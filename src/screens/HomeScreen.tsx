import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleHabitCompletion, deleteHabit, reorderHabits, setHabits } from '../store/habitSlice';
import { HabitCard } from '../components/HabitCard';
import { ReorderableHabitList } from '../components/ReorderableHabitList';
import { FAB } from '../components/FAB';
import { CalendarView } from '../components/CalendarView';
import { theme } from '../styles/theme';
import { format, isToday, parseISO, differenceInDays, subDays } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { habits } = useSelector((state: RootState) => state.habits);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isReorderMode, setIsReorderMode] = useState(false);
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    saveHabits();
  }, [habits]);

  const loadHabits = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem('habits');
      if (savedHabits) {
        dispatch(setHabits(JSON.parse(savedHabits)));
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits:', error);
    }
  };

  const isHabitCompletedOnDate = (habit: any, date: string) => {
    return habit.completedDates.includes(date);
  };

  const calculateStreak = (habit: any) => {
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

  const handleToggleHabit = (habitId: string) => {
    dispatch(toggleHabitCompletion({ habitId, date: selectedDateString }));
  };

  const handleDeleteHabit = (habitId: string) => {
    dispatch(deleteHabit(habitId));
  };

  const handleCreateHabit = () => {
    navigation.navigate('CreateHabit');
  };

  const handleHabitPress = (habit: any) => {
    navigation.navigate('HabitDetail', { 
      habitId: habit.id,
      habitName: habit.name,
      selectedDate: selectedDateString 
    });
  };

  const handleEditHabit = (habit: any) => {
    navigation.navigate('EditHabit', { habitId: habit.id });
  };

  const enterReorderMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsReorderMode(true);
  };

  const exitReorderMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsReorderMode(false);
  };

  const handleReorder = (reorderedHabits: any[]) => {
    dispatch(reorderHabits(reorderedHabits));
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  // Handle home logo click to go to today
  const handleHomeLogoPress = () => {
    const today = new Date();
    if (!isToday(selectedDate)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedDate(today);
    }
  };

  // Navigate to Settings screen
  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Settings');
  };

  if (habits.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleHomeLogoPress} activeOpacity={0.7}>
            <Text style={styles.title}>Lunar</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSettingsPress} 
            style={styles.settingsButton}
            activeOpacity={0.7}
          >
            <MaterialIcons name="settings" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <CalendarView
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          habits={habits}
        />
        
        <View style={styles.emptyState}>
          <Text style={styles.HomeEmoji}>🌟</Text>
          <Text style={styles.emptyTitle}>
            Your Transformation Starts Here
          </Text>
          <Text style={styles.emptyDescription}>
            Tap to create your first habit and build a better life through small, daily wins
          </Text>
        </View>
        
        <FAB onPress={handleCreateHabit} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleHomeLogoPress} activeOpacity={0.7}>
          <Text style={[
            styles.title,
            !isToday(selectedDate) && styles.titleNotToday
          ]}>
            Lunar
          </Text>
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          {!isReorderMode && (
            <TouchableOpacity 
              onPress={handleSettingsPress} 
              style={styles.settingsButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="settings" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          {isReorderMode && (
            <TouchableOpacity
              style={styles.exitReorderButton}
              onPress={exitReorderMode}
            >
              <MaterialIcons name="check" size={24} color={theme.colors.surface} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {!isReorderMode && (
        <CalendarView
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          habits={habits}
        />
      )}
      
      <Text style={styles.dateTitle}>
        {isReorderMode 
          ? '🔄 Reorder Mode - Drag to rearrange'
          : isToday(selectedDate) 
            ? 'Today - Long press habits for options' 
            : format(selectedDate, 'EEEE - MMM d, yyyy')
        }
      </Text>
      
      {isReorderMode ? (
        <ReorderableHabitList
          habits={habits}
          onReorder={handleReorder}
          onEdit={handleEditHabit}
        />
      ) : (
        <ScrollView 
          style={styles.habitsList} 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        >
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              isCompleted={isHabitCompletedOnDate(habit, selectedDateString)}
              currentStreak={calculateStreak(habit)}
              selectedDate={selectedDate}
              onToggleComplete={() => handleToggleHabit(habit.id)}
              onDelete={() => handleDeleteHabit(habit.id)}
              onPress={() => handleHabitPress(habit)}
              onEdit={() => handleEditHabit(habit)}
              onReorder={enterReorderMode}
              onDateChange={handleDateChange}
              canComplete={isToday(selectedDate) || selectedDate < new Date()}
            />
          ))}
          
          <View style={styles.pastDateInfo}>
            {isToday(selectedDate) ? (
              <>
                <Text style={styles.pastDateText}>
                  🌟 Make today count
                </Text>
                <Text style={styles.pastDateText}></Text>
                <Text style={styles.pastDateText}>
                  You've got this 💪 Stay consistent.
                </Text>
              </>
            ) : selectedDate < new Date() ? (
              <>
                <Text style={styles.pastDateText}>
                  🚀 Small steps towards a better tomorrow :]
                </Text>
                <Text style={styles.pastDateText}></Text>
                <Text style={styles.pastDateText}>
                  👈 Swipe on a habit to traverse in time 👉
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.pastDateText}>
                  🕰️ You're one step closer than yesterday 
                </Text>
                <Text style={styles.pastDateText}></Text>
                <Text style={styles.pastDateText}>
                  Click on a habit to see its history 👆
                </Text>
              </>
            )}
          </View>
        </ScrollView>
      )}
      
      {!isReorderMode && <FAB onPress={handleCreateHabit} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: theme.colors.background,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.primary,
  },
  titleNotToday: {
    color: theme.colors.NotToday,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 20,
  },
  exitReorderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 100,
  },
  HomeEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: theme.typography.heading.fontSize,
    fontWeight: theme.typography.heading.fontWeight,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyDescription: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  habitsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pastDateInfo: {
    marginTop: theme.spacing.lg,
    marginBottom: 80,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
  },
  pastDateText: {
    fontSize: 14,
    color: theme.colors.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});