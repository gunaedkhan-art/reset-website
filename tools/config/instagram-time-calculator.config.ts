import { ENGINE_CONSTANTS } from "./constants";

export const instagramTimeCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "instagram-time-calculator",
  slug: "instagram-time-calculator",
  status: "published" as const,

  seo: {
    title: "Time Lost to Instagram Calculator",
    metaDescription:
      "See how many hours, days, and work weeks you spend on Instagram each year — and what else you could do with that time.",
    primaryKeyword: "instagram screen time",
    secondaryKeywords: [
      "social media time calculator",
      "time lost calculator",
      "instagram usage",
      "digital wellbeing",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/instagram-time-calculator",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["instagram", "screen-time", "social-media"],
    cluster: "social-media-time",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Time Lost to Instagram Calculator",
    intro:
      "Enter your daily Instagram minutes — see hours, days, and work weeks per year, plus what else that time could buy.",
    icon: "phone",
    proseTitle: "About this calculator",
    sections: [
      {
        id: "problem",
        heading: "One app, invisible hours",
        framework: "pas",
        body: "Instagram checks feel like seconds — Reels autoplay, stories refresh, DMs ping. Daily minutes compound into weeks per year spent on one feed while goals wait in the background.",
      },
      {
        id: "concept",
        heading: "Platform-specific cost",
        framework: "concept",
        body: "General screen time hides how much one app owns. Measuring Instagram separately makes the tradeoff explicit — and easier to decide whether the habit matches what you say you value.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "outcome",
        body: "Annual Instagram hours, full-day equivalents, work-week totals, and illustrative comparisons for what you could do with reclaimed time.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "minutes",
        type: "integer" as const,
        label: "Minutes on Instagram per day",
        placeholder: "e.g. 45",
        hint: "Your daily average from Screen Time or Digital Wellbeing.",
        min: 0,
        max: 1440,
        required: true,
        integer: true,
      },
    ],
    constants: {
      DAYS_PER_YEAR: ENGINE_CONSTANTS.DAYS_PER_YEAR,
      HOURS_PER_DAY: 24,
      HOURS_PER_WORK_WEEK: 40,
    },
    expressions: {
      hoursPerYear: "(inputs.minutes * constants.DAYS_PER_YEAR) / 60",
      daysPerYear: "calcs.hoursPerYear / constants.HOURS_PER_DAY",
      workingWeeksLost: "calcs.hoursPerYear / constants.HOURS_PER_WORK_WEEK",
      booksCount: "floor(calcs.hoursPerYear / 5)",
      skillBlocks: "floor(calcs.hoursPerYear / 100)",
      marathonCount: "floor(calcs.hoursPerYear / 100)",
      fullWeeks: "floor(calcs.daysPerYear / 7)",
      atlanticTrips: "floor(calcs.hoursPerYear / 15)",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your daily Instagram minutes and hit Calculate to see how much time you lose each year.",
    templates: [
      {
        id: "default",
        cardColumns: 3 as const,
        cards: [
          {
            title: "Hours per year",
            valueTemplate: "{{calcs.hoursPerYear|decimal1}}",
            descriptionTemplate:
              "{{inputs.minutes}} min/day × 365 days",
          },
          {
            title: "Days per year",
            valueTemplate: "{{calcs.daysPerYear|decimal1}}",
            descriptionTemplate: "Full 24-hour days of scrolling",
          },
          {
            title: "Working weeks lost",
            valueTemplate: "{{calcs.workingWeeksLost|decimal1}}",
            descriptionTemplate: "At a standard 40-hour work week",
          },
        ],
        comparisonTitle: "Put it in perspective",
        comparisonRules: [
          {
            when: "calcs.booksCount >= 1",
            textTemplate:
              "Enough time to read roughly {{calcs.booksCount}} book(s) (at 5 hours each).",
          },
          {
            when: "calcs.hoursPerYear >= 100",
            textTemplate:
              "About {{calcs.skillBlocks}}× the 100 hours often cited to reach basic competence in a new skill.",
          },
          {
            when: "calcs.workingWeeksLost >= 1",
            textTemplate:
              "Equivalent to {{calcs.workingWeeksLost|decimal1}} full 40-hour work weeks — time you could spend building something meaningful.",
          },
          {
            when: "calcs.hoursPerYear >= 100",
            textTemplate:
              "Enough training time for about {{calcs.marathonCount}} marathon(s) (roughly 100 hours each).",
          },
          {
            when: "calcs.daysPerYear >= 7",
            textTemplate:
              "Over {{calcs.fullWeeks}} full week(s) of 24-hour days — more vacation than most people take in several years.",
          },
          {
            when: "calcs.hoursPerYear >= 15",
            textTemplate:
              "You could fly round-trip across the Atlantic about {{calcs.atlanticTrips}} time(s) with that time.",
          },
          {
            when: "calcs.hoursPerYear >= 2000",
            textTemplate:
              "At a typical full-time job (2,000 hours/year), this rivals an entire extra career year spent scrolling.",
          },
          {
            when: "calcs.hoursPerYear >= 500",
            textTemplate:
              "More than the ~480 hours in a standard American school semester — an entire season of learning, gone to the feed.",
          },
        ],
        fallbackComparison:
          "Even small daily habits compound. Cutting a few minutes adds up to days recovered over a year.",
      },
    ],
  },

  guidance: [
    {
      title: "Find your number in phone settings",
      body: "Use your daily average from the last week for the most accurate picture.",
      list: [
        "iPhone: Settings → Screen Time → See All Activity → Instagram",
        "Android: Settings → Digital Wellbeing → Dashboard → Instagram (path may vary by device)",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Reclaim the time you just calculated",
      description:
        "Reset blocks Instagram when you need to focus, tracks your screen time goals, and helps you turn those lost hours into something that matters.",
    },
  },

  faq: [
    {
      question: "Where do I find my Instagram screen time?",
      answer:
        "On iPhone, open Settings → Screen Time → See All Activity and tap Instagram. On Android, try Settings → Digital Wellbeing → Dashboard. Some Samsung and Pixel devices label this slightly differently, but look for Screen Time or Digital Wellbeing.",
    },
    {
      question: "How is “working weeks lost” calculated?",
      answer:
        "We take your total yearly Instagram hours and divide by 40 — the hours in a standard full-time work week. It shows how much productive time the habit consumes in work-week equivalents.",
    },
    {
      question: "Should I use today’s number or an average?",
      answer:
        "Use your daily average over the past 7 days if your phone provides it. A single unusual day can skew results; the weekly average is more representative.",
    },
  ],

  recommendations: [],
};
