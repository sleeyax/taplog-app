import React, { useCallback, useMemo, useState } from 'react';
import { Alert, SectionList, StyleSheet, View } from 'react-native';

import { DayHeader } from '@/components/day-header';
import { EditEntryModal } from '@/components/edit-entry-modal';
import { EmptyState } from '@/components/empty-state';
import { LogEntryRow } from '@/components/log-entry-row';
import { Spacing } from '@/constants/theme';
import type { LogEntryWithEvent } from '@/db/log-entries';
import { useLogEntries } from '@/hooks/use-log-entries';
import { useTheme } from '@/hooks/use-theme';
import { groupByDay } from '@/utils/date';

export default function LogbookScreen() {
  const { entries, update, remove } = useLogEntries();
  const theme = useTheme();
  const [editEntry, setEditEntry] = useState<LogEntryWithEvent | null>(null);

  const sections = useMemo(() => groupByDay(entries), [entries]);

  const handleDelete = useCallback(
    (id: string) => {
      Alert.alert('Delete Entry', 'Are you sure you want to delete this entry?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            remove(id);
            setEditEntry(null);
          },
        },
      ]);
    },
    [remove],
  );

  const handleSave = useCallback(
    (id: string, fields: { note?: string; logged_at?: string }) => {
      update(id, fields);
    },
    [update],
  );

  if (entries.length === 0) {
    return <EmptyState message="No entries yet. Tap an event on the Log tab to get started." />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => <DayHeader title={section.title} />}
        renderItem={({ item }) => (
          <LogEntryRow
            entry={item}
            onPress={() => setEditEntry(item)}
            onLongPress={() => handleDelete(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled
      />

      <EditEntryModal
        entry={editEntry}
        visible={editEntry !== null}
        onSave={handleSave}
        onDelete={handleDelete}
        onClose={() => setEditEntry(null)}
      />
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
});
