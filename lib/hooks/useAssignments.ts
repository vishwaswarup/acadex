'use client';

import { useState, useEffect, useCallback } from 'react';
import { Assignment } from '@/lib/types';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface UseAssignmentsProps {
  classId?: string;       // For students
  teacherId?: string;     // For teacher dashboard
}

export const useAssignments = ({ classId, teacherId }: UseAssignmentsProps) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback((): Unsubscribe => {
    setLoading(true);
    setError(null);

    try {
      let q;

      if (teacherId) {
        // Teacher dashboard: fetch assignments created by this teacher
        q = query(
          collection(db, 'assignments'),
          where('createdBy', '==', teacherId),
          orderBy('createdAt', 'desc')
        );
      } else if (classId) {
        // Student dashboard: fetch assignments for the class
        q = query(
          collection(db, 'assignments'),
          where('classId', '==', classId),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Fallback: fetch all assignments (optional)
        q = query(collection(db, 'assignments'), orderBy('createdAt', 'desc'));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const fetchedAssignments: Assignment[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              title: data.title,
              classId: data.classId,
              description: data.description,
              dueDate: data.dueDate,
              questions: data.questions || [],
              totalQuestions: data.totalQuestions || (data.questions || []).length,
              createdBy: data.createdBy,
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            };
          });

          setAssignments(fetchedAssignments);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching assignments:', err);
          setError('Failed to fetch assignments');
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err: any) {
      console.error('Error setting up assignments listener:', err);
      setError(err.message || 'Unknown error');
      setLoading(false);
      return () => {}; // dummy unsubscribe
    }
  }, [classId, teacherId]);

  useEffect(() => {
    const unsubscribe = fetchAssignments();
    return () => unsubscribe();
  }, [fetchAssignments]);

  return { assignments, loading, error, refetch: fetchAssignments };
};
