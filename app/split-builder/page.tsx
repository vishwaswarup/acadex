"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Save } from 'lucide-react';
import { Exercise, WorkoutDay, WorkoutSplit } from '@/lib/types';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';

function SplitBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [splitName, setSplitName] = useState('My Split');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(0);
  const [days, setDays] = useState<WorkoutDay[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editSplitId, setEditSplitId] = useState<string | null>(null);

  // Load existing split data when in edit mode
  useEffect(() => {
    const loadSplitForEdit = async () => {
      const editId = searchParams.get('edit');
      if (!editId || !auth.currentUser) return;

      setIsEditMode(true);
      setEditSplitId(editId);
      setLoading(true);

      try {
        const splitDoc = await getDoc(doc(db, 'users', auth.currentUser.uid, 'splits', editId));
        if (splitDoc.exists()) {
          const splitData = splitDoc.data() as WorkoutSplit;
          setSplitName(splitData.name || 'My Split');
          setDaysPerWeek(splitData.daysPerWeek || 0);
          setDays(splitData.days || []);
        } else {
          console.error('Split not found');
          router.push('/split-builder');
        }
      } catch (error) {
        console.error('Error loading split:', error);
        router.push('/split-builder');
      } finally {
        setLoading(false);
      }
    };

    loadSplitForEdit();
  }, [searchParams, router]);

  const handleSetDays = (num: number) => {
    setDaysPerWeek(num);
    if (num <= 0) {
      setDays([]);
      return;
    }
    const next: WorkoutDay[] = Array.from({ length: num }, (_, i) => ({ day: i + 1, exercises: [] }));
    setDays(next);
  };

  const addExercise = (dayIndex: number) => {
    setDays(prev => {
      const copy = [...prev];
      const newExercise: Exercise = { name: '', sets: 3, reps: 10 };
      copy[dayIndex] = { ...copy[dayIndex], exercises: [...copy[dayIndex].exercises, newExercise] };
      return copy;
    });
  };

  const updateExercise = (dayIndex: number, exIndex: number, field: keyof Exercise, value: string) => {
    setDays(prev => {
      const copy = [...prev];
      const ex = { ...copy[dayIndex].exercises[exIndex], [field]: field === 'name' ? value : Number(value) } as Exercise;
      const exs = [...copy[dayIndex].exercises];
      exs[exIndex] = ex;
      copy[dayIndex] = { ...copy[dayIndex], exercises: exs };
      return copy;
    });
  };

  const saveSplit = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please sign in first.');
      return;
    }
    if (daysPerWeek <= 0 || days.length === 0) {
      alert('Please set number of days and add exercises.');
      return;
    }
    try {
      setSaving(true);
      const payload = {
        uid: user.uid,
        name: splitName || 'My Split',
        daysPerWeek,
        days,
        isTemplate: false,
        updatedAt: serverTimestamp(),
      };

      if (isEditMode && editSplitId) {
        // Update existing split
        await updateDoc(doc(db, 'users', user.uid, 'splits', editSplitId), payload);
      } else {
        // Create new split
        await addDoc(collection(db, 'users', user.uid, 'splits'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
      alert(`Failed to ${isEditMode ? 'update' : 'save'} split`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen">
          <Header title="Split Builder" />
          <div className="container mx-auto p-6">
            <div className="text-center">
              <p>Loading split data...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
    <div className="min-h-screen">
      <Header title={isEditMode ? "Edit Split" : "Split Builder"} />
      <div className="container mx-auto p-6 space-y-6">
        <Card className="rounded-xl card-hover">
          <CardHeader>
            <CardTitle>Step 1: Number of workout days</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="splitName">Split Name</Label>
                <Input id="splitName" value={splitName} onChange={(e) => setSplitName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="days">Days per week</Label>
                <Input id="days" type="number" min={1} max={7} value={daysPerWeek || ''} onChange={(e) => handleSetDays(Number(e.target.value))} />
              </div>
            </div>
          </CardContent>
        </Card>

        {daysPerWeek > 0 && (
          <Card className="rounded-xl card-hover">
            <CardHeader>
              <CardTitle>Step 2-3: Configure days and exercises</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {days.map((day, di) => (
                <div key={day.day} className="space-y-3 p-4 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Day {day.day}</h3>
                    <Button size="sm" variant="outline" className="rounded-xl" onClick={() => addExercise(di)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Exercise
                    </Button>
                  </div>

                  {day.exercises.length === 0 && (
                    <p className="text-sm text-muted-foreground">No exercises yet. Click "Add Exercise".</p>
                  )}

                  {day.exercises.map((ex, ei) => (
                    <div key={ei} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Exercise</Label>
                        <Input value={ex.name} onChange={(e) => updateExercise(di, ei, 'name', e.target.value)} placeholder="e.g. Bench Press" />
                      </div>
                      <div className="space-y-2">
                        <Label>Sets</Label>
                        <Input type="number" min={1} value={ex.sets} onChange={(e) => updateExercise(di, ei, 'sets', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Reps</Label>
                        <Input type="number" min={1} value={ex.reps} onChange={(e) => updateExercise(di, ei, 'reps', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end">
          <Button className="h-12 rounded-xl btn-hero" onClick={saveSplit} disabled={saving || daysPerWeek <= 0}>
            <Save className="h-4 w-4 mr-2" /> 
            {saving ? 'Saving...' : (isEditMode ? 'Update Split' : 'Save & Go to Dashboard')}
          </Button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

export default function SplitBuilderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SplitBuilderContent />
    </Suspense>
  );
}