import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Submission, SubmissionFile } from '@/lib/types';

// GET /api/submissions - List submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assignmentId = searchParams.get('assignmentId');
    const studentId = searchParams.get('studentId');
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Build query based on filters
    let submissionsQuery;
    
    if (assignmentId) {
      // Get all submissions for a specific assignment
      submissionsQuery = query(
        collection(db, 'submissions'),
        where('assignmentId', '==', assignmentId),
        orderBy('submittedAt', 'desc')
      );
    } else if (studentId) {
      // Get all submissions for a specific student
      submissionsQuery = query(
        collection(db, 'submissions'),
        where('studentId', '==', studentId),
        orderBy('submittedAt', 'desc')
      );
    } else {
      // Get all submissions (for teachers)
      submissionsQuery = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
    }

    const submissionsSnapshot = await getDocs(submissionsQuery);
    const submissions: Submission[] = submissionsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        assignmentId: data.assignmentId,
        studentId: data.studentId,
        files: data.files || [],
        submittedAt: data.submittedAt,
        status: data.status || 'draft',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      };
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

// POST /api/submissions - Create submission (student only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assignmentId, studentId, files, userId, userRole } = body;

    // Validate required fields
    if (!assignmentId || !studentId || !files || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user is a student
    if (userRole !== 'student') {
      return NextResponse.json({ error: 'Only students can create submissions' }, { status: 403 });
    }

    // Validate files structure
    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'At least one file is required' }, { status: 400 });
    }

    // Validate each file
    for (const file of files) {
      if (!file.url || !file.name || typeof file.size !== 'number') {
        return NextResponse.json({ error: 'Invalid file structure' }, { status: 400 });
      }
    }

    // Create submission document
    const submissionData = {
      assignmentId,
      studentId,
      files,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'submissions'), submissionData);

    return NextResponse.json({ 
      id: docRef.id,
      message: 'Submission created successfully' 
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 });
  }
}
