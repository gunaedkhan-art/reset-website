export const whatShouldIDoInsteadOfScrollingConfig = {
  schemaVersion: "1.0" as const,
  id: "what-should-i-do-instead-of-scrolling",
  slug: "what-should-i-do-instead-of-scrolling",
  status: "published" as const,

  seo: {
    title: "What Should I Do Instead of Scrolling?",
    metaDescription:
      "About to scroll? Answer 3 quick questions and get one better thing to do right now — free replacement activity picker in under 60 seconds.",
    primaryKeyword: "what should i do instead of scrolling",
    secondaryKeywords: [
      "instead of scrolling",
      "alternatives to scrolling",
      "bored what to do instead of phone",
      "stop scrolling what to do",
      "replace scrolling habit",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/what-should-i-do-instead-of-scrolling",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["scrolling", "alternatives", "boredom"],
    cluster: "doomscrolling",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "What Should I Do Instead of Scrolling?",
    intro:
      "You caught the urge — good. Three questions and you'll get one concrete replacement that fits your energy, time, and location.",
    icon: "checklist",
    proseTitle: "About scroll replacements",
    sections: [
      {
        id: "problem",
        heading: "The urge without a plan",
        framework: "pas",
        body: "You know you shouldn't scroll — but boredom, anxiety, or habit leaves a void. Without a ready alternative, the feed wins by default because it's always there.",
      },
      {
        id: "concept",
        heading: "Replace, don't just resist",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) recommends high-quality leisure alternatives in [Digital Minimalism](https://calnewport.com/books/digital-minimalism/) — activities that satisfy the same need (rest, connection, stimulation) without the infinite feed.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "One specific replacement activity matched to how much time you have, your energy, and where you are — something you can do in the next few minutes.",
      },
    ],
    eyebrow: "Scroll swap picker",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_time",
    nodes: {
      q_time: {
        type: "question" as const,
        id: "q_time",
        prompt: "How much time do you have?",
        input: "single-choice" as const,
        options: [
          { id: "two", label: "2–5 minutes", score: { short: 3 }, next: "q_energy" },
          { id: "fifteen", label: "10–15 minutes", score: { medium: 3 }, next: "q_energy" },
          { id: "long", label: "30+ minutes", score: { long: 3 }, next: "q_energy" },
        ],
      },
      q_energy: {
        type: "question" as const,
        id: "q_energy",
        prompt: "What's your energy level?",
        input: "single-choice" as const,
        options: [
          { id: "low", label: "Low — tired or drained", score: { low: 3 }, next: "q_place" },
          { id: "medium", label: "Medium — OK but restless", score: { medium: 2 }, next: "q_place" },
          { id: "high", label: "High — antsy, need to move", score: { high: 3 }, next: "q_place" },
        ],
      },
      q_place: {
        type: "question" as const,
        id: "q_place",
        prompt: "Where are you?",
        input: "single-choice" as const,
        options: [
          { id: "home", label: "Home", score: { home: 1 }, next: "q_goal" },
          { id: "work", label: "Work or school", score: { work: 1 }, next: "q_goal" },
          { id: "public", label: "Out in public", score: { public: 1 }, next: "q_goal" },
        ],
      },
      q_goal: {
        type: "question" as const,
        id: "q_goal",
        prompt: "What would feel best?",
        input: "single-choice" as const,
        options: [
          { id: "rest", label: "Real rest — not more input", score: { rest: 3 }, next: "branch_result" },
          { id: "productive", label: "Something useful", score: { productive: 3 }, next: "branch_result" },
          { id: "social", label: "Connection with a person", score: { social: 3 }, next: "branch_result" },
          { id: "body", label: "Move my body", score: { body: 3 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.body >= 2 || scores.high >= 2", next: "result_move" },
          { when: "scores.rest >= 2 && scores.low >= 2", next: "result_rest" },
          { when: "scores.productive >= 2", next: "result_productive" },
          { when: "scores.social >= 2", next: "result_social" },
          { when: "scores.short >= 2", next: "result_quick" },
        ],
        default: "result_default",
      },
      result_move: { type: "result" as const, id: "result_move", resultTemplateId: "move" },
      result_rest: { type: "result" as const, id: "result_rest", resultTemplateId: "rest" },
      result_productive: { type: "result" as const, id: "result_productive", resultTemplateId: "productive" },
      result_social: { type: "result" as const, id: "result_social", resultTemplateId: "social" },
      result_quick: { type: "result" as const, id: "result_quick", resultTemplateId: "quick" },
      result_default: { type: "result" as const, id: "result_default", resultTemplateId: "default" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your scroll replacement.",
    templates: [
      { id: "move", cards: [{ title: "Do this instead", valueTemplate: "Move for 10 minutes", descriptionTemplate: "Walk outside, stretch, or do a quick workout — discharge the restlessness." }], summaryTemplates: ["Put shoes on before you decide — motion beats the feed."] },
      { id: "rest", cards: [{ title: "Do this instead", valueTemplate: "True rest break", descriptionTemplate: "Lie down, eyes closed, no input — 10 minutes of actual recovery." }], summaryTemplates: ["Scrolling isn't rest. Silence is."] },
      { id: "productive", cards: [{ title: "Do this instead", valueTemplate: "One tiny task", descriptionTemplate: "Pick the smallest useful thing: one dish, one email, one paragraph." }], summaryTemplates: ["2-minute rule — you'll feel better after one win."] },
      { id: "social", cards: [{ title: "Do this instead", valueTemplate: "Reach out to one person", descriptionTemplate: "Voice note or call someone you miss — real connection beats parasocial scroll." }], summaryTemplates: ["Text \"thinking of you\" to one person — not a group chat lurk."] },
      { id: "quick", cards: [{ title: "Do this instead", valueTemplate: "2-minute reset", descriptionTemplate: "Water, window, 10 deep breaths — enough to break the urge." }], summaryTemplates: ["Set a timer — if you still want to scroll after, reassess."] },
      { id: "default", cards: [{ title: "Do this instead", valueTemplate: "Read 5 pages", descriptionTemplate: "Physical book or Kindle — one chapter's worth of real content." }], summaryTemplates: ["Keep book where you usually grab your phone."] },
    ],
  },

  recommendations: [
    { id: "rec-move", when: "scores.body >= 2 || scores.high >= 2", title: "Your move swap", steps: ["Stand up before opening any app.", "Walk to the end of the block and back.", "If indoors: 20 jumping jacks or stairs once.", "Phone stays in pocket until you return."] },
    { id: "rec-rest", when: "scores.rest >= 2 && scores.low >= 2", title: "Your real rest swap", steps: ["Phone face-down in another room.", "Set timer 10 min — eyes closed or soft music only.", "No podcasts or audiobooks — that's input.", "Stand slowly when timer ends."] },
    { id: "rec-productive", when: "scores.productive >= 2", title: "Your micro-task swap", steps: ["Write one task that takes under 5 minutes.", "Do it immediately — timer optional.", "Cross it off on paper for satisfaction.", "Then choose: rest or another micro-task."] },
    { id: "rec-social", when: "scores.social >= 2", title: "Your connection swap", steps: ["Call one person for 5 minutes — voice beats text.", "Or write a thoughtful message to someone specific.", "No feeds — direct contact only.", "Schedule coffee if you want longer connection."] },
    { id: "rec-quick", when: "scores.short >= 2", title: "Your urge interrupt", steps: ["Drink a full glass of water.", "Look at something 20 feet away for 20 seconds.", "Ask: \"What do I actually need?\" — bored, tired, lonely?", "Match need to action, not scroll."] },
    { id: "rec-default", when: "true", title: "Your default swap list", steps: ["Keep a sticky on phone: \"Read / Walk / Text one person.\"", "Rotate swaps — same replacement gets boring.", "Log which swaps work — build your personal list.", "Use Reset to block feeds during swap hours."] },
  ],

  guidance: [],
  ctas: { app: { title: "Make scrolling the backup plan", description: "Reset blocks feeds by default during focus and downtime windows — so better options become the path of least resistance." } },
  faq: [
    { question: "Why do I scroll when I'm bored?", answer: "Feeds offer infinite low-effort stimulation. Boredom is a signal — match it with rest, movement, or a tiny task instead of passive input." },
    { question: "What if I do the alternative and still want to scroll?", answer: "Wait 10 minutes. If the urge persists, set a 15-minute scroll timer — bounded beats endless." },
    { question: "Does this work at night in bed?", answer: "At night, best swaps are book, podcast with screen off, or sleep. Remove the phone from arm's reach entirely." },
  ],
} satisfies Record<string, unknown>;
