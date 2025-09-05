'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Calendar, Dumbbell, Target } from 'lucide-react';
import { WorkoutSplit } from '../../lib/types';
import { useRouter } from 'next/navigation';

interface SplitSummaryProps {
  split: WorkoutSplit | null;
  onEditClick?: () => void;
  loading?: boolean;
}

export default function SplitSummary({ split, onEditClick, loading }: SplitSummaryProps) {
  const router = useRouter();

  if (!split) {
    return (
      <Card className="card-gradient">
        <CardContent className="pt-6 text-center">
          <div className="space-y-4">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h3 className="text-lg font-semibold mb-2">No Split Selected</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first workout split to get started
              </p>
              <Button
                onClick={() => router.push('/split-builder')}
                className="btn-hero"
              >
                Create Split
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalExercises = split.days.reduce((total, day) => total + day.exercises.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="card-gradient card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-lg font-semibold">Current Split</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditClick}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-primary mb-2">{split.name}</h3>
            <p className="text-sm text-muted-foreground">
              Created on {new Date(split.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{split.daysPerWeek} Days</p>
                <p className="text-xs text-muted-foreground">per week</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">{totalExercises} Exercises</p>
                <p className="text-xs text-muted-foreground">total</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Workout Days:</p>
            <div className="flex flex-wrap gap-2">
              {split.days.map((day) => (
                <div
                  key={day.day}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20"
                >
                  Day {day.day} ({day.exercises.length} exercises)
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}