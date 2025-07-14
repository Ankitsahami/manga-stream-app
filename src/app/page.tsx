'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { MangaCard } from '@/components/MangaCard';
import { manhwaList } from '@/lib/data';
import type { Manhwa, Chapter } from '@/lib/types';
import { Search } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Separator } from '@/components/ui/separator';

interface ChapterUpdate {
  manhwa: Manhwa;
  chapter: Chapter;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [localManhwaList, setLocalManhwaList] = useState<Manhwa[]>([]);
  const [trendingManhwa, setTrendingManhwa] = useState<Manhwa[]>([]);
  const [recentlyUpdated, setRecentlyUpdated] = useState<Manhwa[]>([]);
  const [newChapters, setNewChapters] = useState<ChapterUpdate[]>([]);


  useEffect(() => {
    // In a real app, you'd fetch this data. Here we use localStorage to persist admin changes.
    const storedManhwa = localStorage.getItem('manhwaList');
    const allManhwa: Manhwa[] = storedManhwa ? JSON.parse(storedManhwa) : manhwaList;
    setLocalManhwaList(allManhwa);

    const storedTrending = localStorage.getItem('trendingManhwaIds');
    const trendingIds = storedTrending ? JSON.parse(storedTrending) : allManhwa.filter((m: Manhwa) => m.isTrending).map((m: Manhwa) => m.id);
    setTrendingManhwa(allManhwa.filter((m: Manhwa) => trendingIds.includes(m.id)));

    // Simulate recently updated and new chapters
    const updated = [...allManhwa]
      .filter(m => m.chapters.length > 0)
      .sort((a, b) => {
        const lastChapterA = new Date(a.chapters[a.chapters.length - 1].publishedAt);
        const lastChapterB = new Date(b.chapters[b.chapters.length - 1].publishedAt);
        return lastChapterB.getTime() - lastChapterA.getTime();
      })
      .slice(0, 5);
    setRecentlyUpdated(updated);

    const chapters: ChapterUpdate[] = allManhwa
      .flatMap((m: Manhwa) => m.chapters.map(c => ({ manhwa: m, chapter: c })))
      .sort((a, b) => new Date(b.chapter.publishedAt).getTime() - new Date(a.chapter.publishedAt).getTime())
      .slice(0, 12);
    setNewChapters(chapters);

  }, []);

  const filteredManhwa = useMemo(() => {
    if (!searchQuery) {
      return localManhwaList;
    }
    return localManhwaList.filter(manhwa =>
      manhwa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manhwa.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, localManhwaList]);
  
  const getLatestChapters = (manhwa: Manhwa, count: number) => {
    return [...manhwa.chapters]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, count);
  };

  return (
    <div className="space-y-12">
      {trendingManhwa.length > 0 && (
         <section>
          <h1 className="text-3xl font-headline font-bold mb-6">Trending Now</h1>
           <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {trendingManhwa.map((manhwa) => (
                <CarouselItem key={manhwa.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1">
                    <MangaCard manhwa={manhwa} size="large" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      )}

      {recentlyUpdated.length > 0 && (
        <section>
          <h2 className="text-2xl font-headline font-bold mb-4">Recently Updated</h2>
          <div className="space-y-4">
            {recentlyUpdated.map(manhwa => (
              <div key={manhwa.id} className="flex gap-4 p-4 border rounded-lg bg-card">
                <Link href={`/manga/${manhwa.id}`}>
                  <div className="relative w-24 h-36 flex-shrink-0">
                    <Image
                      src={manhwa.coverUrl}
                      alt={`Cover of ${manhwa.title}`}
                      fill
                      className="object-cover rounded-md"
                      data-ai-hint="manhwa cover"
                    />
                  </div>
                </Link>
                <div className="flex-grow">
                  <Link href={`/manga/${manhwa.id}`} className="hover:text-accent">
                    <h3 className="font-headline font-bold text-lg">{manhwa.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-2">by {manhwa.author}</p>
                  <Separator className="my-2" />
                  <div className="flex flex-col gap-1.5 text-sm">
                    {getLatestChapters(manhwa, 3).map((chapter) => (
                      <Link key={chapter.id} href={`/manga/${manhwa.id}/${chapter.id}`} className="flex justify-between hover:text-accent transition-colors">
                        <span>{chapter.title}</span>
                        <span className="text-muted-foreground text-xs">
                          {formatDistanceToNow(new Date(chapter.publishedAt), { addSuffix: true })}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

       {newChapters.length > 0 && (
        <section>
          <h2 className="text-2xl font-headline font-bold mb-4">New Chapters</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {newChapters.map(({manhwa, chapter}) => (
              <MangaCard key={`${manhwa.id}-${chapter.id}`} manhwa={manhwa} chapter={chapter} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-headline font-bold">Browse All</h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or genre..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {filteredManhwa.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filteredManhwa.map(manhwa => (
              <MangaCard key={manhwa.id} manhwa={manhwa} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-xl">No results found.</p>
            <p>Try a different search term.</p>
          </div>
        )}
      </section>
    </div>
  );
}
