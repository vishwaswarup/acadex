'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { signIn as firebaseSignIn, signUp as firebaseSignUp, signOut as firebaseSignOut, onAuthChanged } from '../lib/firebase/auth';
import { createUser, getUser } from '../lib/firebase/firestore';
import { useRouter } from 'next/navigation';
import { User, AuthContextType } from '../lib/types';
import { useToast } from './use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          let userData = await getUser(firebaseUser.uid);
          
          // If user doesn't exist in Firestore, create them
          if (!userData) {
            const newUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'User',
              streak: 0,
              lastLoggedDate: null,
              xpLevel: 1,
              role: undefined // No default role - let user choose
            };
            
            await createUser(newUserData);
            userData = {
              ...newUserData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
          
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast({
            title: "Error",
            description: "Failed to load user data",
            variant: "destructive"
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [toast, router]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await firebaseSignIn(email, password);
      toast({
        title: "Welcome back!",
        description: "Successfully signed in"
      });
      // Note: The actual routing will be handled by the auth state change listener
      // which will check the user's role and route accordingly
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: 'student' | 'teacher' = 'student') => {
    try {
      setLoading(true);
      const result = await firebaseSignUp(email, password);
      
      // Create user document in Firestore
      const userData = {
        uid: result.user.uid,
        email: email,
        name: name,
        streak: 0,
        lastLoggedDate: null,
        xpLevel: 1,
        role: role // Add role field
      };
      
      await createUser(userData);
      
      toast({
        title: "Account created!",
        description: "Welcome to Acadex"
      });
      
      // Route based on role
      if (role === 'teacher') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard/student');
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
      toast({
        title: "Signed out",
        description: "See you next time!"
      });
      router.push('/');
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
};

export { AuthContext };