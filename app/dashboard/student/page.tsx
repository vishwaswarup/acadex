'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { listenToAssignments, listenToSubmissions } from '@/lib/firebase/firestore';
import { Assignment, Submission } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentDashboardPage() {
  const { user, loading } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoadingData(true);

    // Listen to all assignments
    const unsubscribeAssignments = listenToAssignments(
      (data) => setAssignments(data),
      (error) => console.error('Assignments listener error:', error)
    );

    // Listen to submissions for this student
    const unsubscribeSubmissions = listenToSubmissions(
      user.uid,
      (data) => setSubmissions(data),
      (error) => console.error('Submissions listener error:', error)
    );

    setLoadingData(false);

    return () => {
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, [user]);

  if (loading || loadingData) {
    return (
      <ProtectedRoute role="student">
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute role="student">
      <div className="min-h-screen p-6 space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Assignments</h2>
          {assignments.length === 0 ? (
            <p>No assignments yet.</p>
          ) : (
            assignments.map((assignment) => {
              const submission = submissions.find((s) => s.assignmentId === assignment.id);

              return (
                <Card key={assignment.id}>
                  <CardHeader>
                    <CardTitle>{assignment.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p>{assignment.description}</p>
                    {submission ? (
                      <p className="mt-2 text-green-600">
                        Status: {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                      </p>
                    ) : (
                      <p className="mt-2 text-orange-600">Not submitted yet</p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
