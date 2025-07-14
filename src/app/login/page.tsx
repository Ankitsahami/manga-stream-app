
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { user, googleSignIn, authAvailable } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  if (!authAvailable) {
    return (
       <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Login Not Configured</CardTitle>
            <CardDescription>
              The application developer has not configured Firebase authentication. Please add your credentials to the .env file.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Sign in to sync your bookmarks and history.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignIn}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Sign In with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
