import {
  INVESTMENT_APP_CTA,
  INVESTMENT_DISCLAIMER,
  sharedInvestmentFields,
} from "./investment-shared";

export const compoundGrowthCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "compound-growth-calculator",
  slug: "compound-growth-calculator",
  status: "published" as const,

  seo: {
    title: "Compound Growth Calculator",
    metaDescription:
      "See how a lump sum grows with compounding over time. Enter starting balance, annual growth rate, years, and compounding schedule — free projection with chart and year-by-year table.",
    primaryKeyword: "compound growth calculator",
    secondaryKeywords: [
      "compound growth",
      "investment growth calculator",
      "compounding calculator",
      "lump sum growth",
      "future value calculator",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/compound-growth-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["investment", "compounding", "growth", "calculator"],
    cluster: "investment",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Compound Growth Calculator",
    intro:
      "See how a starting balance grows when earnings are reinvested and compounded over time. Adjust growth rate, timeline, and compounding schedule to compare scenarios.",
    icon: "chart",
    proseTitle: "About compounding",
    sections: [
      {
        id: "problem",
        heading: "Why lump sums are hard to intuit",
        framework: "pas",
        body: "A 7% annual return doesn't feel dramatic year one — but over decades, reinvested earnings dominate the final balance. Without running the numbers, it's easy to underestimate time or overestimate short-term swings.",
      },
      {
        id: "concept",
        heading: "Compound growth explained",
        framework: "concept",
        body: "Compounding means each period's growth applies to prior earnings too — not just the original deposit. Frequency (monthly vs annual) and timeline both change the curve materially.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Projected ending balance, growth breakdown, chart, and year-by-year table — compare rates, timelines, and compounding schedules side by side.",
      },
    ],
    eyebrow: "Investment",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "projection" as const,
    calculatorProfile: "compound-growth" as const,
    inputs: [
      sharedInvestmentFields.startingBalance,
      sharedInvestmentFields.annualReturnRate,
      sharedInvestmentFields.years,
      sharedInvestmentFields.compoundingFrequency,
    ],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter a starting balance, growth rate, and timeline to see compounded growth.",
    templates: [
      {
        id: "default",
        showChart: true,
        showTable: true,
        cardColumns: 3 as const,
        cards: [
          {
            title: "Ending balance",
            valueTemplate: "{{projection.finalBalance|currency}}",
            descriptionTemplate: "After {{inputs.years}} years of compounding",
          },
          {
            title: "Total growth",
            valueTemplate: "{{projection.totalGrowth|currency}}",
            descriptionTemplate: "Earnings reinvested over the full period",
          },
          {
            title: "Effective annual growth",
            valueTemplate: "{{projection.effectiveAnnualGrowthRate|percent}}",
            descriptionTemplate: "Average annualized growth on the starting balance",
          },
        ],
        summaryTemplates: [
          "{{inputs.starting_balance|currency}} growing at {{inputs.annual_return_rate|percent}} per year with {{inputs.compounding_frequency}} compounding becomes {{projection.finalBalance|currency}} after {{inputs.years}} years.",
        ],
        comparisonTitle: "Compounding insights",
        comparisonRules: [
          {
            when: "projection.totalGrowth >= inputs.starting_balance",
            textTemplate:
              "Your balance more than doubles from growth alone — compounding accelerates as the base gets larger.",
          },
          {
            when: "inputs.compounding_frequency == \"monthly\"",
            textTemplate:
              "Monthly compounding adds slightly more growth than annual compounding at the same stated rate.",
          },
          {
            when: "inputs.years >= 20",
            textTemplate:
              "Long timelines amplify compounding — most growth often arrives in the later years.",
          },
        ],
        fallbackComparison:
          "Small differences in rate or compounding schedule compound into large gaps over time.",
      },
    ],
  },

  guidance: [
    {
      title: "Choosing a growth rate",
      body: "This tool uses a fixed annual growth assumption. Historical stock-market averages are often cited around 7–10% before inflation, but future results vary widely.",
      list: [
        "Conservative planning: 4–5%",
        "Moderate planning: 6–7%",
        "Aggressive planning: 8–10%",
      ],
    },
    {
      title: "Compounding schedule",
      body: "More frequent compounding (e.g. monthly vs annually) produces a slightly higher ending balance at the same nominal annual rate because earnings are reinvested sooner.",
    },
  ],

  ctas: {
    app: INVESTMENT_APP_CTA,
  },

  faq: [
    {
      question: "What is compound growth?",
      answer:
        "Compound growth means your balance increases on both the original amount and on prior earnings that stay invested. Each compounding period adds growth to a larger base, so the curve accelerates over long timelines.",
    },
    {
      question: "Does compounding frequency matter?",
      answer:
        "Yes, at the same stated annual rate, more frequent compounding (daily or monthly) produces a slightly higher ending balance than annual compounding because earnings are reinvested sooner.",
    },
    {
      question: "Is this financial advice?",
      answer:
        "No. This calculator shows math-based estimates for education. It does not recommend any investment, account, or strategy.",
    },
  ],

  legalDisclaimer: INVESTMENT_DISCLAIMER,
  recommendations: [],
};
