import {
  INVESTMENT_APP_CTA,
  INVESTMENT_DISCLAIMER,
  sharedInvestmentFields,
} from "./investment-shared";

export const investmentWithdrawalCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "investment-withdrawal-calculator",
  slug: "investment-withdrawal-calculator",
  status: "published" as const,

  seo: {
    title: "Investment Withdrawal Calculator",
    metaDescription:
      "See how long your savings last with fixed monthly withdrawals and a growth assumption. Free drawdown calculator with timeline chart and year-by-year table.",
    primaryKeyword: "how long will my savings last",
    secondaryKeywords: [
      "investment withdrawal calculator",
      "retirement withdrawal calculator",
      "savings drawdown calculator",
      "monthly withdrawal calculator",
      "portfolio depletion calculator",
    ],
    searchIntent: "how-long" as const,
    canonicalPath: "/investment-withdrawal-calculator",
  },

  taxonomy: {
    category: "calculators" as const,
    tags: ["investment", "withdrawal", "retirement", "calculator"],
    cluster: "investment",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Investment Withdrawal Calculator",
    intro:
      "How long until the account runs out? Enter your starting balance, monthly withdrawal, and an expected growth rate — see how long your money lasts with a year-by-year drawdown projection.",
    eyebrow: "Investment",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "projection" as const,
    calculatorProfile: "withdrawal-duration" as const,
    inputs: [
      sharedInvestmentFields.startingBalance,
      sharedInvestmentFields.withdrawalAmount,
      sharedInvestmentFields.annualReturnRate,
    ],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter a starting balance, monthly withdrawal, and growth rate to see how long your money lasts.",
    templates: [
      {
        id: "default",
        showChart: true,
        showTable: true,
        tableVariant: "withdrawal" as const,
        cardColumns: 3 as const,
        cards: [
          {
            title: "Money lasts",
            valueTemplate: "{{projection.withdrawalDurationYears|years}}",
            descriptionTemplate: "Until the balance is depleted",
          },
          {
            title: "Total withdrawn",
            valueTemplate: "{{projection.totalWithdrawn|currency}}",
            descriptionTemplate: "Fixed {{inputs.withdrawal_amount|currency}}/month",
          },
          {
            title: "Growth earned",
            valueTemplate: "{{projection.totalGrowth|currency}}",
            descriptionTemplate: "Compounding while balance remains",
          },
        ],
        summaryTemplates: [
          "Starting with {{inputs.starting_balance|currency}} and withdrawing {{inputs.withdrawal_amount|currency}} per month at {{inputs.annual_return_rate|percent}} annual growth, your balance lasts about {{projection.withdrawalDurationYears|years}} before reaching zero.",
        ],
        comparisonTitle: "Drawdown notes",
        comparisonRules: [
          {
            when: "projection.totalGrowth > 0",
            textTemplate:
              "Compounding added {{projection.totalGrowth|currency}} in growth during the drawdown — without it, the money would run out sooner.",
          },
          {
            when: "inputs.annual_return_rate >= 7",
            textTemplate:
              "Higher growth extends runway — a lower withdrawal or higher return assumption both add time.",
          },
          {
            when: "true",
            textTemplate:
              "Fixed withdrawals ignore inflation, taxes, and fees. Reduce the growth rate or increase withdrawals in the model for a conservative stress test.",
          },
        ],
        fallbackComparison:
          "If the timeline feels short, try a lower monthly withdrawal or model a part-time income source.",
      },
    ],
  },

  guidance: [
    {
      title: "Fixed withdrawal assumption",
      body: "This calculator uses the same dollar amount every month. In real retirement planning, many people increase withdrawals over time to match inflation — that shortens runway compared with this model.",
    },
    {
      title: "Sequence-of-returns risk",
      body: "Bad market years early in retirement deplete balances faster than this smooth average-growth model shows. Use a lower growth rate for a cautious view.",
    },
  ],

  ctas: {
    app: INVESTMENT_APP_CTA,
  },

  faq: [
    {
      question: "How is the timeline calculated?",
      answer:
        "Each month we apply growth to the remaining balance, then subtract your fixed withdrawal. The timeline ends when the balance reaches zero or falls below one cent.",
    },
    {
      question: "What if my money never runs out?",
      answer:
        "If the balance is still positive after 100 years, the calculator shows an error. That usually means withdrawals are small relative to growth — try lowering the growth rate to stress-test.",
    },
    {
      question: "Is this financial advice?",
      answer:
        "No. This is an educational drawdown estimate. It does not recommend a withdrawal rate or retirement strategy.",
    },
  ],

  legalDisclaimer: INVESTMENT_DISCLAIMER,
  recommendations: [],
};
