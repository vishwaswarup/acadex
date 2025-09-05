'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { WorkoutSplit } from '../../lib/types';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase/config';
import { useAuth } from '../../hooks/useAuth';

interface QuickLogProps {
  canLog: boolean;
  currentSplit: WorkoutSplit | null;
  onLogWorkout?: () => void;
  loading?: boolean;
}

export default function QuickLog({ canLog, currentSplit, onLogWorkout, loading }: QuickLogProps) {
  const { user } = useAuth();
  const [logging, setLogging] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const getButtonContent = () => {
    if (!currentSplit) {
      return {
        icon: <AlertCircle className="h-5 w-5" />,
        text: "No Split Selected",
        disabled: true,
        variant: "secondary" as const
      };
    }

    if (!canLog) {
      return {
        icon: <CheckCircle className="h-5 w-5" />,
        text: "Already Logged Today",
        disabled: true,
        variant: "secondary" as const
      };
    }

    if (success) {
      return {
        icon: <CheckCircle className="h-5 w-5" />,
        text: "Workout logged ✅",
        disabled: true,
        variant: "default" as const
      };
    }

    return {
      icon: <PlayCircle className="h-5 w-5" />,
      text: "Log Today's Workout",
      disabled: false,
      variant: "default" as const
    };
  };

  const buttonProps = getButtonContent();

  const logWorkout = async () => {
    if (!user || !currentSplit || logging || !canLog) return;
    setLogging(true);
    try {
      const today = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
      const workoutRef = doc(db, 'users', user.uid, 'workouts', today);
      await setDoc(workoutRef, {
        splitId: currentSplit.id,
        splitName: currentSplit.name,
        date: today,
        daysPerWeek: currentSplit.daysPerWeek,
        loggedAt: new Date().toISOString()
      });
      setSuccess(true);
      window.location.href = "/dashboard";
      if (onLogWorkout) onLogWorkout();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error logging workout:', error);
    } finally {
      setLogging(false);
    }
  };

  return (
    <Card className="card-gradient card-hover">
      <CardContent className="pt-6">
        {!currentSplit && (
          <div className="text-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push('/split-builder')}
            >
              Create Your First Split
            </Button>
          </div>
        )}
        {currentSplit && (
          <>
            <div className="text-sm text-muted-foreground">
              <p>
                Current Split: <span className="font-medium text-foreground">{currentSplit.name}</span>
              </p>
              <p>{currentSplit.daysPerWeek} days per week</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={logWorkout}
                disabled={buttonProps.disabled || loading || logging}
                className={`w-full h-12 rounded-xl transition-colors ${canLog ? 'btn-hero' : ''}`}
                variant={buttonProps.variant}
              >
                <span className="flex items-center space-x-2">
                  {buttonProps.icon}
                  <span>{buttonProps.text}</span>
                </span>
              </Button>
            </motion.div>
          </>
        )}
      </CardContent>
    </Card>
  );
}