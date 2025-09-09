import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Grade, QuestionMark } from '@/lib/types';

// GET /api/grades - List grades
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');
    const studentId = searchParams.get('studentId');
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Build query based on filters
    let gradesQuery;
    
    if (submissionId) {
      // Get grade for a specific submission
      gradesQuery = query(
        collection(db, 'grades'),
        where('submissionId', '==', submissionId)
      );
    } else if (studentId) {
      // Get all grades for a specific student
      gradesQuery = query(
        collection(db, 'grades'),
        where('studentId', '==', studentId),
        orderBy('gradedAt', 'desc')
      );
    } else {
      // Get all grades (for teachers)
      gradesQuery = query(collection(db, 'grades'), orderBy('gradedAt', 'desc'));
    }

    const gradesSnapshot = await getDocs(gradesQuery);
    const grades: Grade[] = gradesSnapshot.docs.map(doc => {
      const data = doc.data() as Grade;
      return {
        id: doc.id,
        submissionId: data.submissionId,
        teacherId: data.teacherId,
        marks: data.marks || [],
        total: data.total || 0,
        feedback: data.feedback || '',
        gradedAt: data.gradedAt,
        createdAt: data.createdAt,
      };
    });

    return NextResponse.json({ grades });
  } catch (error) {
    console.error('Error fetching grades:', error);
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 });
  }
}

// POST /api/grades - Create grade (teacher only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, teacherId, marks, feedback, userId, userRole } = body;

    // Validate required fields
    if (!submissionId || !teacherId || !marks || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user is a teacher
    if (userRole !== 'teacher') {
      return NextResponse.json({ error: 'Only teachers can create grades' }, { status: 403 });
    }

    // Validate marks structure
    if (!Array.isArray(marks) || marks.length === 0) {
      return NextResponse.json({ error: 'At least one mark is required' }, { status: 400 });
    }

    // Validate each mark
    for (const mark of marks) {
      if (!mark.questionId || typeof mark.mark !== 'number' || mark.mark < 0) {
        return NextResponse.json({ error: 'Invalid mark structure' }, { status: 400 });
      }
    }

    // Calculate total marks
    const total = marks.reduce((sum, mark) => sum + mark.mark, 0);

    // Create grade document
    const gradeData = {
      submissionId,
      teacherId,
      marks,
      total,
      feedback: feedback || '',
      gradedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'grades'), gradeData);

    // Update submission status to 'graded'
    const submissionRef = doc(db, 'submissions', submissionId);
    await updateDoc(submissionRef, {
      status: 'graded',
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({ 
      id: docRef.id,
      total,
      message: 'Grade created successfully' 
    });
  } catch (error) {
    console.error('Error creating grade:', error);
    return NextResponse.json({ error: 'Failed to create grade' }, { status: 500 });
  }
}
