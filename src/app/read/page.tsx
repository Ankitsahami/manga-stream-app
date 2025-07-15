
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage, firebaseEnabled } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

function Reader() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const series = searchParams.get('series');
  const chapter = searchParams.get('chapter');

  useEffect(() => {
    const fetchImages = async () => {
      if (!series || !chapter) {
        setLoading(false);
        setError('Series and chapter are required.');
        return;
      }
      if (!firebaseEnabled || !storage) {
        setLoading(false);
        setError('Firebase is not configured. Cannot fetch images.');
        return;
      }

      setLoading(true);
      setError(null);
      setImageUrls([]);

      try {
        const folderRef = ref(storage, `manga/${series}/chapter-${chapter}/`);
        const result = await listAll(folderRef);

        if (result.items.length === 0) {
          setError('No images found for this chapter. The path might be incorrect or the chapter is not uploaded yet.');
          setLoading(false);
          return;
        }

        const urls = await Promise.all(
          result.items.map((item) => getDownloadURL(item))
        );

        // Simple sort to handle names like '001.jpg', '002.jpg', etc.
        urls.sort();

        setImageUrls(urls);
      } catch (err: any) {
        console.error("Error fetching images from Firebase Storage:", err);
        if (err.code === 'storage/object-not-found') {
             setError('Chapter not found. Check the series and chapter names.');
        } else {
             setError('An error occurred while fetching chapter images.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [series, chapter]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading chapter...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-24 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-headline font-semibold text-destructive">Error Loading Chapter</h2>
          <p className="text-muted-foreground mt-2 max-w-md">{error}</p>
        </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
       <h1 className="text-2xl font-headline font-bold mb-2 capitalize">{series?.replace(/-/g, ' ')}</h1>
       <h2 className="text-lg text-muted-foreground mb-8">Chapter {chapter}</h2>
      {imageUrls.map((url, index) => (
        <div key={url} className="relative w-full max-w-3xl mb-1">
           <img
              src={url}
              alt={`Page ${index + 1}`}
              className="w-full h-auto"
              loading="lazy"
            />
        </div>
      ))}
    </div>
  );
}


export default function ReadChapterPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading...</p>
            </div>
        }>
            <Reader />
        </Suspense>
    )
}
