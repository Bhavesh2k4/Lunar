import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../styles/theme';

interface WidgetConfigScreenProps {
  navigation: any;
}

export const WidgetConfigScreen: React.FC<WidgetConfigScreenProps> = ({ navigation }) => {
  const { habits } = useSelector((state: RootState) => state.habits);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadExistingConfig();
  }, []);

  const loadExistingConfig = async () => {
    try {
      const savedConfig = await AsyncStorage.getItem('widgetConfig');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        setSelectedHabits(config.selectedHabits || []);
      }
    } catch (error) {
      console.error('Error loading widget config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const toggleHabitSelection = (habitId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setSelectedHabits(prev => {
      if (prev.includes(habitId)) {
        return prev.filter(id => id !== habitId);
      } else {
        if (prev.length >= 4) {
          Alert.alert('Limit Reached', 'You can select up to 4 habits for widgets.');
          return prev;
        }
        return [...prev, habitId];
      }
    });
  };

  const saveWidgetConfig = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      if (selectedHabits.length === 0) {
        Alert.alert('No Habits Selected', 'Please select at least one habit for the widget.');
        return;
      }

      // Save widget configuration
      const widgetConfig = {
        selectedHabits: selectedHabits,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('widgetConfig', JSON.stringify(widgetConfig));

      Alert.alert(
        'Widget Configured! 🎉',
        `Your widget has been set up with ${selectedHabits.length} habit${selectedHabits.length > 1 ? 's' : ''}.\n\nGo to your home screen and add the Lunar widget!`,
        [
          { text: 'Got it!', onPress: () => navigation.goBack() }
        ]
      );
    } catch (error) {
      console.error('Widget config error:', error);
      Alert.alert('Configuration Failed', 'Could not save widget settings. Please try again.');
    }
  };

  interface HabitItemProps {
    habit: {
      id: string;
      name: string;
      icon?: string;
      frequency?: string;
    };
    isSelected: boolean;
    onPress: () => void;
  }

  const HabitItem: React.FC<HabitItemProps> = ({ habit, isSelected, onPress }) => (
    <TouchableOpacity 
      style={[styles.habitItem, isSelected && styles.selectedHabitItem]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.habitItemContent}>
        <View style={styles.habitIcon}>
          <Text style={styles.habitEmoji}>{habit.icon || '🌟'}</Text>
        </View>
        <View style={styles.habitInfo}>
          <Text style={[styles.habitName, isSelected && styles.selectedText]}>
            {habit.name}
          </Text>
          <Text style={styles.habitFrequency}>
            {habit.frequency || 'Daily'}
          </Text>
        </View>
      </View>
      <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
        {isSelected && (
          <MaterialIcons name="check" size={16} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Widget Setup</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoEmoji}>📱</Text>
          <Text style={styles.infoTitle}>Create Your Home Screen Widget</Text>
          <Text style={styles.infoSubtitle}>
            Select up to 4 habits to display on your home screen widget. Track your progress at a glance!
          </Text>
        </View>

        {/* Selection Counter */}
        <View style={styles.counterSection}>
          <Text style={styles.counterText}>
            Selected: {selectedHabits.length}/4 habits
          </Text>
        </View>

        {/* Habits List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Choose Your Habits</Text>
          
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyText}>
                No habits found. Create some habits first to set up widgets!
              </Text>
            </View>
          ) : (
            habits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                isSelected={selectedHabits.includes(habit.id)}
                onPress={() => toggleHabitSelection(habit.id)}
              />
            ))
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>📋 Next Steps:</Text>
          <Text style={styles.instruction}>1. Tap "Configure Widget" below</Text>
          <Text style={styles.instruction}>2. Go to your home screen</Text>
          <Text style={styles.instruction}>3. Long press on an empty area</Text>
          <Text style={styles.instruction}>4. Tap "Widgets" and find "Lunar"</Text>
          <Text style={styles.instruction}>5. Add the widget to your home screen!</Text>
        </View>
                </ScrollView>

          {/* Action Button */}
          {selectedHabits.length > 0 && (
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.configureButton}
                onPress={saveWidgetConfig}
                activeOpacity={0.8}
              >
                <Text style={styles.configureButtonText}>
                  Configure Widget ({selectedHabits.length} habit{selectedHabits.length > 1 ? 's' : ''})
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: StatusBar.currentHeight || 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
  },
  title: {
    fontSize: theme.typography.title.fontSize,
    fontWeight: theme.typography.title.fontWeight,
    color: theme.colors.primary,
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 24,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
  },
  infoEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  infoSubtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  counterSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 16,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedHabitItem: {
    borderColor: theme.colors.accent,
    backgroundColor: '#F0F8FF',
  },
  habitItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  habitEmoji: {
    fontSize: 20,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  selectedText: {
    color: theme.colors.accent,
  },
  habitFrequency: {
    fontSize: 14,
    color: theme.colors.secondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  instructionsSection: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 100,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
  },
  configureButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
  },
  configureButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});