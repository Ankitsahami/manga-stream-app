'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { manhwaList as defaultManhwaList } from '@/lib/data';
import type { Manhwa } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function GenresPage() {
  const [localManhwaList, setLocalManhwaList] = useState<Manhwa[]>([]);

  useEffect(() => {
    const storedManhwa = localStorage.getItem('manhwaList');
    const allManhwa: Manhwa[] = storedManhwa ? JSON.parse(storedManhwa) : defaultManhwaList;
    setLocalManhwaList(allManhwa);
  }, []);

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    localManhwaList.forEach(manhwa => {
      manhwa.genres.forEach(genre => genres.add(genre));
    });
    return Array.from(genres).sort();
  }, [localManhwaList]);

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">Browse by Genre</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allGenres.map(genre => (
          <Link
            key={genre}
            href={`/genres/${encodeURIComponent(genre.toLowerCase())}`}
            className="group flex items-center justify-between p-4 rounded-lg bg-card border hover:border-accent hover:bg-accent/10 transition-colors"
          >
            <span className="font-semibold">{genre}</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
