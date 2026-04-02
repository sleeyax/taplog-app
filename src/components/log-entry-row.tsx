import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { LogEntryWithEvent } from '@/db/log-entries';
import { useTheme } from '@/hooks/use-theme';
import { formatTime } from '@/utils/date';

interface LogEntryRowProps {
  entry: LogEntryWithEvent;
  onPress: () => void;
  onLongPress: () => void;
}

export function LogEntryRow({ entry, onPress, onLongPress }: LogEntryRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      style={[styles.container, { backgroundColor: theme.backgroundElement }]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={[styles.colorDot, { backgroundColor: entry.event_color }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={styles.eventName}>
            {entry.event_icon} {entry.event_name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatTime(entry.logged_at)}
          </ThemedText>
        </View>
        {entry.note ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {entry.note}
          </ThemedText>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
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
  content: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventName: {
    fontWeight: '600',
    fontSize: 15,
  },
});
