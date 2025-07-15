
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { manhwaList as defaultManhwaList } from '@/lib/data';
import type { Manhwa, Chapter } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, Bookmark } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { cn } from '@/lib/utils';
import Loading from '../../../loading';

function ChapterReader({ id, chapterIdParam }: { id: string; chapterIdParam: string }) {
  const [manhwa, setManhwa] = useState<Manhwa | undefined>(undefined);
  const [chapter, setChapter] = useState<Chapter | undefined>(undefined);
  const [chapterIndex, setChapterIndex] = useState(-1);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  useEffect(() => {
    const storedManhwa = localStorage.getItem('manhwaList');
    const allManhwa = storedManhwa ? JSON.parse(storedManhwa) : defaultManhwaList;
    const foundManhwa = allManhwa.find((m: Manhwa) => m.id === id);
    
    if (foundManhwa) {
      setManhwa(foundManhwa);
      const chapterId = parseInt(chapterIdParam, 10);
      const foundChapter = foundManhwa.chapters.find((c: Chapter) => c.id === chapterId);
      const foundChapterIndex = foundManhwa.chapters.findIndex((c: Chapter) => c.id === chapterId);
      setChapter(foundChapter);
      setChapterIndex(foundChapterIndex);
    }
  }, [id, chapterIdParam]);

  if (!manhwa || !chapter) {
    if(manhwa === null || chapter === null) notFound();
    return null; 
  }

  const prevChapter = chapterIndex > 0 ? manhwa.chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < manhwa.chapters.length - 1 ? manhwa.chapters[chapterIndex + 1] : null;

  return (
    <div className="w-full">
      <div className="sticky top-16 bg-background/80 backdrop-blur-sm z-10 py-3 border-b mb-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href={`/manga/${manhwa.id}`} className="hover:text-accent transition-colors">
            <h1 className="text-xl font-headline font-bold truncate">{manhwa.title}</h1>
            <p className="text-sm text-muted-foreground">{chapter.title}</p>
          </Link>

          <div className="flex items-center gap-2">
            {prevChapter ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/manga/${manhwa.id}/${prevChapter.id}`}>
                  <ArrowLeft className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Previous</span>
                </Link>
              </Button>
            ) : <div className="w-24 md:w-[105px]"></div>}
             <Button asChild variant="outline" size="icon">
                <Link href={`/`}>
                  <Home className="h-4 w-4" />
                </Link>
              </Button>
             <Button 
                variant={isBookmarked(manhwa.id) ? 'default' : 'outline'} 
                size="icon" 
                onClick={() => toggleBookmark(manhwa.id)}
                aria-label={isBookmarked(manhwa.id) ? 'Remove bookmark' : 'Add bookmark'}
             >
                <Bookmark className={cn("h-4 w-4", isBookmarked(manhwa.id) && "fill-current")} />
              </Button>
            {nextChapter ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/manga/${manhwa.id}/${nextChapter.id}`}>
                  <span className="hidden md:inline">Next</span>
                  <ArrowRight className="h-4 w-4 md:ml-2" />
                </Link>
              </Button>
            ) : <div className="w-24 md:w-[105px]"></div>}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {chapter.pages.map((page, index) => (
          <div key={page.id} className="relative w-full max-w-3xl aspect-[2/3]">
            <Image
              src={page.imageUrl}
              alt={`Page ${page.id} of ${chapter.title}`}
              fill
              priority={index === 0}
              className="object-contain"
              data-ai-hint="manhwa page"
            />
          </div>
        ))}
      </div>
      
      <div className="container mx-auto flex justify-center items-center gap-4 my-8">
         {prevChapter && (
            <Button asChild variant="outline" size="lg">
              <Link href={`/manga/${manhwa.id}/${prevChapter.id}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Chapter
              </Link>
            </Button>
          )}
          {nextChapter && (
            <Button asChild size="lg">
              <Link href={`/manga/${manhwa.id}/${nextChapter.id}`}>
                Next Chapter
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
      </div>
    </div>
  );
}

export default function ChapterPage({ params }: { params: { id: string; chapter: string } }) {
  const { id, chapter } = params;
  return (
    <Suspense fallback={<Loading />}>
      <ChapterReader id={id} chapterIdParam={chapter} />
    </Suspense>
  )
}
