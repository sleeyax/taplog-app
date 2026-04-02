import { getDb } from './client';

export interface LogEntry {
  id: string;
  event_type_id: string;
  note: string | null;
  logged_at: string;
  created_at: string;
}

export interface LogEntryWithEvent extends LogEntry {
  event_name: string;
  event_color: string;
  event_icon: string;
}

export function getLogEntries(): LogEntryWithEvent[] {
  return getDb().getAllSync<LogEntryWithEvent>(
    `SELECT l.*, e.name as event_name, e.color as event_color, e.icon as event_icon
     FROM log_entries l
     JOIN event_types e ON e.id = l.event_type_id
     ORDER BY l.logged_at DESC`,
  );
}

export function createLogEntry(
  eventTypeId: string,
  note?: string,
): LogEntry {
  return getDb().getFirstSync<LogEntry>(
    'INSERT INTO log_entries (event_type_id, note) VALUES (?, ?) RETURNING *',
    eventTypeId,
    note ?? null,
  )!;
}

export function updateLogEntry(
  id: string,
  fields: Partial<Pick<LogEntry, 'note' | 'logged_at'>>,
) {
  const db = getDb();
  const sets: string[] = [];
  const values: (string | number | null)[] = [];

  if (fields.note !== undefined) {
    sets.push('note = ?');
    values.push(fields.note);
  }
  if (fields.logged_at !== undefined) {
    sets.push('logged_at = ?');
    values.push(fields.logged_at);
  }

  if (sets.length === 0) return;

  values.push(id);
  db.runSync(`UPDATE log_entries SET ${sets.join(', ')} WHERE id = ?`, ...values);
}

export function deleteLogEntry(id: string) {
  getDb().runSync('DELETE FROM log_entries WHERE id = ?', id);
}

export function clearAllLogEntries() {
  getDb().runSync('DELETE FROM log_entries');
}
