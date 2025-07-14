'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useMemo, Suspense } from 'react';
import { MangaCard } from '@/components/MangaCard';
import { manhwaList as defaultManhwaList } from '@/lib/data';
import type { Manhwa } from '@/lib/types';
import Loading from '../../loading';

function GenreResults() {
    const pathname = usePathname()
    const genre = decodeURIComponent(pathname.split('/').pop() || '');
    const [localManhwaList, setLocalManhwaList] = useState<Manhwa[]>([]);

    useEffect(() => {
        const storedManhwa = localStorage.getItem('manhwaList');
        const allManhwa: Manhwa[] = storedManhwa ? JSON.parse(storedManhwa) : defaultManhwaList;
        setLocalManhwaList(allManhwa);
    }, []);

    const filteredManhwa = useMemo(() => {
        if (!genre) {
            return [];
        }
        return localManhwaList.filter(manhwa =>
            manhwa.genres.some(g => g.toLowerCase() === genre.toLowerCase())
        );
    }, [genre, localManhwaList]);

    return (
        <div>
            <h1 className="text-3xl font-headline font-bold mb-8">
                {genre.charAt(0).toUpperCase() + genre.slice(1)} Manhwa
            </h1>
            {filteredManhwa.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {filteredManhwa.map(manhwa => (
                        <MangaCard key={manhwa.id} manhwa={manhwa} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-headline font-semibold">No results found</h2>
                    <p className="text-muted-foreground mt-2">
                        There are no manhwa with this genre yet.
                    </p>
                </div>
            )}
        </div>
    );
}

export default function GenrePage() {
    return (
        <Suspense fallback={<Loading />}>
            <GenreResults />
        </Suspense>
    );
}
