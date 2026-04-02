import { getDb } from './client';

export interface EventType {
  id: string;
  name: string;
  color: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export function getAllEventTypes(): EventType[] {
  return getDb().getAllSync<EventType>(
    'SELECT * FROM event_types ORDER BY sort_order ASC, created_at ASC',
  );
}

export function getEventType(id: string): EventType | null {
  return getDb().getFirstSync<EventType>(
    'SELECT * FROM event_types WHERE id = ?',
    id,
  );
}

export function createEventType(
  name: string,
  color: string,
  icon: string,
): EventType {
  const db = getDb();
  const maxOrder =
    db.getFirstSync<{ m: number | null }>('SELECT MAX(sort_order) as m FROM event_types')?.m ?? -1;
  return db.getFirstSync<EventType>(
    'INSERT INTO event_types (name, color, icon, sort_order) VALUES (?, ?, ?, ?) RETURNING *',
    name,
    color,
    icon,
    (maxOrder ?? -1) + 1,
  )!;
}

export function updateEventType(
  id: string,
  fields: Partial<Pick<EventType, 'name' | 'color' | 'icon'>>,
) {
  const db = getDb();
  const sets: string[] = [];
  const values: (string | number | null)[] = [];

  if (fields.name !== undefined) {
    sets.push('name = ?');
    values.push(fields.name);
  }
  if (fields.color !== undefined) {
    sets.push('color = ?');
    values.push(fields.color);
  }
  if (fields.icon !== undefined) {
    sets.push('icon = ?');
    values.push(fields.icon);
  }

  if (sets.length === 0) return;

  values.push(id);
  db.runSync(`UPDATE event_types SET ${sets.join(', ')} WHERE id = ?`, ...values);
}

export function deleteEventType(id: string) {
  getDb().runSync('DELETE FROM event_types WHERE id = ?', id);
}

export function reorderEventTypes(ids: string[]) {
  const db = getDb();
  for (let i = 0; i < ids.length; i++) {
    db.runSync('UPDATE event_types SET sort_order = ? WHERE id = ?', i, ids[i]);
  }
}
