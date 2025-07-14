
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { manhwaList as defaultManhwaList } from '@/lib/data';
import type { Manhwa } from '@/lib/types';
import { Edit, Trash2 } from 'lucide-react';

const manhwaSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverUrl: z.string().url('Must be a valid URL'),
  genres: z.string().min(1, 'At least one genre is required'),
});

type ManhwaFormValues = z.infer<typeof manhwaSchema>;

const trendingSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});

type TrendingFormValues = z.infer<typeof trendingSchema>;

export default function AdminPage() {
  const { toast } = useToast();
  const [manhwaList, setManhwaList] = useState<Manhwa[]>([]);
  const [trendingManhwaIds, setTrendingManhwaIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  
  const manhwaForm = useForm<ManhwaFormValues>({
    resolver: zodResolver(manhwaSchema),
    defaultValues: {
      title: '',
      author: '',
      description: '',
      coverUrl: '',
      genres: '',
    },
  });

  const trendingForm = useForm<TrendingFormValues>({
    resolver: zodResolver(trendingSchema),
    defaultValues: {
      items: [],
    },
  });
  
  const loadData = () => {
    const storedManhwa = localStorage.getItem('manhwaList');
    const allManhwa = storedManhwa ? JSON.parse(storedManhwa) : defaultManhwaList;
    setManhwaList(allManhwa);

    const storedTrendingIds = localStorage.getItem('trendingManhwaIds');
    let initialTrendingIds: string[];
    if (storedTrendingIds) {
      initialTrendingIds = JSON.parse(storedTrendingIds);
    } else {
      initialTrendingIds = allManhwa.filter(m => m.isTrending).map(m => m.id);
    }
    setTrendingManhwaIds(initialTrendingIds);
    trendingForm.reset({ items: initialTrendingIds });
    setIsLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [trendingForm]);


  const saveManhwaList = (list: Manhwa[]) => {
    setManhwaList(list);
    localStorage.setItem('manhwaList', JSON.stringify(list));
  };
  
  const onManhwaSubmit: SubmitHandler<ManhwaFormValues> = (data) => {
    if (data.id) {
      // Editing existing manhwa
      const updatedList = manhwaList.map(m => 
        m.id === data.id 
          ? { ...m, ...data, genres: data.genres.split(',').map(g => g.trim()) }
          : m
      );
      saveManhwaList(updatedList);
      toast({ title: 'Success!', description: 'Manhwa updated.' });
    } else {
      // Adding new manhwa
       const newManhwa: Manhwa = {
        id: data.title.toLowerCase().replace(/\s+/g, '-'),
        ...data,
        genres: data.genres.split(',').map(g => g.trim()),
        chapters: [],
      };
      saveManhwaList([...manhwaList, newManhwa]);
      toast({ title: 'Success!', description: 'New manhwa added.' });
    }
    manhwaForm.reset();
    setEditModalOpen(false);
  };
  
  const openEditModal = (manhwa: Manhwa) => {
    manhwaForm.reset({
      ...manhwa,
      genres: manhwa.genres.join(', '),
    });
    setEditModalOpen(true);
  }

  const deleteManhwa = (manhwaId: string) => {
    const updatedList = manhwaList.filter(m => m.id !== manhwaId);
    saveManhwaList(updatedList);
    toast({ title: 'Success!', description: 'Manhwa deleted.' });
  }

  const onTrendingSubmit: SubmitHandler<TrendingFormValues> = (data) => {
    setTrendingManhwaIds(data.items);
    localStorage.setItem('trendingManhwaIds', JSON.stringify(data.items));
    toast({ title: 'Success!', description: 'Trending list updated.' });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-headline font-bold mb-8">Admin Control Panel</h1>
      <Tabs defaultValue="manage-manhwa">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manage-manhwa">Manage Manhwa</TabsTrigger>
          <TabsTrigger value="add-manhwa">Add Manhwa</TabsTrigger>
          <TabsTrigger value="manage-trending">Manage Trending</TabsTrigger>
        </TabsList>

        <TabsContent value="manage-manhwa">
          <Card>
            <CardHeader>
              <CardTitle>Manage Existing Manhwa</CardTitle>
              <CardDescription>
                Edit or delete series from the catalog.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {manhwaList.map(manhwa => (
                  <Card key={manhwa.id} className="flex items-center justify-between p-4">
                    <p className="font-semibold">{manhwa.title}</p>
                    <div className="flex items-center gap-2">
                      <Dialog open={isEditModalOpen && manhwaForm.getValues('id') === manhwa.id} onOpenChange={(open) => { if (!open) setEditModalOpen(false)}}>
                        <DialogTrigger asChild>
                           <Button variant="outline" size="icon" onClick={() => openEditModal(manhwa)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit {manhwa.title}</DialogTitle>
                          </DialogHeader>
                          <Form {...manhwaForm}>
                            <form onSubmit={manhwaForm.handleSubmit(onManhwaSubmit)} className="space-y-4">
                              <FormField control={manhwaForm.control} name="title" render={({ field }) => (
                                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                               <FormField control={manhwaForm.control} name="author" render={({ field }) => (
                                <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                               <FormField control={manhwaForm.control} name="description" render={({ field }) => (
                                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                               <FormField control={manhwaForm.control} name="coverUrl" render={({ field }) => (
                                <FormItem><FormLabel>Cover Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )} />
                               <FormField control={manhwaForm.control} name="genres" render={({ field }) => (
                                <FormItem><FormLabel>Genres</FormLabel><FormControl><Input {...field} /></FormControl><FormDescription>Enter genres separated by commas.</FormDescription><FormMessage /></FormItem>
                              )} />
                               <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Save Changes</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the manhwa
                              "{manhwa.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteManhwa(manhwa.id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="add-manhwa">
          <Card>
            <CardHeader>
              <CardTitle>Add New Manhwa</CardTitle>
              <CardDescription>
                Fill out the form to add a new series to the catalog. This is a demo and will only save to your browser's local storage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...manhwaForm}>
                <form onSubmit={manhwaForm.handleSubmit(onManhwaSubmit)} className="space-y-6">
                  <FormField control={manhwaForm.control} name="title" render={({ field }) => (
                    <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="Solo Leveling" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={manhwaForm.control} name="author" render={({ field }) => (
                    <FormItem><FormLabel>Author</FormLabel><FormControl><Input placeholder="Chugong" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={manhwaForm.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="A short synopsis..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={manhwaForm.control} name="coverUrl" render={({ field }) => (
                    <FormItem><FormLabel>Cover Image URL</FormLabel><FormControl><Input placeholder="https://placehold.co/300x450.png" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={manhwaForm.control} name="genres" render={({ field }) => (
                    <FormItem><FormLabel>Genres</FormLabel><FormControl><Input placeholder="Action, Fantasy, Adventure" {...field} /></FormControl><FormDescription>Enter genres separated by commas.</FormDescription><FormMessage /></FormItem>
                  )} />
                  <Button type="submit">Add Manhwa</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage-trending">
          <Card>
            <CardHeader>
              <CardTitle>Manage Trending Manhwa</CardTitle>
              <CardDescription>
                Select which series appear on the homepage's trending section.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...trendingForm}>
                <form onSubmit={trendingForm.handleSubmit(onTrendingSubmit)} className="space-y-8">
                  <FormField
                    control={trendingForm.control}
                    name="items"
                    render={() => (
                      <FormItem>
                         <div className="mb-4">
                          <FormLabel className="text-base">Available Manhwa</FormLabel>
                        </div>
                        <div className="space-y-2">
                        {manhwaList.length > 0 && manhwaList.map((item) => (
                          <FormField
                            key={item.id}
                            control={trendingForm.control}
                            name="items"
                            render={({ field }) => {
                              return (
                                <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">{item.title}</FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Trending List</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    