import { useCallback, useEffect, useState } from 'react';

import {
  type LogEntry,
  type LogEntryWithEvent,
  clearAllLogEntries,
  createLogEntry,
  deleteLogEntry,
  getLogEntries,
  updateLogEntry,
} from '@/db/log-entries';
import { dbEvents } from './use-db-event';

export function useLogEntries() {
  const [entries, setEntries] = useState<LogEntryWithEvent[]>([]);

  const reload = useCallback(() => {
    setEntries(getLogEntries());
  }, []);

  useEffect(() => {
    reload();
    const unsub = dbEvents.subscribe(reload);
    return unsub;
  }, [reload]);

  const log = useCallback(
    (eventTypeId: string, note?: string) => {
      createLogEntry(eventTypeId, note);
      dbEvents.emit();
    },
    [],
  );

  const update = useCallback(
    (id: string, fields: Partial<Pick<LogEntry, 'note' | 'logged_at'>>) => {
      updateLogEntry(id, fields);
      dbEvents.emit();
    },
    [],
  );

  const remove = useCallback(
    (id: string) => {
      deleteLogEntry(id);
      dbEvents.emit();
    },
    [],
  );

  const clearAll = useCallback(() => {
    clearAllLogEntries();
    dbEvents.emit();
  }, []);

  return { entries, log, update, remove, clearAll, reload };
}
