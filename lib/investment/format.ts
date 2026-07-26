export function formatCurrency(value: number, precise = false): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precise ? 2 : 0,
    minimumFractionDigits: precise ? 2 : 0,
  });
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })}%`;
}

export function formatYears(years: number): string {
  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);
  if (months === 0) {
    return wholeYears === 1 ? "1 year" : `${wholeYears} years`;
  }
  if (wholeYears === 0) {
    return months === 1 ? "1 month" : `${months} months`;
  }
  return `${wholeYears} yr ${months} mo`;
}
