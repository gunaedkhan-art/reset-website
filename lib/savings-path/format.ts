import type { SupportedCurrency } from "./types";

const locale = "en-US";

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency,
  options?: { precise?: boolean },
): string {
  return amount.toLocaleString(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: options?.precise ? 2 : 0,
    minimumFractionDigits: options?.precise ? 2 : 0,
  });
}

export function formatCompactCurrency(
  amount: number,
  currency: SupportedCurrency,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatChartDate(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year!, month! - 1, day);
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayIsoDate(): string {
  return toIsoDate(new Date());
}
