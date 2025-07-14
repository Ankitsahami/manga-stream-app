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
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { manhwaList as defaultManhwaList } from '@/lib/data';
import type { Manhwa } from '@/lib/types';

const manhwaSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  coverUrl: z.string().url('Must be a valid URL'),
  genres: z.string().min(1, 'At least one genre is required'),
});

type ManhwaFormValues = z.infer<typeof manhwaSchema>;

const trendingSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

type TrendingFormValues = z.infer<typeof trendingSchema>;

export default function AdminPage() {
  const { toast } = useToast();
  const [manhwaList, setManhwaList] = useState<Manhwa[]>([]);

  useEffect(() => {
    const storedManhwa = localStorage.getItem('manhwaList');
    setManhwaList(storedManhwa ? JSON.parse(storedManhwa) : defaultManhwaList);
  }, []);

  const manhwaForm = useForm<ManhwaFormValues>({
    resolver: zodResolver(manhwaSchema),
  });

  const trendingForm = useForm<TrendingFormValues>({
    resolver: zodResolver(trendingSchema),
    defaultValues: {
      items: manhwaList.filter(m => {
        const trendingIds = JSON.parse(localStorage.getItem('trendingManhwaIds') || '[]');
        return trendingIds.includes(m.id) || m.isTrending
      }).map(m => m.id),
    },
  });

  useEffect(() => {
    const trendingIds = JSON.parse(localStorage.getItem('trendingManhwaIds') || '[]');
    const currentTrending = manhwaList.filter(m => trendingIds.length > 0 ? trendingIds.includes(m.id) : m.isTrending).map(m => m.id);
    trendingForm.reset({ items: currentTrending });
  }, [manhwaList, trendingForm]);

  const onManhwaSubmit: SubmitHandler<ManhwaFormValues> = (data) => {
    const newManhwa: Manhwa = {
      id: data.title.toLowerCase().replace(/\s+/g, '-'),
      ...data,
      genres: data.genres.split(',').map(g => g.trim()),
      chapters: [],
    };
    const updatedList = [...manhwaList, newManhwa];
    setManhwaList(updatedList);
    localStorage.setItem('manhwaList', JSON.stringify(updatedList));
    toast({ title: 'Success!', description: 'New manhwa added.' });
    manhwaForm.reset({ title: '', author: '', description: '', coverUrl: '', genres: ''});
  };

  const onTrendingSubmit: SubmitHandler<TrendingFormValues> = (data) => {
    localStorage.setItem('trendingManhwaIds', JSON.stringify(data.items));
    toast({ title: 'Success!', description: 'Trending list updated.' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-headline font-bold mb-8">Admin Control Panel</h1>
      <Tabs defaultValue="add-manhwa">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add-manhwa">Add Manhwa</TabsTrigger>
          <TabsTrigger value="manage-trending">Manage Trending</TabsTrigger>
        </TabsList>
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
                        {manhwaList.map((item) => (
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
