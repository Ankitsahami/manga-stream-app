'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem('bookmarks');
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error('Failed to parse bookmarks from localStorage', error);
      setBookmarks([]);
    }
  }, []);

  const addBookmark = useCallback((manhwaId: string) => {
    setBookmarks(prev => {
      const newBookmarks = [...prev, manhwaId];
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      toast({ title: "Bookmarked!", description: "Series added to your bookmarks." });
      return newBookmarks;
    });
  }, [toast]);

  const removeBookmark = useCallback((manhwaId: string) => {
    setBookmarks(prev => {
      const newBookmarks = prev.filter(id => id !== manhwaId);
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      toast({ title: "Bookmark removed", description: "Series removed from your bookmarks." });
      return newBookmarks;
    });
  }, [toast]);

  const isBookmarked = useCallback((manhwaId: string) => {
    return bookmarks.includes(manhwaId);
  }, [bookmarks]);
  
  const toggleBookmark = useCallback((manhwaId: string) => {
    if (isBookmarked(manhwaId)) {
      removeBookmark(manhwaId);
    } else {
      addBookmark(manhwaId);
    }
  }, [isBookmarked, addBookmark, removeBookmark]);

  return { bookmarks, toggleBookmark, isBookmarked };
}
