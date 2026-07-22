export const iDontKnowWhereToStartConfig = {
  schemaVersion: "1.0" as const,
  id: "i-dont-know-where-to-start",
  slug: "i-dont-know-where-to-start",
  status: "published" as const,

  seo: {
    title: "I Don't Know Where to Start",
    metaDescription:
      "Stuck at the starting line? Answer 4 questions and get one clear first step — free interactive tool for when you don't know where to begin.",
    primaryKeyword: "i don't know where to start",
    secondaryKeywords: [
      "don't know where to start",
      "how to start a project",
      "can't get started",
      "where do i begin",
      "starting overwhelm",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/i-dont-know-where-to-start",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["getting-started", "planning", "procrastination"],
    cluster: "getting-started",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "I Don't Know Where to Start",
    intro:
      "Starting isn't about motivation — it's about making the next step small enough that your brain says yes. Four questions, one first move.",
    eyebrow: "First-step finder",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_stuck",
    nodes: {
      q_stuck: {
        type: "question" as const,
        id: "q_stuck",
        prompt: "What are you trying to start?",
        input: "single-choice" as const,
        options: [
          { id: "project", label: "A project or big goal", score: { big: 3 }, next: "q_block" },
          { id: "task", label: "One task I've been avoiding", score: { task: 2 }, next: "q_block" },
          { id: "day", label: "My day — too many options", score: { day: 3 }, next: "q_block" },
          { id: "life", label: "A life change (habit, career, health)", score: { life: 3 }, next: "q_block" },
        ],
      },
      q_block: {
        type: "question" as const,
        id: "q_block",
        prompt: "What's blocking the start?",
        input: "single-choice" as const,
        options: [
          { id: "big", label: "It feels too big or vague", score: { vague: 3 }, next: "q_info" },
          { id: "fear", label: "I'm afraid of doing it wrong", score: { fear: 3 }, next: "q_info" },
          { id: "choice", label: "Too many possible first steps", score: { choice: 3 }, next: "q_info" },
          { id: "energy", label: "I don't have the energy yet", score: { energy: 2 }, next: "q_info" },
        ],
      },
      q_info: {
        type: "question" as const,
        id: "q_info",
        prompt: "How much do you know about what \"done\" looks like?",
        input: "single-choice" as const,
        options: [
          { id: "clear", label: "Clear end goal — stuck on first step", score: { clear: 1 }, next: "q_deadline" },
          { id: "fuzzy", label: "Fuzzy — I know the area, not the target", score: { fuzzy: 2 }, next: "q_deadline" },
          { id: "none", label: "No idea — I'm exploring", score: { explore: 3 }, next: "q_deadline" },
        ],
      },
      q_deadline: {
        type: "question" as const,
        id: "q_deadline",
        prompt: "Is there external pressure to start soon?",
        input: "single-choice" as const,
        options: [
          { id: "yes", label: "Yes — deadline or someone waiting", score: { pressure: 2 }, next: "branch_result" },
          { id: "no", label: "No — it's self-imposed", score: { self: 1 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.vague >= 2 || scores.big >= 2", next: "result_shrink" },
          { when: "scores.fear >= 2", next: "result_fear" },
          { when: "scores.choice >= 2 || scores.day >= 2", next: "result_choice" },
          { when: "scores.explore >= 2", next: "result_explore" },
          { when: "scores.energy >= 2", next: "result_energy" },
        ],
        default: "result_step",
      },
      result_shrink: { type: "result" as const, id: "result_shrink", resultTemplateId: "shrink" },
      result_fear: { type: "result" as const, id: "result_fear", resultTemplateId: "fear" },
      result_choice: { type: "result" as const, id: "result_choice", resultTemplateId: "choice" },
      result_explore: { type: "result" as const, id: "result_explore", resultTemplateId: "explore" },
      result_energy: { type: "result" as const, id: "result_energy", resultTemplateId: "energy" },
      result_step: { type: "result" as const, id: "result_step", resultTemplateId: "step" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your first step.",
    templates: [
      { id: "shrink", cards: [{ title: "Your blocker", valueTemplate: "Project too big", descriptionTemplate: "You're trying to start the whole thing — not the next inch." }], summaryTemplates: ["Your plan shrinks the start to a 2-minute physical action."] },
      { id: "fear", cards: [{ title: "Your blocker", valueTemplate: "Fear of wrong", descriptionTemplate: "Starting feels like committing to a mistake." }], summaryTemplates: ["Your plan makes the first step deliberately imperfect."] },
      { id: "choice", cards: [{ title: "Your blocker", valueTemplate: "Decision paralysis", descriptionTemplate: "Too many paths — so you pick none." }], summaryTemplates: ["Your plan picks one path with a 20-minute time box."] },
      { id: "explore", cards: [{ title: "Your blocker", valueTemplate: "Unclear destination", descriptionTemplate: "You need discovery before execution." }], summaryTemplates: ["Your plan uses a 15-minute research cap, then one experiment."] },
      { id: "energy", cards: [{ title: "Your blocker", valueTemplate: "Low activation", descriptionTemplate: "The task is fine — your engine isn't warm." }], summaryTemplates: ["Your plan warms up with movement, then a 5-minute start."] },
      { id: "step", cards: [{ title: "Your blocker", valueTemplate: "Missing first step", descriptionTemplate: "You know the goal — the next action isn't defined." }], summaryTemplates: ["Your plan writes one verb + one object — then does it."] },
    ],
  },

  recommendations: [
    { id: "rec-shrink", when: "scores.vague >= 2 || scores.big >= 2", title: "Your shrink-to-start plan", steps: ["Write the project in one sentence.", "Ask: \"What's the smallest visible version?\" — 2 minutes max.", "Do that action now — open doc, one line, one email draft.", "Stop after the micro-step — you started."] },
    { id: "rec-fear", when: "scores.fear >= 2", title: "Your messy-first plan", steps: ["Title a doc \"Bad first draft — delete later.\"", "Set 10-minute timer — quantity over quality.", "Share nothing until timer ends.", "Remind yourself: done beats perfect at the start."] },
    { id: "rec-choice", when: "scores.choice >= 2 || scores.day >= 2", title: "Your pick-one plan", steps: ["List 3 possible starts — flip a coin if needed.", "Commit: 20 minutes on the winner only.", "When timer ends, keep going or switch — but you started.", "For daily overwhelm: pick ONE outcome for today."] },
    { id: "rec-explore", when: "scores.explore >= 2", title: "Your explore-then-act plan", steps: ["15-minute research timer — 3 sources max.", "Write: \"What I learned\" in 5 bullets.", "Choose one experiment you can run in 30 minutes.", "Run the experiment — exploration becomes action."] },
    { id: "rec-energy", when: "scores.energy >= 2", title: "Your warm-up plan", steps: ["Walk or stretch for 5 minutes.", "Drink water — dehydration feels like resistance.", "Do the easiest 2-minute part of the task.", "Optional: schedule the hard part for your peak energy window."] },
    { id: "rec-step", when: "true", title: "Your one-line plan", steps: ["Finish this sentence: \"The next physical action is ___\".", "Must be doable in under 5 minutes.", "Do it before opening email or messages.", "Write tomorrow's first action before you stop today."] },
  ],

  guidance: [],
  ctas: { app: { title: "Start — then stay started", description: "Reset blocks the distractions that pull you away the moment you finally begin — so the first step turns into real progress." } },
  faq: [
    { question: "Why can't I start even when I care?", answer: "Your brain resists ambiguous or high-stakes starts. Shrinking the first step lowers the threat response — action creates clarity." },
    { question: "How small should the first step be?", answer: "Small enough to do in 2–5 minutes without preparation. Open the file, write one line, send one message — not \"work on project.\"" },
    { question: "What if I still can't start after the plan?", answer: "The step is still too big or you're depleted. Shrink again or rest — forcing rarely works twice in a row." },
  ],
} satisfies Record<string, unknown>;
