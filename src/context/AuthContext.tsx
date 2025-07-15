
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, firebaseEnabled } from '@/lib/firebase';
import Loading from '@/app/loading';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  googleSignIn: () => Promise<void>;
  emailSignIn: (email: string, pass: string) => Promise<void>;
  emailSignUp: (email: string, pass: string, name: string) => Promise<void>;
  logOut: () => Promise<void>;
  authAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  const googleSignIn = async () => {
    if (!auth) throw new Error("Firebase not configured");
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const emailSignIn = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase not configured");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
       console.error(error);
       throw error;
    }
  }

  const emailSignUp = async (email: string, pass: string, name: string) => {
     if (!auth) throw new Error("Firebase not configured");
     try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
       await updateProfile(userCredential.user, {
         displayName: name,
       });
       // To ensure the user object is updated with the display name
       setUser({ ...userCredential.user, displayName: name });
     } catch (error) {
       console.error(error);
       throw error;
     }
  }

  const logOut = async () => {
    if (!auth) throw new Error("Firebase not configured");
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ user, loading, googleSignIn, emailSignIn, emailSignUp, logOut, authAvailable: firebaseEnabled }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
