import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, ToastAndroid, View } from 'react-native';

import { EmptyState } from '@/components/empty-state';
import { NoteModal } from '@/components/note-modal';
import { TapButton } from '@/components/tap-button';
import { Spacing } from '@/constants/theme';
import type { EventType } from '@/db/event-types';
import { useEventTypes } from '@/hooks/use-event-types';
import { useLogEntries } from '@/hooks/use-log-entries';
import { useTheme } from '@/hooks/use-theme';
import { triggerHaptic } from '@/utils/haptics';

export default function LogScreen() {
  const { eventTypes } = useEventTypes();
  const { log } = useLogEntries();
  const theme = useTheme();

  const [noteModal, setNoteModal] = useState<{ visible: boolean; event: EventType | null }>({
    visible: false,
    event: null,
  });

  const handleTap = useCallback(
    (event: EventType) => {
      log(event.id);
      triggerHaptic('medium');
      ToastAndroid.show(`Logged: ${event.name}`, ToastAndroid.SHORT);
    },
    [log],
  );

  const handleLongPress = useCallback((event: EventType) => {
    setNoteModal({ visible: true, event });
  }, []);

  const handleNoteSubmit = useCallback(
    (note: string) => {
      if (noteModal.event) {
        log(noteModal.event.id, note || undefined);
        ToastAndroid.show(`Logged: ${noteModal.event.name}`, ToastAndroid.SHORT);
      }
      setNoteModal({ visible: false, event: null });
    },
    [noteModal.event, log],
  );

  if (eventTypes.length === 0) {
    return (
      <EmptyState
        message="No events yet. Create your first event to start logging."
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
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TapButton
            name={item.name}
            icon={item.icon}
            color={item.color}
            onPress={() => handleTap(item)}
            onLongPress={() => handleLongPress(item)}
          />
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

      <NoteModal
        visible={noteModal.visible}
        eventName={noteModal.event?.name ?? ''}
        onSubmit={handleNoteSubmit}
        onCancel={() => setNoteModal({ visible: false, event: null })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    padding: Spacing.three,
    gap: Spacing.three,
  },
  row: {
    gap: Spacing.three,
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
