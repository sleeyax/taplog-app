import { useCallback, useEffect, useState } from 'react';

import {
  type EventType,
  createEventType,
  deleteEventType,
  getAllEventTypes,
  updateEventType,
  reorderEventTypes,
} from '@/db/event-types';
import { dbEvents } from './use-db-event';

export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);

  const reload = useCallback(() => {
    setEventTypes(getAllEventTypes());
  }, []);

  useEffect(() => {
    reload();
    const unsub = dbEvents.subscribe(reload);
    return unsub;
  }, [reload]);

  const add = useCallback(
    (name: string, color: string, icon: string) => {
      createEventType(name, color, icon);
      dbEvents.emit();
    },
    [],
  );

  const update = useCallback(
    (id: string, fields: Partial<Pick<EventType, 'name' | 'color' | 'icon'>>) => {
      updateEventType(id, fields);
      dbEvents.emit();
    },
    [],
  );

  const remove = useCallback(
    (id: string) => {
      deleteEventType(id);
      dbEvents.emit();
    },
    [],
  );

  const reorder = useCallback(
    (ids: string[]) => {
      reorderEventTypes(ids);
      dbEvents.emit();
    },
    [],
  );

  return { eventTypes, add, update, remove, reorder, reload };
}
