
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
  return Math.random().toString(36).substring(2, 12);
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

  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    // Generate a random slug when the component mounts
    setSlug(generateRandomSlug());
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    setUploadError(null);
    const storage = getStorage();
    const storageRef = ref(storage, `post_images/${Date.now()}_${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading image:", error);
        setUploadError(`Upload failed: ${error.message}`);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const finalSlug = slug || generateRandomSlug();
    if (!firestore || !title || !content) return;

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
    } catch (e: any) {
      console.error("Error adding document: ", e);
      setUploadError(`Failed to save post: ${e.message || e}`);
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="title">Title / Place Name</Label>
              <Input id="title" value={title} onChange={handleTitleChange} placeholder="e.g., Bardhaman, Shantiniketan" required />
            </div>
            <div>
              <Label htmlFor="slug-display">Slug</Label>
              <Input id="slug-display" value={slug} readOnly className="bg-muted" />
              <input type="hidden" name="slug" value={slug} />
            </div>
          </div>

          <div>
            <Label htmlFor="imageUrl">Featured Image</Label>
            <Tabs defaultValue="upload">
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
              <div className="mt-4 p-2 border rounded-md">
                <p className="text-xs text-muted-foreground mb-2">Image Preview:</p>
                <Image src={imageUrl} alt="Image preview" width={100} height={100} className="object-contain rounded-md" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="content">Description / Content</Label>
            <TiptapEditor
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
