import React, { useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { addHabit } from '../store/habitSlice';
import { Button } from '../components/Button';
import { theme } from '../styles/theme';

interface CreateHabitScreenProps {
  navigation: any;
}

const PREDEFINED_HABITS = [
  { name: 'Learn Something New', emoji: '📚' },
  { name: 'Budget Tracking', emoji: '💰' },
  { name: 'Gym Workout', emoji: '🏋️' },
  { name: '7h Sleep', emoji: '😴' },
  { name: '10k Steps', emoji: '👟' },
  { name: 'No Sugar', emoji: '🍫' },
  { name: '5m Meditation', emoji: '🧘' },
  { name: 'Social Media Limit', emoji: '📱' },
];

export const CreateHabitScreen: React.FC<CreateHabitScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const [habitName, setHabitName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('⭐');
  const [customEmoji, setCustomEmoji] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [showPredefined, setShowPredefined] = useState(true);

  const handleCreateHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    // Use custom emoji if provided, otherwise use selected emoji
    const finalEmoji = customEmoji.trim() || selectedEmoji;

    dispatch(addHabit({
      name: habitName.trim(),
      emoji: finalEmoji,
      frequency,
    }));

    navigation.goBack();
  };

  const selectPredefinedHabit = (habit: any) => {
    setHabitName(habit.name);
    setSelectedEmoji(habit.emoji);
    setCustomEmoji(''); // Clear custom emoji when selecting predefined
    setShowPredefined(false);
  };

  const handleEmojiChange = (text: string) => {
    // Only allow single emoji/character
    if (text.length <= 2) { // Allow for compound emojis
      setCustomEmoji(text);
    }
  };

  if (showPredefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Habit</Text>
          <View style={{ width: 30 }} />
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Popular</Text>
          <Text style={styles.subtitle}>
            Start with proven habits that have helped thousands succeed
          </Text>
          
          {PREDEFINED_HABITS.map((habit, index) => (
            <TouchableOpacity
              key={index}
              style={styles.predefinedItem}
              onPress={() => selectPredefinedHabit(habit)}
            >
              <Text style={styles.predefinedEmoji}>{habit.emoji}</Text>
              <View style={styles.predefinedInfo}>
                <Text style={styles.predefinedName}>{habit.name}</Text>
                <Text style={styles.predefinedDesc}>
                  {habit.name === 'Learn Something New' && 'Feed your curious mind'}
                  {habit.name === 'Budget Tracking' && 'Master your money mindset'} 
                  {habit.name === 'Gym Workout' && 'Crush a gym session'}
                  {habit.name === '7h Sleep' && 'Rest and recharge fully'}
                  {habit.name === '10k Steps' && 'Walk your way to wellness'}
                  {habit.name === 'No Sugar' && 'Choose health over cravings'}
                  {habit.name === '5m Meditation' && 'Find your inner peace'}
                  {habit.name === 'Social Media Limit' && 'Mindful digital usage'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Create a custom habit"
            onPress={() => setShowPredefined(false)}
            style={styles.customButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create a new habit</Text>
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
                    setCustomEmoji(''); // Clear custom when selecting common
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
          title="Create habit"
          onPress={handleCreateHabit}
          style={styles.createButton}
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
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  predefinedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.sm,
  },
  predefinedEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  predefinedInfo: {
    flex: 1,
  },
  predefinedName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  predefinedDesc: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  nameInput: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    fontSize: 16,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  emojiDescription: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: theme.spacing.sm,
  },
  emojiSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  emojiInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.medium,
    fontSize: 20,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
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
    marginBottom: theme.spacing.sm,
  },
  commonEmojisContainer: {
    marginBottom: theme.spacing.md,
  },
  commonEmojis: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
  },
  commonEmojiOption: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
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
    marginBottom: theme.spacing.lg,
  },
  frequencyButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.pill,
    backgroundColor: theme.colors.inactive,
    marginRight: theme.spacing.sm,
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
  customButton: {
    marginTop: theme.spacing.md,
  },
  createButton: {
    marginTop: theme.spacing.md,
  },
  
});