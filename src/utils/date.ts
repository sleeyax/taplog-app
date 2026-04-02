import type { LogEntryWithEvent } from '@/db/log-entries';

export function formatDate(iso: string): string {
  const d = new Date(iso + 'Z');
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(iso: string): string {
  const d = new Date(iso + 'Z');
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} ${formatTime(iso)}`;
}

export function getDayKey(iso: string): string {
  return iso.slice(0, 10);
}

export interface DaySection {
  title: string;
  dayKey: string;
  data: LogEntryWithEvent[];
}

export function groupByDay(entries: LogEntryWithEvent[]): DaySection[] {
  const groups = new Map<string, LogEntryWithEvent[]>();

  for (const entry of entries) {
    const key = getDayKey(entry.logged_at);
    const group = groups.get(key);
    if (group) {
      group.push(entry);
    } else {
      groups.set(key, [entry]);
    }
  }

  return Array.from(groups.entries()).map(([dayKey, data]) => ({
    title: formatDate(data[0].logged_at),
    dayKey,
    data,
  }));
}
