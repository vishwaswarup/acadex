// Utility functions for debugging Firestore queries and data
// This file is for development/debugging purposes only

import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Debug function to check assignments collection
export const debugAssignmentsCollection = async () => {
  try {
    console.log('🔍 Debugging assignments collection...');
    
    // Get all assignments
    const allAssignments = await getDocs(collection(db, 'assignments'));
    console.log(`📊 Total assignments found: ${allAssignments.docs.length}`);
    
    allAssignments.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`📝 Assignment ${index + 1}:`, {
        id: doc.id,
        title: data.title,
        createdBy: data.createdBy,
        createdAt: data.createdAt,
        hasCreatedAt: !!data.createdAt,
        hasUpdatedAt: !!data.updatedAt,
        totalQuestions: data.totalQuestions,
        questionsCount: data.questions?.length || 0
      });
    });
    
    return allAssignments.docs.length;
  } catch (error) {
    console.error('❌ Error debugging assignments collection:', error);
    throw error;
  }
};

// Debug function to check submissions collection
export const debugSubmissionsCollection = async () => {
  try {
    console.log('🔍 Debugging submissions collection...');
    
    // Get all submissions
    const allSubmissions = await getDocs(collection(db, 'submissions'));
    console.log(`📊 Total submissions found: ${allSubmissions.docs.length}`);
    
    allSubmissions.docs.forEach((doc, index) => {
      const data = doc.data();
      console.log(`📝 Submission ${index + 1}:`, {
        id: doc.id,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
        submittedAt: data.submittedAt,
        hasSubmittedAt: !!data.submittedAt,
        status: data.status
      });
    });
    
    return allSubmissions.docs.length;
  } catch (error) {
    console.error('❌ Error debugging submissions collection:', error);
    throw error;
  }
};

// Debug function to test specific queries
export const debugTeacherAssignmentsQuery = async (teacherId: string) => {
  try {
    console.log(`🔍 Testing teacher assignments query for: ${teacherId}`);
    
    // Test simple where query
    const simpleQuery = query(
      collection(db, 'assignments'),
      where('createdBy', '==', teacherId)
    );
    
    const simpleResults = await getDocs(simpleQuery);
    console.log(`📊 Simple query results: ${simpleResults.docs.length} assignments`);
    
    // Test ordered query (this might fail)
    try {
      const orderedQuery = query(
        collection(db, 'assignments'),
        where('createdBy', '==', teacherId),
        orderBy('createdAt', 'desc')
      );
      
      const orderedResults = await getDocs(orderedQuery);
      console.log(`📊 Ordered query results: ${orderedResults.docs.length} assignments`);
    } catch (orderError) {
      console.warn('⚠️ Ordered query failed (this is expected if indexes are missing):', orderError);
    }
    
    return simpleResults.docs.length;
  } catch (error) {
    console.error('❌ Error testing teacher assignments query:', error);
    throw error;
  }
};

// Function to add debug functions to window for browser console access
if (typeof window !== 'undefined') {
  (window as any).debugFirestore = {
    assignments: debugAssignmentsCollection,
    submissions: debugSubmissionsCollection,
    teacherAssignments: debugTeacherAssignmentsQuery
  };
  
  console.log('🛠️ Firestore debug functions available:');
  console.log('- window.debugFirestore.assignments()');
  console.log('- window.debugFirestore.submissions()');
  console.log('- window.debugFirestore.teacherAssignments(teacherId)');
}
