import { NextRequest, NextResponse } from 'next/server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

// POST /api/upload - Handle file uploads to Firebase Storage
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const assignmentId = formData.get('assignmentId') as string;
    const studentId = formData.get('studentId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!assignmentId || !studentId) {
      return NextResponse.json({ error: 'Assignment ID and Student ID required' }, { status: 400 });
    }

    // Validate file type (only PDF allowed)
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Create storage reference with organized path structure
    const fileName = `${Date.now()}_${file.name}`;
    const storagePath = `acadex/submissions/${assignmentId}/${studentId}/${fileName}`;
    const storageRef = ref(storage, storagePath);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // Upload file to Firebase Storage
    const uploadResult = await uploadBytes(storageRef, buffer);
    
    // Get download URL
    const downloadURL = await getDownloadURL(uploadResult.ref);

    // Return file metadata
    const fileMetadata = {
      url: downloadURL,
      name: file.name,
      size: file.size,
      path: storagePath,
    };

    return NextResponse.json({ 
      success: true,
      file: fileMetadata,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
