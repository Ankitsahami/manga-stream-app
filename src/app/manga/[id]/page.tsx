'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { manhwaList as defaultManhwaList } from '@/lib/data';
import type { Manhwa } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';

export default function ManhwaPage({ params }: { params: { id: string } }) {
  const [manhwa, setManhwa] = useState<Manhwa | undefined>(undefined);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const storedManhwa = localStorage.getItem('manhwaList');
    const allManhwa = storedManhwa ? JSON.parse(storedManhwa) : defaultManhwaList;
    const foundManhwa = allManhwa.find((m: Manhwa) => m.id === params.id);
    setManhwa(foundManhwa);
  }, [params.id]);

  if (!manhwa) {
    // This will be caught by loading.tsx initially, then notFound if it's still null after effect.
    // To prevent flashing notFound, we can show a skeleton loader here.
    return null; 
  }

  return (
    <div className="grid md:grid-cols-4 gap-8">
      <div className="md:col-span-1">
        <Card className="overflow-hidden sticky top-24">
          <Image
            src={manhwa.coverUrl}
            alt={`Cover of ${manhwa.title}`}
            width={300}
            height={450}
            className="w-full object-cover"
            data-ai-hint="manhwa cover"
          />
        </Card>
        <Button onClick={() => toggleBookmark(manhwa.id)} className="w-full mt-4" variant={isBookmarked(manhwa.id) ? 'default' : 'outline'}>
          <Bookmark className="mr-2 h-4 w-4" />
          {isBookmarked(manhwa.id) ? 'Bookmarked' : 'Bookmark'}
        </Button>
      </div>

      <div className="md:col-span-3">
        <h1 className="text-4xl font-headline font-bold">{manhwa.title}</h1>
        <p className="text-lg text-muted-foreground mt-1">by {manhwa.author}</p>
        
        <div className="flex flex-wrap gap-2 my-4">
          {manhwa.genres.map(genre => (
            <Badge key={genre} variant="secondary">{genre}</Badge>
          ))}
        </div>
        
        <p className="text-foreground/80 leading-relaxed">{manhwa.description}</p>
        
        <Separator className="my-8" />
        
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Chapters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {manhwa.chapters.length > 0 ? (
                [...manhwa.chapters].reverse().map(chapter => (
                  <Link key={chapter.id} href={`/manga/${manhwa.id}/${chapter.id}`} legacyBehavior>
                    <a className="block p-4 rounded-md transition-colors hover:bg-muted">
                      <p className="font-medium">{chapter.title}</p>
                    </a>
                  </Link>
                ))
              ) : (
                <p className="text-muted-foreground p-4">No chapters available yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
