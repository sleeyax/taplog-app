import * as SQLite from 'expo-sqlite';

const DB_NAME = 'taplog.db';

let _db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) {
    _db = SQLite.openDatabaseSync(DB_NAME);
    migrate(_db);
  }
  return _db;
}

function migrate(db: SQLite.SQLiteDatabase) {
  db.execSync(`PRAGMA journal_mode = WAL`);
  db.execSync(`PRAGMA foreign_keys = ON`);

  const version = db.getFirstSync<{ user_version: number }>(
    'PRAGMA user_version',
  )!.user_version;

  if (version < 1) {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS event_types (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT '#3c87f7',
        icon TEXT NOT NULL DEFAULT '🚌',
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS log_entries (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        event_type_id TEXT NOT NULL REFERENCES event_types(id) ON DELETE CASCADE,
        note TEXT,
        logged_at TEXT NOT NULL DEFAULT (datetime('now')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_log_entries_logged_at ON log_entries(logged_at);
      CREATE INDEX IF NOT EXISTS idx_log_entries_event_type ON log_entries(event_type_id);

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      INSERT OR IGNORE INTO settings (key, value) VALUES ('haptics', 'true');

      PRAGMA user_version = 1;
    `);
  }
}
