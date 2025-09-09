import { useState, useEffect } from 'react';
import { Assignment, Submission } from '@/lib/types';
import { listenToAssignments, listenToSubmissions, listenToTeacherAssignments, listenToAllSubmissions } from '@/lib/firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

export function useStudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

    const unsubscribeAssignments = listenToAssignments(
      (assignmentsData) => {
        setAssignments(assignmentsData);
        assignmentsLoaded = true;
        checkLoadingComplete();
      },
      (error) => {
        console.error('Error loading assignments:', error);
        assignmentsLoaded = true;
        checkLoadingComplete();
      }
    );

    const unsubscribeSubmissions = listenToSubmissions(
      user.uid,
      (submissionsData) => {
        setSubmissions(submissionsData);
        submissionsLoaded = true;
        checkLoadingComplete();
      },
      (error) => {
        console.error('Error loading submissions:', error);
        submissionsLoaded = true;
        checkLoadingComplete();
      }
    );

    return () => {
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, [user]);

  return { assignments, submissions, loading };
}

export function useTeacherAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

    const unsubscribeAssignments = listenToTeacherAssignments(
      user.uid,
      (assignmentsData) => {
        setAssignments(assignmentsData);
        assignmentsLoaded = true;
        checkLoadingComplete();
      },
      (error) => {
        console.error('Error loading assignments:', error);
        assignmentsLoaded = true;
        checkLoadingComplete();
      }
    );

    const unsubscribeSubmissions = listenToAllSubmissions(
      (submissionsData) => {
        setSubmissions(submissionsData);
        submissionsLoaded = true;
        checkLoadingComplete();
      },
      (error) => {
        console.error('Error loading submissions:', error);
        submissionsLoaded = true;
        checkLoadingComplete();
      }
    );

    return () => {
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, [user]);

  return { assignments, submissions, loading };
}