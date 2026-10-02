import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// The streak lives on this phone only. No account, no sign in.
const STREAK_KEY = 'guestStreakCount';
const DATE_KEY = 'guestLastActivityDate';

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayString() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// Given the old count and the last day a quiz was done, work out today's new count.
function advanceStreak(count, lastDate) {
  const today = todayString();
  if (lastDate === today) return { count, date: today, alreadyCountedToday: true };
  const newCount = lastDate === yesterdayString() ? count + 1 : 1;
  return { count: newCount, date: today, alreadyCountedToday: false };
}

// Tracks the streak number shown on screen.
export function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(STREAK_KEY)
      .then((stored) => setStreak(stored ? parseInt(stored, 10) : 0))
      .catch(() => {});
  }, []);

  // Call this the moment a quiz is finished.
  const completeQuiz = useCallback(async () => {
    const storedCount = await AsyncStorage.getItem(STREAK_KEY);
    const storedDate = await AsyncStorage.getItem(DATE_KEY);
    const { count, date, alreadyCountedToday } = advanceStreak(
      storedCount ? parseInt(storedCount, 10) : 0,
      storedDate
    );
    if (!alreadyCountedToday) {
      await AsyncStorage.setItem(STREAK_KEY, String(count));
      await AsyncStorage.setItem(DATE_KEY, date);
    }
    setStreak(count);
  }, []);

  return { streak, completeQuiz };
}
