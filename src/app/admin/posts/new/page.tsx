
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { TiptapEditor } from './_components/tiptap-editor';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const generateRandomSlug = () => {
<<<<<<< HEAD
    return Math.random().toString(36).substring(2, 12);
=======
  return Math.random().toString(36).substring(2, 12);
>>>>>>> 4faf67b (inserted favicon)
};

export default function NewPostPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

<<<<<<< HEAD
=======
  const [uploadError, setUploadError] = useState<string | null>(null);

>>>>>>> 4faf67b (inserted favicon)
  useEffect(() => {
    // Generate a random slug when the component mounts
    setSlug(generateRandomSlug());
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
<<<<<<< HEAD
  
=======

>>>>>>> 4faf67b (inserted favicon)
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
<<<<<<< HEAD
    const storage = getStorage();
    const storageRef = ref(storage, `post_images/${Date.now()}_${file.name}`);
    
=======
    setUploadError(null);
    const storage = getStorage();
    const storageRef = ref(storage, `post_images/${Date.now()}_${file.name}`);

>>>>>>> 4faf67b (inserted favicon)
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading image:", error);
<<<<<<< HEAD
=======
        setUploadError(`Upload failed: ${error.message}`);
>>>>>>> 4faf67b (inserted favicon)
        setUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setUploadProgress(100);
        });
      }
    );
  };

<<<<<<< HEAD
=======
  const handleDataUriConversion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) { // 500KB limit warning
      setUploadError("Warning: Large images (>500KB) stored as Data URIs may slow down your site or exceed database limits. Consider using standard upload.");
    } else {
      setUploadError(null);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to convert image to Data URI.");
    };
    reader.readAsDataURL(file);
  };

>>>>>>> 4faf67b (inserted favicon)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const finalSlug = slug || generateRandomSlug();
    if (!firestore || !title || !content) return;
<<<<<<< HEAD
    
=======

>>>>>>> 4faf67b (inserted favicon)
    setIsSubmitting(true);

    try {
      await addDoc(collection(firestore, 'posts'), {
        title,
        slug: finalSlug,
        content,
        imageUrl,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      router.push('/admin/posts');
<<<<<<< HEAD
    } catch (e) {
      console.error("Error adding document: ", e);
=======
    } catch (e: any) {
      console.error("Error adding document: ", e);
      setUploadError(`Failed to save post: ${e.message || e}`);
>>>>>>> 4faf67b (inserted favicon)
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Create a New Post</CardTitle>
        <CardDescription>Fill out the details below to add a new post to the site.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
<<<<<<< HEAD
          
=======

>>>>>>> 4faf67b (inserted favicon)
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Title / Place Name</Label>
              <Input id="title" value={title} onChange={handleTitleChange} placeholder="e.g., Bardhaman, Shantiniketan" required />
            </div>
<<<<<<< HEAD
             <div>
=======
            <div>
>>>>>>> 4faf67b (inserted favicon)
              <Label htmlFor="slug-display">Slug</Label>
              <Input id="slug-display" value={slug} readOnly className="bg-muted" />
              <input type="hidden" name="slug" value={slug} />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Featured Image</Label>
            <Tabs defaultValue="upload">
<<<<<<< HEAD
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                    <TabsTrigger value="url">URL</TabsTrigger>
                </TabsList>
                <TabsContent value="upload" className="py-4">
                    <Input id="imageUrl" type="file" onChange={handleImageUpload} accept="image/*" />
                    {uploadProgress !== null && (
                        <Progress value={uploadProgress} className="w-full mt-2" />
                    )}
                </TabsContent>
                <TabsContent value="url" className="py-4">
                    <Input name="imageUrl" type="url" placeholder="https://..." value={imageUrl} onChange={handleImageUrlChange} />
                </TabsContent>
            </Tabs>
             {imageUrl && (
=======
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="data-uri">Data URI</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
              </TabsList>
              <TabsContent value="upload" className="py-4">
                <Input id="imageUrl" type="file" onChange={handleImageUpload} accept="image/*" />
                {uploadProgress !== null && (
                  <Progress value={uploadProgress} className="w-full mt-2" />
                )}
              </TabsContent>
              <TabsContent value="data-uri" className="py-4">
                <div className="space-y-2">
                  <Label htmlFor="dataUriInput">Select Image for Data URI Conversion</Label>
                  <Input id="dataUriInput" type="file" onChange={handleDataUriConversion} accept="image/*" />
                  <p className="text-xs text-muted-foreground">Best for small images/icons. Large images may cause issues.</p>
                </div>
              </TabsContent>
              <TabsContent value="url" className="py-4">
                <Input name="imageUrl" type="url" placeholder="https://..." value={imageUrl} onChange={handleImageUrlChange} />
              </TabsContent>
            </Tabs>
            {uploadError && (
              <div className="mt-2 text-sm text-destructive font-medium">
                {uploadError}
              </div>
            )}
            {imageUrl && (
>>>>>>> 4faf67b (inserted favicon)
              <div className="mt-4 p-2 border rounded-md">
                <p className="text-xs text-muted-foreground mb-2">Image Preview:</p>
                <Image src={imageUrl} alt="Image preview" width={100} height={100} className="object-contain rounded-md" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="content">Description / Content</Label>
<<<<<<< HEAD
             <TiptapEditor
=======
            <TiptapEditor
>>>>>>> 4faf67b (inserted favicon)
              content={content}
              onChange={setContent}
            />
          </div>

          <div className="flex justify-end gap-4 pt-8">
            <Button type="button" variant="outline" disabled={isSubmitting}>Save as Draft</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
