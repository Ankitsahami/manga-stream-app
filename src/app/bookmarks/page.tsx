'use client';

import { useState, useEffect } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { manhwaList as defaultManhwaList } from '@/lib/data';
import type { Manhwa } from '@/lib/types';
import { MangaCard } from '@/components/MangaCard';
import { BookMarked } from 'lucide-react';

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const [bookmarkedManhwa, setBookmarkedManhwa] = useState<Manhwa[]>([]);

  useEffect(() => {
    const storedManhwa = localStorage.getItem('manhwaList');
    const allManhwa = storedManhwa ? JSON.parse(storedManhwa) : defaultManhwaList;
    const filtered = allManhwa.filter((m: Manhwa) => bookmarks.includes(m.id));
    setBookmarkedManhwa(filtered);
  }, [bookmarks]);

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-8">Your Bookmarks</h1>
      {bookmarkedManhwa.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {bookmarkedManhwa.map(manhwa => (
            <MangaCard key={manhwa.id} manhwa={manhwa} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed rounded-lg">
          <BookMarked className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-headline font-semibold">Nothing here yet!</h2>
          <p className="text-muted-foreground mt-2">
            Click the bookmark icon on a series to add it to this list.
          </p>
        </div>
      )}
    </div>
  );
}
