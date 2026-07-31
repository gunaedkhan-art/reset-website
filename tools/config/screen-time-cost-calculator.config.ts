import { ENGINE_CONSTANTS } from "./constants";

export const screenTimeCostCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "screen-time-cost-calculator",
  slug: "screen-time-cost-calculator",
  status: "published" as const,

  seo: {
    title: "Screen Time Cost Calculator",
    metaDescription:
      "See how your daily screen time adds up in days per year — and how many years of your life you may spend on screens.",
    primaryKeyword: "screen time calculator",
    secondaryKeywords: [
      "daily screen time",
      "phone usage calculator",
      "digital wellbeing",
      "screen time cost",
      "time on phone",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/screen-time-cost-calculator",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["screen-time", "digital-wellbeing", "phone-usage"],
    cluster: "screen-time",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Screen Time Cost Calculator",
    intro:
      "See how your daily screen time adds up in days per year — and how many years of your life you may spend on screens.",
    icon: "phone",
    proseTitle: "About this calculator",
    sections: [
      {
        id: "problem",
        heading: "Two hours a day doesn't feel like much",
        framework: "pas",
        body: "A couple of hours on your phone seems harmless — until you multiply by 365. Suddenly it's weeks per year and years over a lifetime spent on a glowing rectangle instead of what you say matters.",
      },
      {
        id: "concept",
        heading: "Make the invisible visible",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) recommends measuring digital habits before changing them — in [Digital Minimalism](https://calnewport.com/books/digital-minimalism/), clarity about time cost precedes intentional use.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "outcome",
        body: "Days per year on screens, lifetime hours at your current rate, and a clear picture of what you're trading for feed time.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "hours",
        type: "number" as const,
        label: "Daily screen time (hours)",
        placeholder: "e.g. 6.5",
        hint: "Decimal hours — e.g. 90 minutes = 1.5",
        min: 0,
        max: 24,
        step: 0.25,
        required: true,
      },
    ],
    constants: {
      DAYS_PER_YEAR: ENGINE_CONSTANTS.DAYS_PER_YEAR,
      HOURS_PER_DAY: 24,
      LIFE_EXPECTANCY: 80,
      WHO_EXERCISE_WEEKLY: 2.5,
      WORK_HOURS_PER_YEAR: 2080,
      SKILL_MASTERY: 10000,
    },
    expressions: {
      hoursPerYear: "inputs.hours * constants.DAYS_PER_YEAR",
      daysPerYear: "calcs.hoursPerYear / constants.HOURS_PER_DAY",
      yearsOverLifetime:
        "(inputs.hours / constants.HOURS_PER_DAY) * constants.LIFE_EXPECTANCY",
      lifetimeHours:
        "inputs.hours * constants.DAYS_PER_YEAR * constants.LIFE_EXPECTANCY",
      booksCount: "floor(calcs.hoursPerYear / 5)",
      exerciseMultiplier: "floor(calcs.hoursPerYear / constants.WHO_EXERCISE_WEEKLY)",
      careerYears: "calcs.lifetimeHours / constants.WORK_HOURS_PER_YEAR",
      deepSkills: "floor(calcs.lifetimeHours / constants.SKILL_MASTERY)",
      monthsPerYear: "calcs.daysPerYear / 30",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your daily screen time to see how many days and years it adds up to.",
    templates: [
      {
        id: "default",
        cards: [
          {
            title: "Days per year",
            valueTemplate: "{{calcs.daysPerYear|decimal1}}",
            descriptionTemplate:
              "{{calcs.hoursPerYear|decimal1}} hours of screen time annually",
          },
          {
            title: "Years over a lifetime",
            valueTemplate: "{{calcs.yearsOverLifetime|decimal1}}",
            descriptionTemplate:
              "Based on 80 years at {{inputs.hours|decimal1}} hrs/day",
          },
        ],
        comparisonTitle: "What you're trading away",
        comparisonRules: [
          {
            when: "calcs.booksCount >= 1",
            textTemplate:
              "You could read about {{calcs.booksCount}} book(s) per year instead (at 5 hours each).",
          },
          {
            when: "calcs.exerciseMultiplier >= 1 && inputs.hours >= 1",
            textTemplate:
              "The WHO recommends ~2.5 hours of moderate exercise per week — your yearly screen time equals {{calcs.exerciseMultiplier}}× that minimum.",
          },
          {
            when: "inputs.hours >= 2",
            textTemplate:
              "Heavy screen use is linked to poorer sleep, eye strain, and less physical activity — {{inputs.hours|decimal1}} hrs/day adds up before you notice the drag.",
          },
          {
            when: "calcs.yearsOverLifetime >= 5",
            textTemplate:
              "Over an 80-year life, that's {{calcs.yearsOverLifetime|decimal1}} years staring at screens — more than most people spend in college and grad school combined.",
          },
          {
            when: "calcs.lifetimeHours >= constants.WORK_HOURS_PER_YEAR",
            textTemplate:
              "Your lifetime total equals {{calcs.careerYears|decimal1}} full-time work years (2,080 hrs/yr) — a second career spent on a glass rectangle.",
          },
          {
            when: "inputs.hours >= 4",
            textTemplate:
              "At {{inputs.hours|decimal1}} hrs/day, you're spending a large chunk of your waking life on devices — time that could go to sleep, relationships, or hobbies.",
          },
          {
            when: "calcs.lifetimeHours >= constants.SKILL_MASTERY",
            textTemplate:
              "The \"10,000 hour\" rule suggests {{calcs.deepSkills}} deep skill(s) you could have pursued with that lifetime screen time.",
          },
          {
            when: "calcs.lifetimeHours >= 1000",
            textTemplate:
              "Over a lifetime, {{calcs.lifetimeHours|integer}} hours is enough to become genuinely good at several hobbies — if redirected.",
          },
          {
            when: "calcs.daysPerYear >= 30",
            textTemplate:
              "{{calcs.daysPerYear|decimal1}} full days per year on screens — nearly {{calcs.monthsPerYear|decimal1}} months you won't get back.",
          },
        ],
        fallbackComparison:
          "Even modest daily screen time compounds into weeks per year — small cuts now pay off over decades.",
      },
    ],
  },

  guidance: [
    {
      title: "Find your daily total in phone settings",
      body: "Include phone, tablet, and computer if you can — or start with phone only and add a rough guess for laptop/TV time.",
      list: [
        "iPhone: Settings → Screen Time → See All Activity (check \"Total\" daily average)",
        "Android: Settings → Digital Wellbeing → Dashboard (daily screen time at the top)",
      ],
    },
    {
      title: "No stats? Estimate manually",
      body: "Think about a typical weekday and add up:",
      list: [
        "Morning scroll before getting up",
        "Commute, breaks, and lunch",
        "After-work TV, gaming, or social apps",
        "Phone in bed before sleep",
      ],
    },
    {
      title: "Convert minutes to hours",
      body: "Divide total minutes by 60 for hours. Use your 7-day average if your phone shows one — weekends often push the number higher than you expect.",
    },
  ],

  ctas: {
    app: {
      title: "Take back the years you're losing to screens",
      description:
        "Reset tracks your screen time goals, blocks distracting apps, and helps you reclaim hours for sleep, movement, and what actually matters.",
    },
  },

  faq: [
    {
      question: "How are “years over a lifetime” calculated?",
      answer:
        "We multiply your daily screen hours by 80 years and divide by 24 — the fraction of each day on screens, scaled across a lifetime. It's a projection, not a prediction.",
    },
    {
      question: "Should I include TV and laptop time?",
      answer:
        "Yes, for the fullest picture. If you only have phone data, add a rough estimate for other devices — most people underestimate TV and work browsing.",
    },
    {
      question: "Is this medical advice?",
      answer:
        "No. Comparisons about sleep, exercise, and health are for context only. Talk to a healthcare provider about concerns related to screen use or sedentary habits.",
    },
  ],

  recommendations: [],
};
