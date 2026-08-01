import {
  buildWeeklyShareMailtoUrl,
  buildWeeklyShareText,
} from "@/lib/one-thing-weekly/share";

export interface SavingsPathShareOptions {
  exportText: string;
  title: string;
  trackerUrl: string;
}

export function buildSavingsPathShareText(options: SavingsPathShareOptions): string {
  return buildWeeklyShareText({
    exportText: options.exportText,
    weekLabel: options.title,
    trackerUrl: options.trackerUrl,
  });
}

export function buildSavingsPathShareMailtoUrl(
  options: SavingsPathShareOptions,
): string {
  return buildWeeklyShareMailtoUrl({
    exportText: options.exportText,
    weekLabel: options.title,
    trackerUrl: options.trackerUrl,
    shareTitle: options.title,
  });
}
