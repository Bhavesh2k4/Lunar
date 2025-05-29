// HabitSharingUtils.ts - Utility functions for habit sharing
import {
  Alert,
  Share,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { format } from 'date-fns';

export interface HabitSharingOptions {
  habit: any;
  currentStreak: number;
  completionRate?: number;
}

// Calculate completion rate if not provided
const calculateCompletionRate = (habit: any) => {
  if (habit.completedDates.length === 0) return 0;
  
  // Calculate based on days since habit creation
  const createdDate = new Date(habit.createdAt || Date.now());
  const today = new Date();
  const daysSinceCreation = Math.ceil((today.getTime() - createdDate.getTime()) / (1000 * 3600 * 24));
  
  return Math.round((habit.completedDates.length / Math.max(daysSinceCreation, 1)) * 100);
};

// Generate shareable habit summary
const generateHabitSummary = (habit: any, currentStreak: number, completionRate?: number) => {
  const emoji = habit.icon || '🌟';
  const name = habit.name || 'My Habit';
  const streak = currentStreak || 0;
  const rate = completionRate || calculateCompletionRate(habit);
  
  return {
    title: `${emoji} ${name}`,
    summary: `🔥 Current Streak: ${streak} days
📊 Success Rate: ${rate}%
📅 Total Completions: ${habit.completedDates.length}
⭐ Tracked with Lunar Habit Tracker`,
    data: {
      name: habit.name,
      icon: habit.icon,
      streak: streak,
      completionRate: rate,
      totalCompletions: habit.completedDates.length,
      createdAt: habit.createdAt,
      frequency: habit.frequency,
      completedDates: habit.completedDates,
    }
  };
};

// Share as text message
export const shareHabitProgress = async ({ habit, currentStreak, completionRate }: HabitSharingOptions) => {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const { title, summary } = generateHabitSummary(habit, currentStreak, completionRate);
    
    const result = await Share.share({
      title: title,
      message: `${title}\n\n${summary}`,
    });

    if (result.action === Share.sharedAction) {
      return { success: true, message: 'Habit progress shared successfully!' };
    }
    return { success: false, message: 'Share cancelled' };
  } catch (error) {
    console.error('Share error:', error);
    return { success: false, message: 'Could not share habit. Please try again.' };
  }
};

// Share as JSON file (for importing)
export const shareHabitData = async ({ habit, currentStreak, completionRate }: HabitSharingOptions) => {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const { data } = generateHabitSummary(habit, currentStreak, completionRate);
    
    // Create exportable habit data
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      exportType: 'single_habit',
      habit: data,
      appName: 'Lunar Habit Tracker'
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = `lunar-habit-${habit.name.replace(/[^a-zA-Z0-9]/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    
    // Write to file system
    const fileUri = FileSystem.documentDirectory + fileName;
    await FileSystem.writeAsStringAsync(fileUri, jsonString);

    // Share the file
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'Share Habit Data',
      });
      
      return { 
        success: true, 
        message: 'Habit data exported! Others can import this into their Lunar app.' 
      };
    }
    
    return { success: false, message: 'Sharing not available on this device' };
  } catch (error) {
    console.error('File share error:', error);
    return { success: false, message: 'Could not export habit data. Please try again.' };
  }
};

// Generate motivational share message
export const shareMotivationalPost = async ({ habit, currentStreak }: HabitSharingOptions) => {
  try {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const emoji = habit.icon || '🌟';
    const name = habit.name;
    const streak = currentStreak;
    
    let message = '';
    
    if (streak === 0) {
      message = `Starting my ${emoji} ${name} journey today! 🚀\n\nSmall steps lead to big changes. Here's to building better habits with Lunar! 🌙✨`;
    } else if (streak < 7) {
      message = `${emoji} ${name} - Day ${streak}! 💪\n\nBuilding momentum one day at a time. Every small step counts! 🌟\n\n#HabitTracker #LunarApp`;
    } else if (streak < 30) {
      message = `🔥 ${streak} days strong with ${emoji} ${name}!\n\nConsistency is key, and I'm proving it to myself every day. 💯\n\n#${streak}DayStreak #LunarHabits`;
    } else {
      message = `🏆 MILESTONE ACHIEVED! 🏆\n\n${emoji} ${name} - ${streak} days and counting!\n\nThis is what dedication looks like. Big dreams start with small habits! 🌙🚀\n\n#${streak}Days #HabitMaster #LunarApp`;
    }

    const result = await Share.share({
      title: `${emoji} ${name} - ${streak} Day Streak!`,
      message: message,
    });

    if (result.action === Share.sharedAction) {
      return { success: true, message: 'Motivational post shared!' };
    }
    return { success: false, message: 'Share cancelled' };
  } catch (error) {
    console.error('Motivational share error:', error);
    return { success: false, message: 'Could not share post. Please try again.' };
  }
};

// Main share action handler with menu
export const showHabitSharingMenu = ({ habit, currentStreak, completionRate }: HabitSharingOptions) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  
  Alert.alert(
    `Share ${habit.name}`,
    'How would you like to share this habit?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: '📱 Share Progress',
        onPress: async () => {
          const result = await shareHabitProgress({ habit, currentStreak, completionRate });
          if (result.success) {
            Alert.alert('Shared! 🎉', result.message);
          } else if (result.message !== 'Share cancelled') {
            Alert.alert('Share Failed', result.message);
          }
        },
      },
      {
        text: '🎉 Motivational Post',
        onPress: async () => {
          const result = await shareMotivationalPost({ habit, currentStreak });
          if (result.success) {
            Alert.alert('Shared! 🎉', result.message);
          } else if (result.message !== 'Share cancelled') {
            Alert.alert('Share Failed', result.message);
          }
        },
      },
      {
        text: '📤 Export Data',
        onPress: async () => {
          const result = await shareHabitData({ habit, currentStreak, completionRate });
          if (result.success) {
            Alert.alert('Export Success! 📤', result.message);
          } else {
            Alert.alert('Export Failed', result.message);
          }
        },
      },
    ]
  );
};