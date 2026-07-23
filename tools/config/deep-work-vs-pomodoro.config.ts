export const deepWorkVsPomodoroConfig = {
  schemaVersion: "1.0" as const,
  id: "deep-work-vs-pomodoro",
  slug: "deep-work-vs-pomodoro",
  status: "published" as const,

  seo: {
    title: "Deep Work vs Pomodoro",
    metaDescription:
      "Deep work or Pomodoro — which fits your task and schedule? Answer 4 questions and get a technique recommendation with block length and break rules.",
    primaryKeyword: "deep work vs pomodoro",
    secondaryKeywords: [
      "pomodoro or deep work",
      "which focus technique",
      "25 minute vs 90 minute focus",
      "pomodoro for deep work",
      "focus technique quiz",
    ],
    searchIntent: "compare" as const,
    canonicalPath: "/deep-work-vs-pomodoro",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "pomodoro", "technique"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Deep Work vs Pomodoro",
    intro:
      "Pomodoro (25 min + break) and deep work (45–120 min uninterrupted) solve different problems. Four questions about your task, calendar, and experience — get the technique that fits today.",
    eyebrow: "Technique picker",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_task",
    nodes: {
      q_task: {
        type: "question" as const,
        id: "q_task",
        prompt: "What kind of task are you doing?",
        input: "single-choice" as const,
        options: [
          { id: "creative", label: "Creative or strategic — writing, design, planning", score: { deep: 3 }, next: "q_calendar" },
          { id: "technical", label: "Technical — coding, analysis, research", score: { deep: 2 }, next: "q_calendar" },
          { id: "admin", label: "Admin batch — email, expenses, organizing", score: { pomodoro: 3 }, next: "q_calendar" },
          { id: "mixed", label: "Mixed — several small tasks", score: { pomodoro: 2 }, next: "q_calendar" },
        ],
      },
      q_calendar: {
        type: "question" as const,
        id: "q_calendar",
        prompt: "Longest uninterrupted window available?",
        input: "single-choice" as const,
        options: [
          { id: "short", label: "Under 30 minutes", score: { pomodoro: 3 }, next: "q_experience" },
          { id: "medium", label: "30–90 minutes", score: { hybrid: 2 }, next: "q_experience" },
          { id: "long", label: "90+ minutes", score: { deep: 2 }, next: "q_experience" },
        ],
      },
      q_experience: {
        type: "question" as const,
        id: "q_experience",
        prompt: "How long can you focus before drifting?",
        input: "single-choice" as const,
        options: [
          { id: "low", label: "Under 20 minutes — drift is constant", score: { pomodoro: 2 }, next: "q_energy" },
          { id: "mid", label: "20–45 minutes — then I need a break", score: { hybrid: 2 }, next: "q_energy" },
          { id: "high", label: "45+ minutes — I can reach flow", score: { deep: 2 }, next: "q_energy" },
        ],
      },
      q_energy: {
        type: "question" as const,
        id: "q_energy",
        prompt: "Energy level right now?",
        input: "single-choice" as const,
        options: [
          { id: "low", label: "Low — tired or scattered", score: { pomodoro: 2 }, next: "branch_result" },
          { id: "ok", label: "OK — normal work energy", score: { ok: 1 }, next: "branch_result" },
          { id: "high", label: "High — sharp and ready", score: { deep: 1 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.pomodoro >= 4", next: "result_pomodoro" },
          { when: "scores.deep >= 4", next: "result_deep" },
          { when: "scores.hybrid >= 2", next: "result_hybrid" },
          { when: "scores.deep >= 3", next: "result_deep" },
        ],
        default: "result_pomodoro",
      },
      result_pomodoro: { type: "result" as const, id: "result_pomodoro", resultTemplateId: "pomodoro" },
      result_deep: { type: "result" as const, id: "result_deep", resultTemplateId: "deep" },
      result_hybrid: { type: "result" as const, id: "result_hybrid", resultTemplateId: "hybrid" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to see deep work vs Pomodoro for your situation.",
    templates: [
      {
        id: "pomodoro",
        cards: [
          { title: "Use", valueTemplate: "Pomodoro", descriptionTemplate: "25 min focus + 5 min break — fits your task, window, or current focus stamina." },
          { title: "Setup", valueTemplate: "25 / 5 × 4, then 15-min break", descriptionTemplate: "Phone away, one task, timer visible." },
        ],
        summaryTemplates: ["Pomodoro builds focus endurance — graduate to longer blocks later."],
      },
      {
        id: "deep",
        cards: [
          { title: "Use", valueTemplate: "Deep work block", descriptionTemplate: "60–90 min uninterrupted — cognitively demanding work needs runway to flow." },
          { title: "Setup", valueTemplate: "90 min, no breaks mid-block", descriptionTemplate: "Phone in another room, one task, shutdown note at end." },
        ],
        summaryTemplates: ["Newport: hard tasks need long blocks — Pomodoro fragments flow."],
      },
      {
        id: "hybrid",
        cards: [
          { title: "Use", valueTemplate: "Hybrid — Pomodoro warm-up", descriptionTemplate: "First 25 min Pomodoro, then extend 45 min if flow arrives — no break between." },
          { title: "Setup", valueTemplate: "25 + 45 continuous", descriptionTemplate: "Break only after 70 min total if needed." },
        ],
        summaryTemplates: ["Bridge technique — Pomodoro starts, deep work continues if momentum builds."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-pomodoro",
      when: "scores.pomodoro >= 2",
      title: "Pomodoro protocol",
      steps: [
        "Pick one task — write it down.",
        "25-minute timer — no phone, no tab switches.",
        "5-minute break — walk, water, no feeds.",
        "After 4 pomodoros: 15–30 min real break.",
      ],
    },
    {
      id: "rec-deep",
      when: "scores.deep >= 2",
      title: "Deep work protocol",
      steps: [
        "Define \"done\" for this block in one sentence.",
        "90-minute timer — phone in another room.",
        "No email, Slack, or breaks mid-block.",
        "5-min walk after block — then shallow work OK.",
      ],
    },
    {
      id: "rec-hybrid",
      when: "scores.hybrid >= 2",
      title: "Hybrid protocol",
      steps: [
        "Start 25-min Pomodoro — same task throughout.",
        "At 25 min: if flowing, reset timer 45 min — no break.",
        "If not flowing, 5-min break then decide: continue or stop.",
        "Track which tasks graduated to deep blocks.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "When to use which",
      steps: [
        "Deep work: hard, single-task, 60+ min available.",
        "Pomodoro: admin batches, short gaps, building stamina.",
        "Never Pomodoro creative flow mid-stream — extend instead.",
        "See what-are-deep-work-blocks for sizing help.",
      ],
    },
  ],

  guidance: [
    {
      title: "Deep work vs Pomodoro",
      body: "Pomodoro is interval training. Deep work is marathon concentration. Newport prioritizes long blocks for cognitively demanding output.",
      list: [
        "Pomodoro: 25 min work, 5 min break",
        "Deep work: 45–120 min, minimal interruption",
        "Use Pomodoro to build toward deep blocks",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Hold whichever block you chose",
      description:
        "Reset blocks distracting apps for Pomodoro or deep work sessions — technique only works if the phone doesn't break it.",
    },
  },

  faq: [
    {
      question: "Can I use Pomodoro for deep work?",
      answer:
        "Pomodoro helps build stamina and fits short calendars. For writing, coding, and strategy, Newport recommends extending into 60–90 minute blocks once you can sustain focus.",
    },
    {
      question: "Which is better for studying?",
      answer:
        "Hard material benefits from deep blocks once basics are understood. Review and flashcards can use Pomodoro. This quiz picks based on your answers.",
    },
    {
      question: "Should I take breaks during deep work?",
      answer:
        "Break after the block, not during. Pomodoro builds in breaks — deep work protects continuity until flow completes or timer ends.",
    },
  ],
} satisfies Record<string, unknown>;
