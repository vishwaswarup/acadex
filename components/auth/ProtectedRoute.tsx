'use client';

import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  role?: UserRole;
}

export default function ProtectedRoute({ children, fallback, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // Not logged in → send to login
      router.replace('/auth');
      return;
    }

    if (role && user.role !== role) {
      // Wrong role → send to their dashboard
      const redirectPath =
        user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
      router.replace(redirectPath);
    }
  }, [user, loading, router, role]);

  if (loading) {
    return fallback || <LoadingSpinner />;
  }

  // Show fallback while redirecting mismatched role
  if (role && user && user.role !== role) {
    return fallback || <LoadingSpinner />;
  }

  if (!user) {
    return fallback || <LoadingSpinner />;
  }

  return <>{children}</>;
}
