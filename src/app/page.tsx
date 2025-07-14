'use client';

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { MangaCard } from '@/components/MangaCard';
import { manhwaList } from '@/lib/data';
import type { Manhwa } from '@/lib/types';
import { Search } from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [localManhwaList, setLocalManhwaList] = useState<Manhwa[]>([]);
  const [trendingManhwa, setTrendingManhwa] = useState<Manhwa[]>([]);

  useEffect(() => {
    // In a real app, you'd fetch this data. Here we use localStorage to persist admin changes.
    const storedManhwa = localStorage.getItem('manhwaList');
    const allManhwa = storedManhwa ? JSON.parse(storedManhwa) : manhwaList;
    setLocalManhwaList(allManhwa);

    const storedTrending = localStorage.getItem('trendingManhwaIds');
    const trendingIds = storedTrending ? JSON.parse(storedTrending) : allManhwa.filter(m => m.isTrending).map(m => m.id);
    setTrendingManhwa(allManhwa.filter((m: Manhwa) => trendingIds.includes(m.id)));
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trendingManhwa.map(manhwa => (
              <MangaCard key={manhwa.id} manhwa={manhwa} />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-headline font-bold">Browse All</h1>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
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
