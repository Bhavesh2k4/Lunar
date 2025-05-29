import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit } from '../types/habit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface HabitState {
  habits: Habit[];
}

const initialState: HabitState = {
  habits: [],
};

const habitSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<Omit<Habit, 'id' | 'createdAt' | 'completedDates'>>) => {
      const newHabit: Habit = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        completedDates: [],
        ...action.payload,
      };
      state.habits.push(newHabit);
    },
    
    deleteHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(habit => habit.id !== action.payload);
    },
    
    editHabit: (state, action: PayloadAction<{ id: string; name?: string; emoji?: string; frequency?: 'daily' | 'weekly' }>) => {
      const habit = state.habits.find(h => h.id === action.payload.id);
      if (habit) {
        if (action.payload.name !== undefined) habit.name = action.payload.name;
        if (action.payload.emoji !== undefined) habit.emoji = action.payload.emoji;
        if (action.payload.frequency !== undefined) habit.frequency = action.payload.frequency;
      }
    },
    
    reorderHabits: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },
    
    toggleHabitCompletion: (state, action: PayloadAction<{ habitId: string; date: string }>) => {
      const habit = state.habits.find(h => h.id === action.payload.habitId);
      if (habit) {
        const dateIndex = habit.completedDates.indexOf(action.payload.date);
        if (dateIndex > -1) {
          habit.completedDates.splice(dateIndex, 1);
        } else {
          habit.completedDates.push(action.payload.date);
        }
      }
    },
    
    setHabits: (state, action: PayloadAction<Habit[]>) => {
      state.habits = action.payload;
    },
  },
});

export const { 
  addHabit, 
  deleteHabit, 
  editHabit,
  reorderHabits,
  toggleHabitCompletion, 
  setHabits 
} = habitSlice.actions;
export default habitSlice.reducer;