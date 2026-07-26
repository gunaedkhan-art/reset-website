import {
  INVESTMENT_APP_CTA,
  INVESTMENT_DISCLAIMER,
  INVESTMENT_GOALS_CTA,
  sharedInvestmentFields,
} from "./investment-shared";

export const investmentDoublingCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "investment-doubling-calculator",
  slug: "investment-doubling-calculator",
  status: "published" as const,

  seo: {
    title: "Investment Doubling Calculator",
    metaDescription:
      "Find how long it takes to double your investment at a given growth rate. Compare exact compounding math to the Rule of 72 — free calculator with chart and breakdown.",
    primaryKeyword: "investment doubling calculator",
    secondaryKeywords: [
      "rule of 72 calculator",
      "how long to double money",
      "doubling time calculator",
      "when will my investment double",
      "compound growth doubling",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/investment-doubling-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["investment", "doubling", "rule-of-72", "calculator"],
    cluster: "investment",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Investment Doubling Calculator",
    intro:
      "How long until your money doubles? Enter a starting balance and expected annual growth rate — see the exact compounding timeline and compare it to the quick Rule of 72 estimate.",
    eyebrow: "Investment",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "projection" as const,
    calculatorProfile: "doubling-time" as const,
    inputs: [
      sharedInvestmentFields.startingBalance,
      sharedInvestmentFields.annualReturnRate,
    ],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter a starting balance and growth rate above 0% to see doubling time.",
    templates: [
      {
        id: "default",
        showChart: true,
        showTable: true,
        cardColumns: 3 as const,
        cards: [
          {
            title: "Exact doubling time",
            valueTemplate: "{{projection.doublingTimeExact|years}}",
            descriptionTemplate: "Precise compounding math",
          },
          {
            title: "Rule of 72 estimate",
            valueTemplate: "{{projection.ruleOf72Estimate|years}}",
            descriptionTemplate: "Quick mental-math shortcut",
          },
          {
            title: "Balance when doubled",
            valueTemplate: "{{projection.balanceAtDouble|currency}}",
            descriptionTemplate: "From {{inputs.starting_balance|currency}} today",
          },
        ],
        summaryTemplates: [
          "At {{inputs.annual_return_rate|percent}} annual growth, {{inputs.starting_balance|currency}} doubles to {{projection.balanceAtDouble|currency}} in about {{projection.doublingTimeExact|years}}. The Rule of 72 suggests {{projection.ruleOf72Estimate|years}} — a {{projection.ruleOf72Difference|decimal1}} year difference.",
        ],
        comparisonTitle: "Doubling insights",
        comparisonRules: [
          {
            when: "projection.ruleOf72Difference <= 1",
            textTemplate:
              "The Rule of 72 is close here — within about a year of the exact answer at {{inputs.annual_return_rate|percent}} growth.",
          },
          {
            when: "inputs.annual_return_rate >= 7",
            textTemplate:
              "At {{inputs.annual_return_rate|percent}} growth, money doubles roughly every {{projection.doublingTimeExact|years}} — compounding accelerates each cycle.",
          },
          {
            when: "inputs.annual_return_rate < 4",
            textTemplate:
              "Lower growth rates mean longer doubling times — patience and consistent contributions matter more.",
          },
        ],
        fallbackComparison:
          "Each time your balance doubles, the next doubling adds the same dollar gain in less time if the rate stays constant.",
      },
    ],
  },

  guidance: [
    {
      title: "What is the Rule of 72?",
      body: "Divide 72 by your annual growth rate to estimate years to double. Example: at 8% growth, 72 ÷ 8 ≈ 9 years. It is a shortcut — the exact compounding formula above is more precise.",
    },
    {
      title: "Growth rate must be above zero",
      body: "With 0% growth, a balance never doubles on its own. Add contributions using the Investment Growth or Savings Goal calculators instead.",
    },
  ],

  ctas: {
    app: INVESTMENT_APP_CTA,
    goals: INVESTMENT_GOALS_CTA,
  },

  faq: [
    {
      question: "How is exact doubling time calculated?",
      answer:
        "We use the compound growth formula: years = log(2) ÷ log(1 + rate). The chart shows your balance growing toward twice the starting amount.",
    },
    {
      question: "Why does the Rule of 72 differ from the exact answer?",
      answer:
        "The Rule of 72 is a linear approximation. It works best for growth rates between about 5% and 12%. Outside that range, the gap widens.",
    },
    {
      question: "Is this financial advice?",
      answer:
        "No. This calculator is for educational estimates only and does not predict or recommend any investment outcome.",
    },
  ],

  legalDisclaimer: INVESTMENT_DISCLAIMER,
  recommendations: [],
};
