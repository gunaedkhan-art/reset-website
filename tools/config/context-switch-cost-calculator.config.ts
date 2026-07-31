import { ENGINE_CONSTANTS } from "./constants";

export const contextSwitchCostCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "context-switch-cost-calculator",
  slug: "context-switch-cost-calculator",
  status: "published" as const,

  seo: {
    title: "Context Switch Cost Calculator",
    metaDescription:
      "Calculate how much time you lose to context switching — tab hops, task changes, and refocus time add up to hours every week.",
    primaryKeyword: "context switching cost",
    secondaryKeywords: [
      "context switch calculator",
      "task switching cost",
      "multitasking cost",
      "focus recovery time",
      "attention residue",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/context-switch-cost-calculator",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["context-switching", "focus", "multitasking"],
    cluster: "context-switch",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Context Switch Cost Calculator",
    intro:
      "Every time you jump tasks, tabs, or tools, your brain pays a refocus tax. Estimate how much time that costs you per day and per year.",
    icon: "blocks",
    proseTitle: "About context switching",
    sections: [
      {
        id: "problem",
        heading: "The hidden tax on every tab hop",
        framework: "pas",
        body: "A quick Slack check mid-document feels harmless — but [UC Irvine interruption research](https://www.ics.uci.edu/~gmark/chi08.pdf) shows recovery can take far longer than the interruption itself. Multiply that by dozens of switches daily and hours vanish into refocus, not work.",
      },
      {
        id: "concept",
        heading: "Attention residue",
        framework: "concept",
        body: "When you switch tasks, part of your attention stays on the previous task — cognitive scientists call this attention residue. Deep work requires sustained single-task focus; reactive switching is its opposite.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "outcome",
        body: "Daily and annual hours lost to refocus, equivalent work days, illustrative salary cost, and how many Pomodoro sessions that time could have bought.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "switches_per_day",
        type: "integer" as const,
        label: "Task or tab switches per day",
        placeholder: "e.g. 40",
        hint: "Count every time you change what you're working on — email, Slack, doc, code, phone.",
        min: 0,
        max: 500,
        required: true,
        integer: true,
      },
    ],
    constants: {
      DAYS_PER_YEAR: ENGINE_CONSTANTS.DAYS_PER_YEAR,
      MINUTES_PER_SWITCH: ENGINE_CONSTANTS.MINUTES_LOST_PER_CONTEXT_SWITCH,
      WORK_HOURS_PER_DAY: ENGINE_CONSTANTS.WORK_HOURS_PER_DAY,
      HOURLY_WAGE: ENGINE_CONSTANTS.ILLUSTRATIVE_HOURLY_WAGE,
    },
    expressions: {
      minutesLostPerDay: "inputs.switches_per_day * constants.MINUTES_PER_SWITCH",
      hoursLostPerDay: "calcs.minutesLostPerDay / 60",
      hoursLostPerYear: "(inputs.switches_per_day * constants.DAYS_PER_YEAR * constants.MINUTES_PER_SWITCH) / 60",
      workDaysLostPerYear: "calcs.hoursLostPerYear / constants.WORK_HOURS_PER_DAY",
      salaryCost: "calcs.hoursLostPerYear * constants.HOURLY_WAGE",
      pomodorosLost: "floor(calcs.hoursLostPerYear)",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter how often you switch tasks or tabs each day to see your refocus tax.",
    templates: [
      {
        id: "default",
        cards: [
          {
            title: "Time lost per day",
            valueTemplate: "{{calcs.hoursLostPerDay|decimal1}} hrs",
            descriptionTemplate:
              "{{inputs.switches_per_day}} switches × 15 min refocus each",
          },
          {
            title: "Time lost per year",
            valueTemplate: "{{calcs.hoursLostPerYear|decimal1}} hrs",
            descriptionTemplate: "Conservative 15-minute recovery per switch",
          },
        ],
        summaryTemplates: [
          "That's {{calcs.workDaysLostPerYear|decimal1}} full work days per year — roughly ${{calcs.salaryCost|integer}} at $35/hr.",
        ],
        comparisonTitle: "The hidden tax on multitasking",
        comparisonRules: [
          {
            when: "inputs.switches_per_day >= 50",
            textTemplate:
              "{{inputs.switches_per_day}} switches daily means you rarely finish a thought — chronic attention residue kills deep work.",
          },
          {
            when: "calcs.hoursLostPerDay >= 2",
            textTemplate:
              "Over 2 hours/day lost to refocus — batching tasks could return a full morning of productivity.",
          },
          {
            when: "calcs.pomodorosLost >= 100",
            textTemplate:
              "Enough time for {{calcs.pomodorosLost}}+ Pomodoro sessions — structured focus you never reach.",
          },
          {
            when: "true",
            textTemplate:
              "Research on attention residue suggests even brief switches leave cognitive hangover — 15 min/switch is a conservative average.",
          },
        ],
        fallbackComparison:
          "Batch similar work, close extra tabs, and silence notifications — each switch you prevent buys back real focus time.",
      },
    ],
  },

  guidance: [
    {
      title: "How to count a switch",
      body: "Each time you stop one task and start another counts — including checking email mid-task, opening Slack, or jumping between browser tabs.",
      list: [
        "Email → document → email = 2 switches",
        "One long focus block with no interruptions = 0 switches",
        "Phone pickup during work counts as a switch",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Fewer switches, longer focus",
      description:
        "Reset blocks distracting apps during focus sessions so you stay on one task — cutting the refocus tax before it starts.",
    },
  },

  faq: [
    {
      question: "Why 15 minutes per switch?",
      answer:
        "Studies on task switching and attention residue suggest recovery often takes 10–25 minutes depending on complexity. We use 15 as a practical daily average.",
    },
    {
      question: "Is context switching ever good?",
      answer:
          "Planned breaks and intentional task changes are fine. The cost comes from reactive switching — notifications, pings, and \"quick checks\" that fragment flow.",
    },
    {
      question: "How do I reduce switches?",
      answer:
        "Batch email and messages, use one-tab rules, time-block your calendar, and put your phone out of reach during deep work blocks.",
    },
  ],

  recommendations: [],
};
