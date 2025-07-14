
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookMarked, Home, LayoutGrid, Library, LogOut, User as UserIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { SearchBar } from '@/components/SearchBar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/genres', label: 'Genres', icon: Library },
  { href: '/bookmarks', label: 'Bookmarks', icon: BookMarked },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logOut, authAvailable } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
            <LayoutGrid className="h-6 w-6 text-accent" />
            <span>MangaStream</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
        </div>

        <div className="flex items-center justify-end space-x-2">
            <div className="w-full flex-1 md:w-auto md:flex-none">
                <SearchBar />
            </div>
            <ThemeToggle />
            {authAvailable && (
                <>
                {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>
                            <UserIcon />
                        </AvatarFallback>
                        </Avatar>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                ) : (
                <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                </Button>
                )}
                </>
            )}
        </div>
      </div>
    </header>
  );
}
