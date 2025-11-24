
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  mobileImageUrl?: string;
  link: string;
};

function EditPortfolioItemForm({ item, onUpdateItem }: { item: PortfolioItem, onUpdateItem: (item: PortfolioItem) => void }) {
  const [formData, setFormData] = useState(item);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onUpdateItem(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title-edit">Title</Label>
        <Input id="title-edit" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="category-edit">Category</Label>
        <Input id="category-edit" name="category" value={formData.category} onChange={handleChange} placeholder="website, branding, seo, etc." required />
      </div>
      <div>
        <Label htmlFor="imageUrl-edit">Desktop Image</Label>
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" disabled>Upload</TabsTrigger>
            <TabsTrigger value="url">URL</TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="py-4">
            <Input id="imageUrl-edit" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} required />
          </TabsContent>
        </Tabs>
      </div>
      <div>
        <Label htmlFor="mobileImageUrl-edit">Mobile Image URL (Optional)</Label>
        <Tabs defaultValue="url">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" disabled>Upload</TabsTrigger>
                <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="py-4">
                <Input id="mobileImageUrl-edit" name="mobileImageUrl" type="url" value={formData.mobileImageUrl || ''} onChange={handleChange} />
            </TabsContent>
        </Tabs>
      </div>
      <div>
        <Label htmlFor="link-edit">Project Link</Label>
        <Input id="link-edit" name="link" type="url" value={formData.link} onChange={handleChange} required />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
}


export default function PortfolioAdminPage() {
  const firestore = useFirestore();
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  const portfolioCollectionRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'portfolio_items') : null),
    [firestore]
  );
  
  const { data: portfolioItems, isLoading, error } = useCollection<PortfolioItem>(portfolioCollectionRef);

  const handleDeleteItem = async (id: string) => {
    if (!firestore) return;
    try {
      await deleteDoc(doc(firestore, 'portfolio_items', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };
  
  const handleUpdateItem = async (item: PortfolioItem) => {
    if (!firestore) return;
    const { id, ...data } = item;
    try {
      await updateDoc(doc(firestore, 'portfolio_items', id), data);
      setEditingItem(null);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }

  return (
     <Card className="bg-white shadow-bluish">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Portfolio</CardTitle>
            <CardDescription>Manage your portfolio projects. You can add, edit, or delete items.</CardDescription>
          </div>
          <Button size="sm" className="gap-1" asChild>
            <Link href="/admin/portfolio/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Item
                </span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <p>Loading portfolio items...</p>}
        {error && <p className="text-destructive">Error: {error.message}</p>}
        {!isLoading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioItems?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Image src={item.imageUrl} alt={item.title} width={80} height={60} className="object-cover rounded-md aspect-[4/3]"/>
                  </TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setEditingItem(item)}>
                          <Edit className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                         <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
         {!isLoading && !error && portfolioItems?.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p>No portfolio items found.</p>
             <Button size="sm" className="gap-1 mt-4" asChild>
                <Link href="/admin/portfolio/new">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add Item</span>
                </Link>
             </Button>
          </div>
        )}
      </CardContent>
       {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Portfolio Item</DialogTitle>
              <DialogDescription>
                Update the details for your portfolio project.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
               <EditPortfolioItemForm item={editingItem} onUpdateItem={handleUpdateItem} />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
