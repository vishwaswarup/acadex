"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import Navigation from '@/components/common/Navigation';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AssignmentCard from '@/components/assignment/AssignmentCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Clock } from 'lucide-react';
import { Assignment, Submission } from '@/lib/types';
import { listenToAssignments, listenToSubmissions } from '@/lib/firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    let assignmentsLoaded = false;
    let submissionsLoaded = false;

    const checkLoadingComplete = () => {
      if (assignmentsLoaded && submissionsLoaded) {
        setLoading(false);
      }
    };

    // Listen to assignments
    const unsubscribeAssignments = listenToAssignments(
      (assignmentsData) => {
        setAssignments(assignmentsData);
        assignmentsLoaded = true;
        checkLoadingComplete();
      },
      (error) => {
        console.error('Error loading assignments:', error);
        toast({
          title: "Error loading assignments",
          description: "Please refresh the page to try again.",
          variant: "destructive"
        });
        assignmentsLoaded = true;
        checkLoadingComplete();
      }
    );

    // Listen to submissions for this student
    const unsubscribeSubmissions = listenToSubmissions(
      user.uid,
      (submissionsData) => {
        setSubmissions(submissionsData);
        submissionsLoaded = true;
        checkLoadingComplete();
      },
      (error) => {
        console.error('Error loading submissions:', error);
        toast({
          title: "Error loading submissions",
          description: "Failed to load submissions. Please refresh the page.",
          variant: "destructive"
        });
        submissionsLoaded = true;
        checkLoadingComplete();
      }
    );

    return () => {
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, [user, toast]);

  const getSubmissionStatus = (assignmentId: string) => {
    const submission = submissions.find(sub => sub.assignmentId === assignmentId);
    if (!submission) return 'not_submitted';
    return submission.status;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const handleViewDetails = (assignmentId: string) => {
    router.push(`/assignments/${assignmentId}`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen pb-20">
          <Header title="Assignments" />
          <div className="container mx-auto p-6">
            <div className="text-center">Loading assignments...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen pb-20">
        <Header title="All Assignments" />

        <main className="container mx-auto p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Total Assignments</p>
                    <p className="text-2xl font-bold">{assignments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">Pending</p>
                    <p className="text-2xl font-bold">
                      {assignments.filter(a => getSubmissionStatus(a.id) === 'not_submitted').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Overdue</p>
                    <p className="text-2xl font-bold">
                      {assignments.filter(a => 
                        isOverdue(a.dueDate) && getSubmissionStatus(a.id) === 'not_submitted'
                      ).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assignments List */}
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No assignments available</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {assignments.map((assignment) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      submissionStatus={getSubmissionStatus(assignment.id)}
                      isOverdue={isOverdue(assignment.dueDate)}
                      onViewDetails={() => handleViewDetails(assignment.id)}
                      showActions={true}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        <Navigation currentPath="/assignments" />
      </div>
    </ProtectedRoute>
  );
}