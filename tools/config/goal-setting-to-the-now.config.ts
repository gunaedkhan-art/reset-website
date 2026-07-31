export const goalSettingToTheNowConfig = {
  schemaVersion: "1.0" as const,
  id: "goal-setting-to-the-now",
  slug: "goal-setting-to-the-now",
  status: "published" as const,

  seo: {
    title: "Goal Setting to the Now",
    metaDescription:
      "Connect your someday goal to today's action — Gary Keller's Goal Setting to the Now ladder from 5-year vision down to your ONE Thing today. Free guided tool.",
    primaryKeyword: "goal setting to the now",
    secondaryKeywords: [
      "connect goals to daily actions",
      "break down big goals",
      "someday goal to today",
      "one thing goal ladder",
      "gary keller goal setting",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/goal-setting-to-the-now",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["one-thing", "goals", "planning"],
    cluster: "one-thing",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Goal Setting to the Now",
    intro:
      "Big goals fail when they never reach today. Four questions to find where your goal ladder breaks — and reconnect someday to this week's ONE Thing.",
    icon: "target",
    proseTitle: "About the goal ladder",
    sections: [
      {
        id: "problem",
        heading: "When someday never becomes today",
        framework: "pas",
        body: "You have a vision but daily tasks feel disconnected. Motivation leaks because today's to-do list doesn't obviously build toward the life you want — so urgent noise wins over important progress.",
      },
      {
        id: "concept",
        heading: "Keller's Goal Setting to the Now",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) connects Someday → 5-year → 1-year → monthly → weekly → daily through the [Focusing Question](https://www.the1thing.com/) at each rung. Each answer must connect to the level above or the ladder breaks.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Diagnosis of where your ladder breaks — missing rung, weak link, or today's action disconnected from the top — plus steps to reconnect goals to now.",
      },
    ],
    eyebrow: "Goal ladder",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_someday",
    nodes: {
      q_someday: {
        type: "question" as const,
        id: "q_someday",
        prompt: "Do you have a clear \"someday\" goal — a big vision you're working toward?",
        input: "single-choice" as const,
        options: [
          { id: "clear", label: "Yes — I can describe it in one sentence", score: { someday_clear: 3 }, next: "q_break" },
          { id: "vague", label: "Sort of — a direction but not a specific outcome", score: { someday_vague: 3 }, next: "q_break" },
          { id: "none", label: "No — I'm reacting day to day", score: { someday_none: 3 }, next: "q_break" },
        ],
      },
      q_break: {
        type: "question" as const,
        id: "q_break",
        prompt: "Where does your goal ladder break down most?",
        input: "single-choice" as const,
        options: [
          { id: "five", label: "I can't connect someday to the next 5 years", score: { break_five: 3 }, next: "q_domain" },
          { id: "one", label: "5-year is OK but this year's ONE Thing is unclear", score: { break_one: 3 }, next: "q_domain" },
          { id: "month", label: "This year is OK but this month feels fuzzy", score: { break_month: 3 }, next: "q_domain" },
          { id: "week", label: "This month is OK but this week has no lead domino", score: { break_week: 3 }, next: "q_domain" },
          { id: "today", label: "This week is OK but today I still do random tasks", score: { break_today: 3 }, next: "q_domain" },
        ],
      },
      q_domain: {
        type: "question" as const,
        id: "q_domain",
        prompt: "Which life area is this goal ladder for?",
        input: "single-choice" as const,
        options: [
          { id: "career", label: "Career or professional growth", score: { career: 2 }, next: "q_time" },
          { id: "health", label: "Health or fitness", score: { health: 2 }, next: "q_time" },
          { id: "financial", label: "Financial — saving, debt, income", score: { financial: 2 }, next: "q_time" },
          { id: "creative", label: "Creative project or business", score: { creative: 2 }, next: "q_time" },
          { id: "relationship", label: "Relationship or family", score: { relationship: 2 }, next: "q_time" },
        ],
      },
      q_time: {
        type: "question" as const,
        id: "q_time",
        prompt: "How much time can you protect weekly for this goal?",
        input: "single-choice" as const,
        options: [
          { id: "little", label: "Under 3 hours — squeezed in when possible", score: { time_little: 2 }, next: "branch_result" },
          { id: "some", label: "3–8 hours — a few focused blocks", score: { time_some: 2 }, next: "branch_result" },
          { id: "serious", label: "8+ hours — significant weekly investment", score: { time_serious: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.someday_none >= 2", next: "result_no_someday" },
          { when: "scores.someday_vague >= 2", next: "result_vague_someday" },
          { when: "scores.break_five >= 2", next: "result_five_year" },
          { when: "scores.break_one >= 2", next: "result_one_year" },
          { when: "scores.break_month >= 2", next: "result_monthly" },
          { when: "scores.break_week >= 2", next: "result_weekly" },
          { when: "scores.break_today >= 2", next: "result_daily" },
        ],
        default: "result_connected",
      },
      result_no_someday: { type: "result" as const, id: "result_no_someday", resultTemplateId: "no_someday" },
      result_vague_someday: { type: "result" as const, id: "result_vague_someday", resultTemplateId: "vague_someday" },
      result_five_year: { type: "result" as const, id: "result_five_year", resultTemplateId: "five_year" },
      result_one_year: { type: "result" as const, id: "result_one_year", resultTemplateId: "one_year" },
      result_monthly: { type: "result" as const, id: "result_monthly", resultTemplateId: "monthly" },
      result_weekly: { type: "result" as const, id: "result_weekly", resultTemplateId: "weekly" },
      result_daily: { type: "result" as const, id: "result_daily", resultTemplateId: "daily" },
      result_connected: { type: "result" as const, id: "result_connected", resultTemplateId: "connected" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to find where your goal ladder breaks.",
    templates: [
      {
        id: "no_someday",
        cards: [
          { title: "Broken rung", valueTemplate: "No someday goal", descriptionTemplate: "Without a destination, daily tasks can't connect — you're climbing a ladder with no top." },
          { title: "Fix", valueTemplate: "Start at Someday", descriptionTemplate: "Write one sentence: \"Someday I want to ___\" — be specific enough to feel real." },
        ],
        summaryTemplates: ["You can't Goal Setting to the Now without a Someday — start there tonight."],
      },
      {
        id: "vague_someday",
        cards: [
          { title: "Broken rung", valueTemplate: "Vague someday", descriptionTemplate: "\"Be successful\" isn't a domino — you need a concrete someday outcome." },
          { title: "Fix", valueTemplate: "Sharpen Someday", descriptionTemplate: "Add numbers or evidence: income, weight, published, launched, saved." },
        ],
        summaryTemplates: ["Specific someday goals make every lower rung easier to answer."],
      },
      {
        id: "five_year",
        cards: [
          { title: "Broken rung", valueTemplate: "Someday → 5-year gap", descriptionTemplate: "Your vision exists but the first major milestone isn't defined." },
          { title: "Fix", valueTemplate: "Ask the 5-year question", descriptionTemplate: "Based on my Someday goal, what's the ONE Thing I want to achieve in 5 years?" },
        ],
        summaryTemplates: ["Five years is close enough to plan, far enough to think big."],
      },
      {
        id: "one_year",
        cards: [
          { title: "Broken rung", valueTemplate: "5-year → 1-year gap", descriptionTemplate: "Long vision without this year's ONE Thing — months drift without a anchor." },
          { title: "Fix", valueTemplate: "Ask the 1-year question", descriptionTemplate: "Based on my 5-year goal, what's the ONE Thing I must do this year?" },
        ],
        summaryTemplates: ["This year's ONE Thing should make the 5-year goal easier or unnecessary to rethink."],
      },
      {
        id: "monthly",
        cards: [
          { title: "Broken rung", valueTemplate: "1-year → monthly gap", descriptionTemplate: "Annual goal without a monthly domino — weeks fill with urgent noise." },
          { title: "Fix", valueTemplate: "Ask the monthly question", descriptionTemplate: "Based on my 1-year goal, what's the ONE Thing this month?" },
        ],
        summaryTemplates: ["Monthly ONE Things are small enough to act on, big enough to matter."],
      },
      {
        id: "weekly",
        cards: [
          { title: "Broken rung", valueTemplate: "Monthly → weekly gap", descriptionTemplate: "You know the month but not the week's lead domino." },
          { title: "Fix", valueTemplate: "Ask the weekly question", descriptionTemplate: "Based on my monthly goal, what's the ONE Thing this week?" },
        ],
        summaryTemplates: ["Sunday planning: one weekly ONE Thing, then daily dominoes beneath it."],
      },
      {
        id: "daily",
        cards: [
          { title: "Broken rung", valueTemplate: "Weekly → daily gap", descriptionTemplate: "Good weekly intent but today still reactive — the ladder stops one rung short." },
          { title: "Fix", valueTemplate: "Ask today's question", descriptionTemplate: "Based on my weekly goal, what's the ONE Thing I can do today?" },
        ],
        summaryTemplates: ["Today's ONE Thing should be doable in one focused block."],
      },
      {
        id: "connected",
        cards: [
          { title: "Ladder status", valueTemplate: "Mostly connected", descriptionTemplate: "Your goals likely link — tighten the weakest rung with the Focusing Question." },
          { title: "Fix", valueTemplate: "Stress-test today", descriptionTemplate: "Can you explain how today's top task serves your someday goal in one sentence?" },
        ],
        summaryTemplates: ["If you can't connect today to someday, today's task may be the wrong ONE Thing."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-no-someday",
      when: "scores.someday_none >= 2",
      title: "Build your ladder from the top",
      steps: [
        "Tonight: 15 minutes — write \"Someday I want to ___\" in one area of life.",
        "Pick the area that would change most if you succeeded.",
        "Don't optimize — one sentence, gut answer.",
        "Tomorrow: ask the 5-year Focusing Question from that someday goal.",
      ],
    },
    {
      id: "rec-five",
      when: "scores.break_five >= 2",
      title: "Someday → 5-year bridge",
      steps: [
        "Write your someday goal at top of a page.",
        "Ask: \"What's the ONE Thing in 5 years such that by achieving it my someday goal is easier?\"",
        "Write the 5-year answer — one outcome only.",
        "Ask the 1-year question from there — continue the ladder.",
      ],
    },
    {
      id: "rec-one",
      when: "scores.break_one >= 2",
      title: "5-year → 1-year bridge",
      steps: [
        "List what must be true in 5 years — pick the biggest gap from today.",
        "Ask: \"What's the ONE Thing this year toward that 5-year outcome?\"",
        "Cut other annual goals that split focus — Keller: go small.",
        "Calendar one monthly review to check alignment.",
      ],
    },
    {
      id: "rec-month",
      when: "scores.break_month >= 2",
      title: "1-year → monthly bridge",
      steps: [
        "Divide the year into 4 quarters — what's the ONE Thing Q1?",
        "This month: which domino starts the quarterly ONE?",
        "Block time this week for the monthly ONE before adding tasks.",
        "Defer new commitments that don't serve the monthly domino.",
      ],
    },
    {
      id: "rec-week",
      when: "scores.break_week >= 2",
      title: "Monthly → weekly bridge",
      steps: [
        "Sunday: \"Based on my monthly ONE Thing, what's the ONE Thing this week?\"",
        "Write it on paper — visible all week.",
        "Each morning: \"What's today's ONE Thing toward the weekly ONE?\"",
        "Friday: did the week serve the monthly goal? Adjust.",
      ],
    },
    {
      id: "rec-today",
      when: "scores.break_today >= 2",
      title: "Weekly → daily bridge",
      steps: [
        "Each evening: write tomorrow's ONE Thing — one sentence.",
        "Must connect to weekly ONE — if it doesn't, pick a different task.",
        "Block 60–90 minutes first thing for tomorrow's ONE.",
        "Use the time-block calculator to protect the slot.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "The full ladder (write this down)",
      steps: [
        "Someday: What's the ONE Thing I want to someday achieve?",
        "5-year → 1-year → monthly → weekly → daily — same question, smaller horizon.",
        "Each answer should make the next question easier.",
        "When stuck, use the Focusing Question tool for the broken rung.",
      ],
    },
  ],

  guidance: [
    {
      title: "Goal Setting to the Now",
      body: "Keller's method links big vision to daily action through cascading Focusing Questions — one rung at a time.",
      list: [
        "Someday → 5-year → 1-year → monthly → weekly → daily",
        "Each level asks the same ONE Thing question for that horizon",
        "If today doesn't connect to someday, motivation and clarity suffer",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Execute today's rung on the ladder",
      description:
        "Reset blocks distractions during your daily ONE Thing block — so the ladder reaches the ground, not just the whiteboard.",
    },
  },

  faq: [
    {
      question: "What is Goal Setting to the Now?",
      answer:
        "A method from The ONE Thing that connects your someday goal to today's action by asking the Focusing Question at each time horizon — 5-year, 1-year, monthly, weekly, and daily.",
    },
    {
      question: "How many goals should I have?",
      answer:
        "One ONE Thing per domain per horizon. Multiple goals at the same level means going small on all of them — Keller's \"economic reality.\"",
    },
    {
      question: "What if my someday goal changes?",
      answer:
        "Normal — revisit the ladder quarterly. Change someday, then re-ask each rung down to today. A broken connection is worse than a changed goal.",
    },
  ],
} satisfies Record<string, unknown>;
