import Link from 'next/link';
import Image from 'next/image';
import type { Manhwa, Chapter } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MangaCardProps {
  manhwa: Manhwa;
  chapter?: Chapter;
  size?: 'default' | 'large';
}

export function MangaCard({ manhwa, chapter, size = 'default' }: MangaCardProps) {
  const href = chapter ? `/manga/${manhwa.id}/${chapter.id}` : `/manga/${manhwa.id}`;

  const isLarge = size === 'large';

  return (
    <Link href={href} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-accent">
        <CardContent className="p-0">
          <div className={cn("relative", isLarge ? "aspect-[4/3]" : "aspect-[2/3]")}>
            <Image
              src={manhwa.coverUrl}
              alt={`Cover of ${manhwa.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="manhwa cover"
            />
             {chapter && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1.5 text-white backdrop-blur-sm">
                 <p className="text-xs font-semibold truncate">{chapter.title}</p>
              </div>
            )}
          </div>
          <div className={cn(isLarge ? 'p-4' : 'p-2')}>
            <h3 className={cn("font-headline font-semibold truncate group-hover:text-accent", isLarge ? 'text-lg' : 'text-xs')}>
              {manhwa.title}
            </h3>
             {!isLarge && manhwa.genres && manhwa.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {manhwa.genres.slice(0, 1).map(genre => (
                  <Badge key={genre} variant="secondary" className="text-[10px] px-1.5 py-0">{genre}</Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
