# Acadex - Grade smarter.

A modern assignment management system built with Next.js, TypeScript, and Firebase. Streamline grading workflows for teachers and simplify assignment submission for students.

## Features

- 📚 **Assignment Management**: Create, distribute, and track assignments with detailed questions
- 📤 **File Submissions**: Students can upload PDF submissions with progress tracking
- ✅ **Smart Grading**: Question-wise grading with automatic total calculation
- 📊 **Analytics Dashboard**: Track assignment progress and class performance
- 👥 **Role-Based Access**: Separate interfaces for students and teachers
- 🔐 **Secure Authentication**: Firebase Auth with role-based permissions
- ☁️ **Cloud Storage**: Real-time data sync with Firestore
- 📱 **Mobile-First**: Responsive design optimized for all devices
- ✨ **Modern UI**: Beautiful interface with smooth animations

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase Auth, Firestore, Firebase Storage
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns, date-fns-tz
- **Testing**: Playwright, Vitest
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Auth, Firestore, and Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd acadex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password provider)
   - Enable Firestore Database
   - Enable Firebase Storage
   - Copy your Firebase configuration

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Deploy Firestore rules and indexes**
   ```bash
   # Install Firebase CLI if you haven't
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize Firebase in your project
   firebase init firestore
   
   # Deploy rules and indexes
   firebase deploy --only firestore:rules,firestore:indexes
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Project Structure

```
app/
├── dashboard/
│   ├── student/          # Student dashboard
│   └── teacher/          # Teacher dashboard
├── assignments/
│   ├── [id]/            # Assignment detail view
│   ├── [id]/submissions/ # Grade submissions
│   └── create/          # Create assignment
├── submissions/          # Submission history
└── api/                 # API endpoints
    ├── assignments.ts
    ├── submissions.ts
    ├── upload.ts
    └── grades.ts

components/
├── assignment/           # Assignment-related components
├── auth/                # Authentication components
├── dashboard/           # Dashboard widgets
├── common/              # Shared components
└── ui/                  # shadcn/ui components

lib/
├── firebase/            # Firebase configuration
├── types/               # TypeScript definitions
└── utils/               # Utility functions

models/
└── README.md            # Data model documentation
```

## User Roles

### Student Features
- View assigned assignments with due dates
- Upload PDF submissions with progress tracking
- View submission history and grades
- Track assignment progress

### Teacher Features
- Create assignments with custom questions
- View all submissions for grading
- Grade submissions question-wise
- View class analytics and performance metrics

## Data Models

### Users
```typescript
{
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  classIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Assignments
```typescript
{
  id: string;
  title: string;
  classId: string;
  description: string;
  dueDate: string;
  questions: Array<{
    id: string;
    text: string;
    maxMarks: number;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

### Submissions
```typescript
{
  id: string;
  assignmentId: string;
  studentId: string;
  files: Array<{
    url: string;
    name: string;
    size: number;
  }>;
  submittedAt: string;
  status: 'draft' | 'submitted' | 'graded';
  createdAt: string;
}
```

### Grades
```typescript
{
  id: string;
  submissionId: string;
  teacherId: string;
  marks: Array<{
    questionId: string;
    mark: number;
  }>;
  total: number;
  feedback: string;
  gradedAt: string;
  createdAt: string;
}
```

## API Endpoints

### Assignments
- `GET /api/assignments` - List assignments
- `POST /api/assignments` - Create assignment (teacher only)

### Submissions
- `GET /api/submissions` - List submissions
- `POST /api/submissions` - Create submission (student only)

### File Upload
- `POST /api/upload` - Upload PDF file to storage

### Grading
- `POST /api/grades` - Submit grades (teacher only)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Run ESLint

## Security

- Firestore security rules ensure users can only access their own data
- Role-based API endpoints with proper authorization
- File upload restrictions (PDF only)
- Client-side route protection with authentication guards

## Testing

### Unit Tests
```bash
npm run test
```

### End-to-End Tests
```bash
npm run test:e2e
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed description
3. Include steps to reproduce any bugs

---

Built with ❤️ for educators and students