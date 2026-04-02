import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import type { LogEntryWithEvent } from '@/db/log-entries';
import { formatDate, formatTime, getDayKey } from './date';

export async function exportLogbookPdf(entries: LogEntryWithEvent[]) {
  const grouped = new Map<string, LogEntryWithEvent[]>();
  for (const entry of entries) {
    const key = getDayKey(entry.logged_at);
    const group = grouped.get(key);
    if (group) {
      group.push(entry);
    } else {
      grouped.set(key, [entry]);
    }
  }

  let tableRows = '';
  for (const [, dayEntries] of grouped) {
    const dateStr = formatDate(dayEntries[0].logged_at);
    tableRows += `<tr><td colspan="4" style="background:#f0f0f3;font-weight:700;padding:8px 12px;">${dateStr}</td></tr>`;
    for (const entry of dayEntries) {
      tableRows += `
        <tr>
          <td style="padding:6px 12px;">${entry.event_icon}</td>
          <td style="padding:6px 12px;">${entry.event_name}</td>
          <td style="padding:6px 12px;">${formatTime(entry.logged_at)}</td>
          <td style="padding:6px 12px;">${entry.note ?? ''}</td>
        </tr>`;
    }
  }

  const html = `
    <html>
      <head>
        <style>
          body { font-family: -apple-system, sans-serif; padding: 20px; }
          h1 { font-size: 24px; margin-bottom: 4px; }
          p { color: #666; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; }
          tr { border-bottom: 1px solid #e0e0e0; }
          th { text-align: left; padding: 8px 12px; background: #3c87f7; color: #fff; }
        </style>
      </head>
      <body>
        <h1>TapLog Export</h1>
        <p>${entries.length} entries</p>
        <table>
          <thead>
            <tr><th></th><th>Event</th><th>Time</th><th>Note</th></tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>`;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
}
