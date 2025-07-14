'use client';

import { useState, useEffect, useMemo } from 'react';
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
    const allManhwa = storedManhwa ? JSON.parse(storedManhwa) : manhwaList;
    setLocalManhwaList(allManhwa);

    const storedTrending = localStorage.getItem('trendingManhwaIds');
    const trendingIds = storedTrending ? JSON.parse(storedTrending) : allManhwa.filter((m: Manhwa) => m.isTrending).map((m: Manhwa) => m.id);
    setTrendingManhwa(allManhwa.filter((m: Manhwa) => trendingIds.includes(m.id)));

    // Simulate recently updated and new chapters
    const updated = [...allManhwa].sort(() => 0.5 - Math.random()).slice(0, 12);
    setRecentlyUpdated(updated);

    const chapters: ChapterUpdate[] = allManhwa
      .flatMap((m: Manhwa) => m.chapters.length > 0 ? [{ manhwa: m, chapter: m.chapters[m.chapters.length - 1] }] : [])
      .sort(() => 0.5 - Math.random()) // In a real app, sort by date
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
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {recentlyUpdated.map(manhwa => (
              <MangaCard key={manhwa.id} manhwa={manhwa} />
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
