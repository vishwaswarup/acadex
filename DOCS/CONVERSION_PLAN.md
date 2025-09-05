# Acadex Conversion Plan

## Overview
Converting Fitstreak Forge to Acadex - an assignment management system with tagline "Grade smarter."

## Phase A: Global Rebrand (Fitstreak → Acadex)

### Files to Update:

#### 1. Package Configuration
- `package.json` - Change name from "fitstreak-forge" to "acadex"
- `package-lock.json` - Will auto-update

#### 2. App Metadata & Branding
- `app/layout.tsx` - Update title and description
- `app/page.tsx` - Update homepage branding
- `README.md` - Complete rewrite for Acadex

#### 3. UI Text Replacements
- `app/dashboard/page.tsx` - "Dashboard" → "Student Dashboard" / "Teacher Dashboard"
- `components/dashboard/SplitSummary.tsx` - "Current Split" → "Current Assignment"
- `components/dashboard/StreakCard.tsx` - "Streak" → "Assignment Progress"
- `components/dashboard/QuickLog.tsx` - "Log Today's Workout" → "Submit Assignment"
- `components/common/Navigation.tsx` - Update navigation labels

#### 4. Type Definitions
- `lib/types/index.ts` - Rename fitness types to education types
- `src/lib/types/index.ts` - Same as above

## Phase B: Domain Model Implementation

### New Data Models (Firestore Collections)

#### 1. Create `models/README.md`
Document the following collections:
- `users` - { id, name, email, role: 'student'|'teacher', classIds[] }
- `assignments` - { id, title, classId, description, dueDate, questions: [{id, text, maxMarks}] }
- `submissions` - { id, assignmentId, studentId, files: [{url, name, size}], submittedAt, status }
- `grades` - { id, submissionId, teacherId, marks: [{questionId, mark}], total, feedback, gradedAt }

#### 2. Update Type Definitions
- `lib/types/index.ts` - Replace fitness types with education types
- Add new interfaces for Assignment, Submission, Grade, Question

#### 3. API Endpoints
Create new API routes:
- `pages/api/assignments.ts` - GET/POST assignments
- `pages/api/submissions.ts` - GET/POST submissions  
- `pages/api/upload.ts` - Handle PDF uploads
- `pages/api/grades.ts` - POST grades (teacher-only)

## Phase C: UI Pages & Components

### New Pages Structure

#### 1. Student Pages
- `app/dashboard/student/page.tsx` - Student dashboard
- `app/assignments/[id]/page.tsx` - Assignment detail view
- `app/submissions/page.tsx` - Submission history

#### 2. Teacher Pages  
- `app/dashboard/teacher/page.tsx` - Teacher dashboard
- `app/assignments/[id]/submissions/page.tsx` - Grade submissions
- `app/assignments/create/page.tsx` - Create assignment

#### 3. New Components
- `components/assignment/AssignmentCard.tsx` - Assignment display
- `components/assignment/SubmissionUploader.tsx` - File upload
- `components/assignment/GradingModal.tsx` - Grade submissions
- `components/assignment/AssignmentForm.tsx` - Create/edit assignments

### Component Mappings

#### Existing → New
- `SplitSummary.tsx` → `AssignmentSummary.tsx`
- `StreakCard.tsx` → `ProgressCard.tsx` 
- `QuickLog.tsx` → `QuickSubmit.tsx`
- `WorkoutCalendar.tsx` → `AssignmentCalendar.tsx`

## Implementation Order

### Phase A: Rebrand (Immediate)
1. Update package.json name
2. Update app/layout.tsx metadata
3. Update app/page.tsx homepage
4. Update README.md
5. Commit: "feat: rebrand to Acadex"

### Phase B: Models (Core)
1. Create models/README.md
2. Update lib/types/index.ts with new interfaces
3. Create API endpoints
4. Commit: "feat: implement assignment domain models"

### Phase C: UI (Features)
1. Create new page structure
2. Build assignment components
3. Implement student/teacher flows
4. Commit: "feat: implement assignment management UI"

## File Changes Summary

### Files to Create:
- `DOCS/CONVERSION_PLAN.md` ✓
- `models/README.md`
- `pages/api/assignments.ts`
- `pages/api/submissions.ts` 
- `pages/api/upload.ts`
- `pages/api/grades.ts`
- `app/dashboard/student/page.tsx`
- `app/dashboard/teacher/page.tsx`
- `app/assignments/[id]/page.tsx`
- `app/assignments/[id]/submissions/page.tsx`
- `app/assignments/create/page.tsx`
- `components/assignment/AssignmentCard.tsx`
- `components/assignment/SubmissionUploader.tsx`
- `components/assignment/GradingModal.tsx`
- `components/assignment/AssignmentForm.tsx`

### Files to Modify:
- `package.json`
- `app/layout.tsx`
- `app/page.tsx`
- `README.md`
- `lib/types/index.ts`
- `src/lib/types/index.ts`
- `app/dashboard/page.tsx`
- `components/dashboard/SplitSummary.tsx`
- `components/dashboard/StreakCard.tsx`
- `components/dashboard/QuickLog.tsx`
- `components/dashboard/WorkoutCalendar.tsx`
- `components/common/Navigation.tsx`

### Files to Rename:
- `app/split-builder/` → `app/assignments/create/`
- `components/dashboard/SplitSummary.tsx` → `components/dashboard/AssignmentSummary.tsx`
- `components/dashboard/StreakCard.tsx` → `components/dashboard/ProgressCard.tsx`
- `components/dashboard/QuickLog.tsx` → `components/dashboard/QuickSubmit.tsx`
- `components/dashboard/WorkoutCalendar.tsx` → `components/dashboard/AssignmentCalendar.tsx`

## Risk Mitigation
- Keep existing fitness functionality as fallback
- Use feature flags for gradual rollout
- Maintain backward compatibility during transition
- Create comprehensive tests for new functionality
