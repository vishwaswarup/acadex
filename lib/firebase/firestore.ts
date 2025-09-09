import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  runTransaction,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import { User, Assignment, Submission, Grade } from '@/lib/types';

// Collections
export const USERS_COLLECTION = 'users';
export const ASSIGNMENTS_COLLECTION = 'assignments';
export const SUBMISSIONS_COLLECTION = 'submissions';
export const GRADES_COLLECTION = 'grades';

// Helper function to convert Firestore timestamp to ISO string
const timestampToISO = (timestamp: Timestamp): string => {
  return timestamp.toDate().toISOString();
};

// Helper function to get current ISO string
const getCurrentISO = (): string => {
  return new Date().toISOString();
};

// User operations
export const createUser = async (userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, userData.uid);
  const now = Timestamp.now();
  await setDoc(userRef, {
    ...userData,
    createdAt: now,
    updatedAt: now,
  });
};

export const getUser = async (uid: string): Promise<User | null> => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const data = userSnap.data();
    return {
      ...data,
      createdAt: timestampToISO(data.createdAt),
      updatedAt: timestampToISO(data.updatedAt)
    } as User;
  }
  
  return null;
};

export const updateUser = async (uid: string, updates: Partial<User>): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

// Workout Split operations
export const createWorkoutSplit = async (split: Omit<WorkoutSplit, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, WORKOUT_SPLITS_COLLECTION), {
    ...split,
    createdAt: now,
    updatedAt: now
  });
  
  return docRef.id;
};

export const getUserWorkoutSplits = async (uid: string): Promise<WorkoutSplit[]> => {
  const q = query(
    collection(db, WORKOUT_SPLITS_COLLECTION),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: timestampToISO(data.createdAt),
      updatedAt: timestampToISO(data.updatedAt)
    } as WorkoutSplit;
  });
};

export const getWorkoutSplit = async (id: string): Promise<WorkoutSplit | null> => {
  const splitRef = doc(db, WORKOUT_SPLITS_COLLECTION, id);
  const splitSnap = await getDoc(splitRef);
  
  if (splitSnap.exists()) {
    const data = splitSnap.data();
    return {
      ...data,
      id: splitSnap.id,
      createdAt: timestampToISO(data.createdAt),
      updatedAt: timestampToISO(data.updatedAt)
    } as WorkoutSplit;
  }
  
  return null;
};

export const updateWorkoutSplit = async (id: string, updates: Partial<WorkoutSplit>): Promise<void> => {
  const splitRef = doc(db, WORKOUT_SPLITS_COLLECTION, id);
  await updateDoc(splitRef, {
    ...updates,
    updatedAt: Timestamp.now()
  });
};

export const deleteWorkoutSplit = async (id: string): Promise<void> => {
  const splitRef = doc(db, WORKOUT_SPLITS_COLLECTION, id);
  await deleteDoc(splitRef);
};

// Workout Log operations
export const createWorkoutLog = async (log: Omit<WorkoutLog, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, WORKOUT_LOGS_COLLECTION), {
    ...log,
    createdAt: Timestamp.now()
  }
  )
}
// ===== EDUCATION DOMAIN FUNCTIONS =====

// Real-time listeners for assignments and submissions
export const listenToAssignments = (
  callback: (assignments: Assignment[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  // Try with orderBy first, fallback to simple query if it fails
  let q;
  try {
    q = query(
      collection(db, ASSIGNMENTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.warn('Failed to create ordered assignments query, falling back to simple query:', error);
    q = query(collection(db, ASSIGNMENTS_COLLECTION));
  }
  
  return onSnapshot(q, 
    (querySnapshot) => {
      try {
        const assignments: Assignment[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt ? timestampToISO(data.createdAt) : new Date().toISOString(),
            updatedAt: data.updatedAt ? timestampToISO(data.updatedAt) : new Date().toISOString()
          } as Assignment;
        });
        
        // Sort manually if we couldn't use orderBy
        assignments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        callback(assignments);
      } catch (error) {
        console.error('Error processing assignment data:', error);
        if (onError) onError(error as Error);
      }
    },
    (error) => {
      console.error('Error listening to assignments:', error);
      if (onError) onError(error);
    }
  );
};

export const listenToSubmissions = (
  studentId: string,
  callback: (submissions: Submission[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  // Try with orderBy first, fallback to simple query if it fails
  let q;
  try {
    q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where('studentId', '==', studentId),
      orderBy('submittedAt', 'desc')
    );
  } catch (error) {
    console.warn('Failed to create ordered submissions query, falling back to simple query:', error);
    q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      where('studentId', '==', studentId)
    );
  }
  
  return onSnapshot(q, 
    (querySnapshot) => {
      try {
        const submissions: Submission[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            submittedAt: data.submittedAt ? timestampToISO(data.submittedAt) : new Date().toISOString(),
            createdAt: data.createdAt ? timestampToISO(data.createdAt) : new Date().toISOString()
          } as Submission;
        });
        
        // Sort manually if we couldn't use orderBy
        submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        
        callback(submissions);
      } catch (error) {
        console.error('Error processing submission data:', error);
        if (onError) onError(error as Error);
      }
    },
    (error) => {
      console.error('Error listening to submissions:', error);
      if (onError) onError(error);
    }
  );
};

