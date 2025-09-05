import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';
import { differenceInDays } from 'date-fns';
import { StreakUpdateResult } from '@/lib/types';

/**
 * Updates user streak based on last logged date and current date in user's timezone
 * @param lastLoggedDate ISO date string (yyyy-MM-dd) or null
 * @param userTimezone IANA timezone string (e.g., 'America/New_York')
 * @returns StreakUpdateResult with new streak value and logging status
 */
export function calculateStreakUpdate(
  lastLoggedDate: string | null,
  userTimezone: string = 'UTC'
): StreakUpdateResult {
  // Get today's date in user's timezone as ISO string
  const nowInUserTZ = toZonedTime(new Date(), userTimezone);
  const todayISO = format(nowInUserTZ, 'yyyy-MM-dd');
  
  // If no previous log, start streak at 1
  if (!lastLoggedDate) {
    return {
      newStreak: 1,
      canLog: true,
      message: 'Welcome! Starting your streak!'
    };
  }
  
  // Parse last logged date
  const lastDate = new Date(lastLoggedDate + 'T00:00:00');
  const todayDate = new Date(todayISO + 'T00:00:00');
  
  // Calculate difference in days
  const diffDays = differenceInDays(todayDate, lastDate);
  
  if (diffDays === 0) {
    // Already logged today
    return {
      newStreak: 0, // No change to existing streak
      canLog: false,
      message: 'Already logged today!'
    };
  } else if (diffDays === 1) {
    // Consecutive day - increment streak
    return {
      newStreak: -1, // Increment by 1 (handled in calling code)
      canLog: true,
      message: 'Great! Streak continues!'
    };
  } else {
    // Gap in logging - reset streak
    return {
      newStreak: 1,
      canLog: true,
      message: 'Streak reset. Starting fresh!'
    };
  }
}

/**
 * Get today's date in ISO format for a given timezone
 */
export function getTodayISO(timezone: string = 'UTC'): string {
  const nowInUserTZ = toZonedTime(new Date(), timezone);
  return format(nowInUserTZ, 'yyyy-MM-dd');
}

/**
 * Check if user can log workout for today
 */
export function canLogToday(lastLoggedDate: string | null, timezone: string = 'UTC'): boolean {
  const result = calculateStreakUpdate(lastLoggedDate, timezone);
  return result.canLog;
}