"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { listenToAssignments, listenToSubmissions } from "@/lib/firebase/firestore";
import { Assignment, Submission } from "@/lib/types";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubAssignments = listenToAssignments(
      (data) => {
        setAssignments(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching assignments:", error);
        setLoading(false);
      }
    );

    const unsubSubmissions = listenToSubmissions(
      user.uid,
      (data) => setSubmissions(data),
      (error) => console.error("Error fetching submissions:", error)
    );

    return () => {
      unsubAssignments();
      unsubSubmissions();
    };
  }, [user?.uid]);

  if (loading) {
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
      <div className="min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

        {/* Assignments Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Available Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length === 0 ? (
              <p className="text-muted-foreground">No assignments available.</p>
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
            <CardTitle>Your Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-muted-foreground">You haven't submitted any assignments yet.</p>
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
