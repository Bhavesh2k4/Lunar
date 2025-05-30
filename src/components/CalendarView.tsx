import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { theme } from '../styles/theme';
import { 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  format, 
  isSameDay,
  isToday,
  isFuture,
  addWeeks,
  subWeeks
} from 'date-fns';
import * as Haptics from 'expo-haptics';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  habits: any[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  onDateSelect,
  habits,
}) => {
  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getCompletionCount = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return habits.filter(habit => 
      habit.completedDates.includes(dateString)
    ).length;
  };

  const getTotalHabits = () => {
    return habits.length;
  };

  const getCompletionRatio = (date: Date) => {
    const completed = getCompletionCount(date);
    const total = getTotalHabits();
    return total > 0 ? completed / total : 0;
  };

  const handleSwipe = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      const swipeThreshold = 50;
      const velocityThreshold = 500;
      
      if (Math.abs(translationX) > swipeThreshold || Math.abs(velocityX) > velocityThreshold) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        if (translationX > 0 || velocityX > 0) {
          // Swipe right - go to PREVIOUS week
          const previousWeek = subWeeks(selectedDate, 1);
          onDateSelect(previousWeek);
        } else {
          // Swipe left - go to NEXT week
          const nextWeek = addWeeks(selectedDate, 1);
          onDateSelect(nextWeek);
        }
      }
    }
  };

  return (
    <PanGestureHandler onHandlerStateChange={handleSwipe}>
      <View style={styles.container}>
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>
            {format(selectedDate, 'MMMM yyyy')}
          </Text>
          <Text style={styles.swipeHint}>
            👈 Swipe calendar for weeks 👉
          </Text>
        </View>
        
        <View style={styles.daysRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text
              key={index}
              style={[styles.dayLabel, { color: theme.colors.secondary }]}
            >
              {day}
            </Text>
          ))}
        </View>
        
        <View style={styles.datesRow}>
          {weekDays.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isCurrentDay = isToday(date);
            const isFutureDate = isFuture(date);
            const completionRatio = getCompletionRatio(date);
            const completedCount = getCompletionCount(date);
            
            return (
              <TouchableOpacity
                key={date.toISOString()}
                style={[
                  styles.dateButton,
                  isSelected && styles.selectedDate,
                  isFutureDate && styles.futureDate,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onDateSelect(date);
                }}
              >
                <Text
                  style={[
                    styles.dateText,
                    {
                      color: isSelected 
                        ? theme.colors.surface
                        : isCurrentDay 
                          ? theme.colors.primary 
                          : isFutureDate
                            ? theme.colors.inactive
                            : theme.colors.secondary
                    },
                    isSelected && styles.selectedDateText,
                  ]}
                >
                  {format(date, 'd')}
                </Text>
                
                {!isFutureDate && completedCount > 0 && (
                  <View style={[
                    styles.completionDot,
                    {
                      backgroundColor: completionRatio === 1 
                        ? theme.colors.accent 
                        : theme.colors.primary,
                      opacity: completionRatio === 1 ? 1 : 0.6,
                    }
                  ]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  monthHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  swipeHint: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontStyle: 'italic',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.sm,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    width: 36,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedDate: {
    backgroundColor: theme.colors.primary,
  },
  futureDate: {
    opacity: 0.5,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  selectedDateText: {
    fontWeight: '700',
  },
  completionDot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});