// Create submission
export const createSubmission = async (submissionData: Omit<Submission, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, SUBMISSIONS_COLLECTION), {
    ...submissionData,
    createdAt: Timestamp.now()
  });
  
  return docRef.id;
};

// Create assignment
export const createAssignment = async (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const now = Timestamp.now();
  
  // Ensure all required fields are present with proper types
  const assignmentDoc = {
    title: assignmentData.title,
    description: assignmentData.description,
    classId: assignmentData.classId,
    dueDate: assignmentData.dueDate,
    questions: assignmentData.questions,
    createdBy: assignmentData.createdBy,
    totalQuestions: assignmentData.questions.length, // Add totalQuestions field
    createdAt: now,
    updatedAt: now
  };
  
  const docRef = await addDoc(collection(db, ASSIGNMENTS_COLLECTION), assignmentDoc);
  
  return docRef.id;
};

// Create grade
export const createGrade = async (gradeData: Omit<Grade, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, GRADES_COLLECTION), {
    ...gradeData,
    createdAt: Timestamp.now()
  });
  
  return docRef.id;
};

// Listen to assignments for a specific teacher
export const listenToTeacherAssignments = (
  teacherId: string,
  callback: (assignments: Assignment[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  // First try with orderBy, if that fails, fall back to simple where query
  let q;
  try {
    q = query(
      collection(db, ASSIGNMENTS_COLLECTION),
      where('createdBy', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
  } catch (error) {
    console.warn('Failed to create ordered query, falling back to simple query:', error);
    // Fallback to simple query without orderBy
    q = query(
      collection(db, ASSIGNMENTS_COLLECTION),
      where('createdBy', '==', teacherId)
    );
  }
  
  return onSnapshot(q, 
    (querySnapshot) => {
      try {
        const assignments: Assignment[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt ? timestampToISO(data.createdAt) : new Date().toISOString(),
            updatedAt: data.updatedAt ? timestampToISO(data.updatedAt) : new Date().toISOString()
          } as Assignment;
        });
        
        // Sort manually if we couldn't use orderBy
        assignments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        callback(assignments);
      } catch (error) {
        console.error('Error processing assignment data:', error);
        if (onError) onError(error as Error);
      }
    },
    (error) => {
      console.error('Error listening to teacher assignments:', error);
      if (onError) onError(error);
    }
  );
};

// Listen to all submissions (for teacher dashboard)
export const listenToAllSubmissions = (
  callback: (submissions: Submission[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  // Try with orderBy first, fallback to simple query if it fails
  let q;
  try {
    q = query(
      collection(db, SUBMISSIONS_COLLECTION),
      orderBy('submittedAt', 'desc')
    );
  } catch (error) {
    console.warn('Failed to create ordered submissions query, falling back to simple query:', error);
    q = query(collection(db, SUBMISSIONS_COLLECTION));
  }
  
  return onSnapshot(q, 
    (querySnapshot) => {
      try {
        const submissions: Submission[] = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            submittedAt: data.submittedAt ? timestampToISO(data.submittedAt) : new Date().toISOString(),
            createdAt: data.createdAt ? timestampToISO(data.createdAt) : new Date().toISOString()
          } as Submission;
        });
        
        // Sort manually if we couldn't use orderBy
        submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
        
        callback(submissions);
      } catch (error) {
        console.error('Error processing submission data:', error);
        if (onError) onError(error as Error);
      }
    },
    (error) => {
      console.error('Error listening to all submissions:', error);
      if (onError) onError(error);
    }
  );
};