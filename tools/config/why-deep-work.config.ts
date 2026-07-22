import { ENGINE_CONSTANTS } from "./constants";

export const whyDeepWorkConfig = {
  schemaVersion: "1.0" as const,
  id: "why-deep-work",
  slug: "why-deep-work",
  status: "published" as const,

  seo: {
    title: "Why Deep Work?",
    metaDescription:
      "Why does deep work matter? Enter your current focus hours and shallow load — see your depth ratio, what you're leaving on the table, and whether your work rewards concentration.",
    primaryKeyword: "why deep work",
    secondaryKeywords: [
      "benefits of deep work",
      "is deep work worth it",
      "why deep work matters",
      "value of deep work",
      "cal newport why deep work",
    ],
    searchIntent: "why" as const,
    canonicalPath: "/why-deep-work",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "motivation", "productivity"],
    cluster: "deep-work",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Why Deep Work?",
    intro:
      "Cal Newport's case for deep work is simple: hard, uninterrupted focus produces disproportionate value — and most knowledge work barely protects it. Enter your numbers to see how much depth you're getting and what you'd gain by protecting more.",
    explainer:
      "Deep work is cognitively demanding labor done without distraction. Shallow work keeps things running but rarely compounds. The gap between them is where career leverage lives.",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "work_hours_week",
        type: "number" as const,
        label: "Total work hours per week",
        placeholder: "e.g. 40",
        hint: "Paid work only — your typical week.",
        min: 1,
        max: 80,
        step: 1,
        required: true,
      },
      {
        id: "deep_hours_week",
        type: "number" as const,
        label: "Deep work hours per week (estimate)",
        placeholder: "e.g. 5",
        hint: "Uninterrupted blocks on hard, valuable tasks — writing, coding, strategy, learning.",
        min: 0,
        max: 60,
        step: 0.5,
        required: true,
      },
      {
        id: "shallow_hours_week",
        type: "number" as const,
        label: "Shallow work hours per week (estimate)",
        placeholder: "e.g. 20",
        hint: "Meetings, email, Slack, admin, status updates — necessary but not cognitively demanding.",
        min: 0,
        max: 60,
        step: 0.5,
        required: true,
      },
    ],
    constants: {
      WEEKS_PER_YEAR: ENGINE_CONSTANTS.WEEKS_PER_YEAR,
      SHALLOW_RECLAIM_RATE: 0.2,
      BOOK_HOURS: 40,
    },
    expressions: {
      mixedHoursWeek: "max(0, inputs.work_hours_week - inputs.deep_hours_week - inputs.shallow_hours_week)",
      deepPercent: "(inputs.deep_hours_week / inputs.work_hours_week) * 100",
      shallowPercent: "(inputs.shallow_hours_week / inputs.work_hours_week) * 100",
      depthScore: "min(100, (inputs.deep_hours_week / inputs.work_hours_week) * 200)",
      reclaimableHoursWeek: "inputs.shallow_hours_week * constants.SHALLOW_RECLAIM_RATE",
      potentialDeepWeek: "inputs.deep_hours_week + calcs.reclaimableHoursWeek",
      reclaimableHoursYear: "calcs.reclaimableHoursWeek * constants.WEEKS_PER_YEAR",
      potentialDeepYear: "calcs.potentialDeepWeek * constants.WEEKS_PER_YEAR",
      booksEquivalent: "floor(calcs.reclaimableHoursYear / constants.BOOK_HOURS)",
      deepHoursYear: "inputs.deep_hours_week * constants.WEEKS_PER_YEAR",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your weekly work, deep, and shallow hours to see why depth matters for your schedule.",
    templates: [
      {
        id: "default",
        cardColumns: 3 as const,
        cards: [
          {
            title: "Your depth ratio",
            valueTemplate: "{{calcs.deepPercent|decimal1}}%",
            descriptionTemplate: "{{inputs.deep_hours_week}} deep hrs of {{inputs.work_hours_week}} total",
          },
          {
            title: "Depth score",
            valueTemplate: "{{calcs.depthScore|integer}}/100",
            descriptionTemplate: "How much of your week is protected focus",
          },
          {
            title: "Reclaimable depth",
            valueTemplate: "+{{calcs.reclaimableHoursWeek|decimal1}} hrs/wk",
            descriptionTemplate: "If you drained 20% of shallow work into depth",
          },
        ],
        summaryTemplates: [
          "You do {{calcs.deepHoursYear|decimal1}} hours of deep work per year — reclaiming 20% of shallow time could add {{calcs.reclaimableHoursYear|decimal1}} more.",
        ],
        comparisonTitle: "Why this matters",
        comparisonRules: [
          {
            when: "calcs.deepPercent < 10",
            textTemplate:
              "Under 10% deep work — your output is mostly reactive. Newport argues this caps skill growth and career leverage.",
          },
          {
            when: "calcs.deepPercent >= 25",
            textTemplate:
              "{{calcs.deepPercent|decimal1}}% depth is strong — you're investing in work that compounds. Protect these hours fiercely.",
          },
          {
            when: "calcs.shallowPercent >= 50",
            textTemplate:
              "{{calcs.shallowPercent|decimal1}}% shallow — busy without building. Draining even one meeting block per week shifts the ratio.",
          },
          {
            when: "calcs.booksEquivalent >= 5",
            textTemplate:
              "Reclaimed depth time equals {{calcs.booksEquivalent}}+ books worth of focused hours per year — skills, projects, or mastery you never reach today.",
          },
          {
            when: "true",
            textTemplate:
              "Deep work isn't moral superiority — it's where hard problems get solved. Shallow work expands infinitely unless you cap it.",
          },
        ],
        fallbackComparison:
          "Run the shallow work audit next — most people underestimate shallow hours by a third.",
      },
    ],
  },

  guidance: [
    {
      title: "Why Newport argues for depth",
      body: "In a distracted economy, the ability to focus without distraction on a hard task is becoming simultaneously more rare and more valuable.",
      list: [
        "Deep work produces higher-quality output in less total time",
        "Skill acquisition requires sustained concentration",
        "Shallow work feels productive but rarely compounds",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Turn depth hours into actual depth",
      description:
        "Reset blocks distracting apps during focus blocks — so the hours you count as \"deep\" aren't lost to reflexive phone checks mid-session.",
    },
  },

  faq: [
    {
      question: "Why deep work if my job is mostly meetings?",
      answer:
        "Even 3–5 protected hours weekly compounds over a career. The calculator shows your ratio — the goal is to grow depth where your role allows, not eliminate collaboration.",
    },
    {
      question: "Is shallow work bad?",
      answer:
        "No — organizations need it. The problem is when shallow work consumes the hours that should produce your best output. Balance, not elimination.",
    },
    {
      question: "What's a good depth ratio?",
      answer:
        "Varies by role, but under 15% means depth is accidental, not intentional. Many knowledge workers aim for 20–30% protected deep hours.",
    },
  ],

  recommendations: [],
};
