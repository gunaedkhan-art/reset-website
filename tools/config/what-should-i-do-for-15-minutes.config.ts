export const whatShouldIDoFor15MinutesConfig = {
  schemaVersion: "1.0" as const,
  id: "what-should-i-do-for-15-minutes",
  slug: "what-should-i-do-for-15-minutes",
  status: "published" as const,

  seo: {
    title: "What Should I Do for 15 Minutes?",
    metaDescription:
      "Have 15 minutes free? Answer 3 questions and get one productive, restful, or fun activity matched to your mood — free picker in under 60 seconds.",
    primaryKeyword: "what should i do for 15 minutes",
    secondaryKeywords: [
      "15 minutes free what to do",
      "things to do in 15 minutes",
      "15 minute break ideas",
      "quick activities 15 minutes",
      "bored 15 minutes",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/what-should-i-do-for-15-minutes",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["micro-breaks", "time-management", "activities"],
    cluster: "micro-time",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "What Should I Do for 15 Minutes?",
    intro:
      "Fifteen minutes is enough for a real win — if you pick the right thing. Three questions, one matched activity, timer-ready.",
    eyebrow: "15-minute picker",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_context",
    nodes: {
      q_context: {
        type: "question" as const,
        id: "q_context",
        prompt: "What's the context?",
        input: "single-choice" as const,
        options: [
          { id: "break", label: "Break between tasks", score: { break: 2 }, next: "q_mood" },
          { id: "waiting", label: "Waiting — appointment, commute, gap", score: { waiting: 2 }, next: "q_mood" },
          { id: "avoid", label: "Avoiding something I should do", score: { avoid: 3 }, next: "q_mood" },
          { id: "free", label: "Genuinely free time", score: { free: 1 }, next: "q_mood" },
        ],
      },
      q_mood: {
        type: "question" as const,
        id: "q_mood",
        prompt: "How do you feel?",
        input: "single-choice" as const,
        options: [
          { id: "tired", label: "Tired", score: { tired: 3 }, next: "q_goal" },
          { id: "wired", label: "Restless or wired", score: { wired: 3 }, next: "q_goal" },
          { id: "ok", label: "Neutral — just deciding", score: { ok: 1 }, next: "q_goal" },
        ],
      },
      q_goal: {
        type: "question" as const,
        id: "q_goal",
        prompt: "What would help most?",
        input: "single-choice" as const,
        options: [
          { id: "energy", label: "More energy", score: { energy: 3 }, next: "branch_result" },
          { id: "progress", label: "Progress on something", score: { progress: 3 }, next: "branch_result" },
          { id: "calm", label: "Calm down", score: { calm: 3 }, next: "branch_result" },
          { id: "fun", label: "Enjoyment — guilt-free", score: { fun: 3 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.avoid >= 2 && scores.progress >= 2", next: "result_starter" },
          { when: "scores.tired >= 2 && scores.calm >= 2", next: "result_calm" },
          { when: "scores.wired >= 2 || scores.energy >= 2", next: "result_energy" },
          { when: "scores.progress >= 2", next: "result_progress" },
          { when: "scores.fun >= 2", next: "result_fun" },
        ],
        default: "result_default",
      },
      result_starter: { type: "result" as const, id: "result_starter", resultTemplateId: "starter" },
      result_calm: { type: "result" as const, id: "result_calm", resultTemplateId: "calm" },
      result_energy: { type: "result" as const, id: "result_energy", resultTemplateId: "energy" },
      result_progress: { type: "result" as const, id: "result_progress", resultTemplateId: "progress" },
      result_fun: { type: "result" as const, id: "result_fun", resultTemplateId: "fun" },
      result_default: { type: "result" as const, id: "result_default", resultTemplateId: "default" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your 15-minute plan.",
    templates: [
      { id: "starter", cards: [{ title: "Your 15 minutes", valueTemplate: "Start the hard thing", descriptionTemplate: "Use 15 minutes to begin what you've been avoiding — not finish, just start." }], summaryTemplates: ["Set timer. Open the file. Write one sentence. That's the win."] },
      { id: "calm", cards: [{ title: "Your 15 minutes", valueTemplate: "Restorative break", descriptionTemplate: "Walk, stretch, or eyes-closed rest — no screens." }], summaryTemplates: ["You'll return sharper than if you scrolled."] },
      { id: "energy", cards: [{ title: "Your 15 minutes", valueTemplate: "Movement burst", descriptionTemplate: "Brisk walk, stairs, or quick workout — reset your nervous system." }], summaryTemplates: ["15 minutes of movement beats an hour of low energy grinding."] },
      { id: "progress", cards: [{ title: "Your 15 minutes", valueTemplate: "One inbox sweep", descriptionTemplate: "Clear one category: email, messages, or one chore zone." }], summaryTemplates: ["Batch process — don't start new threads."] },
      { id: "fun", cards: [{ title: "Your 15 minutes", valueTemplate: "Guilty-pleasure OK", descriptionTemplate: "One episode, game level, or hobby session — timer enforced, no scroll." }], summaryTemplates: ["Bounded fun beats endless drift."] },
      { id: "default", cards: [{ title: "Your 15 minutes", valueTemplate: "Learn something", descriptionTemplate: "One lesson, 5 pages, or one practice problem — focused input." }], summaryTemplates: ["Pick one source — no tab hopping."] },
    ],
  },

  recommendations: [
    { id: "rec-starter", when: "scores.avoid >= 2 && scores.progress >= 2", title: "15-minute start ritual", steps: ["Title doc \"15-min start only.\"", "Timer 15 min — one paragraph, outline, or problem set.", "Stop when timer rings — success is starting.", "Schedule next 15-min block tomorrow."] },
    { id: "rec-calm", when: "scores.tired >= 2 && scores.calm >= 2", title: "15-minute recovery", steps: ["Phone in drawer.", "Walk outside or lie down with eyes closed.", "Slow breathing 4-4-4 for 3 minutes.", "Return without checking feeds first."] },
    { id: "rec-energy", when: "scores.wired >= 2 || scores.energy >= 2", title: "15-minute activation", steps: ["Put on shoes — leave the building if possible.", "Walk briskly 12 minutes, stretch 3.", "Cold water on face when back.", "Tackle one task while energy is up."] },
    { id: "rec-progress", when: "scores.progress >= 2", title: "15-minute batch", steps: ["Pick one pile: email, dishes, or admin.", "Process only — don't organize the whole life.", "Trash/archive aggressively.", "Stop at 15 — inbox zero isn't the goal."] },
    { id: "rec-fun", when: "scores.fun >= 2", title: "15-minute bounded play", steps: ["Choose activity before timer starts.", "No phone unless it's the activity.", "Stop when timer ends — trains bounded leisure.", "Note if you feel better than scrolling."] },
    { id: "rec-default", when: "true", title: "15-minute default menu", steps: ["Read 5–10 pages.", "Tidy one visible surface.", "Message one friend.", "Review tomorrow's top priority.", "Pick one — set timer — go."] },
  ],

  guidance: [],
  ctas: { app: { title: "Protect your 15 minutes", description: "Reset blocks notifications during short focus bursts so your 15 minutes actually belong to you." } },
  faq: [
    { question: "Is 15 minutes enough to be productive?", answer: "Yes for starting, clearing a batch, or resetting energy. It's not enough for deep work — chain two blocks if needed." },
    { question: "Should I scroll for 15 minutes?", answer: "Bounded scroll beats endless — but movement, rest, or a micro-task usually leaves you feeling better." },
    { question: "What about Pomodoro?", answer: "A 15-minute block is a short Pomodoro. Use 15 work + 5 break, or 15 break + 25 work after — match your energy." },
  ],
} satisfies Record<string, unknown>;
