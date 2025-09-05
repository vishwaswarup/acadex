'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Calendar } from 'lucide-react';

interface StreakCardProps {
  streak: number;
  lastLoggedDate: string | null;
  loading?: boolean;
}

export default function StreakCard({ streak, lastLoggedDate, loading }: StreakCardProps) {
  const getStreakMessage = () => {
    if (streak === 0) return "Start your fitness journey today!";
    if (streak === 1) return "Great start! Keep it going!";
    if (streak < 7) return "Building momentum!";
    if (streak < 30) return "You're on fire!";
    return "Incredible dedication!";
  };

  const getLastLoggedMessage = () => {
    if (!lastLoggedDate) return "No workouts logged yet";
    const date = new Date(lastLoggedDate);
    return `Last workout: ${date.toLocaleDateString()}`;
  };

  return (
    <Card className="card-gradient card-hover">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gradient">
          Current Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center space-x-3"
        >
          <motion.div
            className={streak > 0 ? "streak-fire" : ""}
            animate={streak > 0 ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className={`h-12 w-12 ${streak > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
          </motion.div>
          <span className="text-5xl font-bold text-primary">{streak}</span>
          <span className="text-xl text-muted-foreground">days</span>
        </motion.div>

        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {getStreakMessage()}
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{getLastLoggedMessage()}</span>
          </div>
        </div>

        {streak >= 7 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="px-4 py-2 bg-success/10 text-success rounded-lg border border-success/20"
          >
            <span className="text-sm font-medium">
              🎉 {streak >= 30 ? 'Legendary' : 'Weekly'} Streak Achievement!
            </span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}