import { WorkoutSplit, WorkoutLog } from '@/lib/types';

type CacheItem<T> = {
  data: T;
  timestamp: number;
  expiresIn: number;
};

class WorkoutCache {
  private static instance: WorkoutCache;
  private splits: Map<string, CacheItem<WorkoutSplit>>;
  private logs: Map<string, CacheItem<WorkoutLog[]>>;
  private readonly DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes

  private constructor() {
    this.splits = new Map();
    this.logs = new Map();
  }

  static getInstance(): WorkoutCache {
    if (!WorkoutCache.instance) {
      WorkoutCache.instance = new WorkoutCache();
    }
    return WorkoutCache.instance;
  }

  cacheSplit(id: string, split: WorkoutSplit, expiresIn = this.DEFAULT_EXPIRY): void {
    this.splits.set(id, {
      data: split,
      timestamp: Date.now(),
      expiresIn
    });
  }

  getSplit(id: string): WorkoutSplit | null {
    const cached = this.splits.get(id);
    if (!cached || Date.now() - cached.timestamp > cached.expiresIn) {
      this.splits.delete(id);
      return null;
    }
    return cached.data;
  }

  cacheLogs(uid: string, logs: WorkoutLog[], expiresIn = this.DEFAULT_EXPIRY): void {
    this.logs.set(uid, {
      data: logs,
      timestamp: Date.now(),
      expiresIn
    });
  }

  getLogs(uid: string): WorkoutLog[] | null {
    const cached = this.logs.get(uid);
    if (!cached || Date.now() - cached.timestamp > cached.expiresIn) {
      this.logs.delete(uid);
      return null;
    }
    return cached.data;
  }

  clearCache(): void {
    this.splits.clear();
    this.logs.clear();
  }
}

export const workoutCache = WorkoutCache.getInstance();
