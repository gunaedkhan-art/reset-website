export const weeklyPlanningScoreConfig = {
  schemaVersion: "1.0" as const,
  id: "weekly-planning-score",
  slug: "weekly-planning-score",
  status: "published" as const,

  seo: {
    title: "Weekly Planning Score",
    metaDescription:
      "Answer 4 quick questions to score your weekly planning habits — find out if you're reactive, over-planning, or ready to level up.",
    primaryKeyword: "weekly planning",
    secondaryKeywords: [
      "weekly planning quiz",
      "plan your week",
      "weekly review",
      "planning habits",
      "time blocking quiz",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/weekly-planning-score",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["weekly-planning", "goals", "productivity"],
    cluster: "weekly-planning",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Weekly Planning Score",
    intro:
      "Four questions to see where your weekly planning stands — reactive, over-planning, or ready to level up.",
    icon: "calendar",
    proseTitle: "About weekly planning",
    sections: [
      {
        id: "problem",
        heading: "Weeks that happen to you",
        framework: "pas",
        body: "Monday arrives and you're already behind — reacting to inbox and meetings without a protected block for what matters. Sunday planning feels optional until another week disappears.",
      },
      {
        id: "concept",
        heading: "Plan the week, protect the ONE Thing",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) connects weekly planning to the Focusing Question: what's the ONE Thing I can do this week such that everything else becomes easier? Good planning isn't more lists — it's time blocked before noise arrives.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A planning score and specific fixes — review habits, time blocking, priority clarity, or over-planning traps — for this week.",
      },
    ],
    eyebrow: "Interactive assessment",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_review",
    nodes: {
      q_review: {
        type: "question" as const,
        id: "q_review",
        prompt: "Do you review last week before planning the next?",
        input: "single-choice" as const,
        options: [
          {
            id: "never",
            label: "Never — I just add to the pile",
            score: { reactive: 3 },
            next: "q_priorities",
          },
          {
            id: "sometimes",
            label: "Sometimes — when I remember",
            score: { inconsistent: 2 },
            next: "q_priorities",
          },
          {
            id: "usually",
            label: "Usually — quick mental recap",
            score: { solid: 1 },
            next: "q_priorities",
          },
          {
            id: "always",
            label: "Always — written weekly review",
            score: { advanced: 2 },
            next: "q_priorities",
          },
        ],
      },
      q_priorities: {
        type: "question" as const,
        id: "q_priorities",
        prompt: "How many priorities do you set for the week?",
        input: "single-choice" as const,
        options: [
          {
            id: "none",
            label: "None — I react to whatever is loudest",
            score: { reactive: 3 },
            next: "q_calendar",
          },
          {
            id: "many",
            label: "Too many — 10+ things \"must\" get done",
            score: { overload: 3 },
            next: "q_calendar",
          },
          {
            id: "few",
            label: "1–3 clear priorities",
            score: { solid: 2 },
            next: "q_calendar",
          },
          {
            id: "one",
            label: "One main outcome for the week",
            score: { advanced: 2 },
            next: "q_calendar",
          },
        ],
      },
      q_calendar: {
        type: "question" as const,
        id: "q_calendar",
        prompt: "Is deep work time blocked on your calendar?",
        input: "single-choice" as const,
        options: [
          {
            id: "no",
            label: "No — calendar fills with other people's requests",
            score: { reactive: 2 },
            next: "q_outcome",
          },
          {
            id: "wish",
            label: "I intend to — but it never survives the week",
            score: { inconsistent: 2 },
            next: "q_outcome",
          },
          {
            id: "some",
            label: "Some blocks — but I often skip them",
            score: { inconsistent: 1 },
            next: "q_outcome",
          },
          {
            id: "yes",
            label: "Yes — protected focus blocks most days",
            score: { advanced: 2 },
            next: "q_outcome",
          },
        ],
      },
      q_outcome: {
        type: "question" as const,
        id: "q_outcome",
        prompt: "At week's end, how do you usually feel?",
        input: "single-choice" as const,
        options: [
          {
            id: "busy",
            label: "Busy but unclear what I accomplished",
            score: { reactive: 2 },
            next: "branch_result",
          },
          {
            id: "behind",
            label: "Behind — important stuff didn't happen",
            score: { overload: 2 },
            next: "branch_result",
          },
          {
            id: "ok",
            label: "Okay — mixed progress",
            score: { inconsistent: 1 },
            next: "branch_result",
          },
          {
            id: "clear",
            label: "Clear — I know what shipped",
            score: { advanced: 2 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.reactive >= 5", next: "result_reactive" },
          { when: "scores.overload >= 4", next: "result_overload" },
          { when: "scores.advanced >= 5", next: "result_advanced" },
          { when: "scores.inconsistent >= 3", next: "result_inconsistent" },
          { when: "scores.solid >= 3", next: "result_solid" },
        ],
        default: "result_starter",
      },
      result_reactive: {
        type: "result" as const,
        id: "result_reactive",
        resultTemplateId: "reactive",
      },
      result_overload: {
        type: "result" as const,
        id: "result_overload",
        resultTemplateId: "overload",
      },
      result_advanced: {
        type: "result" as const,
        id: "result_advanced",
        resultTemplateId: "advanced",
      },
      result_inconsistent: {
        type: "result" as const,
        id: "result_inconsistent",
        resultTemplateId: "inconsistent",
      },
      result_solid: {
        type: "result" as const,
        id: "result_solid",
        resultTemplateId: "solid",
      },
      result_starter: {
        type: "result" as const,
        id: "result_starter",
        resultTemplateId: "starter",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions above to get your weekly planning score and plan.",
    templates: [
      {
        id: "reactive",
        cards: [
          {
            title: "Your score",
            valueTemplate: "Reactive mode",
            descriptionTemplate:
              "You're driven by inbox and urgency — weeks happen to you, not by design.",
          },
        ],
        summaryTemplates: ["Your plan installs a 15-minute weekly reset this Sunday."],
      },
      {
        id: "overload",
        cards: [
          {
            title: "Your score",
            valueTemplate: "Over-planner",
            descriptionTemplate:
              "Too many priorities means none win — busy without finishing what matters.",
          },
        ],
        summaryTemplates: ["Your plan forces one weekly outcome and parks the rest."],
      },
      {
        id: "advanced",
        cards: [
          {
            title: "Your score",
            valueTemplate: "Strong planner",
            descriptionTemplate:
              "You review, prioritize, and protect time — refine the system, don't rebuild it.",
          },
        ],
        summaryTemplates: ["Your plan optimizes energy alignment and quarterly links."],
      },
      {
        id: "inconsistent",
        cards: [
          {
            title: "Your score",
            valueTemplate: "Inconsistent",
            descriptionTemplate:
              "You know what works — execution drops when the week gets loud.",
          },
        ],
        summaryTemplates: ["Your plan makes planning non-optional with a fixed ritual."],
      },
      {
        id: "solid",
        cards: [
          {
            title: "Your score",
            valueTemplate: "Building momentum",
            descriptionTemplate:
              "Foundations are there — tighten priorities and calendar protection.",
          },
        ],
        summaryTemplates: ["Your plan adds time blocks and a written weekly review."],
      },
      {
        id: "starter",
        cards: [
          {
            title: "Your score",
            valueTemplate: "Getting started",
            descriptionTemplate:
              "Mixed habits — a simple weekly template will help immediately.",
          },
        ],
        summaryTemplates: ["Your plan uses a 3-step Sunday ritual anyone can stick to."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-reactive",
      when: "scores.reactive >= 5",
      title: "Your weekly reset plan",
      steps: [
        "Every Sunday: 15 minutes — list what shipped last week (even small wins).",
        "Pick ONE outcome for the coming week — write it at the top of your list.",
        "Block 60 minutes Monday morning for that outcome before opening email.",
        "Friday: 5-minute check — did the one outcome happen? Adjust next week.",
      ],
    },
    {
      id: "rec-overload",
      when: "scores.overload >= 4",
      title: "Your priority cap plan",
      steps: [
        "Max 3 priorities per week — everything else goes to a \"later\" list.",
        "Ask: \"If only one thing shipped, what would make the week successful?\"",
        "Delete or defer until next week anything that didn't make top 3.",
        "Say no to new requests until priority #1 has a scheduled block.",
      ],
    },
    {
      id: "rec-advanced",
      when: "scores.advanced >= 5",
      title: "Your optimization plan",
      steps: [
        "Link weekly outcome to a monthly goal — one line in your review.",
        "Schedule hard tasks in personal peak energy (usually morning).",
        "Add a monthly retrospective — what planning habits actually predicted success?",
        "Protect one \"maker day\" per week with zero meetings if possible.",
      ],
    },
    {
      id: "rec-inconsistent",
      when: "scores.inconsistent >= 3",
      title: "Your ritual lock-in plan",
      steps: [
        "Same time every Sunday — calendar invite yourself for planning.",
        "Use the same template every week — reduce decision fatigue.",
        "Tell one person your weekly outcome — accountability beats motivation.",
        "If you skip a week, do a 5-minute version instead of skipping entirely.",
      ],
    },
    {
      id: "rec-solid",
      when: "scores.solid >= 3",
      title: "Your level-up plan",
      steps: [
        "Write priorities, don't just think them — paper or doc, one place.",
        "Time-block top priority before reactive work fills the calendar.",
        "End each day with tomorrow's first action written — 30 seconds.",
        "Review calendar Friday — move unfinished priority blocks to next week.",
      ],
    },
    {
      id: "rec-starter",
      when: "true",
      title: "Your 3-step Sunday plan",
      steps: [
        "Review: What happened last week? (5 min)",
        "Choose: One outcome for next week (2 min)",
        "Schedule: One 60-min block for that outcome (2 min)",
      ],
    },
  ],

  guidance: [],

  ctas: {
    app: {
      title: "Plan the week, protect the blocks",
      description:
        "Reset helps you defend focus time during the week you planned — blocking distractions so your calendar intentions actually happen.",
    },
  },

  faq: [
    {
      question: "How long should weekly planning take?",
      answer:
        "15–30 minutes is enough for most people. Longer sessions often become procrastination. Consistency beats perfection.",
    },
    {
      question: "When should I do my weekly review?",
      answer:
        "Sunday evening or Monday morning works for most. Pick one time and protect it for 4 weeks before changing.",
    },
    {
      question: "What's the difference between priorities and a to-do list?",
      answer:
        "Priorities are outcomes (\"finish proposal draft\"). To-dos are tasks. One weekly outcome beats twenty unchecked boxes.",
    },
  ],
} satisfies Record<string, unknown>;
