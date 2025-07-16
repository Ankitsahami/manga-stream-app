
'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { BookMarked, Bookmark, Check, ChevronRight } from 'lucide-react';
import type { Manhwa, Chapter } from '@/lib/types';
import { manhwaList as defaultManhwaList } from '@/lib/data';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Loading from '../../loading';

function ManhwaDetails({ id }: { id: string }) {
  const [manhwa, setManhwa] = useState<Manhwa | undefined>(undefined);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    const storedManhwa = localStorage.getItem('manhwaList');
    const allManhwa = storedManhwa ? JSON.parse(storedManhwa) : defaultManhwaList;
    const foundManhwa = allManhwa.find((m: Manhwa) => m.id === id);
    setManhwa(foundManhwa);
  }, [id]);

  if (!manhwa) {
    return <Loading />;
  }

  const sortedChapters = [...manhwa.chapters].sort((a, b) => b.id - a.id);

  return (
    <div>
      <Card className="overflow-hidden">
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src={manhwa.coverUrl}
            alt={`Cover for ${manhwa.title}`}
            fill
            className="object-cover object-top"
            data-ai-hint="manhwa cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
        <CardHeader className="relative -mt-24 z-10">
          <CardTitle className="text-4xl font-headline">{manhwa.title}</CardTitle>
          <CardDescription className="text-lg">by {manhwa.author}</CardDescription>
        </CardHeader>
        <CardContent className="z-10 relative">
          <div className="flex flex-wrap gap-2 mb-6">
            {manhwa.genres.map(genre => (
              <Link key={genre} href={`/genres/${genre.toLowerCase()}`}>
                <Badge variant="secondary">{genre}</Badge>
              </Link>
            ))}
          </div>
          <p className="text-muted-foreground mb-6">{manhwa.description}</p>
          <Button onClick={() => toggleBookmark(manhwa.id)} variant="outline">
            {isBookmarked(manhwa.id) ? (
              <>
                <Check className="mr-2 h-4 w-4" /> Bookmarked
              </>
            ) : (
              <>
                <Bookmark className="mr-2 h-4 w-4" /> Add to Bookmarks
              </>
            )}
          </Button>
          <Separator className="my-8" />
          <div>
            <h3 className="text-2xl font-headline font-bold mb-4">Chapters</h3>
            <div className="space-y-2">
              {sortedChapters.map(chapter => (
                <Link
                  key={chapter.id}
                  href={`/manga/${manhwa.id}/${chapter.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-colors group"
                >
                  <div>
                    <p className="font-semibold">{chapter.title}</p>
                    <p className="text-sm text-muted-foreground group-hover:text-accent-foreground">
                      {formatDistanceToNow(new Date(chapter.publishedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ManhwaPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <ManhwaDetails id={params.id} />
    </Suspense>
  )
}
