"use client";

import Header from '@/components/common/Header'
import Navigation from '@/components/common/Navigation'
import StreakCard from '@/components/dashboard/StreakCard'
import SplitSummary from '@/components/dashboard/SplitSummary'
import WorkoutCalendar from '@/components/dashboard/WorkoutCalendar'
import QuickLog from '@/components/dashboard/QuickLog'
import { Button } from '@/components/ui/button'
import { useEffect, useMemo, useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { getTodayISO } from '@/lib/utils/streak'
import type { WorkoutSplit, WorkoutLog } from '@/lib/types'

export default function DashboardPage() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<number>(user?.streak ?? 0);
  const [lastLogged, setLastLogged] = useState<string | null>(user?.lastLoggedDate ?? null);
  const [split, setSplit] = useState<WorkoutSplit | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStreak(user?.streak ?? 0);
    setLastLogged(user?.lastLoggedDate ?? null);
  }, [user]);

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        // fetch active split
        const splitsRef = collection(db, 'users', user.uid, 'splits');
        let qSplits = query(splitsRef);
        try { qSplits = query(splitsRef, orderBy('createdAt', 'desc')) as any; } catch {}
        const splitSnap = await getDocs(qSplits);
        if (!splitSnap.empty) {
          const d0 = splitSnap.docs[0];
          const s: any = d0.data();
          setSplit({
            id: d0.id,
            uid: user.uid,
            name: s.name || 'My Split',
            daysPerWeek: s.daysPerWeek || 0,
            days: s.days || [],
            isTemplate: s.isTemplate || false,
            createdAt: s.createdAt?.toDate?.().toISOString?.() || new Date().toISOString(),
            updatedAt: s.updatedAt?.toDate?.().toISOString?.() || new Date().toISOString(),
          });
        } else { setSplit(null); }

        // fetch workout logs
        const wRef = collection(db, 'users', user.uid, 'workouts');
        const wSnap = await getDocs(wRef);
        const parsed: WorkoutLog[] = wSnap.docs.map(d => {
          const w: any = d.data();
          return { id: d.id, uid: user.uid, date: w.date, splitId: w.splitId || '', completed: !!w.completed, createdAt: w.createdAt?.toDate?.().toISOString?.() || new Date().toISOString() };
        });
        setLogs(parsed);

        // compute streak from completed logs
        const dates = new Set(parsed.filter(x=>x.completed && x.date).map(x=>x.date as string));
        const today = new Date(getTodayISO());
        let sCount = 0;
        for (let i=0;i<3650;i++) {
          const d = new Date(today); d.setDate(d.getDate()-i);
          const iso = d.toISOString().split('T')[0];
          if (dates.has(iso)) sCount++; else { if (i>0) break; else break; }
        }
        setStreak(sCount);
        setLastLogged(parsed.length ? parsed.sort((a,b)=> (a.date>b.date?-1:1))[0].date : null);
      } catch (e) { console.error(e); }
    };
    run();
  }, [user]);

  const todaysWorkout = useMemo(() => {
    if (!split || !split.days || split.days.length === 0) return null;
    const idx = new Date().getDay() % split.days.length;
    return split.days[idx];
  }, [split]);

  const markWorkoutComplete = async () => {
    if (!user) return;
    try {
      setSaving(true);
      const todayISO = getTodayISO();
      await setDoc(doc(db, 'users', user.uid, 'workouts', todayISO), {
        uid: user.uid,
        date: todayISO,
        splitId: split?.id || '',
        completed: true,
        createdAt: serverTimestamp(),
      }, { merge: true });
      setStreak((s) => (lastLogged === todayISO ? s : s + 1 || 1));
      setLastLogged(todayISO);
      setLogs(prev => {
        const exists = prev.find(x=>x.date===todayISO);
        if (exists) return prev.map(x=> x.date===todayISO ? { ...x, completed: true } : x) as WorkoutLog[];
        return [...prev, { id: todayISO, uid: user.uid, date: todayISO, splitId: split?.id || '', completed: true, createdAt: new Date().toISOString() } as WorkoutLog];
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen pb-20">
      <Header title="Dashboard" />

      <main className="container mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <StreakCard streak={streak} lastLoggedDate={lastLogged} />
            <div className="mt-4">
              <Button className="w-full h-12 rounded-xl btn-hero" disabled={saving} onClick={markWorkoutComplete}>
                {saving ? 'Saving...' : `Mark Workout Complete`}
              </Button>
            </div>
          </div>
          <div className="md:col-span-2">
            <SplitSummary split={split} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WorkoutCalendar logs={logs} />
          </div>
          <div className="lg:col-span-1">
            <QuickLog canLog={false} currentSplit={null} />
          </div>
        </div>

        {todaysWorkout && (
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold mb-2">Today's Workout (Day {todaysWorkout.day})</h3>
            <ul className="space-y-1 text-sm">
              {todaysWorkout.exercises.map((ex, i) => (
                <li key={i} className="flex justify-between">
                  <span>{ex.name || 'Exercise'}</span>
                  <span className="text-muted-foreground">{ex.sets} x {ex.reps}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <Navigation currentPath="/dashboard" />
    </div>
    </ProtectedRoute>
  )
}