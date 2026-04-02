import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { LogEntryWithEvent } from '@/db/log-entries';
import { useTheme } from '@/hooks/use-theme';
import { formatDateTime } from '@/utils/date';

interface EditEntryModalProps {
  entry: LogEntryWithEvent | null;
  visible: boolean;
  onSave: (id: string, fields: { note?: string; logged_at?: string }) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function EditEntryModal({ entry, visible, onSave, onDelete, onClose }: EditEntryModalProps) {
  const [note, setNote] = useState('');
  const theme = useTheme();

  useEffect(() => {
    if (entry) {
      setNote(entry.note ?? '');
    }
  }, [entry]);

  if (!entry) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.content, { backgroundColor: theme.backgroundElement }]}
          onPress={(e) => e.stopPropagation()}
        >
          <ThemedText type="subtitle" style={styles.title}>
            {entry.event_icon} {entry.event_name}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {formatDateTime(entry.logged_at)}
          </ThemedText>

          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            value={note}
            onChangeText={setNote}
            placeholder="Note (optional)"
            placeholderTextColor={theme.textSecondary}
            multiline
          />

          <View style={styles.actions}>
            <Pressable
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(entry.id)}
            >
              <ThemedText style={{ color: '#ef4444', fontWeight: '600' }}>Delete</ThemedText>
            </Pressable>
            <View style={styles.rightActions}>
              <Pressable style={styles.actionButton} onPress={onClose}>
                <ThemedText themeColor="textSecondary">Cancel</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.actionButton, styles.saveButton]}
                onPress={() => {
                  onSave(entry.id, { note: note.trim() || undefined });
                  onClose();
                }}
              >
                <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Save</ThemedText>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: Spacing.three,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginTop: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  rightActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  actionButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: 10,
  },
  deleteButton: {},
  saveButton: {
    backgroundColor: '#3c87f7',
  },
});
