import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface DayHeaderProps {
  title: string;
}

export function DayHeader({ title }: DayHeaderProps) {
  return (
    <ThemedText style={styles.header} themeColor="textSecondary">
      {title}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
});
