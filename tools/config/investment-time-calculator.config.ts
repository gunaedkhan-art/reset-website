import {
  INVESTMENT_APP_CTA,
  INVESTMENT_DISCLAIMER,
  sharedInvestmentFields,
} from "./investment-shared";

export const investmentTimeCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "investment-time-calculator",
  slug: "investment-time-calculator",
  status: "published" as const,

  seo: {
    title: "Investment Time Calculator",
    metaDescription:
      "Find how long it takes to reach your investment goal. Enter target amount, starting balance, contributions, and growth rate — free timeline projection with chart and table.",
    primaryKeyword: "how long to reach investment goal",
    secondaryKeywords: [
      "investment time calculator",
      "years to reach savings goal",
      "how long to save for goal",
      "time to reach target amount",
      "investment timeline calculator",
    ],
    searchIntent: "how-long" as const,
    canonicalPath: "/investment-time-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["investment", "timeline", "goal", "calculator"],
    cluster: "investment",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Investment Time Calculator",
    intro:
      "Enter your goal, current balance, contribution plan, and growth assumption — see how long until you get there.",
    icon: "chart",
    proseTitle: "About time to goal",
    sections: [
      {
        id: "problem",
        heading: "When will I actually hit the number?",
        framework: "pas",
        body: "You're saving consistently but the finish line feels fuzzy — is it five years or twenty? Without a timeline, it's hard to adjust contributions or expectations.",
      },
      {
        id: "concept",
        heading: "Time, rate, and contributions trade off",
        framework: "concept",
        body: "The same goal arrives sooner with higher contributions, higher growth assumptions, or a lower target. This calculator shows the timeline implied by your current plan.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Years and months to reach your target, final projected balance, and a year-by-year table to stress-test assumptions.",
      },
    ],
    eyebrow: "Investment",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "projection" as const,
    calculatorProfile: "time-to-goal" as const,
    inputs: [
      sharedInvestmentFields.targetAmount,
      sharedInvestmentFields.startingBalance,
      sharedInvestmentFields.annualReturnRate,
      sharedInvestmentFields.contributionAmount,
      sharedInvestmentFields.contributionFrequency,
      sharedInvestmentFields.contributionTiming,
    ],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter a target, starting balance, and contribution plan to see how long it takes to get there.",
    templates: [
      {
        id: "default",
        showChart: true,
        showTable: true,
        cardColumns: 3 as const,
        cards: [
          {
            title: "Time to reach goal",
            valueTemplate: "{{projection.requiredYears|years}}",
            descriptionTemplate: "At {{inputs.annual_return_rate|percent}} annual growth",
          },
          {
            title: "Target amount",
            valueTemplate: "{{inputs.target_amount|currency}}",
            descriptionTemplate: "Your goal balance",
          },
          {
            title: "Projected ending balance",
            valueTemplate: "{{projection.finalBalance|currency}}",
            descriptionTemplate: "At the end of the timeline",
          },
        ],
        summaryTemplates: [
          "Reaching {{inputs.target_amount|currency}} takes about {{projection.requiredYears|years}} with {{inputs.starting_balance|currency}} today, {{inputs.contribution_amount|currency}} {{inputs.contribution_frequency}} contributions, and {{inputs.annual_return_rate|percent}} assumed annual growth.",
        ],
        comparisonTitle: "Timeline insights",
        comparisonRules: [
          {
            when: "projection.requiredYears == 0",
            textTemplate:
              "Your starting balance already meets the target — no additional time needed under these assumptions.",
          },
          {
            when: "projection.totalGrowth > projection.totalContributions",
            textTemplate:
              "Compounding adds {{projection.totalGrowth|currency}} in growth over the timeline — about {{projection.requiredYears|years}} of patience pays off.",
          },
          {
            when: "inputs.contribution_frequency == \"monthly\"",
            textTemplate:
              "Steady monthly contributions shorten the timeline compared with saving in sporadic lump sums.",
          },
        ],
        fallbackComparison:
          "Small increases in contributions or growth assumptions can shave years off the timeline.",
      },
    ],
  },

  guidance: [
    {
      title: "When the timeline feels long",
      body: "Try these levers in the calculator:",
      list: [
        "Increase contribution amount or frequency",
        "Add a higher starting balance",
        "Use a lower target for a first milestone",
        "Extend is not an option here — this tool solves for time",
      ],
    },
    {
      title: "Growth rate assumptions",
      body: "Use a rate that matches your planning style. Lower rates show a conservative timeline; higher rates show an optimistic one. Neither is guaranteed.",
    },
  ],

  ctas: {
    app: INVESTMENT_APP_CTA,
  },

  faq: [
    {
      question: "How is the timeline calculated?",
      answer:
        "We search for the number of years where your projected ending balance meets or exceeds the target, given starting balance, contributions, and growth assumptions. The simulation runs month-by-month.",
    },
    {
      question: "What if my goal is unreachable?",
      answer:
        "If contributions and growth cannot reach the target within 100 years, the calculator shows an error. Try a lower target, higher contributions, or a higher growth assumption.",
    },
    {
      question: "Is this financial advice?",
      answer:
        "No. This tool estimates timelines for education. It does not recommend any investment strategy or product.",
    },
  ],

  legalDisclaimer: INVESTMENT_DISCLAIMER,
  recommendations: [],
};
