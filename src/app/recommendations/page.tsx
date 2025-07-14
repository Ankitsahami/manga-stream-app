'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  generateManhwaRecommendations,
  ManhwaRecommendationsOutput,
} from '@/ai/flows/manhwa-recommendations';
import { Loader2, Wand2 } from 'lucide-react';

const FormSchema = z.object({
  readingHistory: z.string().min(10, 'Please list at least a few titles.'),
  preferences: z.string().min(10, 'Please describe your preferences.'),
});

type FormValues = z.infer<typeof FormSchema>;

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<ManhwaRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      readingHistory: '',
      preferences: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const result = await generateManhwaRecommendations(data);
      setRecommendations(result);
    } catch (e) {
      setError('Sorry, we couldn\'t generate recommendations at this time. Please try again later.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-headline font-bold">Personalized Recommendations</h1>
        <p className="text-muted-foreground mt-2">Let our AI find your next favorite series!</p>
      </div>

      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Tell Us What You Like</CardTitle>
              <CardDescription>
                The more details you provide, the better your recommendations will be.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="readingHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Reading History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Solo Leveling, Tower of God, Omniscient Reader's Viewpoint..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I love fantasy with strong protagonists, interesting power systems, and a bit of mystery. I dislike romance-focused stories."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Recommendations
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {error && (
        <Card className="mt-8 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">An Error Occurred</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {recommendations && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-headline">Here Are Your Recommendations!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {recommendations.recommendations}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
