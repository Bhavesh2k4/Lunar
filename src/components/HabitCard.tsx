import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Habit } from '../types/habit';
import { theme } from '../styles/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { addDays, subDays, format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { DeleteModal } from './DeleteModal';
import { ActionMenu } from './ActionMenu';
import { showHabitSharingMenu } from '../utils/HabitSharingUtils';
interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  currentStreak: number;
  selectedDate: Date;
  onToggleComplete: () => void;
  onDelete: () => void;
  onPress: () => void;
  onEdit: () => void;
  onReorder?: () => void;
  onDateChange: (newDate: Date) => void;
  canComplete: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  currentStreak,
  selectedDate,
  onToggleComplete,
  onDelete,
  onPress,
  onEdit,
  onReorder,
  onDateChange,
  canComplete,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const handleCardPress = () => {
    if (canComplete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggleComplete();
    } else {
      onPress();
    }
  };

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowActionMenu(true);
  };

  const handleSwipe = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY, velocityX, velocityY } = event.nativeEvent;
      
      // Enhanced gesture detection
      const swipeThreshold = 60;
      const velocityThreshold = 800;
      
      // Check if horizontal swipe is more significant than vertical
      const isHorizontalSwipe = Math.abs(translationX) > Math.abs(translationY);
      const isSignificantSwipe = Math.abs(translationX) > swipeThreshold || Math.abs(velocityX) > velocityThreshold;
      
      // Only handle horizontal swipes for date navigation
      if (isHorizontalSwipe && isSignificantSwipe) {
        // Prevent vertical scrolling interference
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        if (translationX > 0 || velocityX > 0) {
          // Swipe right - go to PREVIOUS day
          const previousDay = subDays(selectedDate, 1);
          onDateChange(previousDay);
        } else {
          // Swipe left - go to NEXT day
          const nextDay = addDays(selectedDate, 1);
          onDateChange(nextDay);
        }
      }
      // If vertical swipe or not significant, let ScrollView handle it
    }
  };

  const handleDeletePress = (e: any) => {
    e.stopPropagation();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowDeleteModal(true);
  };

  const handleCheckboxPress = (e: any) => {
    e.stopPropagation();
    if (canComplete) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggleComplete();
    }
  };

  const handleActionMenuEdit = () => {
    setShowActionMenu(false);
    onEdit();
  };

  const handleActionMenuReorder = () => {
    setShowActionMenu(false);
    onReorder && onReorder();
  };

  const handleActionMenuDelete = () => {
    setShowActionMenu(false);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleActionMenuShare = () => {
  setShowActionMenu(false);
  showHabitSharingMenu({
    habit,
    currentStreak,
    // You can add completionRate calculation if you have it
  });
};

// Then update your ActionMenu component call to include the share handler:
<ActionMenu
  visible={showActionMenu}
  habitName={habit.name}
  onCancel={() => setShowActionMenu(false)}
  onEdit={handleActionMenuEdit}
  onShare={handleActionMenuShare}  // Add this line
  onReorder={handleActionMenuReorder}
  onDelete={handleActionMenuDelete}
/>

  return (
    <>
      <PanGestureHandler 
        onHandlerStateChange={handleSwipe}
        activeOffsetX={[-60, 60]}  // Only activate after 60px horizontal movement
        failOffsetY={[-30, 30]}   // Fail if vertical movement exceeds 30px
        shouldCancelWhenOutside={true}
      >
        <View style={styles.cardWrapper}>
          <TouchableOpacity
            style={[
              styles.card,
              isCompleted && styles.completedCard,
              !canComplete && styles.futureCard,
            ]}
            onPress={handleCardPress}
            onLongPress={handleLongPress}
            delayLongPress={600}
            activeOpacity={0.8}
          >
            <View style={styles.content}>
              <View style={styles.leftSection}>
                <Text style={styles.emoji}>{habit.emoji}</Text>
                <View style={styles.textContainer}>
                  <View style={styles.nameContainer}>
                    <Text style={[
                      styles.name,
                      isCompleted && styles.completedText,
                      !canComplete && styles.futureText,
                    ]}>
                      {habit.name}
                    </Text>
                    {isCompleted && <View style={styles.strikethrough} />}
                  </View>
                  <Text style={[
                    styles.frequency,
                    isCompleted && styles.completedText,
                    !canComplete && styles.futureText,
                  ]}>
                    {habit.frequency} 
                  </Text>
                </View>
              </View>
              
              <View style={styles.rightSection}>
                {currentStreak > 0 && (
                  <View style={styles.streak}>
                    <Text style={[
                      styles.streakNumber,
                      isCompleted && { color: theme.colors.surface },
                      !canComplete && { color: theme.colors.inactive },
                    ]}>
                      {currentStreak}
                    </Text>
                    <Text style={styles.streakEmoji}>🔥</Text>
                  </View>
                )}
                
                <TouchableOpacity
                  style={[
                    styles.checkButton,
                    isCompleted && styles.completedButton,
                    !canComplete && styles.futureButton,
                  ]}
                  onPress={handleCheckboxPress}
                  disabled={!canComplete}
                >
                  <Text style={styles.checkmark}>
                    {!canComplete ? '⏳' : isCompleted ? '✓' : '○'}
                  </Text>
                </TouchableOpacity>
                

                {/* Delete Button */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleDeletePress}
                >
                  <MaterialIcons 
                    name="delete-outline" 
                    size={20} 
                    color="#FF6B6B" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </PanGestureHandler>

      <ActionMenu
        visible={showActionMenu}
        habitName={habit.name}
        onCancel={() => setShowActionMenu(false)}
        onEdit={handleActionMenuEdit}
        onReorder={handleActionMenuReorder}
        onDelete={handleActionMenuDelete}
        onShare={handleActionMenuShare}  // Add this line
      />

      <DeleteModal
        visible={showDeleteModal}
        habitName={habit.name}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: theme.colors.primary,
  },
  futureCard: {
    backgroundColor: theme.colors.surface,
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  emoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  nameContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  strikethrough: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: theme.colors.surface,
    opacity: 0.9,
  },
  frequency: {
    fontSize: 12,
    color: theme.colors.secondary,
  },
  completedText: {
    color: theme.colors.surface,
  },
  futureText: {
    color: theme.colors.inactive,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginRight: 4,
  },
  streakEmoji: {
    fontSize: 14,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.inactive,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: theme.colors.accent,
  },
  futureButton: {
    backgroundColor: theme.colors.border,
  },
  checkmark: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
});