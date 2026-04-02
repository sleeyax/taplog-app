import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import { writeAsStringAsync } from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { getDb } from '@/db/client';
import type { EventType } from '@/db/event-types';
import type { LogEntry } from '@/db/log-entries';
import { dbEvents } from '@/hooks/use-db-event';

interface BackupData {
  version: 1;
  exported_at: string;
  event_types: EventType[];
  log_entries: LogEntry[];
}

export async function exportBackup() {
  const db = getDb();
  const eventTypes = db.getAllSync<EventType>('SELECT * FROM event_types ORDER BY sort_order');
  const logEntries = db.getAllSync<LogEntry>('SELECT * FROM log_entries ORDER BY logged_at DESC');

  const data: BackupData = {
    version: 1,
    exported_at: new Date().toISOString(),
    event_types: eventTypes,
    log_entries: logEntries,
  };

  const json = JSON.stringify(data, null, 2);
  const fileName = `taplog-backup-${new Date().toISOString().slice(0, 10)}.json`;
  const file = new File(Paths.cache, fileName);
  await writeAsStringAsync(file.uri, json);

  await Sharing.shareAsync(file.uri, { mimeType: 'application/json' });
}

export async function importBackup(): Promise<{ eventTypes: number; logEntries: number } | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });

  if (result.canceled) return null;

  const pickedFile = result.assets[0];
  const file = new File(pickedFile.uri);
  const content = await file.text();
  const data: BackupData = JSON.parse(content);

  if (!data.version || !data.event_types || !data.log_entries) {
    throw new Error('Invalid backup file format');
  }

  const db = getDb();

  db.execSync('DELETE FROM log_entries');
  db.execSync('DELETE FROM event_types');

  for (const et of data.event_types) {
    db.runSync(
      'INSERT INTO event_types (id, name, color, icon, sort_order, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      et.id,
      et.name,
      et.color,
      et.icon,
      et.sort_order,
      et.created_at,
    );
  }

  for (const le of data.log_entries) {
    db.runSync(
      'INSERT INTO log_entries (id, event_type_id, note, logged_at, created_at) VALUES (?, ?, ?, ?, ?)',
      le.id,
      le.event_type_id,
      le.note,
      le.logged_at,
      le.created_at,
    );
  }

  dbEvents.emit();

  return { eventTypes: data.event_types.length, logEntries: data.log_entries.length };
}
