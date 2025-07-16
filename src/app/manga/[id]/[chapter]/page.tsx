
'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Bookmark, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Manhwa, Chapter, Page } from '@/lib/types';
import { manhwaList as defaultManhwaList } from '@/lib/data';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Button } from '@/components/ui/button';
import Loading from '../../../loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function ChapterReader({ id, chapterIdParam }: { id: string, chapterIdParam: string }) {
  const router = useRouter();
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
      const sortedChapters = [...foundManhwa.chapters].sort((a,b) => a.id - b.id);
      const foundChapter = sortedChapters.find(c => c.id === chapterId);
      setChapter(foundChapter);
      if(foundChapter) {
        const CIndex = sortedChapters.findIndex(c => c.id === chapterId);
        setChapterIndex(CIndex)
      }
    }
  }, [id, chapterIdParam]);

  if (!manhwa || !chapter) {
    return <Loading />;
  }

  const sortedChapters = [...manhwa.chapters].sort((a,b) => a.id - b.id);
  const prevChapter = chapterIndex > 0 ? sortedChapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < sortedChapters.length - 1 ? sortedChapters[chapterIndex + 1] : null;

  const handleChapterChange = (chapterId: string) => {
    router.push(`/manga/${manhwa.id}/${chapterId}`);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl bg-card border rounded-lg p-4 sticky top-20 z-40 mb-4">
         <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link href={`/manga/${manhwa.id}`} className="flex items-center gap-2 text-lg font-headline font-bold hover:text-accent">
              <Home className="h-5 w-5" />
              <span>{manhwa.title}</span>
            </Link>

           <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" asChild disabled={!prevChapter}>
                <Link href={prevChapter ? `/manga/${manhwa.id}/${prevChapter.id}` : '#'}>
                    <ChevronLeft/>
                </Link>
              </Button>

             <Select onValueChange={handleChapterChange} defaultValue={chapter.id.toString()}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent>
                  {sortedChapters.map(c => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            
              <Button variant="outline" size="icon" asChild disabled={!nextChapter}>
                <Link href={nextChapter ? `/manga/${manhwa.id}/${nextChapter.id}` : '#'}>
                  <ChevronRight/>
                </Link>
              </Button>
            </div>
             <Button onClick={() => toggleBookmark(manhwa.id)} variant="outline" size="icon">
                {isBookmarked(manhwa.id) ? (
                  <Check className="text-green-500" />
                ) : (
                  <Bookmark/>
                )}
            </Button>
        </div>
        <h1 className="text-center text-2xl font-semibold mt-4">{chapter.title}</h1>
      </div>

      <div className="w-full max-w-3xl">
        {chapter.pages.map((page: Page) => (
          <div key={page.id} className="relative w-full">
            <Image
              src={page.imageUrl}
              alt={`Page ${page.id}`}
              width={800}
              height={1200}
              className="w-full h-auto"
              priority={page.id <= 2}
              loading={page.id > 2 ? 'lazy' : 'eager'}
              data-ai-hint="manhwa page"
            />
          </div>
        ))}
      </div>
      
       <div className="flex items-center gap-4 mt-8">
        <Button variant="outline" asChild disabled={!prevChapter}>
            <Link href={prevChapter ? `/manga/${manhwa.id}/${prevChapter.id}` : '#'}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
            </Link>
        </Button>
        <Button variant="outline" asChild disabled={!nextChapter}>
            <Link href={nextChapter ? `/manga/${manhwa.id}/${nextChapter.id}` : '#'}>
                Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </div>
    </div>
  );
}

export default function ChapterPage({ params }: { params: { id: string; chapter: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <ChapterReader id={params.id} chapterIdParam={params.chapter} />
    </Suspense>
  )
}
