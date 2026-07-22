export const imOverwhelmedConfig = {
  schemaVersion: "1.0" as const,
  id: "im-overwhelmed",
  slug: "im-overwhelmed",
  status: "published" as const,

  seo: {
    title: "I'm Overwhelmed",
    metaDescription:
      "Feeling overwhelmed? Answer 4 questions and get a calm, step-by-step plan to shrink the pile and start moving — free tool in under 60 seconds.",
    primaryKeyword: "i'm overwhelmed",
    secondaryKeywords: [
      "feeling overwhelmed",
      "overwhelmed at work",
      "too much to do",
      "overwhelmed anxiety",
      "how to feel less overwhelmed",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/im-overwhelmed",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["overwhelm", "stress", "planning"],
    cluster: "overwhelm",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "I'm Overwhelmed",
    intro:
      "Overwhelm isn't a character flaw — it's too many open loops for one brain. Four questions to find your pattern and a plan to make today manageable.",
    eyebrow: "Interactive relief plan",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_source",
    nodes: {
      q_source: {
        type: "question" as const,
        id: "q_source",
        prompt: "What's overwhelming you most?",
        input: "single-choice" as const,
        options: [
          { id: "tasks", label: "Too many tasks and deadlines", score: { volume: 3 }, next: "q_feel" },
          { id: "life", label: "Work plus life — everything at once", score: { life: 3 }, next: "q_feel" },
          { id: "unclear", label: "I don't even know what's on my plate", score: { chaos: 3 }, next: "q_feel" },
          { id: "people", label: "Other people's demands and messages", score: { external: 3 }, next: "q_feel" },
        ],
      },
      q_feel: {
        type: "question" as const,
        id: "q_feel",
        prompt: "How does overwhelm show up for you?",
        input: "single-choice" as const,
        options: [
          { id: "freeze", label: "I freeze — can't start anything", score: { freeze: 3 }, next: "q_time" },
          { id: "busy", label: "I'm busy all day but nothing important gets done", score: { busy: 3 }, next: "q_time" },
          { id: "anxious", label: "Anxious, tight chest, racing thoughts", score: { anxiety: 3 }, next: "q_time" },
          { id: "shutdown", label: "I shut down — scroll, nap, or avoid", score: { avoid: 3 }, next: "q_time" },
        ],
      },
      q_time: {
        type: "question" as const,
        id: "q_time",
        prompt: "How long has this feeling lasted?",
        input: "single-choice" as const,
        options: [
          { id: "today", label: "Today — bad day or bad moment", score: { acute: 1 }, next: "q_help" },
          { id: "week", label: "Most of this week", score: { sustained: 2 }, next: "q_help" },
          { id: "long", label: "Weeks or longer", score: { chronic: 3 }, next: "q_help" },
        ],
      },
      q_help: {
        type: "question" as const,
        id: "q_help",
        prompt: "What would help most right now?",
        input: "single-choice" as const,
        options: [
          { id: "clarity", label: "Clarity — know what matters today", score: { clarity: 2 }, next: "branch_result" },
          { id: "permission", label: "Permission to do less", score: { reduce: 2 }, next: "branch_result" },
          { id: "firststep", label: "One first step — anything", score: { action: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.freeze >= 2 || scores.chaos >= 2", next: "result_freeze" },
          { when: "scores.anxiety >= 2", next: "result_anxiety" },
          { when: "scores.external >= 2", next: "result_external" },
          { when: "scores.busy >= 2", next: "result_busy" },
          { when: "scores.life >= 2", next: "result_life" },
          { when: "scores.chronic >= 2", next: "result_chronic" },
        ],
        default: "result_today",
      },
      result_freeze: { type: "result" as const, id: "result_freeze", resultTemplateId: "freeze" },
      result_anxiety: { type: "result" as const, id: "result_anxiety", resultTemplateId: "anxiety" },
      result_external: { type: "result" as const, id: "result_external", resultTemplateId: "external" },
      result_busy: { type: "result" as const, id: "result_busy", resultTemplateId: "busy" },
      result_life: { type: "result" as const, id: "result_life", resultTemplateId: "life" },
      result_chronic: { type: "result" as const, id: "result_chronic", resultTemplateId: "chronic" },
      result_today: { type: "result" as const, id: "result_today", resultTemplateId: "today" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your overwhelm relief plan.",
    templates: [
      { id: "freeze", cards: [{ title: "Your pattern", valueTemplate: "Shutdown freeze", descriptionTemplate: "Too much input — your brain chose off instead of sort." }], summaryTemplates: ["Your plan externalizes everything, then picks one micro-step."] },
      { id: "anxiety", cards: [{ title: "Your pattern", valueTemplate: "Anxious overload", descriptionTemplate: "Your nervous system is treating the to-do list like a threat." }], summaryTemplates: ["Your plan calms the body first, then shrinks the list."] },
      { id: "external", cards: [{ title: "Your pattern", valueTemplate: "Demand overload", descriptionTemplate: "Everyone else's urgency became yours." }], summaryTemplates: ["Your plan sets boundaries and batches responses."] },
      { id: "busy", cards: [{ title: "Your pattern", valueTemplate: "Reactive busy", descriptionTemplate: "Motion without progress — urgent wins over important." }], summaryTemplates: ["Your plan blocks one outcome before opening the inbox."] },
      { id: "life", cards: [{ title: "Your pattern", valueTemplate: "Life-work pile-up", descriptionTemplate: "No single domain owns the stress — it's everything." }], summaryTemplates: ["Your plan triages one domain today and parks the rest."] },
      { id: "chronic", cards: [{ title: "Your pattern", valueTemplate: "Sustained overload", descriptionTemplate: "This isn't a bad day — your system needs structural change." }], summaryTemplates: ["Your plan cuts commitments and adds a weekly reset ritual."] },
      { id: "today", cards: [{ title: "Your pattern", valueTemplate: "Acute overwhelm", descriptionTemplate: "A heavy day — you need triage, not a life overhaul." }], summaryTemplates: ["Your plan gets you through today with three items max."] },
    ],
  },

  recommendations: [
    { id: "rec-freeze", when: "scores.freeze >= 2 || scores.chaos >= 2", title: "Your unfreeze plan", steps: ["Set a 10-minute timer. Brain-dump every task onto paper — no organizing.", "Circle ONE item that would make today feel 10% better.", "Break it into a 2-minute physical action — do only that.", "Hide the list until that action is done."] },
    { id: "rec-anxiety", when: "scores.anxiety >= 2", title: "Your calm-first plan", steps: ["Box breathing: 4 in, 4 hold, 4 out — repeat 4 times.", "Write: \"What am I afraid will happen if I don't do everything?\"", "Cross out anything that isn't true catastrophe.", "Pick one kind-to-yourself task — not the hardest one."] },
    { id: "rec-external", when: "scores.external >= 2", title: "Your boundary plan", steps: ["Turn off non-urgent notifications for 2 hours.", "Reply to messages at 12pm and 5pm only today.", "Say no to one optional request — practice script: \"I can't take that on this week.\"", "Protect one 60-minute block for your top priority."] },
    { id: "rec-busy", when: "scores.busy >= 2", title: "Your priority plan", steps: ["Before email: write today's #1 outcome.", "Batch admin into one 30-minute slot — not all day.", "Decline or defer one meeting this week.", "End day by naming what actually shipped."] },
    { id: "rec-life", when: "scores.life >= 2", title: "Your triage plan", steps: ["Pick ONE domain today: work, home, health, or relationships.", "Do the minimum viable action in that domain only.", "Ask for help on one thing you'd normally solo.", "Sleep on time — overwhelm worsens when tired."] },
    { id: "rec-chronic", when: "scores.chronic >= 2", title: "Your structural plan", steps: ["List every recurring commitment — mark one to pause or drop.", "Schedule a weekly 20-minute review every Sunday.", "Cap daily to-do at 3 items until load feels lighter.", "Consider talking to someone if overwhelm affects health or relationships."] },
    { id: "rec-today", when: "true", title: "Your today-only plan", steps: ["Three items max for the rest of today — write them.", "Everything else goes on a \"not today\" list.", "Do item #1 for 25 minutes — then reassess.", "Celebrate finishing one thing — momentum reduces overwhelm."] },
  ],

  guidance: [],
  ctas: { app: { title: "Less noise, clearer days", description: "Reset reduces digital noise and protects focus blocks so overwhelm doesn't restart every time you pick up your phone." } },
  faq: [
    { question: "Is feeling overwhelmed the same as burnout?", answer: "Not always. Overwhelm is often too many inputs at once. Burnout is longer exhaustion and cynicism. Both need fewer commitments — overwhelm can improve faster with triage." },
    { question: "Should I push through overwhelm?", answer: "Forced grinding usually makes it worse. Shrink the scope, externalize the list, and take one small action — progress calms the nervous system." },
    { question: "When should I get professional help?", answer: "If overwhelm is constant, affects sleep or relationships, or comes with panic or hopelessness, talk to a healthcare provider or therapist." },
  ],
} satisfies Record<string, unknown>;
