'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { WorkoutSplit } from '../../lib/types';
import { useRouter } from 'next/navigation';

interface QuickLogProps {
  canLog: boolean;
  currentSplit: WorkoutSplit | null;
  onLogWorkout: () => void;
  loading?: boolean;
}

export default function QuickLog({ canLog, currentSplit, onLogWorkout, loading }: QuickLogProps) {
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

    return {
      icon: <PlayCircle className="h-5 w-5" />,
      text: "Log Today's Workout",
      disabled: false,
      variant: "default" as const
    };
  };

  const buttonProps = getButtonContent();

  return (
    <Card className="card-gradient card-hover">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentSplit && (
          <div className="text-sm text-muted-foreground">
            <p>Current Split: <span className="font-medium text-foreground">{currentSplit.name}</span></p>
            <p>{currentSplit.daysPerWeek} days per week</p>
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onLogWorkout}
            disabled={buttonProps.disabled || loading}
            className={`w-full h-12 ${canLog ? 'btn-hero' : ''}`}
            variant={buttonProps.variant}
          >
            <span className="flex items-center space-x-2">
              {buttonProps.icon}
              <span>{buttonProps.text}</span>
            </span>
          </Button>
        </motion.div>

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
      </CardContent>
    </Card>
  );
}