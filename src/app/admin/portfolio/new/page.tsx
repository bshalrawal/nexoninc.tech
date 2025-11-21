
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type PortfolioItem = {
  title: string;
  category: string;
  imageUrl: string;
  mobileImageUrl?: string;
  link: string;
};

export default function NewPortfolioItemPage() {
  const firestore = useFirestore();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PortfolioItem>({
    title: '',
    category: '',
    imageUrl: '',
    mobileImageUrl: '',
    link: ''
  });
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number | null }>({
    desktop: null,
    mobile: null,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, imageType: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(prev => ({ ...prev, [imageType]: 0 }));
    const storage = getStorage();
    const storageRef = ref(storage, `portfolio_images/${Date.now()}_${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(prev => ({ ...prev, [imageType]: progress }));
      },
      (error) => {
        console.error(`Error uploading ${imageType} image:`, error);
        setUploadProgress(prev => ({ ...prev, [imageType]: null }));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const fieldName = imageType === 'desktop' ? 'imageUrl' : 'mobileImageUrl';
          setFormData(prev => ({ ...prev, [fieldName]: downloadURL }));
           setUploadProgress(prev => ({ ...prev, [imageType]: 100 }));
        });
      }
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'portfolio_items'), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      router.push('/admin/portfolio');
    } catch (e) {
      console.error("Error adding document: ", e);
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Portfolio Item</CardTitle>
        <CardDescription>Fill out the details for the new portfolio project.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" value={formData.category} onChange={handleInputChange} placeholder="website, branding, seo, etc." required />
          </div>
           <div>
            <Label htmlFor="imageUrl">Desktop Image</Label>
            <Tabs defaultValue="upload">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="py-4">
                <Input id="imageUrl" type="file" onChange={(e) => handleImageUpload(e, 'desktop')} accept="image/*" />
                {uploadProgress.desktop !== null && (
                    <Progress value={uploadProgress.desktop} className="w-full mt-2" />
                )}
              </TabsContent>
              <TabsContent value="url" className="py-4">
                 <Input id="imageUrl-url" name="imageUrl" type="url" placeholder="https://..." value={formData.imageUrl} onChange={handleInputChange} />
              </TabsContent>
            </Tabs>
            {formData.imageUrl && (
              <div className="mt-4 p-2 border rounded-md">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <Image src={formData.imageUrl} alt="Image preview" width={100} height={100} className="object-contain rounded-md" />
              </div>
            )}
          </div>
           <div>
            <Label htmlFor="mobileImageUrl">Mobile Image (Optional)</Label>
            <Tabs defaultValue="upload">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="py-4">
                <Input id="mobileImageUrl" type="file" onChange={(e) => handleImageUpload(e, 'mobile')} accept="image/*" />
                {uploadProgress.mobile !== null && (
                    <Progress value={uploadProgress.mobile} className="w-full mt-2" />
                )}
              </TabsContent>
               <TabsContent value="url" className="py-4">
                 <Input id="mobileImageUrl-url" name="mobileImageUrl" type="url" placeholder="https://..." value={formData.mobileImageUrl} onChange={handleInputChange} />
              </TabsContent>
            </Tabs>
            {formData.mobileImageUrl && (
              <div className="mt-4 p-2 border rounded-md">
                <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                <Image src={formData.mobileImageUrl} alt="Mobile image preview" width={100} height={100} className="object-contain rounded-md" />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="link">Project Link</Label>
            <Input id="link" name="link" type="url" value={formData.link} onChange={handleInputChange} required />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Item...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
