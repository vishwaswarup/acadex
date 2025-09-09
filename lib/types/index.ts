// ===== BRANDING =====
// Project: Acadex
// Tagline: "Grade smarter."
// Sign-in/Register page text:
// Title: "Join Acadex"
// Subtitle: "Create your account and start managing your assignments smarter."

export type UserRole = 'student' | 'teacher' | 'admin';

// ===== USER MODELS =====

// Core user model for Acadex
export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole; // Explicit role required
  createdAt: string;
  updatedAt: string;
}

// Simplified education domain user interface
export interface EducationUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  classIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ===== AUTH CONTEXT =====
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: 'student' | 'teacher'
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface EducationAuthContextType {
  user: EducationUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role: 'student' | 'teacher'
  ) => Promise<void>;
  signOut: () => Promise<void>;
}

// ===== ACADEX DOMAIN TYPES =====

// Question interface for assignments
export interface Question {
  id: string;
  text: string;
  maxMarks: number;
}

// Assignment interface
export interface Assignment {
  id: string;
  title: string;
  classId: string;
  description: string;
  dueDate: string; // ISO timestamp
  questions: Question[];
  totalQuestions: number;
  createdBy: string; // Teacher UID
  createdAt: string;
  updatedAt: string;
}

// Submission file interface
export interface SubmissionFile {
  url: string; // Firebase Storage URL
  name: string; // Original filename
  size: number; // File size in bytes
}

// Submission interface
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  files: SubmissionFile[];
  submittedAt: string; // ISO timestamp
  status: 'draft' | 'submitted' | 'graded';
  createdAt: string;
}

// Question mark interface for grading
export interface QuestionMark {
  questionId: string;
  mark: number;
}

// Grade interface
export interface Grade {
  id: string;
  submissionId: string;
  teacherId: string;
  marks: QuestionMark[];
  total: number;
  feedback: string;
  gradedAt: string; // ISO timestamp
  createdAt: string;
}

// Class interface
export interface Class {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  createdAt: string;
  updatedAt: string;
}
