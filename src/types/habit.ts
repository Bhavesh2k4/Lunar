export interface Habit {
  id: string;
  name: string;
  emoji: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  completedDates: string[]; // Array of date strings like "2025-05-29"
}

export interface HabitStats {
  currentStreak: number;
  totalCompletions: number;
}