/**
 * Seed the database with realistic test data.
 * Run from the app by importing and calling seed() — e.g. from a dev button or useEffect.
 *
 * Usage: add this temporarily to your root layout or settings screen:
 *   import { seed } from '@/scripts/seed';
 *   seed();
 */

import { getDb } from '@/db/client';
import { dbEvents } from '@/hooks/use-db-event';

export function seed() {
  const db = getDb();

  // Clear existing data
  db.execSync('DELETE FROM log_entries');
  db.execSync('DELETE FROM event_types');

  // Event types
  const events = [
    { name: 'Missed bus', color: '#ef4444', icon: '🚌' },
    { name: 'Worked from home', color: '#3c87f7', icon: '🏠' },
    { name: 'Took the bike', color: '#22c55e', icon: '🚲' },
  ];

  const eventIds: string[] = [];
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const row = db.getFirstSync<{ id: string }>(
      'INSERT INTO event_types (name, color, icon, sort_order) VALUES (?, ?, ?, ?) RETURNING id',
      e.name, e.color, e.icon, i,
    )!;
    eventIds.push(row.id);
  }

  // Generate entries over the past 3 months
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const notes = [
    null, null, null, null, null, // mostly no notes
    'Bus left 2 min early',
    'Driver didn\'t wait',
    'Was running late',
    'Road construction detour',
    'Bad weather, walked anyway',
    'Bus was full, had to wait',
    'Strike day',
  ];

  const d = new Date(threeMonthsAgo);
  while (d <= now) {
    const dayOfWeek = d.getDay();

    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      d.setDate(d.getDate() + 1);
      continue;
    }

    // ~50% chance of missing the morning bus
    if (Math.random() < 0.5) {
      const hour = 7 + Math.floor(Math.random() * 2); // 7 or 8
      const min = Math.floor(Math.random() * 60);
      const ts = new Date(d);
      ts.setHours(hour, min, 0, 0);
      const note = notes[Math.floor(Math.random() * notes.length)];
      db.runSync(
        'INSERT INTO log_entries (event_type_id, note, logged_at) VALUES (?, ?, ?)',
        eventIds[0], note, toSqlite(ts),
      );
    }

    // ~30% chance of missing the evening bus
    if (Math.random() < 0.3) {
      const hour = 17 + Math.floor(Math.random() * 2); // 17 or 18
      const min = Math.floor(Math.random() * 60);
      const ts = new Date(d);
      ts.setHours(hour, min, 0, 0);
      const note = notes[Math.floor(Math.random() * notes.length)];
      db.runSync(
        'INSERT INTO log_entries (event_type_id, note, logged_at) VALUES (?, ?, ?)',
        eventIds[0], note, toSqlite(ts),
      );
    }

    // ~10% chance of working from home
    if (Math.random() < 0.1) {
      const ts = new Date(d);
      ts.setHours(9, 0, 0, 0);
      db.runSync(
        'INSERT INTO log_entries (event_type_id, logged_at) VALUES (?, ?)',
        eventIds[1], toSqlite(ts),
      );
    }

    // ~15% chance of biking
    if (Math.random() < 0.15) {
      const ts = new Date(d);
      ts.setHours(7, 30, 0, 0);
      db.runSync(
        'INSERT INTO log_entries (event_type_id, logged_at) VALUES (?, ?)',
        eventIds[2], toSqlite(ts),
      );
    }

    d.setDate(d.getDate() + 1);
  }

  dbEvents.emit();

  const count = db.getFirstSync<{ c: number }>('SELECT COUNT(*) as c FROM log_entries')!.c;
  console.log(`Seeded ${events.length} event types and ${count} log entries`);
}

function toSqlite(d: Date): string {
  return d.toISOString().replace('T', ' ').slice(0, 19);
}

seed();
