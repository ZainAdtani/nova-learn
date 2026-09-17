import { LESSONS } from '../constants/lessons';

function dayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function lessonForOffset(offsetDays) {
  const date = new Date(Date.now() + offsetDays * 24 * 60 * 60 * 1000);
  const index = dayOfYear(date) % LESSONS.length;
  return LESSONS[index];
}

export function getTodayLesson() {
  return lessonForOffset(0);
}

export function getTomorrowLesson() {
  return lessonForOffset(1);
}
