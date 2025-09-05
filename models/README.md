# Acadex Data Models

This document describes the data models used in Acadex for assignment management.

## Firestore Collections

### Users Collection (`users`)

Stores user information with role-based access.

```typescript
interface User {
  id: string;                    // Document ID
  name: string;                  // Display name
  email: string;                 // Email address (unique)
  role: 'student' | 'teacher';   // User role
  classIds: string[];            // Array of class IDs user belongs to
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

**Example Document:**
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "classIds": ["class_456", "class_789"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Assignments Collection (`assignments`)

Stores assignment information and questions.

```typescript
interface Assignment {
  id: string;                    // Document ID
  title: string;                 // Assignment title
  classId: string;               // Class this assignment belongs to
  description: string;            // Assignment description
  dueDate: string;               // ISO timestamp
  questions: Question[];          // Array of questions
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}

interface Question {
  id: string;                    // Unique question ID
  text: string;                  // Question text
  maxMarks: number;              // Maximum marks for this question
}
```

**Example Document:**
```json
{
  "id": "assign_456",
  "title": "Math Problem Set 1",
  "classId": "class_789",
  "description": "Solve the following mathematical problems",
  "dueDate": "2024-02-01T23:59:59.000Z",
  "questions": [
    {
      "id": "q1",
      "text": "Solve for x: 2x + 5 = 13",
      "maxMarks": 10
    },
    {
      "id": "q2", 
      "text": "Find the derivative of x² + 3x",
      "maxMarks": 15
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Submissions Collection (`submissions`)

Stores student submissions for assignments.

```typescript
interface Submission {
  id: string;                    // Document ID
  assignmentId: string;          // Reference to assignment
  studentId: string;             // Reference to student user
  files: SubmissionFile[];       // Array of uploaded files
  submittedAt: string;           // ISO timestamp when submitted
  status: 'draft' | 'submitted' | 'graded';  // Submission status
  createdAt: string;             // ISO timestamp
}

interface SubmissionFile {
  url: string;                   // Firebase Storage URL
  name: string;                  // Original filename
  size: number;                  // File size in bytes
}
```

**Example Document:**
```json
{
  "id": "sub_789",
  "assignmentId": "assign_456",
  "studentId": "user_123",
  "files": [
    {
      "url": "https://firebasestorage.googleapis.com/.../submission.pdf",
      "name": "math_homework.pdf",
      "size": 2048576
    }
  ],
  "submittedAt": "2024-01-30T14:30:00.000Z",
  "status": "submitted",
  "createdAt": "2024-01-30T14:30:00.000Z"
}
```

### Grades Collection (`grades`)

Stores grading information for submissions.

```typescript
interface Grade {
  id: string;                    // Document ID
  submissionId: string;          // Reference to submission
  teacherId: string;             // Reference to teacher user
  marks: QuestionMark[];         // Array of question-wise marks
  total: number;                 // Total marks achieved
  feedback: string;              // Teacher feedback
  gradedAt: string;              // ISO timestamp when graded
  createdAt: string;             // ISO timestamp
}

interface QuestionMark {
  questionId: string;            // Reference to question
  mark: number;                  // Marks awarded for this question
}
```

**Example Document:**
```json
{
  "id": "grade_101",
  "submissionId": "sub_789",
  "teacherId": "user_456",
  "marks": [
    {
      "questionId": "q1",
      "mark": 8
    },
    {
      "questionId": "q2",
      "mark": 12
    }
  ],
  "total": 20,
  "feedback": "Good work! Remember to show your steps clearly.",
  "gradedAt": "2024-02-02T09:15:00.000Z",
  "createdAt": "2024-02-02T09:15:00.000Z"
}
```

## Collection Structure

```
Firestore Root
├── users/
│   ├── {userId}/
│   └── ...
├── assignments/
│   ├── {assignmentId}/
│   └── ...
├── submissions/
│   ├── {submissionId}/
│   └── ...
└── grades/
    ├── {gradeId}/
    └── ...
```

## Security Rules

### Users Collection
- Users can read/write their own user document
- Teachers can read all users in their classes

### Assignments Collection
- Teachers can create/read/update/delete assignments for their classes
- Students can read assignments for their classes

### Submissions Collection
- Students can create/read/update their own submissions
- Teachers can read all submissions for assignments in their classes

### Grades Collection
- Teachers can create/read/update grades for submissions in their classes
- Students can read grades for their own submissions

## Indexes

Required Firestore indexes:

1. **Submissions by Assignment and Student**
   - Collection: `submissions`
   - Fields: `assignmentId` (Ascending), `studentId` (Ascending)

2. **Submissions by Assignment and Status**
   - Collection: `submissions`
   - Fields: `assignmentId` (Ascending), `status` (Ascending)

3. **Grades by Submission**
   - Collection: `grades`
   - Fields: `submissionId` (Ascending)

4. **Assignments by Class**
   - Collection: `assignments`
   - Fields: `classId` (Ascending), `createdAt` (Descending)

## File Storage

### Firebase Storage Structure
```
/acadex/
├── submissions/
│   ├── {assignmentId}/
│   │   ├── {studentId}/
│   │   │   ├── {filename}
│   │   │   └── ...
│   │   └── ...
│   └── ...
└── ...
```

### File Upload Rules
- Only PDF files allowed for submissions
- Maximum file size: 10MB
- Files are automatically organized by assignment and student
- Access controlled by Firestore security rules
