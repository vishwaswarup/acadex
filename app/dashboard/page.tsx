"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  useEffect(() => {
    if (!loading && user && user.role) {
      // If user has a role in Firestore, redirect automatically
      if (user.role === 'teacher') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard/student');
      }
    }
  }, [user, loading, router]);

  const handleRoleSelection = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
    if (role === 'teacher') {
      router.push('/dashboard/teacher');
    } else {
      router.push('/dashboard/student');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }

  // If user has a role, show loading while redirecting
  if (user?.role) {
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

  // Show role selection for users without a role
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Choose Your Role</CardTitle>
              <p className="text-muted-foreground">Select how you'll be using Acadex</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleRoleSelection('student')}
                className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                variant="outline"
              >
                <BookOpen className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="font-semibold">Student</div>
                  <div className="text-sm text-muted-foreground">Submit assignments</div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleRoleSelection('teacher')}
                className="w-full h-20 flex flex-col items-center justify-center space-y-2"
                variant="outline"
              >
                <GraduationCap className="h-8 w-8 text-green-600" />
                <div>
                  <div className="font-semibold">Teacher</div>
                  <div className="text-sm text-muted-foreground">Grade assignments</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}