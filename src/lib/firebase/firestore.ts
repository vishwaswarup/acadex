import {
  collection,
  doc,
  addDoc,
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
  runTransaction
} from 'firebase/firestore';
import { db } from './config';
import { User, WorkoutSplit, WorkoutLog } from '@/lib/types';
import { FirebaseError } from 'firebase/app';

// Collections
export const USERS_COLLECTION = 'users';
export const WORKOUT_SPLITS_COLLECTION = 'workoutSplits';
export const WORKOUT_LOGS_COLLECTION = 'workoutLogs';

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
  
  await updateDoc(userRef, {
    ...userData,
    createdAt: now,
    updatedAt: now
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
  });
  
  return docRef.id;
};

// Add error handling wrapper
const handleFirebaseError = (error: unknown) => {
  if (error instanceof FirebaseError) {
    throw new Error(`Firebase Error ${error.code}: ${error.message}`);
  }
  throw error;
};

// Add input validation
const validateDateRange = (startDate?: string, endDate?: string) => {
  if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    throw new Error('Invalid start date format. Use YYYY-MM-DD');
  }
  if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    throw new Error('Invalid end date format. Use YYYY-MM-DD');
  }
}

// Add batch operations
export const batchCreateWorkoutLogs = async (logs: Array<Omit<WorkoutLog, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const batch = writeBatch(db);
    logs.forEach(log => {
      const logRef = doc(collection(db, WORKOUT_LOGS_COLLECTION));
      batch.set(logRef, {
        ...log,
        createdAt: Timestamp.now()
      });
    });
    await batch.commit();
  } catch (error) {
    handleFirebaseError(error);
  }
};

// Improve getUserWorkoutLogs with proper date filtering
export const getUserWorkoutLogs = async (
  uid: string, 
  startDate?: string, 
  endDate?: string
): Promise<WorkoutLog[]> => {
  try {
    validateDateRange(startDate, endDate);
    
    let constraints = [
      where('uid', '==', uid),
      orderBy('date', 'desc')
    ];
    
    if (startDate) {
      constraints.push(where('date', '>=', startDate));
    }
    if (endDate) {
      constraints.push(where('date', '<=', endDate));
    }
    
    const q = query(
      collection(db, WORKOUT_LOGS_COLLECTION),
      ...constraints
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: timestampToISO(doc.data().createdAt)
    } as WorkoutLog));
  } catch (error) {
    handleFirebaseError(error);
  }
};

export const getWorkoutLogByDate = async (uid: string, date: string): Promise<WorkoutLog | null> => {
  const q = query(
    collection(db, WORKOUT_LOGS_COLLECTION),
    where('uid', '==', uid),
    where('date', '==', date),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: timestampToISO(data.createdAt)
    } as WorkoutLog;
  }
  
  return null;
};

// Atomic streak update
export const updateUserStreakAtomic = async (
  uid: string,
  newStreak: number,
  lastLoggedDate: string,
  workoutLogData: Omit<WorkoutLog, 'id' | 'createdAt'>
): Promise<void> => {
  await runTransaction(db, async (transaction) => {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const logRef = doc(collection(db, WORKOUT_LOGS_COLLECTION));
    
    // Update user streak
    transaction.update(userRef, {
      streak: newStreak,
      lastLoggedDate: lastLoggedDate,
      updatedAt: Timestamp.now()
    });
    
    // Create workout log
    transaction.set(logRef, {
      ...workoutLogData,
      createdAt: Timestamp.now()
    });
  });
};