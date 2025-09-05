// Utility functions for adding test data to Firestore
// This file is for development/testing purposes only

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Assignment, Question } from '@/lib/types';

export const createTestAssignment = async (): Promise<string> => {
  const questions: Question[] = [
    {
      id: 'q1',
      text: 'Explain the concept of object-oriented programming and provide examples.',
      maxMarks: 10
    },
    {
      id: 'q2', 
      text: 'Write a simple class in your preferred programming language that demonstrates inheritance.',
      maxMarks: 15
    },
    {
      id: 'q3',
      text: 'Compare and contrast encapsulation and abstraction with examples.',
      maxMarks: 10
    }
  ];

  const assignmentData: Omit<Assignment, 'id'> = {
    title: 'Object-Oriented Programming Assignment',
    classId: 'cs101',
    description: 'This assignment covers the fundamental concepts of object-oriented programming. Please provide detailed answers with code examples where appropriate.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    questions,
    totalQuestions: questions.length,
    createdBy: 'demo_teacher',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'assignments'), {
      ...assignmentData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Test assignment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating test assignment:', error);
    throw error;
  }
};

// Function to add test assignment via browser console
// Usage: In browser console, run: window.createTestAssignment()
if (typeof window !== 'undefined') {
  (window as any).createTestAssignment = createTestAssignment;
}
