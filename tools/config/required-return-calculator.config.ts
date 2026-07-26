import {
  INVESTMENT_APP_CTA,
  INVESTMENT_DISCLAIMER,
  INVESTMENT_GOALS_CTA,
  sharedInvestmentFields,
} from "./investment-shared";

export const requiredReturnCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "required-return-calculator",
  slug: "required-return-calculator",
  status: "published" as const,

  seo: {
    title: "Required Return Calculator",
    metaDescription:
      "Find what annual growth rate you need to reach an investment goal. Enter target, starting balance, timeline, and contributions — free calculator with chart and breakdown.",
    primaryKeyword: "required return calculator",
    secondaryKeywords: [
      "what return do I need",
      "investment return needed",
      "rate of return calculator",
      "growth rate to reach goal",
      "annual return calculator",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/required-return-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["investment", "return", "goal", "calculator"],
    cluster: "investment",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Required Return Calculator",
    intro:
      "What annual growth rate closes the gap between today and your goal? Enter your target, timeline, starting balance, and contribution plan to see the required return — then compare it to historical market averages.",
    eyebrow: "Investment",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "projection" as const,
    calculatorProfile: "required-return" as const,
    inputs: [
      sharedInvestmentFields.targetAmount,
      sharedInvestmentFields.startingBalance,
      sharedInvestmentFields.years,
      sharedInvestmentFields.contributionAmount,
      sharedInvestmentFields.contributionFrequency,
      sharedInvestmentFields.contributionTiming,
    ],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your goal, timeline, and savings plan to see the growth rate required.",
    templates: [
      {
        id: "default",
        showChart: true,
        showTable: true,
        cardColumns: 3 as const,
        cards: [
          {
            title: "Required annual growth",
            valueTemplate: "{{projection.requiredReturnRate|percent}}",
            descriptionTemplate: "To reach your goal in {{inputs.years}} years",
          },
          {
            title: "Target amount",
            valueTemplate: "{{inputs.target_amount|currency}}",
            descriptionTemplate: "Goal balance at end of timeline",
          },
          {
            title: "Total growth earned",
            valueTemplate: "{{projection.totalGrowth|currency}}",
            descriptionTemplate: "Compounded earnings over the period",
          },
        ],
        summaryTemplates: [
          "To grow from {{inputs.starting_balance|currency}} to {{inputs.target_amount|currency}} in {{inputs.years}} years with your contribution plan, you need about {{projection.requiredReturnRate|percent}} average annual growth before taxes and fees.",
        ],
        comparisonTitle: "Reality check",
        comparisonRules: [
          {
            when: "projection.requiredReturnRate == 0",
            textTemplate:
              "Your contributions alone reach the goal — no growth required under these assumptions.",
          },
          {
            when: "projection.requiredReturnRate <= 7",
            textTemplate:
              "A {{projection.requiredReturnRate|percent}} required return is within the range often cited for long-term diversified stock-market history — still not guaranteed.",
          },
          {
            when: "projection.requiredReturnRate > 10",
            textTemplate:
              "Requiring more than 10% annual growth is aggressive. Consider more time, higher contributions, or a lower target.",
          },
        ],
        fallbackComparison:
          "Compare the required rate to your actual portfolio mix — bonds and cash typically grow slower than equities.",
      },
    ],
  },

  guidance: [
    {
      title: "How to read the result",
      body: "The required return is the average annual growth needed on your combined balance and contributions. Real markets vary year to year — this is a planning average, not a prediction.",
    },
    {
      title: "If the rate seems too high",
      body: "Adjust one lever at a time:",
      list: [
        "Add more years to the timeline",
        "Increase contribution amount",
        "Lower the target for a nearer milestone",
        "Boost starting balance with a one-time deposit",
      ],
    },
  ],

  ctas: {
    app: INVESTMENT_APP_CTA,
    goals: INVESTMENT_GOALS_CTA,
  },

  faq: [
    {
      question: "Does this account for taxes or fees?",
      answer:
        "No. The required return is pre-tax and excludes account fees, fund expenses, and inflation. Reduce the growth assumption manually for a conservative view.",
    },
    {
      question: "What if contributions alone hit the goal?",
      answer:
        "The required growth rate shows 0% — your deposits reach the target without compounded earnings on the balance.",
    },
    {
      question: "Is this financial advice?",
      answer:
        "No. This is an educational calculator. It does not tell you what to buy, sell, or expect from any investment.",
    },
  ],

  legalDisclaimer: INVESTMENT_DISCLAIMER,
  recommendations: [],
};
