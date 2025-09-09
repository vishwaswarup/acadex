"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Assignment, Submission } from '@/lib/types';
import { listenToTeacherAssignments, listenToSubmissionsForTeacher } from '@/lib/firebase/firestore';

export default function DashboardTeacherPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && user?.role !== 'teacher') {
      router.push('/dashboard/student');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    setLoadingData(true);

    const unsubscribeAssignments = listenToTeacherAssignments(
      user.uid,
      (data) => {
        setAssignments(data);

        // Once we have assignments, listen to submissions
        const assignmentIds = data.map(a => a.id);
        const unsubscribeSubmissions = listenToSubmissionsForTeacher(
          assignmentIds,
          (subData) => {
            setSubmissions(subData);
            setLoadingData(false);
          },
          (err) => {
            console.error('Error fetching submissions:', err);
            setLoadingData(false);
          }
        );

        return () => unsubscribeSubmissions();
      },
      (err) => {
        console.error('Error fetching assignments:', err);
        setLoadingData(false);
      }
    );

    return () => unsubscribeAssignments();
  }, [user]);

  if (loading || loadingData) {
    return (
      <ProtectedRoute role="teacher">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="teacher">
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{assignments.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-semibold">{submissions.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Assignments</h2>
          <div className="space-y-4">
            {assignments.map((a) => (
              <Card key={a.id}>
                <CardHeader>
                  <CardTitle>{a.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{a.description}</p>
                  <p className="text-sm text-muted-foreground">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">Submissions: {submissions.filter(s => s.assignmentId === a.id).length}</p>
                  <Button className="mt-2" onClick={() => router.push(`/dashboard/teacher/assignments/${a.id}`)}>
                    View Submissions
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
