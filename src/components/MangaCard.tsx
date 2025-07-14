import Link from 'next/link';
import Image from 'next/image';
import type { Manhwa } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MangaCardProps {
  manhwa: Manhwa;
}

export function MangaCard({ manhwa }: MangaCardProps) {
  return (
    <Link href={`/manga/${manhwa.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-accent">
        <CardContent className="p-0">
          <div className="aspect-[2/3] relative">
            <Image
              src={manhwa.coverUrl}
              alt={`Cover of ${manhwa.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="manhwa cover"
            />
          </div>
          <div className="p-3">
            <h3 className="font-headline font-semibold text-sm truncate group-hover:text-accent">{manhwa.title}</h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {manhwa.genres.slice(0, 2).map(genre => (
                <Badge key={genre} variant="secondary" className="text-xs">{genre}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
