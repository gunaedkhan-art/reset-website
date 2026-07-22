export const giveMeOneSmallTaskConfig = {
  schemaVersion: "1.0" as const,
  id: "give-me-one-small-task",
  slug: "give-me-one-small-task",
  status: "published" as const,

  seo: {
    title: "Give Me One Small Task",
    metaDescription:
      "Need one small task to do right now? Answer 3 questions and get a single 2–5 minute action matched to your situation — free picker in 60 seconds.",
    primaryKeyword: "give me one small task",
    secondaryKeywords: [
      "one small task",
      "tiny task generator",
      "small thing to do",
      "micro task",
      "one thing to do now",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/give-me-one-small-task",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["micro-tasks", "momentum", "getting-started"],
    cluster: "getting-started",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Give Me One Small Task",
    intro:
      "Big lists paralyze. One small task unsticks you. Three questions — we'll give you exactly one thing to do in the next 5 minutes.",
    eyebrow: "Micro-task picker",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_where",
    nodes: {
      q_where: {
        type: "question" as const,
        id: "q_where",
        prompt: "Where are you?",
        input: "single-choice" as const,
        options: [
          { id: "home", label: "Home", score: { home: 1 }, next: "q_energy" },
          { id: "work", label: "Work or study", score: { work: 1 }, next: "q_energy" },
          { id: "out", label: "Out and about", score: { out: 1 }, next: "q_energy" },
        ],
      },
      q_energy: {
        type: "question" as const,
        id: "q_energy",
        prompt: "Energy right now?",
        input: "single-choice" as const,
        options: [
          { id: "low", label: "Low", score: { low: 3 }, next: "q_type" },
          { id: "ok", label: "OK", score: { ok: 2 }, next: "q_type" },
          { id: "high", label: "High", score: { high: 3 }, next: "q_type" },
        ],
      },
      q_type: {
        type: "question" as const,
        id: "q_type",
        prompt: "What kind of win would help?",
        input: "single-choice" as const,
        options: [
          { id: "tidy", label: "Order — space or inbox", score: { tidy: 3 }, next: "branch_result" },
          { id: "body", label: "Body — move or hydrate", score: { body: 3 }, next: "branch_result" },
          { id: "work", label: "Work — one step forward", score: { worktask: 3 }, next: "branch_result" },
          { id: "kind", label: "Kind — self or someone else", score: { kind: 3 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.tidy >= 2 && scores.home >= 1", next: "result_tidy_home" },
          { when: "scores.worktask >= 2", next: "result_work" },
          { when: "scores.body >= 2", next: "result_body" },
          { when: "scores.kind >= 2", next: "result_kind" },
          { when: "scores.low >= 2", next: "result_low" },
        ],
        default: "result_default",
      },
      result_tidy_home: { type: "result" as const, id: "result_tidy_home", resultTemplateId: "tidy_home" },
      result_work: { type: "result" as const, id: "result_work", resultTemplateId: "work" },
      result_body: { type: "result" as const, id: "result_body", resultTemplateId: "body" },
      result_kind: { type: "result" as const, id: "result_kind", resultTemplateId: "kind" },
      result_low: { type: "result" as const, id: "result_low", resultTemplateId: "low" },
      result_default: { type: "result" as const, id: "result_default", resultTemplateId: "default" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your one small task.",
    templates: [
      { id: "tidy_home", cards: [{ title: "Your one task", valueTemplate: "Clear one surface", descriptionTemplate: "Kitchen counter, desk, or nightstand — one zone, 3 minutes max." }], summaryTemplates: ["Visible order creates mental order."] },
      { id: "work", cards: [{ title: "Your one task", valueTemplate: "Open + one line", descriptionTemplate: "Open the file or email draft and write one sentence — not edit, write." }], summaryTemplates: ["One line breaks the seal on avoided work."] },
      { id: "body", cards: [{ title: "Your one task", valueTemplate: "Water + walk", descriptionTemplate: "Full glass of water, walk to mailbox and back." }], summaryTemplates: ["Body first — brain follows."] },
      { id: "kind", cards: [{ title: "Your one task", valueTemplate: "One kind message", descriptionTemplate: "Text someone \"thinking of you\" — no scroll after." }], summaryTemplates: ["Small connection beats passive feed."] },
      { id: "low", cards: [{ title: "Your one task", valueTemplate: "Rest setup", descriptionTemplate: "Lay out tomorrow's clothes, fill water bottle, plug phone across room." }], summaryTemplates: ["Future-you tasks count — low energy friendly."] },
      { id: "default", cards: [{ title: "Your one task", valueTemplate: "Delete 5 emails", descriptionTemplate: "Archive or trash five messages — quick inbox win." }], summaryTemplates: ["Done in under 2 minutes — momentum started."] },
    ],
  },

  recommendations: [
    { id: "rec-tidy", when: "scores.tidy >= 2", title: "After this task", steps: ["Stop after one surface — don't expand scope.", "Sit in the cleared space 30 seconds — notice the calm.", "If motivated, pick one more micro-task tomorrow.", "Don't turn cleaning into procrastination."] },
    { id: "rec-work", when: "scores.worktask >= 2", title: "After this task", steps: ["If the line flowed, set 10 more minutes — optional.", "If not, you still win — starting counts.", "Write tomorrow's first line before closing.", "Phone stays away until next break."] },
    { id: "rec-body", when: "scores.body >= 2", title: "After this task", steps: ["Notice energy shift — even small.", "If better, tackle one cognitive task.", "If still low, rest without guilt.", "Repeat water + walk anytime you're stuck."] },
    { id: "rec-kind", when: "scores.kind >= 2", title: "After this task", steps: ["Put phone down after sending.", "No checking for replies immediately.", "Kind acts reduce isolation-driven scroll.", "One person per day is enough."] },
    { id: "rec-low", when: "scores.low >= 2", title: "After this task", steps: ["Rest if needed — one task is enough today.", "Don't stack tasks when depleted.", "Sleep window is a task too.", "Retry picker tomorrow morning."] },
    { id: "rec-default", when: "true", title: "After this task", steps: ["Cross it off on paper — dopamine matters.", "Ask: one more 2-minute task or stop?", "Default to stop if energy is low.", "Come back to picker anytime you're stuck."] },
  ],

  guidance: [],
  ctas: { app: { title: "One task, fewer distractions", description: "Reset keeps your phone from hijacking the momentum after you finish one small task." } },
  faq: [
    { question: "How small is \"small\"?", answer: "2–5 minutes, no setup required. If you need to \"get ready\" first, it's too big — shrink again." },
    { question: "Can I get another task after?", answer: "Yes — but finish one first. Stacking before completing trains avoidance." },
    { question: "What if the task feels pointless?", answer: "Momentum tasks aren't always important — they're bridge tasks to bigger work. One bridge is enough." },
  ],
} satisfies Record<string, unknown>;
