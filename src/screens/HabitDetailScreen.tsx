import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { theme } from '../styles/theme';
import { format, parseISO, eachDayOfInterval, startOfYear, endOfYear, isSameDay, startOfWeek, endOfWeek, addDays, differenceInDays, subDays } from 'date-fns';

export const HabitDetailScreen: React.FC<any> = ({ navigation, route }) => {
  const { habitId, habitName, selectedDate } = route.params;
  const { habits } = useSelector((state: RootState) => state.habits);
  const [selectedView, setSelectedView] = useState<'list' | 'weekly' | 'yearly'>('list');
  
  const habit = habits.find((h: any) => h.id === habitId);
  
  if (!habit) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Habit not found</Text>
          <View style={{ width: 30 }} />
        </View>
      </SafeAreaView>
    );
  }

  const completedDates = habit.completedDates
    .map((date: string) => parseISO(date))
    .sort((a: Date, b: Date) => b.getTime() - a.getTime());

  const isDateCompleted = (date: Date) => {
    return habit.completedDates.includes(format(date, 'yyyy-MM-dd'));
  };

  // Calculate current streak
  const calculateCurrentStreak = () => {
    if (habit.completedDates.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = format(subDays(currentDate, i), 'yyyy-MM-dd');
      const wasCompleted = habit.completedDates.includes(checkDate);
      
      if (i === 0) {
        if (wasCompleted) {
          streak = 1;
        } else {
          const yesterday = format(subDays(currentDate, 1), 'yyyy-MM-dd');
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

  // Calculate maximum streak
  const calculateMaxStreak = () => {
    if (habit.completedDates.length === 0) return 0;
    
    const sortedDates = habit.completedDates
      .map((date: string) => parseISO(date))
      .sort((a, b) => a.getTime() - b.getTime());
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sortedDates.length; i++) {
      const daysDiff = differenceInDays(sortedDates[i], sortedDates[i - 1]);
      
      if (daysDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return sortedDates.length === 0 ? 0 : maxStreak;
  };

  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (habit.completedDates.length === 0) return 0;
    
    const createdDate = parseISO(habit.createdAt);
    const today = new Date();
    const daysSinceCreated = Math.max(1, differenceInDays(today, createdDate) + 1);
    
    return Math.round((habit.completedDates.length / daysSinceCreated) * 100);
  };

  const currentStreak = calculateCurrentStreak();
  const maxStreak = calculateMaxStreak();
  const completionRate = calculateCompletionRate();
  const createdDate = parseISO(habit.createdAt);

  const renderListView = () => (
    <View style={styles.historySection}>
      <Text style={styles.sectionTitle}>Completion History</Text>

      {completedDates.length > 0 ? (
  <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
    {completedDates.map((date: Date, index: number) => (
      <View key={index} style={styles.historyItem}>
        <Text style={styles.historyDate}>
          {format(date, 'EEEE, MMMM d, yyyy')}
        </Text>
        <Text style={styles.historyCheck}>✓</Text>
      </View>
    ))}
  </ScrollView>
) : (
        <View style={styles.emptyHistory}>
          <Text style={styles.emptyHistoryText}>
            No completions yet. Start your journey today! 🚀
          </Text>
        </View>
      )}
    </View>
  );

  const renderWeeklyView = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = startOfWeek(addDays(today, -i * 7));
      const weekEnd = endOfWeek(weekStart);
      const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      weeks.push(
        <View key={i} style={styles.weekRow}>
          <Text style={styles.weekLabel}>
            {format(weekStart, 'MMM d')}
          </Text>
          <View style={styles.weekDays}>
            {weekDays.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={[
                  styles.daySquare,
                  isDateCompleted(day) && styles.completedDay,
                  day > today && styles.futureDay,
                ]}
              />
            ))}
          </View>
        </View>
      );
    }
    
    return (
      <View style={styles.weeklyView}>
        <Text style={styles.sectionTitle}>Weekly View (Last 12 weeks)</Text>
        <View style={styles.weekLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.daySquare, styles.legendSquare]} />
            <Text style={styles.legendText}>Not completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.daySquare, styles.completedDay, styles.legendSquare]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
        </View>
        <ScrollView style={styles.weeksContainer}>
          {weeks}
        </ScrollView>
      </View>
    );
  };

  const renderYearlyView = () => {
    const currentYear = new Date().getFullYear();
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 11, 31));
    const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd });
    
    const monthsData = [];
    for (let month = 0; month < 12; month++) {
      const monthDays = allDays.filter(day => day.getMonth() === month);
      monthsData.push(monthDays);
    }
    
    return (
      <View style={styles.yearlyView}>
        <Text style={styles.sectionTitle}>Yearly View ({currentYear})</Text>
        <ScrollView style={styles.yearContainer}>
          {monthsData.map((monthDays, monthIndex) => (
            <View key={monthIndex} style={styles.monthContainer}>
              <Text style={styles.monthTitle}>
                {format(new Date(currentYear, monthIndex, 1), 'MMMM')}
              </Text>
              <View style={styles.monthGrid}>
                {monthDays.map((day, dayIndex) => (
                  <View
                    key={dayIndex}
                    style={[
                      styles.yearDaySquare,
                      isDateCompleted(day) && styles.completedDay,
                      day > new Date() && styles.futureDay,
                    ]}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>{habit.emoji}</Text>
          <Text style={styles.headerTitle}>{habit.name}</Text>
        </View>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.content}>
        {/* Enhanced Stats Section */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{habit.completedDates.length}</Text>
            <Text style={styles.statLabel}>Total Completions</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{currentStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{maxStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completionRate}%</Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
        </View>

        {/* Habit Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Created on</Text>
            <Text style={styles.infoValue}>
              {format(createdDate, 'MMMM d, yyyy')}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Frequency</Text>
            <Text style={styles.infoValue}>
              {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedView === 'list' && styles.activeTab]}
            onPress={() => setSelectedView('list')}
          >
            <Text style={[styles.tabText, selectedView === 'list' && styles.activeTabText]}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedView === 'weekly' && styles.activeTab]}
            onPress={() => setSelectedView('weekly')}
          >
            <Text style={[styles.tabText, selectedView === 'weekly' && styles.activeTabText]}>
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedView === 'yearly' && styles.activeTab]}
            onPress={() => setSelectedView('yearly')}
          >
            <Text style={[styles.tabText, selectedView === 'yearly' && styles.activeTabText]}>
              Yearly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on selected view */}
        {selectedView === 'list' && renderListView()}
        {selectedView === 'weekly' && renderWeeklyView()}
        {selectedView === 'yearly' && renderYearlyView()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    fontSize: 24,
    color: theme.colors.primary,
    width: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  statCard: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
    flex: 1,
    minWidth: '47%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: 16,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.borderRadius.small,
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  activeTabText: {
    color: theme.colors.surface,
  },
  historySection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  statsSummary: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: theme.colors.secondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  boldStat: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.medium,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  historyCheck: {
    fontSize: 18,
    color: theme.colors.accent,
  },
  emptyHistory: {
    backgroundColor: theme.colors.surface,
    padding: 32,
    borderRadius: theme.borderRadius.large,
    alignItems: 'center',
  },
  emptyHistoryText: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  weeklyView: {
    flex: 1,
  },
  weekLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.borderRadius.medium,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSquare: {
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  weeksContainer: {
    flex: 1,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: theme.borderRadius.medium,
  },
  weekLabel: {
    fontSize: 12,
    color: theme.colors.secondary,
    width: 50,
  },
  weekDays: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
  },
  daySquare: {
    width: 12,
    height: 12,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
  },
  completedDay: {
    backgroundColor: theme.colors.accent,
  },
  futureDay: {
    opacity: 0.3,
  },
  yearlyView: {
    flex: 1,
  },
  yearContainer: {
    flex: 1,
  },
  monthContainer: {
    marginBottom: 20,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.borderRadius.medium,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  yearDaySquare: {
    width: 8,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 1,
  },
});