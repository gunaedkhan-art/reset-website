export interface WeeklyShareOptions {
  exportText: string;
  weekLabel: string;
  trackerUrl: string;
}

const MAX_MAILTO_BODY_CHARS = 1500;

export function buildWeeklyShareTitle(weekLabel: string): string {
  return `ONE Thing Weekly — ${weekLabel}`;
}

export function buildWeeklyShareText(options: WeeklyShareOptions): string {
  return `${options.exportText}\n\n—\nTrack your week: ${options.trackerUrl}`;
}

function truncateForMailto(text: string): string {
  if (text.length <= MAX_MAILTO_BODY_CHARS) return text;
  return `${text.slice(0, MAX_MAILTO_BODY_CHARS - 16)}\n\n…(truncated)`;
}

export function buildWeeklyShareMailtoUrl(options: WeeklyShareOptions): string {
  const subject = encodeURIComponent(buildWeeklyShareTitle(options.weekLabel));
  const body = encodeURIComponent(
    truncateForMailto(buildWeeklyShareText(options)),
  );
  return `mailto:?subject=${subject}&body=${body}`;
}
