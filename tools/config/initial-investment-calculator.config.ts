import {
  INVESTMENT_APP_CTA,
  INVESTMENT_DISCLAIMER,
  INVESTMENT_GOALS_CTA,
  sharedInvestmentFields,
} from "./investment-shared";

export const initialInvestmentCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "initial-investment-calculator",
  slug: "initial-investment-calculator",
  status: "published" as const,

  seo: {
    title: "Initial Investment Calculator",
    metaDescription:
      "Find how much you need to invest upfront to reach a goal. Enter target amount, timeline, contributions, and growth rate — free lump-sum calculator with chart and table.",
    primaryKeyword: "how much to invest initially",
    secondaryKeywords: [
      "initial investment calculator",
      "lump sum needed for goal",
      "starting amount calculator",
      "how much to start investing",
      "upfront investment calculator",
    ],
    searchIntent: "how-much" as const,
    canonicalPath: "/initial-investment-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["investment", "lump-sum", "goal", "calculator"],
    cluster: "investment",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Initial Investment Calculator",
    intro:
      "How much do you need to put in today? Enter your goal, timeline, future contributions, and growth assumption — get the upfront amount required to hit your target.",
    eyebrow: "Investment",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "projection" as const,
    calculatorProfile: "initial-investment" as const,
    inputs: [
      sharedInvestmentFields.targetAmount,
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
      "Enter your goal, timeline, and contribution plan to see the required starting amount.",
    templates: [
      {
        id: "default",
        showChart: true,
        showTable: true,
        cardColumns: 3 as const,
        cards: [
          {
            title: "Required starting amount",
            valueTemplate: "{{projection.requiredStartingBalance|currency}}",
            descriptionTemplate: "Lump sum needed today",
          },
          {
            title: "Target amount",
            valueTemplate: "{{inputs.target_amount|currency}}",
            descriptionTemplate: "Goal at end of {{inputs.years}} years",
          },
          {
            title: "Growth from compounding",
            valueTemplate: "{{projection.totalGrowth|currency}}",
            descriptionTemplate: "Earnings reinvested over the timeline",
          },
        ],
        summaryTemplates: [
          "You need {{projection.requiredStartingBalance|currency}} today, plus {{projection.totalContributions|currency}} in scheduled contributions over {{inputs.years}} years, to reach {{inputs.target_amount|currency}} at {{inputs.annual_return_rate|percent}} annual growth.",
        ],
        comparisonTitle: "Planning notes",
        comparisonRules: [
          {
            when: "projection.requiredStartingBalance == 0",
            textTemplate:
              "Your planned contributions alone reach the goal — no upfront lump sum required under these assumptions.",
          },
          {
            when: "projection.totalGrowth > 0",
            textTemplate:
              "Compounding contributes {{projection.totalGrowth|currency}} — you do not need to save every dollar of the target yourself.",
          },
          {
            when: "inputs.years >= 15",
            textTemplate:
              "Longer timelines reduce the upfront amount needed because contributions and compounding have more time to work.",
          },
        ],
        fallbackComparison:
          "Compare this lump sum to cash on hand — then decide how much to deploy now versus add over time.",
      },
    ],
  },

  guidance: [
    {
      title: "Lump sum vs dollar-cost averaging",
      body: "This calculator finds the upfront amount that closes the gap when combined with your future contribution plan. You can still add money gradually — this shows the equivalent starting balance needed today.",
    },
    {
      title: "Emergency fund first",
      body: "Before committing a large lump sum, many planners suggest keeping separate cash for emergencies. This tool does not model liquidity needs.",
    },
  ],

  ctas: {
    app: INVESTMENT_APP_CTA,
    goals: INVESTMENT_GOALS_CTA,
  },

  faq: [
    {
      question: "How is the starting amount calculated?",
      answer:
        "We find the lump sum that, combined with your scheduled contributions and growth assumption, reaches the target at the end of the timeline.",
    },
    {
      question: "What if I already have some savings?",
      answer:
        "Use the Savings Goal or Investment Time calculators instead — this tool assumes you are solving for the full upfront amount with no existing balance.",
    },
    {
      question: "Is this financial advice?",
      answer:
        "No. This calculator is for educational estimates only and does not recommend any investment action.",
    },
  ],

  legalDisclaimer: INVESTMENT_DISCLAIMER,
  recommendations: [],
};
