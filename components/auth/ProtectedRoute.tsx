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
      router.push('/auth');
      return;
    }

    // If a role is required and the user's role doesn't match, redirect
    if (role && user.role !== role) {
      const redirectPath = user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';
      router.push(redirectPath);
    }
  }, [user, loading, router, role]);

  if (loading || (role && user?.role !== role)) {
    return fallback || <LoadingSpinner />;
  }

  if (!user) {
    return fallback || <LoadingSpinner />;
  }

  return <>{children}</>;
}