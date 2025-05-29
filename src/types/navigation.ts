// src/types/navigation.ts (Optional - for better type safety)
export type RootStackParamList = {
  Home: undefined;
  CreateHabit: undefined;
  HabitDetail: {
    habitId: string;
    habitName: string;
    selectedDate: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}