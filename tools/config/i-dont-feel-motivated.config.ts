export const iDontFeelMotivatedConfig = {
  schemaVersion: "1.0" as const,
  id: "i-dont-feel-motivated",
  slug: "i-dont-feel-motivated",
  status: "published" as const,

  seo: {
    title: "I Don't Feel Motivated",
    metaDescription:
      "No motivation? Answer 4 questions to find out why and get practical steps that work without waiting to \"feel like it\" — free tool in 60 seconds.",
    primaryKeyword: "i don't feel motivated",
    secondaryKeywords: [
      "no motivation",
      "lack of motivation",
      "not motivated to do anything",
      "how to get motivated",
      "zero motivation",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/i-dont-feel-motivated",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["motivation", "energy", "habits"],
    cluster: "motivation",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "I Don't Feel Motivated",
    intro:
      "Four questions to find what's draining you and a plan that doesn't depend on feeling inspired.",
    icon: "focus",
    proseTitle: "About motivation",
    sections: [
      {
        id: "problem",
        heading: "Waiting to feel ready",
        framework: "pas",
        body: "You know what to do but can't summon the energy — so tasks slip while you wait for inspiration that doesn't arrive on schedule.",
      },
      {
        id: "concept",
        heading: "Action before motivation",
        framework: "concept",
        body: "Motivation often follows motion, not the reverse. Small starts, fixed cues, and environment design beat waiting to \"feel like it\" — especially for work that matters but isn't exciting.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "What's draining you — fatigue, meaning gap, fear, or habit drift — plus a plan built on action triggers, not willpower.",
      },
    ],
    eyebrow: "Motivation diagnostic",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_scope",
    nodes: {
      q_scope: {
        type: "question" as const,
        id: "q_scope",
        prompt: "What lacks motivation?",
        input: "single-choice" as const,
        options: [
          { id: "work", label: "Work or school", score: { work: 2 }, next: "q_feel" },
          { id: "health", label: "Exercise, health, or self-care", score: { health: 2 }, next: "q_feel" },
          { id: "personal", label: "Personal goals and projects", score: { personal: 2 }, next: "q_feel" },
          { id: "everything", label: "Almost everything", score: { global: 3 }, next: "q_feel" },
        ],
      },
      q_feel: {
        type: "question" as const,
        id: "q_feel",
        prompt: "Which feels closest?",
        input: "single-choice" as const,
        options: [
          { id: "empty", label: "Empty or numb — nothing sounds good", score: { empty: 3 }, next: "q_cause" },
          { id: "tired", label: "Exhausted — I want to but can't", score: { tired: 3 }, next: "q_cause" },
          { id: "bored", label: "Bored — the task doesn't excite me", score: { bored: 3 }, next: "q_cause" },
          { id: "pointless", label: "What's the point? — meaning feels low", score: { meaning: 3 }, next: "q_cause" },
        ],
      },
      q_cause: {
        type: "question" as const,
        id: "q_cause",
        prompt: "When did motivation drop?",
        input: "single-choice" as const,
        options: [
          { id: "recent", label: "Recently — days or a week", score: { acute: 1 }, next: "q_action" },
          { id: "while", label: "A while — weeks or months", score: { sustained: 2 }, next: "q_action" },
          { id: "always", label: "I've rarely felt motivated", score: { chronic: 2 }, next: "q_action" },
        ],
      },
      q_action: {
        type: "question" as const,
        id: "q_action",
        prompt: "Do you still act when motivation is low?",
        input: "single-choice" as const,
        options: [
          { id: "never", label: "Rarely — I wait to feel like it", score: { wait: 3 }, next: "branch_result" },
          { id: "sometimes", label: "Sometimes — inconsistent", score: { mixed: 1 }, next: "branch_result" },
          { id: "force", label: "I force it but burn out", score: { force: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.empty >= 2 || scores.global >= 2", next: "result_empty" },
          { when: "scores.tired >= 2", next: "result_tired" },
          { when: "scores.bored >= 2", next: "result_bored" },
          { when: "scores.meaning >= 2", next: "result_meaning" },
          { when: "scores.wait >= 2", next: "result_wait" },
        ],
        default: "result_momentum",
      },
      result_empty: { type: "result" as const, id: "result_empty", resultTemplateId: "empty" },
      result_tired: { type: "result" as const, id: "result_tired", resultTemplateId: "tired" },
      result_bored: { type: "result" as const, id: "result_bored", resultTemplateId: "bored" },
      result_meaning: { type: "result" as const, id: "result_meaning", resultTemplateId: "meaning" },
      result_wait: { type: "result" as const, id: "result_wait", resultTemplateId: "wait" },
      result_momentum: { type: "result" as const, id: "result_momentum", resultTemplateId: "momentum" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get a motivation-free action plan.",
    templates: [
      { id: "empty", cards: [{ title: "Likely cause", valueTemplate: "Emotional flatness", descriptionTemplate: "Low mood or burnout can flatten motivation — forcing rarely fixes it." }], summaryTemplates: ["Your plan restores basics before demanding output."] },
      { id: "tired", cards: [{ title: "Likely cause", valueTemplate: "Depletion", descriptionTemplate: "You're out of fuel — motivation follows energy, not the reverse." }], summaryTemplates: ["Your plan prioritizes sleep, food, and movement."] },
      { id: "bored", cards: [{ title: "Likely cause", valueTemplate: "Low engagement", descriptionTemplate: "The task doesn't reward you fast enough — willpower fades." }], summaryTemplates: ["Your plan adds stakes, variety, and artificial urgency."] },
      { id: "meaning", cards: [{ title: "Likely cause", valueTemplate: "Meaning gap", descriptionTemplate: "You don't see why it matters — effort feels wasted." }], summaryTemplates: ["Your plan reconnects tasks to a personal \"why\" or smaller win."] },
      { id: "wait", cards: [{ title: "Likely cause", valueTemplate: "Waiting for feeling", descriptionTemplate: "You treat motivation as a prerequisite — it usually arrives after action." }], summaryTemplates: ["Your plan uses identity and tiny commitments, not inspiration."] },
      { id: "momentum", cards: [{ title: "Likely cause", valueTemplate: "Momentum gap", descriptionTemplate: "You need a restart — not more motivation talk." }], summaryTemplates: ["Your plan builds momentum with the smallest possible win today."] },
    ],
  },

  recommendations: [
    { id: "rec-empty", when: "scores.empty >= 2 || scores.global >= 2", title: "Your restore plan", steps: ["Non-negotiables today: sleep window, one meal, 10-minute walk.", "Do one kind task — not the hardest on your list.", "Limit news and feeds — they deepen numbness.", "If this lasts 2+ weeks, talk to someone you trust or a professional."] },
    { id: "rec-tired", when: "scores.tired >= 2", title: "Your energy plan", steps: ["Protect 7+ hours sleep tonight — motivation returns with rest.", "Eat protein at your next meal.", "Do the task in your peak window tomorrow, not now.", "Say no to one optional commitment this week."] },
    { id: "rec-bored", when: "scores.bored >= 2", title: "Your engagement plan", steps: ["Add a reward after 20 minutes — only available if you start.", "Change environment — café, library, different room.", "Use a body double or focus session for accountability.", "Gamify: timer, streak, or bet with a friend."] },
    { id: "rec-meaning", when: "scores.meaning >= 2", title: "Your why plan", steps: ["Write: \"If this gets done, I will feel ___ or gain ___.\"", "Connect task to someone you care about — who benefits?", "If no why exists, question if the task should be dropped.", "Do 10 minutes anyway — meaning sometimes follows motion."] },
    { id: "rec-wait", when: "scores.wait >= 2", title: "Your action-first plan", steps: ["Rule: never wait to feel motivated — start for 5 minutes only.", "Use identity: \"I'm someone who shows up\" — not \"I feel like it.\"", "Same cue daily: time + place + first action prepared.", "Track \"showed up\" days — streaks beat feelings."] },
    { id: "rec-momentum", when: "true", title: "Your one-win plan", steps: ["Pick the easiest task that still matters.", "Set 10-minute timer — start before negotiating with yourself.", "After winning once, chain one more 10-minute block.", "End by scheduling tomorrow's first 5 minutes."] },
  ],

  guidance: [],
  ctas: { app: { title: "Show up without the hype", description: "Reset removes friction and blocks distractions so you can act on low-motivation days — when waiting for inspiration isn't an option." } },
  faq: [
    { question: "Can I get motivated without forcing myself?", answer: "Start tiny — 5 minutes often generates motivation mid-task. Forcing marathons on zero energy backfires; micro-starts don't." },
    { question: "Is lack of motivation depression?", answer: "Persistent emptiness, hopelessness, or loss of interest in everything can signal depression — not laziness. Seek professional support if symptoms persist." },
    { question: "Why don't rewards motivate me anymore?", answer: "Burnout, boredom, or meaning gaps dull reward response. Fix sleep and scope first — then redesign how tasks connect to what you value." },
  ],
} satisfies Record<string, unknown>;
