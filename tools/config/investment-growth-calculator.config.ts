import {
  INVESTMENT_APP_CTA,
  INVESTMENT_DISCLAIMER,
  sharedInvestmentFields,
} from "./investment-shared";

export const investmentGrowthCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "investment-growth-calculator",
  slug: "investment-growth-calculator",
  status: "published" as const,

  seo: {
    title: "Investment Growth Calculator",
    metaDescription:
      "Project how much your investment could grow with starting balance, contributions, annual return, and timeline. Free calculator with summary, chart, and year-by-year table.",
    primaryKeyword: "investment growth calculator",
    secondaryKeywords: [
      "how much will my investment grow",
      "investment return calculator",
      "portfolio growth calculator",
      "future value with contributions",
      "savings growth calculator",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/investment-growth-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["investment", "growth", "contributions", "calculator"],
    cluster: "investment",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Investment Growth Calculator",
    intro:
      "Estimate how much you could have in the future based on what you start with today, how much you add on a schedule, and an expected annual growth rate.",
    icon: "coin",
    proseTitle: "About this calculator",
    sections: [
      {
        id: "problem",
        heading: "Why guessing isn't enough",
        framework: "pas",
        body: "\"Save more\" and \"invest for the long term\" are easy to say and hard to picture. Without numbers, it's unclear whether small contribution changes or a few extra years matter more.",
      },
      {
        id: "concept",
        heading: "How compounding works",
        framework: "concept",
        body: "This calculator models monthly contributions plus compounded growth on your balance. Time and consistency typically matter as much as rate — especially when contributions continue through market ups and downs.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Projected ending balance, total contributions, growth from earnings, a chart, and a year-by-year table you can adjust with different assumptions.",
        list: [
          "Compare beginning vs end-of-period contribution timing",
          "Stress-test with conservative vs optimistic growth rates",
          "See when compounding exceeds what you deposited",
        ],
      },
    ],
    eyebrow: "Investment",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "projection" as const,
    calculatorProfile: "future-value" as const,
    inputs: [
      sharedInvestmentFields.startingBalance,
      sharedInvestmentFields.annualReturnRate,
      sharedInvestmentFields.years,
      sharedInvestmentFields.contributionAmount,
      sharedInvestmentFields.contributionFrequency,
      sharedInvestmentFields.contributionTiming,
    ],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your starting balance, growth assumptions, and contribution schedule to project future value.",
    templates: [
      {
        id: "default",
        showChart: true,
        showTable: true,
        cardColumns: 4 as const,
        cards: [
          {
            title: "Projected balance",
            valueTemplate: "{{projection.finalBalance|currency}}",
            descriptionTemplate: "Estimated ending value",
          },
          {
            title: "Total contributions",
            valueTemplate: "{{projection.totalContributions|currency}}",
            descriptionTemplate: "Money you added over the period",
          },
          {
            title: "Growth from earnings",
            valueTemplate: "{{projection.totalGrowth|currency}}",
            descriptionTemplate: "Compounded growth on balance + contributions",
          },
          {
            title: "Growth share",
            valueTemplate: "{{projection.effectiveAnnualGrowthRate|percent}}",
            descriptionTemplate: "Effective annualized growth rate",
          },
        ],
        summaryTemplates: [
          "You contribute {{projection.totalContributions|currency}} over {{inputs.years}} years. Compounding adds {{projection.totalGrowth|currency}} in growth for a projected total of {{projection.finalBalance|currency}}.",
        ],
        comparisonTitle: "Growth breakdown",
        comparisonRules: [
          {
            when: "projection.totalGrowth > projection.totalContributions",
            textTemplate:
              "Growth from compounding ({{projection.totalGrowth|currency}}) exceeds what you contributed — time in the market amplified your deposits.",
          },
          {
            when: "inputs.contribution_timing == \"beginning\"",
            textTemplate:
              "Contributions at the beginning of each period get slightly more time to compound than end-of-period deposits.",
          },
          {
            when: "inputs.contribution_frequency == \"monthly\"",
            textTemplate:
              "Monthly contributions smooth your path — you buy growth across many periods instead of one lump sum each year.",
          },
        ],
        fallbackComparison:
          "Your ending balance is the sum of contributions plus compounded growth on everything that stayed invested.",
      },
    ],
  },

  guidance: [
    {
      title: "Contribution timing",
      body: "Beginning-of-period contributions get an extra compounding period compared with end-of-period deposits. The difference is usually modest but adds up over decades.",
    },
    {
      title: "Estimate your growth rate",
      body: "Use a rate that matches your mix of assets and planning style. Lower rates stress-test the plan; higher rates show an optimistic scenario.",
    },
  ],

  ctas: {
    app: INVESTMENT_APP_CTA,
  },

  faq: [
    {
      question: "How is the projected balance calculated?",
      answer:
        "We simulate each month: apply scheduled contributions (beginning or end of period), then apply monthly growth based on your annual rate. Yearly rows summarize balance, contributions, and growth.",
    },
    {
      question: "What if I skip contributions some months?",
      answer:
        "This calculator assumes every scheduled contribution happens on time. For irregular saving, run a lower contribution amount or shorter timeline to approximate a conservative case.",
    },
    {
      question: "Does this include fees or taxes?",
      answer:
        "No. Results are pre-tax and exclude account fees, inflation, and transaction costs unless you adjust the growth rate downward yourself.",
    },
  ],

  legalDisclaimer: INVESTMENT_DISCLAIMER,
  recommendations: [],
};
