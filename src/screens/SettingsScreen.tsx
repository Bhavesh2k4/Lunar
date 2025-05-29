import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Linking,
  Platform,
  Share,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setHabits } from '../store/habitSlice';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { theme } from '../styles/theme';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { habits } = useSelector((state: RootState) => state.habits);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleGoBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  // Export habits data to JSON file
  const handleExportData = async () => {
    try {
      setIsExporting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Create export data with metadata
      const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        habits: habits,
        totalHabits: habits.length,
        appName: 'Lunar Habit Tracker'
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      
      // Create filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const fileName = `lunar-habits-backup-${currentDate}.json`;
      
      // Write to file system
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Habits Data',
        });
      } else {
        Alert.alert(
          'Export Complete',
          `Your habits data has been saved to:\n${fileUri}`,
          [{ text: 'OK' }]
        );
      }

      Alert.alert(
        'Export Successful! 🎉',
        `Successfully exported ${habits.length} habits. You can now transfer this file to another device and import it.`,
        [{ text: 'Great!' }]
      );

    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(
        'Export Failed',
        'Sorry, there was an error exporting your data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  // Import habits data from JSON file
  const handleImportData = async () => {
    try {
      setIsImporting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Pick document
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      // Read file content
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);
      const importData = JSON.parse(fileContent);

      // Validate import data structure
      if (!importData.habits || !Array.isArray(importData.habits)) {
        throw new Error('Invalid file format');
      }

      // Show confirmation dialog
      Alert.alert(
        'Import Habits Data',
        `Found ${importData.habits.length} habits in backup from ${
          importData.exportDate ? new Date(importData.exportDate).toLocaleDateString() : 'Unknown date'
        }.\n\nThis will replace your current ${habits.length} habits. Are you sure?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Import',
            style: 'destructive',
            onPress: async () => {
              try {
                // Save to Redux store
                dispatch(setHabits(importData.habits));
                
                // Save to AsyncStorage
                await AsyncStorage.setItem('habits', JSON.stringify(importData.habits));
                
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert(
                  'Import Successful! 🎉',
                  `Successfully imported ${importData.habits.length} habits.`,
                  [{ text: 'Awesome!', onPress: () => navigation.goBack() }]
                );
              } catch (saveError) {
                console.error('Save error:', saveError);
                Alert.alert('Import Failed', 'Could not save imported data.');
              }
            }
          }
        ]
      );

    } catch (error) {
      console.error('Import error:', error);
      Alert.alert(
        'Import Failed',
        'The selected file is not a valid Lunar habits backup. Please choose a valid JSON backup file.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsImporting(false);
    }
  };

  // Contact developer
  const handleContactDeveloper = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Alert.alert(
      'Contact Developer 👋',
      'Choose how you\'d like to get in touch:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '📧 Email',
          onPress: () => {
            const email = 'Bhavesh.oct2k4@gmail.com';
            const subject = 'Lunar Habit Tracker - Feedback';
            const body = 'Hi! I have some feedback about the Lunar app:\n\n';
            Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
          }
        },
        {
          text: '🔗 LinkedIn',
          onPress: () => {
            Linking.openURL('https://www.linkedin.com/in/bhavesh-budharaju/'); // Replace with your Link
          }
        }
      ]
    );
  };

  // Share app
  const handleShareApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    try {
      const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.yourapp.lunar'; // Replace with your app URL
      const appStoreUrl = 'https://apps.apple.com/app/your-app-id'; // Replace with your iOS app URL
      
      const shareUrl = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;
      const message = `Check out Lunar Habit Tracker! 🌟 Build better habits with this clean and motivating app: ${shareUrl}`;
      
      await Share.share({
        message: message,
        url: shareUrl,
        title: 'Lunar Habit Tracker',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // Review app
  const handleReviewApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Alert.alert(
      'Review Lunar 🌟',
      'Your review helps other people discover Lunar and motivates us to keep improving!',
      [
        { text: 'Maybe Later', style: 'cancel' },
        {
          text: '⭐ Review Now',
          onPress: () => {
            const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.yourapp.lunar'; // Replace
            const appStoreUrl = 'https://apps.apple.com/app/your-app-id'; // Replace
            
            const reviewUrl = Platform.OS === 'ios' ? appStoreUrl : playStoreUrl;
            Linking.openURL(reviewUrl);
          }
        }
      ]
    );
  };

  interface SettingsItemProps {
    emoji: string;
    title: string;
    subtitle: string;
    onPress: () => void;
    loading?: boolean;
    accent?: boolean;
  }

  const SettingsItem: React.FC<SettingsItemProps> = ({ 
    emoji, 
    title, 
    subtitle, 
    onPress, 
    loading = false, 
    accent = false 
  }) => (
    <TouchableOpacity 
      style={[styles.settingsItem, accent && styles.accentItem]} 
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
    >
      <View style={styles.settingsItemContent}>
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        <View style={styles.settingsItemText}>
          <Text style={[styles.settingsItemTitle, accent && styles.accentText]}>
            {title}
          </Text>
          <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingDots}>...</Text>
        </View>
      ) : (
        <MaterialIcons 
          name="chevron-right" 
          size={20} 
          color={theme.colors.secondary} 
        />
      )}
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
        <Text style={styles.title}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeEmoji}>⚙️</Text>
            <Text style={styles.welcomeTitle}>Manage Your Lunar Experience</Text>
            <Text style={styles.welcomeSubtitle}>
              Backup your progress, share the love, or get in touch
            </Text>
          </View>

          {/* Data Management Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🗂️ Your Data</Text>
            
            <SettingsItem
              emoji="📤"
              title="Export Habits"
              subtitle={`Backup your ${habits.length} habits to keep them safe`}
              onPress={handleExportData}
              loading={isExporting}
              accent={true}
            />
            
            <SettingsItem
              emoji="📥"
              title="Import Habits"
              subtitle="Restore your habits from a backup file"
              onPress={handleImportData}
              loading={isImporting}
              accent={true}
            />
            <SettingsItem
            emoji="📱"
            title="Configure Widgets"
            subtitle="Set up home screen widgets for quick tracking"
            onPress={() => navigation.navigate('WidgetConfig')}
            />
          </View>

          {/* Community Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💫 Community & Support</Text>
            
            <SettingsItem
              emoji="👋"
              title="Contact Developer"
              subtitle="Send feedback, ideas, or just say hello"
              onPress={handleContactDeveloper}
            />
            
            <SettingsItem
              emoji="⭐"
              title="Review Lunar"
              subtitle="Help others discover this app"
              onPress={handleReviewApp}
            />
            
            <SettingsItem
              emoji="💌"
              title="Share with Friends"
              subtitle="Spread the habit-building love"
              onPress={handleShareApp}
            />
          </View>

          {/* App Info */}
          <View style={styles.appInfo}>
            <Text style={styles.appInfoEmoji}>🌙</Text>
            <Text style={styles.appInfoText}>Lunar Habit Tracker</Text>
            <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
            <Text style={styles.appInfoSubtitle}>
              Building better habits, one day at a time
            </Text>
            <Text style={styles.appInfoFooter}>Made with 💜 for habit builders</Text>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  accentItem: {
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  settingsItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emojiContainer: {
    width: 44,
    height: 44,
    backgroundColor: theme.colors.background,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 24,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  accentText: {
    color: '#1976D2',
  },
  settingsItemSubtitle: {
    fontSize: 15,
    color: theme.colors.secondary,
    lineHeight: 20,
  },
  loadingContainer: {
    width: 20,
    alignItems: 'center',
  },
  loadingDots: {
    fontSize: 20,
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
  appInfo: {
    alignItems: 'center',
    marginTop: 20,
    padding: 32,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appInfoEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  appInfoText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  appInfoSubtitle: {
    fontSize: 16,
    color: theme.colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
  },
  appInfoFooter: {
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});