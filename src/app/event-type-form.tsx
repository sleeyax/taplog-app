import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ColorPicker, PRESET_COLORS } from '@/components/color-picker';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { getEventType } from '@/db/event-types';
import { useEventTypes } from '@/hooks/use-event-types';
import { useTheme } from '@/hooks/use-theme';

const EMOJI_OPTIONS = [
  '🚌', '🚶', '🚗', '🚲', '🚆', '✈️',
  '⏰', '❌', '✅', '⚠️', '📝', '💼',
  '🏃', '☔', '🔧', '📞', '🏠', '⭐',
];

export default function EventTypeFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { add, update } = useEventTypes();
  const theme = useTheme();

  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState(EMOJI_OPTIONS[0]);

  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      const existing = getEventType(id);
      if (existing) {
        setName(existing.name);
        setColor(existing.color);
        setIcon(existing.icon);
      }
    }
  }, [id]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (isEditing) {
      update(id, { name: trimmed, color, icon });
    } else {
      add(trimmed, color, icon);
    }
    router.back();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.section}>
        <ThemedText style={styles.label}>Name</ThemedText>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected, backgroundColor: theme.backgroundElement }]}
          value={name}
          onChangeText={setName}
          placeholder="e.g. Missed bus ride"
          placeholderTextColor={theme.textSecondary}
          autoFocus={!isEditing}
        />
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Icon</ThemedText>
        <View style={styles.emojiGrid}>
          {EMOJI_OPTIONS.map((emoji) => (
            <Pressable
              key={emoji}
              style={[
                styles.emojiButton,
                { backgroundColor: theme.backgroundElement },
                icon === emoji && { backgroundColor: theme.backgroundSelected },
              ]}
              onPress={() => setIcon(emoji)}
            >
              <ThemedText style={styles.emoji}>{emoji}</ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.label}>Color</ThemedText>
        <ColorPicker selected={color} onSelect={setColor} />
      </View>

      <View style={styles.preview}>
        <View style={[styles.previewButton, { backgroundColor: color }]}>
          <ThemedText style={styles.previewIcon}>{icon}</ThemedText>
          <ThemedText style={styles.previewName} numberOfLines={1}>
            {name || 'Event name'}
          </ThemedText>
        </View>
      </View>

      <Pressable
        style={[styles.saveButton, !name.trim() && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!name.trim()}
      >
        <ThemedText style={styles.saveText}>
          {isEditing ? 'Save Changes' : 'Create Event'}
        </ThemedText>
      </Pressable>
    </ScrollView>
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: Spacing.three,
    fontSize: 16,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  emojiButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  preview: {
    alignItems: 'center',
  },
  previewButton: {
    width: 140,
    height: 120,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.three,
    gap: Spacing.two,
  },
  previewIcon: {
    fontSize: 36,
  },
  previewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#3c87f7',
    paddingVertical: Spacing.three,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
