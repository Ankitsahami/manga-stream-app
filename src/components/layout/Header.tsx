
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookMarked, Home, LayoutGrid, Library, LogOut, Menu, User as UserIcon, Shield } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState, useMemo } from 'react';

const baseNavLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/genres', label: 'Genres', icon: Library },
  { href: '/bookmarks', label: 'Bookmarks', icon: BookMarked },
];

export function Header({ adminEmail }: { adminEmail?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logOut, authAvailable } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = useMemo(() => {
    return !!adminEmail && !!user && user.email === adminEmail;
  }, [user, adminEmail]);

  const navLinks = useMemo(() => {
    const links = [...baseNavLinks];
    if (isAdmin) {
      links.push({ href: '/admin', label: 'Admin', icon: Shield });
    }
    return links;
  }, [isAdmin]);

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
            <LayoutGrid className="h-6 w-6 text-accent" />
            <span className="hidden sm:inline-block">MangaStream</span>
          </Link>
        </div>
        
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
        
        <div className="flex flex-1 items-center justify-end space-x-2">
            <div className="w-full flex-1 md:w-auto md:flex-none">
                <SearchBar />
            </div>
            <ThemeToggle />
            {authAvailable && (
                <div className="hidden md:flex items-center">
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
                </div>
            )}
             <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                 <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                 <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline mb-6" onClick={handleLinkClick}>
                    <LayoutGrid className="h-6 w-6 text-accent" />
                    <span>MangaStream</span>
                  </Link>
                <div className="flex flex-col space-y-3">
                  {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={handleLinkClick}
                        className={cn(
                            'flex items-center gap-4 px-2.5',
                            pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                        )}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                  ))}
                   {authAvailable && !user && (
                      <Link
                        href="/login"
                        onClick={handleLinkClick}
                        className="flex items-center gap-4 px-2.5 text-foreground/60"
                      >
                        <UserIcon className="h-5 w-5" />
                        Login
                      </Link>
                   )}
                </div>
                 {user && (
                  <div className="absolute bottom-4 left-4 right-4">
                     <Separator className="my-4" />
                     <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                          <AvatarFallback>
                              <UserIcon />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm truncate">
                          <span className="font-medium">{user.displayName}</span>
                          <span className="text-muted-foreground truncate">{user.email}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                          <LogOut className="h-5 w-5" />
                        </Button>
                     </div>
                  </div>
                 )}
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
