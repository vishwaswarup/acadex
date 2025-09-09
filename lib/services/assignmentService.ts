import { Assignment, Submission, Grade, QuestionMark } from '@/lib/types';

export class AssignmentService {
  static async getAssignments(classId?: string, userId?: string): Promise<Assignment[]> {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    if (userId) params.append('userId', userId);

    const response = await fetch(`/api/assignments?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }

    const data = await response.json();
    return data.assignments;
  }

  static async createAssignment(assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const response = await fetch('/api/assignments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(assignmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create assignment');
    }

    const data = await response.json();
    return data.id;
  }

  static async getSubmissions(assignmentId?: string, studentId?: string): Promise<Submission[]> {
    const params = new URLSearchParams();
    if (assignmentId) params.append('assignmentId', assignmentId);
    if (studentId) params.append('studentId', studentId);

    const response = await fetch(`/api/submissions?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch submissions');
    }

    const data = await response.json();
    return data.submissions;
  }

  static async createSubmission(submissionData: Omit<Submission, 'id' | 'createdAt'>): Promise<string> {
    const response = await fetch('/api/submissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create submission');
    }

    const data = await response.json();
    return data.id;
  }

  static async submitGrade(gradeData: {
    submissionId: string;
    teacherId: string;
    marks: QuestionMark[];
    feedback: string;
    userId: string;
    userRole: string;
  }): Promise<string> {
    const response = await fetch('/api/grades', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gradeData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit grade');
    }

    const data = await response.json();
    return data.id;
  }

  static async uploadFile(file: File, assignmentId: string, studentId: string): Promise<{
    url: string;
    name: string;
    size: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assignmentId', assignmentId);
    formData.append('studentId', studentId);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    return data.file;
  }
}