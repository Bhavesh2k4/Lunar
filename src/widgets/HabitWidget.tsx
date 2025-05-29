// HabitWidget.js - Widget implementation
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, isToday } from 'date-fns';

// Widget Component for React Native
interface Habit {
  id: string;
  name: string;
  icon?: string;
  completedDates: string[];
}

interface HabitWidgetProps {
  habits: Habit[];
  onHabitToggle?: (habitId: string) => void;
}

export const HabitWidget: React.FC<HabitWidgetProps> = ({ habits, onHabitToggle }) => {
  const today = format(new Date(), 'yyyy-MM-dd');

  const isHabitCompleted = (habit: Habit) => {
    return habit.completedDates.includes(today);
  };

  const calculateStreak = (habit: Habit) => {
    if (habit.completedDates.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = format(new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      const wasCompleted = habit.completedDates.includes(checkDate);
      
      if (i === 0) {
        if (wasCompleted) {
          streak = 1;
        } else {
          const yesterday = format(new Date(currentDate.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
          if (habit.completedDates.includes(yesterday)) {
            streak = 1;
            i = 1;
          } else {
            break;
          }
        }
      } else {
        if (wasCompleted) {
          streak++;
        } else {
          break;
        }
      }
    }

    return streak;
  };

  return (
    <View style={styles.widget}>
      <View style={styles.header}>
        <Text style={styles.title}>🌙 Lunar</Text>
        <Text style={styles.date}>{format(new Date(), 'MMM d')}</Text>
      </View>
      
      <View style={styles.habitsContainer}>
        {habits.slice(0, 4).map((habit, index) => {
          const isCompleted = isHabitCompleted(habit);
          const streak = calculateStreak(habit);
          
          return (
            <TouchableOpacity
              key={habit.id}
              style={[styles.habitItem, isCompleted && styles.completedHabit]}
              onPress={() => onHabitToggle && onHabitToggle(habit.id)}
              activeOpacity={0.7}
            >
              <View style={styles.habitInfo}>
                <Text style={styles.habitEmoji}>{habit.icon || '🌟'}</Text>
                <View style={styles.habitText}>
                  <Text style={[styles.habitName, isCompleted && styles.completedText]} numberOfLines={1}>
                    {habit.name}
                  </Text>
                  <Text style={styles.streakText}>{streak}🔥</Text>
                </View>
              </View>
              <View style={[styles.checkCircle, isCompleted && styles.completedCircle]}>
                {isCompleted && <Text style={styles.checkMark}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {habits.length === 0 && (
        <Text style={styles.emptyText}>Set up your widget in the Lunar app</Text>
      )}
    </View>
  );
};

// Widget Configuration for iOS (using react-native-widget-extension)
export const widgetConfig = {
  kind: 'LunarHabitWidget',
  displayName: 'Lunar Habits',
  description: 'Track your daily habits at a glance',
  supportedFamilies: ['systemSmall', 'systemMedium'],
};

// Widget Data Provider
export const getWidgetData = async () => {
  try {
    // Get widget configuration
    const widgetConfigData = await AsyncStorage.getItem('widgetConfig');
    const habitsData = await AsyncStorage.getItem('habits');
    
    if (!widgetConfigData || !habitsData) {
      return { habits: [] };
    }

    const config = JSON.parse(widgetConfigData);
    const allHabits = JSON.parse(habitsData);
    
    // Filter habits based on widget configuration
    const selectedHabits = allHabits.filter((habit: Habit) => 
      config.selectedHabits.includes(habit.id)
    );

    return {
      habits: selectedHabits,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Widget data error:', error);
    return { habits: [] };
  }
};

// Widget Intent Handler (for quick actions)
export const handleWidgetIntent = async (intent: any) => {
  try {
    switch (intent.type) {
      case 'TOGGLE_HABIT':
        const { habitId } = intent.data;
        const habitsData = await AsyncStorage.getItem('habits');
        
        if (habitsData) {
          const habits = JSON.parse(habitsData);
          const today = format(new Date(), 'yyyy-MM-dd');
          
          const updatedHabits = habits.map((habit: Habit) => {
            if (habit.id === habitId) {
              const completedDates = [...habit.completedDates];
              const index = completedDates.indexOf(today);
              
              if (index > -1) {
                completedDates.splice(index, 1);
              } else {
                completedDates.push(today);
              }
              
              return { ...habit, completedDates };
            }
            return habit;
          });
          
          await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
          
          // Trigger widget refresh
          return { success: true, message: 'Habit toggled successfully' };
        }
        break;
        
      case 'OPEN_APP':
        // This would open the main app
        return { success: true, action: 'OPEN_MAIN_APP' };
        
      default:
        return { success: false, message: 'Unknown intent' };
    }
  } catch (error) {
    console.error('Widget intent error:', error);
    return { success: false, message: 'Failed to handle intent' };
  }
};

const styles = StyleSheet.create({
  widget: {
    backgroundColor: '#FAF9F6',
    borderRadius: 16,
    padding: 16,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  date: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  habitsContainer: {
    gap: 8,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  completedHabit: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  habitText: {
    flex: 1,
  },
  habitName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  streakText: {
    fontSize: 12,
    color: '#6B7280',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  checkMark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    marginTop: 20,
  },
});

// Export for use in main app
export default HabitWidget;