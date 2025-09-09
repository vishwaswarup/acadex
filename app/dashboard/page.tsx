"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { listenToTeacherAssignments, listenToSubmissionsForTeacher } from "@/lib/firebase/firestore";
import { Assignment, Submission } from "@/lib/types";
import { useAuth } from "@/hooks/useAuth";

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
      },
      (error) => {
        console.error("Error listening to assignments:", error);
        setLoading(false);
      }
    );

    // Listen to submissions once we know assignments
    const unsubSubmissions = listenToSubmissionsForTeacher(
      assignments.map((a) => a.id),
      (data) => setSubmissions(data),
      (error) => console.error("Error listening to submissions:", error)
    );

    return () => {
      unsubAssignments();
      unsubSubmissions();
    };
  }, [user?.uid, assignments.map((a) => a.id).join(",")]);

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
              <p className="text-muted-foreground">No assignments yet.</p>
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
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-muted-foreground">No submissions yet.</p>
            ) : (
              <ul className="space-y-2">
                {submissions.map((s) => (
                  <li key={s.id} className="flex justify-between items-center border p-3 rounded-lg">
                    <span>
                      {s.studentId} – {new Date(s.submittedAt).toLocaleString()}
                    </span>
                    <Button size="sm">Grade</Button>
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
