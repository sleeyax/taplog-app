import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { EventType } from '@/db/event-types';
import { useEventTypes } from '@/hooks/use-event-types';
import { useTheme } from '@/hooks/use-theme';

export default function ManageEventsScreen() {
  const { eventTypes, remove } = useEventTypes();
  const theme = useTheme();

  const handleDelete = useCallback(
    (event: EventType) => {
      Alert.alert(
        'Delete Event',
        `Delete "${event.name}" and all its log entries? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => remove(event.id),
          },
        ],
      );
    },
    [remove],
  );

  if (eventTypes.length === 0) {
    return (
      <EmptyState
        message="No events yet."
        actionLabel="Create Event"
        onAction={() => router.push('/event-type-form')}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={eventTypes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.row, { backgroundColor: theme.backgroundElement }]}
            onPress={() => router.push({ pathname: '/event-type-form', params: { id: item.id } })}
          >
            <View style={[styles.colorDot, { backgroundColor: item.color }]} />
            <ThemedText style={styles.icon}>{item.icon}</ThemedText>
            <ThemedText style={styles.name} numberOfLines={1}>
              {item.name}
            </ThemedText>
            <Pressable
              onPress={() => handleDelete(item)}
              hitSlop={12}
              style={styles.deleteButton}
            >
              <MaterialIcons name="delete-outline" size={22} color={theme.textSecondary} />
            </Pressable>
          </Pressable>
        )}
      />

      <View style={styles.fab}>
        <Pressable
          style={[styles.fabButton, { backgroundColor: theme.backgroundElement }]}
          onPress={() => router.push('/event-type-form')}
        >
          <MaterialIcons name="add" size={28} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: Spacing.three,
  },
  separator: {
    height: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.three,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  icon: {
    fontSize: 20,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    padding: Spacing.one,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.four,
    right: Spacing.four,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
