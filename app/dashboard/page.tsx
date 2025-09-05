"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user's role from Firestore
      if (user.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else {
        // For students, redirect to student dashboard
        router.push('/dashboard/student');
      }
    }
  }, [user, loading, router]);

  // Show loading while determining user role
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}