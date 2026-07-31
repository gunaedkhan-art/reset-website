export const procrastinationCostCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "procrastination-cost-calculator",
  slug: "procrastination-cost-calculator",
  status: "published" as const,

  seo: {
    title: "Procrastination Cost Calculator",
    metaDescription:
      "Find out how much procrastination actually costs you — in dollars per week and over a full year — based on your salary and lost work hours.",
    primaryKeyword: "procrastination cost",
    secondaryKeywords: [
      "cost of procrastination",
      "productivity calculator",
      "salary calculator",
      "opportunity cost",
      "time is money",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/procrastination-cost-calculator",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["procrastination", "salary", "opportunity-cost"],
    cluster: "procrastination",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Procrastination Cost Calculator",
    intro:
      "Find out how much procrastination costs you — in dollars per week and over a full year — based on your salary and lost work hours.",
    icon: "calculator",
    proseTitle: "About this calculator",
    sections: [
      {
        id: "problem",
        heading: "Procrastination feels free until you run the math",
        framework: "pas",
        body: "An hour avoided doesn't show up on a receipt — but it shows up in salary, deadlines, and stress. Without a number, delay feels abstract and easy to repeat.",
      },
      {
        id: "agitation",
        heading: "Opportunity cost is real",
        framework: "pas",
        body: "Every procrastinated hour is an hour not spent on high-value work, rest, or relationships. Quantifying the cost turns vague guilt into a decision you can act on.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "aida",
        body: "Weekly and annual dollar cost from lost hours at your salary — a concrete reason to fix the trigger, not just feel bad about it.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "annual_salary",
        type: "number" as const,
        label: "Annual salary (before tax)",
        placeholder: "e.g. 75000",
        hint: "Gross salary — pre-tax, before bonuses if you want a simple baseline.",
        min: 0,
        step: 1000,
        required: true,
      },
      {
        id: "hours_per_week",
        type: "number" as const,
        label: "Procrastination hours per work week",
        placeholder: "e.g. 5",
        hint: "Honest average across a typical week — not your best day.",
        min: 0,
        max: 40,
        step: 0.5,
        required: true,
      },
    ],
    constants: {
      ANNUAL_WORK_HOURS: 2080,
      WEEKS_PER_YEAR: 52,
      NETFLIX_ANNUAL: 180,
      GYM_ANNUAL: 600,
      COURSE_COST: 500,
      FLIGHT_COST: 800,
      RENT_MONTHLY: 1500,
      COFFEE_ANNUAL: 1250,
    },
    expressions: {
      hourlyRate: "inputs.annual_salary / constants.ANNUAL_WORK_HOURS",
      moneyLostPerWeek: "calcs.hourlyRate * inputs.hours_per_week",
      annualImpact: "calcs.moneyLostPerWeek * constants.WEEKS_PER_YEAR",
      netflixYears: "floor(calcs.annualImpact / constants.NETFLIX_ANNUAL)",
      gymMultiplier: "calcs.annualImpact / constants.GYM_ANNUAL",
      courseCount: "floor(calcs.annualImpact / constants.COURSE_COST)",
      flightCount: "floor(calcs.annualImpact / constants.FLIGHT_COST)",
      rentMonths: "calcs.annualImpact / constants.RENT_MONTHLY",
      twoHourCost: "calcs.hourlyRate * 2",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your salary and weekly procrastination hours to see what it's costing you.",
    templates: [
      {
        id: "default",
        cards: [
          {
            title: "Money lost per week",
            valueTemplate: "{{calcs.moneyLostPerWeek|currency}}",
            descriptionTemplate:
              "{{inputs.hours_per_week}} hrs × {{calcs.hourlyRate|currencyPrecise}}/hr",
          },
          {
            title: "Annual impact",
            valueTemplate: "{{calcs.annualImpact|currency}}",
            descriptionTemplate: "Projected cost over 52 weeks at this rate",
          },
        ],
        summaryTemplates: [
          "Your effective rate: {{calcs.hourlyRate|currencyPrecise}}/hour (based on {{inputs.annual_salary|currency}} ÷ 2,080 work hours)",
        ],
        comparisonTitle: "Opportunity cost",
        comparisonRules: [
          {
            when: "calcs.annualImpact >= constants.NETFLIX_ANNUAL",
            textTemplate:
              "That's {{calcs.netflixYears}} year(s) of a typical streaming subscription (~$180/yr).",
          },
          {
            when: "calcs.annualImpact >= constants.GYM_ANNUAL",
            textTemplate:
              "Enough to cover {{calcs.gymMultiplier|decimal1}}× a mid-range gym membership (~$600/yr).",
          },
          {
            when: "calcs.annualImpact >= constants.COURSE_COST",
            textTemplate:
              "You could fund {{calcs.courseCount}} online course(s) or certification(s) at ~$500 each.",
          },
          {
            when: "calcs.annualImpact >= constants.FLIGHT_COST",
            textTemplate:
              "Roughly {{calcs.flightCount}} round-trip flight(s) (~$800 each) you're not taking.",
          },
          {
            when: "calcs.annualImpact >= constants.RENT_MONTHLY",
            textTemplate:
              "About {{calcs.rentMonths|decimal1}} month(s) of rent at $1,500/mo — real money leaving your life.",
          },
          {
            when: "calcs.annualImpact >= constants.COFFEE_ANNUAL",
            textTemplate:
              "More than a year of daily $5 coffees on workdays (~$1,250/yr).",
          },
          {
            when: "calcs.hourlyRate >= 25 && calcs.moneyLostPerWeek >= 100",
            textTemplate:
              "Every wasted hour costs you {{calcs.hourlyRate|currency}} — a single 2-hour rabbit hole is {{calcs.twoHourCost|currency}} gone.",
          },
          {
            when: "calcs.annualImpact >= 5000",
            textTemplate:
              "Invested at a modest return, {{calcs.annualImpact|currency}}/yr could grow into a serious retirement cushion over a decade.",
          },
        ],
        fallbackComparison:
          "Even {{calcs.moneyLostPerWeek|currency}}/week adds up — small leaks sink big ships over a career.",
      },
    ],
  },

  guidance: [
    {
      title: "Not sure how many hours? Try this",
      body: "Pick one ordinary workday and add up the time you weren't doing meaningful work:",
      list: [
        "Social media or news at your desk",
        "Staring at a task without starting",
        "Extra-long breaks or \"quick\" errands",
        "Meetings where you tuned out",
        "Busywork that avoided the hard thing",
      ],
    },
    {
      title: "Estimate your weekly total",
      body: "Total those minutes, multiply by 5 for a work week, then round to the nearest half hour. Most people underestimate — if you're between two numbers, pick the higher one.",
    },
  ],

  ctas: {
    app: {
      title: "Stop paying the procrastination tax",
      description:
        "Reset helps you start hard tasks, block distractions, and protect focused work hours — so your salary actually reflects your time.",
    },
  },

  faq: [
    {
      question: "How is the hourly rate calculated?",
      answer:
        "We divide your annual salary by 2,080 — the standard full-time benchmark (40 hours × 52 weeks). Your money lost per week is that rate multiplied by the hours you procrastinate each work week.",
    },
    {
      question: "Should I use gross or net salary?",
      answer:
        "Use gross (pre-tax) salary for consistency with how compensation is usually discussed. The goal is to show the opportunity cost of your time, not your exact take-home pay.",
    },
    {
      question: "What if my hours vary week to week?",
      answer:
        "Estimate an honest weekly average over the past month. One heavy procrastination week and one light week? Split the difference. Consistency matters more than precision.",
    },
  ],

  recommendations: [],
};
