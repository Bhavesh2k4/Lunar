import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Habit } from '../types/habit';
import * as Haptics from 'expo-haptics';

interface ReorderableHabitListProps {
  habits: Habit[];
  onReorder: (reorderedHabits: Habit[]) => void;
  onEdit: (habit: Habit) => void;
}

export const ReorderableHabitList: React.FC<ReorderableHabitListProps> = ({
  habits,
  onReorder,
  onEdit,
}) => {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<Habit>) => {
    return (
      <View style={[styles.item, isActive && styles.activeItem]}>
        <TouchableOpacity
          style={styles.dragHandle}
          onLongPress={drag}
          disabled={isActive}
        >
          <MaterialIcons name="drag-indicator" size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
        
        <Text style={styles.emoji}>{item.emoji}</Text>
        <Text style={styles.name}>{item.name}</Text>
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(item)}
        >
          <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleDragEnd = ({ data }: { data: Habit[] }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onReorder(data);
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={habits}
        onDragEnd={handleDragEnd}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 16,
    marginBottom: 8,
    borderRadius: theme.borderRadius.large,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeItem: {
    backgroundColor: theme.colors.primary,
    shadowOpacity: 0.3,
  },
  dragHandle: {
    padding: 8,
    marginRight: 8,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 26, 26, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});