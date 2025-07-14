'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookMarked, Home, LayoutGrid, Shield, Wand2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/bookmarks', label: 'Bookmarks', icon: BookMarked },
  { href: '/recommendations', label: 'For You', icon: Wand2 },
  { href: '/admin', label: 'Admin', icon: Shield },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
            <LayoutGrid className="h-6 w-6 text-accent" />
            <span>MangaStream</span>
          </Link>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
