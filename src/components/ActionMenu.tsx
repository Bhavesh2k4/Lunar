import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import * as Haptics from 'expo-haptics';

interface ActionMenuProps {
  visible: boolean;
  habitName: string;
  onCancel: () => void;
  onEdit: () => void;
  onShare: () => void;  // Add this new prop
  onReorder: () => void;
  onDelete: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({
  visible,
  habitName,
  onCancel,
  onEdit,
  onShare,  // Add this
  onReorder,
  onDelete,
}) => {
  const handleAction = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action();
  };

  const ActionButton = ({ 
    emoji, 
    title, 
    onPress, 
    color = theme.colors.primary,
    destructive = false 
  }: {
    emoji: string;
    title: string;
    onPress: () => void;
    color?: string;
    destructive?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.actionButton, destructive && styles.destructiveButton]} 
      onPress={() => handleAction(onPress)}
      activeOpacity={0.7}
    >
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={[styles.actionText, { color }, destructive && styles.destructiveText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View style={styles.menuContainer}>
          <View style={styles.header}>
            <Text style={styles.habitName} numberOfLines={1}>
              {habitName}
            </Text>
            <Text style={styles.subtitle}>Choose an action</Text>
          </View>

          <View style={styles.actionsContainer}>
            <ActionButton
              emoji="✏️"
              title="Edit Habit"
              onPress={onEdit}
            />
            
            <ActionButton
              emoji="📱"
              title="Share Habit"
              onPress={onShare}
              color={theme.colors.accent}
            />
            
            <ActionButton
              emoji="🔄"
              title="Reorder Mode"
              onPress={onReorder}
            />
            
            <ActionButton
              emoji="🗑️"
              title="Delete Habit"
              onPress={onDelete}
              destructive={true}
            />
          </View>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => handleAction(onCancel)}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  menuContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.secondary,
    textAlign: 'center',
  },
  actionsContainer: {
    gap: 8,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  destructiveButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.05)',
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  actionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.primary,
  },
  destructiveText: {
    color: '#FF6B6B',
  },
  cancelButton: {
    backgroundColor: theme.colors.border,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
});