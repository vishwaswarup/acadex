# FitTrack - Fitness Tracking App

A beautiful, mobile-first fitness tracking application built with React, TypeScript, Tailwind CSS, and Firebase.

## Features

- 🔥 **Streak Tracking**: Build and maintain workout streaks with visual feedback
- 💪 **Workout Splits**: Create custom workout routines or choose from templates
- 📅 **Calendar View**: Visual workout history with react-day-picker
- 🎯 **Quick Logging**: One-tap workout logging with duplicate prevention
- 📱 **Mobile-First**: Responsive design optimized for mobile devices
- 🔐 **Authentication**: Secure Firebase Auth with email/password
- ☁️ **Cloud Storage**: Real-time data sync with Firestore
- ✨ **Beautiful UI**: Modern design with Framer Motion animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Firebase Auth, Firestore
- **Animations**: Framer Motion
- **Calendar**: react-day-picker
- **Icons**: Lucide React
- **Date Handling**: date-fns, date-fns-tz
- **Testing**: Playwright, Vitest
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Auth and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fittrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password provider)
   - Enable Firestore Database
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

The app will be available at `http://localhost:8080`.

## Project Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard widgets
│   ├── common/           # Shared components
│   └── ui/               # shadcn/ui components
├── hooks/
│   ├── useAuth.ts        # Authentication hook
│   └── use-toast.ts      # Toast notifications
├── lib/
│   ├── firebase/         # Firebase configuration
│   ├── types/            # TypeScript definitions
│   ├── constants/        # Workout templates
│   └── utils/            # Utility functions
├── pages/                # Route components
└── test/                 # Test setup
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run lint` - Run ESLint

## Features in Detail

### Workout Split Templates

FitTrack includes three pre-built workout templates:

1. **3-Day Full Body** - Perfect for beginners
2. **4-Day Upper/Lower** - Balanced intermediate routine
3. **5-Day Push/Pull/Legs** - Advanced bodybuilding split

### Streak Algorithm

The streak system uses timezone-aware date calculations:
- Consecutive daily workouts increase the streak
- Missing a day resets the streak to 1
- Same-day duplicate logging is prevented
- Visual fire emoji animation for active streaks

### Security

- Firestore security rules ensure users can only access their own data
- Client-side route protection with authentication guards
- Atomic transactions for streak updates to prevent data corruption

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

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables

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

Built with ❤️ for the fitness community