"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { listenToTeacherAssignments, listenToSubmissionsForTeacher } from "@/lib/firebase/firestore";
import { Assignment, Submission } from "@/lib/types";

export default function TeacherDashboardPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubAssignments = listenToTeacherAssignments(
      user.uid,
      (data) => {
        setAssignments(data);
        setLoading(false);

        // Fetch submissions for all teacher assignments
        const assignmentIds = data.map(a => a.id);
        const unsubSubmissions = listenToSubmissionsForTeacher(
          assignmentIds,
          (subs) => setSubmissions(subs),
          (error) => console.error("Error fetching submissions:", error)
        );

        // Cleanup for submissions listener
        return () => unsubSubmissions();
      },
      (error) => {
        console.error("Error fetching teacher assignments:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubAssignments();
    };
  }, [user?.uid]);

  if (loading) {
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

        {/* Assignments Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-muted-foreground">You haven't created any assignments yet.</p>
            ) : (
              <ul className="space-y-2">
                {assignments.map((a) => (
                  <li key={a.id} className="flex justify-between items-center border p-3 rounded-lg">
                    <span>{a.title}</span>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Submissions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Student Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-muted-foreground">No submissions yet.</p>
            ) : (
              <ul className="space-y-2">
                {submissions.map((s) => (
                  <li key={s.id} className="flex justify-between items-center border p-3 rounded-lg">
                    <span>
                      {s.assignmentId} – {new Date(s.submittedAt).toLocaleString()} – {s.status}
                    </span>
                    <Button size="sm">View</Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
