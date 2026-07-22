export const helpMeStartMyHomeworkConfig = {
  schemaVersion: "1.0" as const,
  id: "help-me-start-my-homework",
  slug: "help-me-start-my-homework",
  status: "published" as const,

  seo: {
    title: "Help Me Start My Homework",
    metaDescription:
      "Can't start homework? Answer 4 questions and get a personalized plan to open the book and begin — free student tool in under 60 seconds.",
    primaryKeyword: "help me start my homework",
    secondaryKeywords: [
      "can't start homework",
      "how to start homework",
      "homework procrastination",
      "motivation to do homework",
      "stuck on homework",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/help-me-start-my-homework",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["homework", "students", "procrastination"],
    cluster: "homework",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Help Me Start My Homework",
    intro:
      "Homework feels heavy because starting is the hardest part. Four questions — then one small move to get you in the seat and opening the assignment.",
    eyebrow: "Homework starter",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_subject",
    nodes: {
      q_subject: {
        type: "question" as const,
        id: "q_subject",
        prompt: "What type of homework is it?",
        input: "single-choice" as const,
        options: [
          { id: "reading", label: "Reading or notes", score: { reading: 2 }, next: "q_block" },
          { id: "writing", label: "Essay or writing", score: { writing: 3 }, next: "q_block" },
          { id: "math", label: "Math or problem sets", score: { math: 2 }, next: "q_block" },
          { id: "mixed", label: "Mixed bag / don't know where to start", score: { mixed: 3 }, next: "q_block" },
        ],
      },
      q_block: {
        type: "question" as const,
        id: "q_block",
        prompt: "What's stopping you?",
        input: "single-choice" as const,
        options: [
          { id: "overwhelm", label: "Too much — don't know which part first", score: { overwhelm: 3 }, next: "q_distraction" },
          { id: "hard", label: "It's hard — afraid of getting stuck", score: { hard: 3 }, next: "q_distraction" },
          { id: "boring", label: "Boring — I'd rather do anything else", score: { boring: 3 }, next: "q_distraction" },
          { id: "late", label: "It's late — I'm tired", score: { tired: 3 }, next: "q_distraction" },
        ],
      },
      q_distraction: {
        type: "question" as const,
        id: "q_distraction",
        prompt: "Biggest distraction right now?",
        input: "single-choice" as const,
        options: [
          { id: "phone", label: "Phone or social media", score: { phone: 3 }, next: "q_due" },
          { id: "games", label: "Games or videos", score: { games: 3 }, next: "q_due" },
          { id: "chat", label: "Friends or family", score: { chat: 2 }, next: "q_due" },
          { id: "none", label: "Just can't mentally start", score: { mental: 2 }, next: "q_due" },
        ],
      },
      q_due: {
        type: "question" as const,
        id: "q_due",
        prompt: "When is it due?",
        input: "single-choice" as const,
        options: [
          { id: "tonight", label: "Tonight or tomorrow", score: { urgent: 3 }, next: "branch_result" },
          { id: "week", label: "This week", score: { soon: 2 }, next: "branch_result" },
          { id: "later", label: "More than a week", score: { later: 1 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.writing >= 2 && scores.overwhelm >= 2", next: "result_writing" },
          { when: "scores.phone >= 2 || scores.games >= 2", next: "result_phone" },
          { when: "scores.hard >= 2", next: "result_hard" },
          { when: "scores.boring >= 2", next: "result_boring" },
          { when: "scores.tired >= 2", next: "result_tired" },
          { when: "scores.mixed >= 2", next: "result_mixed" },
        ],
        default: "result_start",
      },
      result_writing: { type: "result" as const, id: "result_writing", resultTemplateId: "writing" },
      result_phone: { type: "result" as const, id: "result_phone", resultTemplateId: "phone" },
      result_hard: { type: "result" as const, id: "result_hard", resultTemplateId: "hard" },
      result_boring: { type: "result" as const, id: "result_boring", resultTemplateId: "boring" },
      result_tired: { type: "result" as const, id: "result_tired", resultTemplateId: "tired" },
      result_mixed: { type: "result" as const, id: "result_mixed", resultTemplateId: "mixed" },
      result_start: { type: "result" as const, id: "result_start", resultTemplateId: "start" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your homework start plan.",
    templates: [
      { id: "writing", cards: [{ title: "First move", valueTemplate: "Bad outline in 10 min", descriptionTemplate: "Don't write the essay — bullet three messy points only." }], summaryTemplates: ["Titles and bullets unlock writing faster than a blank page."] },
      { id: "phone", cards: [{ title: "First move", valueTemplate: "Phone away, 25-min block", descriptionTemplate: "Homework doesn't start until the phone is in another room." }], summaryTemplates: ["One Pomodoro before any entertainment."] },
      { id: "hard", cards: [{ title: "First move", valueTemplate: "One problem or paragraph", descriptionTemplate: "Do the easiest piece — or read the prompt twice and underline verbs." }], summaryTemplates: ["Stuck is normal — start with what's doable, ask for help on the rest."] },
      { id: "boring", cards: [{ title: "First move", valueTemplate: "Reward-locked start", descriptionTemplate: "Pick a reward after 20 minutes — only available if timer completes." }], summaryTemplates: ["Pair boring with music or a café if possible."] },
      { id: "tired", cards: [{ title: "First move", valueTemplate: "Minimum viable homework", descriptionTemplate: "One assignment part only — stop before exhaustion makes it worse." }], summaryTemplates: ["15 minutes tonight beats zero — protect sleep for tomorrow."] },
      { id: "mixed", cards: [{ title: "First move", valueTemplate: "Pick smallest assignment", descriptionTemplate: "List everything — circle the quickest win, do that first." }], summaryTemplates: ["Momentum from one checkmark pulls the rest."] },
      { id: "start", cards: [{ title: "First move", valueTemplate: "Open materials now", descriptionTemplate: "Book open, doc created, calculator out — physical setup triggers start." }], summaryTemplates: ["Sit in homework spot — same place daily if you can."] },
    ],
  },

  recommendations: [
    { id: "rec-writing", when: "scores.writing >= 2", title: "Homework: writing start", steps: ["Create doc titled \"Rough — ignore quality.\"", "Timer 10 min — bullet thesis + 3 supports only.", "Write one bad introduction sentence.", "Stop — tomorrow expand one bullet."] },
    { id: "rec-phone", when: "scores.phone >= 2 || scores.games >= 2", title: "Homework: distraction lock", steps: ["Phone in kitchen or parent's room.", "Website blocker on games/YouTube for 45 min.", "Tell someone you're starting — accountability text.", "25 min work, 5 min break — repeat twice max tonight."] },
    { id: "rec-hard", when: "scores.hard >= 2", title: "Homework: unstuck plan", steps: ["Read instructions aloud — underline what's asked.", "Try one problem for 5 min — write what you tried.", "If stuck, email teacher/classmate one specific question.", "Partial credit beats blank submission."] },
    { id: "rec-boring", when: "scores.boring >= 2", title: "Homework: engagement plan", steps: ["Study playlist or lo-fi — same every session.", "Snack only after first 15 minutes.", "Change seat — library or kitchen table.", "Fake deadline: tell friend you'll send photo of done work by 8pm."] },
    { id: "rec-tired", when: "scores.tired >= 2", title: "Homework: tired night plan", steps: ["Pick ONE subject tonight — not all.", "Set 15-minute timer — stop when it rings.", "Prioritize what's due first.", "Wake 20 min early tomorrow if needed — sleep still matters."] },
    { id: "rec-mixed", when: "scores.mixed >= 2", title: "Homework: triage plan", steps: ["List assignments with due dates.", "Star the one due soonest.", "Break starred item into 5-minute steps.", "Do step 1 only — reassess."] },
    { id: "rec-start", when: "true", title: "Homework: universal start", steps: ["Clear desk — water only, no phone.", "Open the exact page or file.", "Set 5-minute timer — permission to stop after.", "Usually you'll keep going once started."] },
  ],

  guidance: [],
  ctas: { app: { title: "Homework mode on", description: "Reset blocks games and social during study hours — so starting homework isn't a fight with your phone every night." } },
  faq: [
    { question: "How do I start homework when I don't feel like it?", answer: "Don't wait to feel like it. Five-minute rule: open materials, one tiny action, timer. Motivation often follows start." },
    { question: "Is it OK to do homework late at night?", answer: "Sometimes unavoidable — do the minimum well, protect sleep, avoid all-nighters when possible. Tired work takes twice as long." },
    { question: "What if homework takes hours?", answer: "Break into Pomodoros with real breaks. Start with the hardest subject first while energy is highest." },
  ],
} satisfies Record<string, unknown>;
