import {
  INVESTMENT_APP_CTA,
  INVESTMENT_DISCLAIMER,
  SAVINGS_GOAL_NEXT_CTA,
  sharedInvestmentFields,
} from "./investment-shared";

export const savingsGoalCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "savings-goal-calculator",
  slug: "savings-goal-calculator",
  status: "published" as const,

  seo: {
    title: "Savings Goal Calculator",
    metaDescription:
      "Find how much you need to save each month or year to reach a target investment balance. Free calculator with contribution schedule, growth assumptions, chart, and table.",
    primaryKeyword: "savings goal calculator",
    secondaryKeywords: [
      "how much to save to reach goal",
      "investment goal calculator",
      "monthly savings calculator",
      "target amount calculator",
      "how much should I save",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/savings-goal-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["investment", "savings", "goal", "calculator"],
    cluster: "investment",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Savings Goal Calculator",
    intro:
      "Work backwards from a target balance. Enter your goal, starting amount, timeline, and growth assumption — get the contribution amount required on your chosen schedule.",
    eyebrow: "Investment",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "projection" as const,
    calculatorProfile: "savings-goal" as const,
    inputs: [
      sharedInvestmentFields.targetAmount,
      sharedInvestmentFields.startingBalance,
      sharedInvestmentFields.annualReturnRate,
      sharedInvestmentFields.years,
      sharedInvestmentFields.contributionFrequency,
      sharedInvestmentFields.contributionTiming,
    ],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter a target amount, timeline, and growth assumptions to see the required contribution.",
    templates: [
      {
        id: "default",
        showChart: true,
        showTable: true,
        cardColumns: 3 as const,
        cards: [
          {
            title: "Required contribution",
            valueTemplate: "{{projection.requiredContribution|currencyPrecise}}",
            descriptionTemplate: "Per {{inputs.contribution_frequency}} period to hit your goal",
          },
          {
            title: "Target amount",
            valueTemplate: "{{inputs.target_amount|currency}}",
            descriptionTemplate: "Goal balance at the end of the timeline",
          },
          {
            title: "Total you'll contribute",
            valueTemplate: "{{projection.totalContributions|currency}}",
            descriptionTemplate: "Excluding starting balance",
          },
        ],
        summaryTemplates: [
          "To reach {{inputs.target_amount|currency}} in {{inputs.years}} years, save {{projection.requiredContribution|currencyPrecise}} each {{inputs.contribution_frequency}} period (assuming {{inputs.annual_return_rate|percent}} annual growth). Compounding provides the rest.",
        ],
        comparisonTitle: "Goal planning notes",
        comparisonRules: [
          {
            when: "projection.requiredContribution == 0",
            textTemplate:
              "Your starting balance already meets the target — no additional contributions required under these assumptions.",
          },
          {
            when: "projection.totalGrowth > 0",
            textTemplate:
              "Compounding contributes {{projection.totalGrowth|currency}} toward your goal — you don't have to save every dollar yourself.",
          },
          {
            when: "inputs.years >= 15",
            textTemplate:
              "Longer timelines reduce the required contribution because growth has more time to work.",
          },
        ],
        fallbackComparison:
          "If the required amount feels high, try extending the timeline, increasing your starting balance, or revisiting the growth assumption.",
      },
    ],
  },

  guidance: [
    {
      title: "Pick a realistic target",
      body: "Use a specific dollar goal — emergency fund, down payment, or retirement milestone. Round numbers are fine for planning.",
    },
    {
      title: "If the result feels too high",
      body: "Try these levers:",
      list: [
        "Add more years to the timeline",
        "Increase starting balance with a one-time boost",
        "Switch from end-of-period to beginning-of-period contributions",
        "Use a lower target for a first milestone",
      ],
    },
  ],

  ctas: {
    app: INVESTMENT_APP_CTA,
    goals: SAVINGS_GOAL_NEXT_CTA,
  },

  faq: [
    {
      question: "How is the required contribution calculated?",
      answer:
        "We search for the contribution amount that brings your projected ending balance to your target, given your starting balance, growth rate, timeline, and contribution schedule.",
    },
    {
      question: "Which contribution schedule should I use?",
      answer:
        "Match the tool to how you actually save — monthly for most automatic transfers, annually for bonus-only saving, quarterly for irregular but periodic deposits.",
    },
    {
      question: "Can I reach the goal with no growth?",
      answer:
        "Set the growth rate to 0% to see the pure savings math. Any positive growth rate reduces the amount you need to contribute yourself.",
    },
  ],

  legalDisclaimer: INVESTMENT_DISCLAIMER,
  recommendations: [],
};
