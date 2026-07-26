import type {
  CompoundingFrequency,
  ContributionFrequency,
} from "./types";

export function periodsPerYearForCompounding(
  frequency: CompoundingFrequency,
): number {
  switch (frequency) {
    case "daily":
      return 365;
    case "monthly":
      return 12;
    case "quarterly":
      return 4;
    case "annually":
      return 1;
  }
}

export function monthsBetweenContributions(
  frequency: ContributionFrequency,
): number {
  switch (frequency) {
    case "monthly":
      return 1;
    case "quarterly":
      return 3;
    case "annually":
      return 12;
    case "none":
      return 0;
  }
}

export function labelForCompounding(frequency: CompoundingFrequency): string {
  switch (frequency) {
    case "daily":
      return "daily";
    case "monthly":
      return "monthly";
    case "quarterly":
      return "quarterly";
    case "annually":
      return "annually";
  }
}

export function labelForContributionFrequency(
  frequency: ContributionFrequency,
): string {
  switch (frequency) {
    case "monthly":
      return "monthly";
    case "quarterly":
      return "quarterly";
    case "annually":
      return "annually";
    case "none":
      return "none";
  }
}
