import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useEventTypes } from '@/hooks/use-event-types';
import { useLogEntries } from '@/hooks/use-log-entries';
import { useHapticsSetting } from '@/hooks/use-settings';
import { useTheme } from '@/hooks/use-theme';
import { type ThemeMode, useThemeSetting } from '@/hooks/use-theme-setting';
import { exportBackup, importBackup } from '@/utils/backup';
import { exportLogbookPdf } from '@/utils/pdf-export';

export default function SettingsScreen() {
  const { eventTypes, remove: removeEvent } = useEventTypes();
  const { entries, clearAll } = useLogEntries();
  const { hapticsEnabled, toggleHaptics } = useHapticsSetting();
  const { themeMode, setThemeMode } = useThemeSetting();
  const theme = useTheme();

  const handleClear = useCallback(() => {
    Alert.alert(
      'Clear Logbook',
      `Delete all ${entries.length} log entries? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAll },
      ],
    );
  }, [entries.length, clearAll]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Clear All Data',
      `Delete all events and log entries? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAll();
            for (const et of eventTypes) {
              removeEvent(et.id);
            }
          },
        },
      ],
    );
  }, [eventTypes, clearAll, removeEvent]);

  const handleExportPdf = useCallback(async () => {
    if (entries.length === 0) {
      Alert.alert('No Entries', 'There are no log entries to export.');
      return;
    }
    try {
      await exportLogbookPdf(entries);
    } catch (e) {
      Alert.alert('Export Failed', String(e));
    }
  }, [entries]);

  const handleExportBackup = useCallback(async () => {
    try {
      await exportBackup();
    } catch (e) {
      Alert.alert('Backup Failed', String(e));
    }
  }, []);

  const handleImportBackup = useCallback(async () => {
    Alert.alert(
      'Import Backup',
      'This will replace all current data with the backup. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          onPress: async () => {
            try {
              const result = await importBackup();
              if (result) {
                Alert.alert(
                  'Import Complete',
                  `Restored ${result.eventTypes} events and ${result.logEntries} log entries.`,
                );
              }
            } catch (e) {
              Alert.alert('Import Failed', String(e));
            }
          },
        },
      ],
    );
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
        <View style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
          <MaterialIcons name="palette" size={22} color={theme.textSecondary} />
          <ThemedText style={styles.rowText}>Theme</ThemedText>
          <View style={styles.themeToggle}>
            {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
              <Pressable
                key={mode}
                style={[
                  styles.themeOption,
                  { backgroundColor: themeMode === mode ? theme.backgroundSelected : 'transparent' },
                ]}
                onPress={() => setThemeMode(mode)}
              >
                <ThemedText
                  style={[
                    styles.themeOptionText,
                    themeMode === mode && { fontWeight: '700' },
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={[styles.row, { backgroundColor: theme.backgroundElement }]}>
          <MaterialIcons name="vibration" size={22} color={theme.textSecondary} />
          <ThemedText style={styles.rowText}>Haptic Feedback</ThemedText>
          <Switch value={hapticsEnabled} onValueChange={toggleHaptics} />
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Backup</ThemedText>
        <SettingsButton
          icon="file-download"
          label="Export Backup (JSON)"
          onPress={handleExportBackup}
          theme={theme}
        />
        <SettingsButton
          icon="file-upload"
          label="Import Backup"
          onPress={handleImportBackup}
          theme={theme}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Data</ThemedText>
        <SettingsButton
          icon="picture-as-pdf"
          label="Export Logbook as PDF"
          onPress={handleExportPdf}
          theme={theme}
        />
        <SettingsButton
          icon="delete-sweep"
          label="Clear Logbook"
          onPress={handleClear}
          theme={theme}
          destructive
        />
        <SettingsButton
          icon="delete-forever"
          label="Clear All"
          onPress={handleClearAll}
          theme={theme}
          destructive
        />
      </View>

      <ThemedText type="small" themeColor="textSecondary" style={styles.version}>
        TapLog v1.0.0
      </ThemedText>
    </ScrollView>
  );
}

function SettingsButton({
  icon,
  label,
  onPress,
  theme,
  destructive,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  theme: ReturnType<typeof import('@/hooks/use-theme').useTheme>;
  destructive?: boolean;
}) {
  return (
    <Pressable
      style={[styles.row, { backgroundColor: theme.backgroundElement }]}
      onPress={onPress}
    >
      <MaterialIcons
        name={icon}
        size={22}
        color={destructive ? '#ef4444' : theme.textSecondary}
      />
      <ThemedText style={[styles.rowText, destructive && { color: '#ef4444' }]}>
        {label}
      </ThemedText>
      <MaterialIcons name="chevron-right" size={22} color={theme.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.three,
  },
  rowText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  themeToggle: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    gap: 2,
  },
  themeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  themeOptionText: {
    fontSize: 13,
  },
  version: {
    textAlign: 'center',
    marginTop: Spacing.four,
  },
});
