import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface NoteModalProps {
  visible: boolean;
  eventName: string;
  onSubmit: (note: string) => void;
  onCancel: () => void;
}

export function NoteModal({ visible, eventName, onSubmit, onCancel }: NoteModalProps) {
  const [note, setNote] = useState('');
  const theme = useTheme();

  const handleSubmit = () => {
    onSubmit(note.trim());
    setNote('');
  };

  const handleCancel = () => {
    setNote('');
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCancel}>
      <Pressable style={styles.overlay} onPress={handleCancel}>
        <Pressable
          style={[styles.content, { backgroundColor: theme.backgroundElement }]}
          onPress={(e) => e.stopPropagation()}
        >
          <ThemedText type="subtitle" style={styles.title}>
            {eventName}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Add an optional note
          </ThemedText>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            value={note}
            onChangeText={setNote}
            placeholder="Note (optional)"
            placeholderTextColor={theme.textSecondary}
            multiline
            autoFocus
          />
          <View style={styles.actions}>
            <Pressable style={styles.actionButton} onPress={handleCancel}>
              <ThemedText themeColor="textSecondary">Cancel</ThemedText>
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.submitButton]}
              onPress={handleSubmit}
            >
              <ThemedText style={{ color: '#fff', fontWeight: '600' }}>Log</ThemedText>
            </Pressable>
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
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  actionButton: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: 10,
  },
  submitButton: {
    backgroundColor: '#3c87f7',
  },
});
