import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { editHabit } from '../store/habitSlice';
import { RootState } from '../store';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';
import * as Haptics from 'expo-haptics';

// Remove the custom interface and use React Navigation's built-in types
export const EditHabitScreen: React.FC<any> = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { habitId } = route.params;
  const { habits } = useSelector((state: RootState) => state.habits);
  
  const habit = habits.find((h: any) => h.id === habitId);
  
  const [habitName, setHabitName] = useState(habit?.name || '');
  const [selectedEmoji, setSelectedEmoji] = useState(habit?.emoji || '⭐');
  const [customEmoji, setCustomEmoji] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>(habit?.frequency || 'daily');

  useEffect(() => {
    if (habit) {
      setHabitName(habit.name);
      setSelectedEmoji(habit.emoji);
      setFrequency(habit.frequency);
    }
  }, [habit]);

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

  const handleSaveChanges = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    const finalEmoji = customEmoji.trim() || selectedEmoji;

    dispatch(editHabit({
      id: habitId,
      name: habitName.trim(),
      emoji: finalEmoji,
      frequency,
    }));

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleEmojiChange = (text: string) => {
    if (text.length <= 2) {
      setCustomEmoji(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Habit</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Name</Text>
        <TextInput
          style={styles.nameInput}
          value={habitName}
          onChangeText={setHabitName}
          placeholder="Enter habit name"
          placeholderTextColor={theme.colors.inactive}
        />

        <Text style={styles.sectionTitle}>Emoji</Text>
        <Text style={styles.emojiDescription}>
          Type any emoji or character to represent your habit
        </Text>
        
        <View style={styles.emojiSection}>
          <TextInput
            style={styles.emojiInput}
            value={customEmoji}
            onChangeText={handleEmojiChange}
            placeholder="Type emoji here..."
            placeholderTextColor={theme.colors.inactive}
            textAlign="center"
            maxLength={2}
          />
          <View style={styles.emojiPreview}>
            <Text style={styles.emojiPreviewText}>
              {customEmoji || selectedEmoji}
            </Text>
          </View>
        </View>

        <Text style={styles.fallbackText}>
          Or choose from common emojis:
        </Text>
        
        <View style={styles.commonEmojisContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.commonEmojis}>
              {['⭐', '🎯', '💪', '🏃', '🍎', '💧', '📖', '🧘', '✍️', '🎨', '🎵', '🌱', '🔥', '💎', '🚀'].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.commonEmojiOption,
                    selectedEmoji === emoji && !customEmoji && styles.selectedCommonEmoji,
                  ]}
                  onPress={() => {
                    setSelectedEmoji(emoji);
                    setCustomEmoji('');
                  }}
                >
                  <Text style={styles.commonEmojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Frequency</Text>
        <View style={styles.frequencyButtons}>
          <TouchableOpacity
            style={[
              styles.frequencyButton,
              frequency === 'daily' && styles.activeFrequencyButton,
            ]}
            onPress={() => setFrequency('daily')}
          >
            <Text
              style={[
                styles.frequencyText,
                frequency === 'daily' && styles.activeFrequencyText,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.frequencyButton,
              frequency === 'weekly' && styles.activeFrequencyButton,
            ]}
            onPress={() => setFrequency('weekly')}
          >
            <Text
              style={[
                styles.frequencyText,
                frequency === 'weekly' && styles.activeFrequencyText,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Changes"
          onPress={handleSaveChanges}
          style={styles.saveButton}
        />
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
    backgroundColor: theme.colors.background,
  },
  backButton: {
    fontSize: 24,
    color: theme.colors.primary,
    width: 30,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 8, // theme.spacing.sm
    marginTop: 24, // theme.spacing.lg
  },
  nameInput: {
    backgroundColor: theme.colors.surface,
    padding: 8, // theme.spacing.sm
    borderRadius: theme.borderRadius.medium,
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: 16, // theme.spacing.md
  },
  emojiDescription: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 8, // theme.spacing.sm
  },
  emojiSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // theme.spacing.md
  },
  emojiInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: 8, // theme.spacing.sm
    borderRadius: theme.borderRadius.medium,
    fontSize: 20,
    color: theme.colors.primary,
    marginRight: 8, // theme.spacing.sm
  },
  emojiPreview: {
    width: 50,
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  emojiPreviewText: {
    fontSize: 24,
  },
  fallbackText: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 8, // theme.spacing.sm
  },
  commonEmojisContainer: {
    marginBottom: 16, // theme.spacing.md
  },
  commonEmojis: {
    flexDirection: 'row',
    paddingVertical: 8, // theme.spacing.sm
  },
  commonEmojiOption: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8, // theme.spacing.sm
    borderRadius: theme.borderRadius.small,
    backgroundColor: theme.colors.surface,
  },
  selectedCommonEmoji: {
    backgroundColor: theme.colors.primary,
  },
  commonEmojiText: {
    fontSize: 20,
  },
  frequencyButtons: {
    flexDirection: 'row',
    marginBottom: 24, // theme.spacing.lg
  },
  frequencyButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.inactive,
    marginRight: 8, // theme.spacing.sm
  },
  activeFrequencyButton: {
    backgroundColor: theme.colors.primary,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.surface,
  },
  activeFrequencyText: {
    color: theme.colors.surface,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  saveButton: {
    marginTop: 16, // theme.spacing.md
  },
});