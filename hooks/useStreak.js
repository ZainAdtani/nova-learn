import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const GUEST_STREAK_KEY = 'guestStreakCount';
const GUEST_DATE_KEY = 'guestLastActivityDate';
const GUEST_FIRST_QUIZ_KEY = 'guestHasCompletedFirstQuiz';

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

// Tracks the streak number shown on screen, and knows whether it lives on
// this phone only (guest) or in Supabase (signed in).
export function useStreak() {
  const { session, isLoading: authLoading } = useAuth();
  const [streak, setStreak] = useState(0);

  const loadGuestStreak = useCallback(async () => {
    const stored = await AsyncStorage.getItem(GUEST_STREAK_KEY);
    setStreak(stored ? parseInt(stored, 10) : 0);
  }, []);

  const loadUserStreak = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('streak_count')
      .eq('id', userId)
      .single();
    setStreak(data?.streak_count ?? 0);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (session) {
      loadUserStreak(session.user.id);
    } else {
      loadGuestStreak();
    }
  }, [authLoading, session, loadUserStreak, loadGuestStreak]);

  // Call this the moment a quiz is finished. Returns true only when this is
  // a guest's very first ever completed quiz, so the app knows to ask them
  // to save their streak.
  const completeQuiz = useCallback(async () => {
    if (session) {
      const { data } = await supabase
        .from('profiles')
        .select('streak_count, last_activity_date')
        .eq('id', session.user.id)
        .single();
      const { count, date, alreadyCountedToday } = advanceStreak(
        data?.streak_count ?? 0,
        data?.last_activity_date
      );
      if (!alreadyCountedToday) {
        await supabase
          .from('profiles')
          .update({ streak_count: count, last_activity_date: date })
          .eq('id', session.user.id);
      }
      setStreak(count);
      return false;
    }

    const storedCount = await AsyncStorage.getItem(GUEST_STREAK_KEY);
    const storedDate = await AsyncStorage.getItem(GUEST_DATE_KEY);
    const { count, date, alreadyCountedToday } = advanceStreak(
      storedCount ? parseInt(storedCount, 10) : 0,
      storedDate
    );
    if (!alreadyCountedToday) {
      await AsyncStorage.setItem(GUEST_STREAK_KEY, String(count));
      await AsyncStorage.setItem(GUEST_DATE_KEY, date);
    }
    setStreak(count);

    const hasCompletedBefore = await AsyncStorage.getItem(GUEST_FIRST_QUIZ_KEY);
    if (!hasCompletedBefore) {
      await AsyncStorage.setItem(GUEST_FIRST_QUIZ_KEY, 'true');
      return true;
    }
    return false;
  }, [session]);

  // Called right after a guest signs in, so the streak they already built
  // up moves with them into their new account instead of resetting to 0.
  const claimGuestStreak = useCallback(async (userId) => {
    const storedCount = await AsyncStorage.getItem(GUEST_STREAK_KEY);
    const storedDate = await AsyncStorage.getItem(GUEST_DATE_KEY);
    const count = storedCount ? parseInt(storedCount, 10) : 0;

    if (count > 0) {
      await supabase
        .from('profiles')
        .update({ streak_count: count, last_activity_date: storedDate })
        .eq('id', userId);
    }
    await AsyncStorage.multiRemove([GUEST_STREAK_KEY, GUEST_DATE_KEY, GUEST_FIRST_QUIZ_KEY]);
    setStreak(count);
  }, []);

  return { streak, completeQuiz, claimGuestStreak };
}
