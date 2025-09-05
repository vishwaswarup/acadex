export interface User {
  uid: string;
  email: string;
  name: string;
  streak: number;
  lastLoggedDate: string | null; // ISO date string (yyyy-MM-dd)
  xpLevel?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

export interface WorkoutDay {
  day: number; // 1-7 (1 = Day 1)
  exercises: Exercise[];
}

export interface WorkoutSplit {
  id: string;
  uid: string;
  name: string;
  daysPerWeek: number;
  days: WorkoutDay[];
  isTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutLog {
  id: string;
  uid: string;
  date: string; // ISO date string (yyyy-MM-dd)
  splitId: string;
  completed: boolean;
  createdAt: string;
}

export interface WorkoutSplitTemplate {
  name: string;
  daysPerWeek: number;
  days: WorkoutDay[];
}

export interface StreakUpdateResult {
  newStreak: number;
  canLog: boolean;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}