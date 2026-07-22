export const theFocusingQuestionConfig = {
  schemaVersion: "1.0" as const,
  id: "the-focusing-question",
  slug: "the-focusing-question",
  status: "published" as const,

  seo: {
    title: "The Focusing Question",
    metaDescription:
      "What's the ONE Thing you can do such that by doing it everything else will be easier or unnecessary? Pick your time horizon and domain — get your answer in 60 seconds.",
    primaryKeyword: "the focusing question",
    secondaryKeywords: [
      "what's the one thing",
      "the one thing question",
      "what should my one thing be",
      "one thing today",
      "gary keller focusing question",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/the-focusing-question",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["one-thing", "priorities", "goals"],
    cluster: "one-thing",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "The Focusing Question",
    intro:
      "Gary Keller's Focusing Question: What's the ONE Thing you can do such that by doing it everything else will be easier or unnecessary? Choose your time horizon and area — we'll narrow to one domino worth knocking over.",
    explainer:
      "Extraordinary results come from asking a great question and then living its answer — one time horizon at a time.",
    eyebrow: "ONE Thing finder",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_horizon",
    nodes: {
      q_horizon: {
        type: "question" as const,
        id: "q_horizon",
        prompt: "Which time horizon are you choosing your ONE Thing for?",
        input: "single-choice" as const,
        options: [
          { id: "today", label: "Today — what matters most in the next 24 hours", score: { today: 3 }, next: "q_domain" },
          { id: "week", label: "This week — my lead domino for the next 7 days", score: { week: 3 }, next: "q_domain" },
          { id: "month", label: "This month — the one thing that moves the needle", score: { month: 3 }, next: "q_domain" },
          { id: "year", label: "This year — my singular focus for 12 months", score: { year: 3 }, next: "q_domain" },
        ],
      },
      q_domain: {
        type: "question" as const,
        id: "q_domain",
        prompt: "Which area of life needs your ONE Thing right now?",
        input: "single-choice" as const,
        options: [
          { id: "work", label: "Work or career", score: { work: 3 }, next: "q_stuck" },
          { id: "health", label: "Health or fitness", score: { health: 3 }, next: "q_stuck" },
          { id: "relationships", label: "Relationships or family", score: { relationships: 3 }, next: "q_stuck" },
          { id: "learning", label: "Learning or skill-building", score: { learning: 3 }, next: "q_stuck" },
          { id: "business", label: "Business or side project", score: { business: 3 }, next: "q_stuck" },
        ],
      },
      q_stuck: {
        type: "question" as const,
        id: "q_stuck",
        prompt: "What's making it hard to pick your ONE Thing?",
        input: "single-choice" as const,
        options: [
          { id: "equal", label: "Too many things feel equally important", score: { equal: 3 }, next: "q_leverage" },
          { id: "external", label: "Other people's requests drown out mine", score: { external: 3 }, next: "q_leverage" },
          { id: "vague", label: "I don't know what would actually move the needle", score: { vague: 3 }, next: "q_leverage" },
          { id: "avoid", label: "I know it — I'm avoiding the hard one", score: { avoid: 3 }, next: "q_leverage" },
        ],
      },
      q_leverage: {
        type: "question" as const,
        id: "q_leverage",
        prompt: "Which domino effect fits your situation best?",
        input: "single-choice" as const,
        options: [
          { id: "skill", label: "One skill that unlocks many outcomes", score: { skill: 2 }, next: "branch_result" },
          { id: "relationship", label: "One relationship or conversation that clears the path", score: { relation: 2 }, next: "branch_result" },
          { id: "system", label: "One system or habit that runs on autopilot after", score: { system: 2 }, next: "branch_result" },
          { id: "project", label: "One project milestone that makes everything else easier", score: { project: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.avoid >= 2", next: "result_avoid" },
          { when: "scores.external >= 2", next: "result_external" },
          { when: "scores.vague >= 2", next: "result_vague" },
          { when: "scores.equal >= 2", next: "result_equal" },
          { when: "scores.health >= 2 && scores.today >= 2", next: "result_health_today" },
          { when: "scores.work >= 2 && scores.week >= 2", next: "result_work_week" },
        ],
        default: "result_framework",
      },
      result_avoid: { type: "result" as const, id: "result_avoid", resultTemplateId: "avoid" },
      result_external: { type: "result" as const, id: "result_external", resultTemplateId: "external" },
      result_vague: { type: "result" as const, id: "result_vague", resultTemplateId: "vague" },
      result_equal: { type: "result" as const, id: "result_equal", resultTemplateId: "equal" },
      result_health_today: { type: "result" as const, id: "result_health_today", resultTemplateId: "health_today" },
      result_work_week: { type: "result" as const, id: "result_work_week", resultTemplateId: "work_week" },
      result_framework: { type: "result" as const, id: "result_framework", resultTemplateId: "framework" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to find your ONE Thing using Keller's Focusing Question.",
    templates: [
      {
        id: "avoid",
        cards: [
          { title: "Your blocker", valueTemplate: "Avoiding the hard ONE", descriptionTemplate: "You already know the domino — fear or discomfort is the real obstacle." },
          { title: "Ask yourself", valueTemplate: "What's the ONE Thing I'm avoiding?", descriptionTemplate: "That answer is usually your true ONE Thing." },
        ],
        summaryTemplates: ["Name the avoided task out loud — then shrink it until you can start in 5 minutes."],
      },
      {
        id: "external",
        cards: [
          { title: "Your blocker", valueTemplate: "Imported priorities", descriptionTemplate: "Everyone else's ONE Thing became yours — your domino is buried." },
          { title: "Ask yourself", valueTemplate: "What ONE Thing is mine — not theirs?", descriptionTemplate: "Ignore urgent requests for one hour while you answer." },
        ],
        summaryTemplates: ["Your ONE Thing may require saying no — protect it before you serve others."],
      },
      {
        id: "vague",
        cards: [
          { title: "Your blocker", valueTemplate: "Unclear leverage", descriptionTemplate: "You can't pick one domino because you haven't defined what success looks like." },
          { title: "Ask yourself", valueTemplate: "If I could only finish ONE outcome this period, which makes the rest optional?", descriptionTemplate: "Work backward from the outcome, not the task list." },
        ],
        summaryTemplates: ["Write the outcome in one sentence — then ask the Focusing Question again."],
      },
      {
        id: "equal",
        cards: [
          { title: "Your blocker", valueTemplate: "False equality", descriptionTemplate: "Not everything is equally important — Pareto says a few things drive most results." },
          { title: "Ask yourself", valueTemplate: "Which ONE Thing makes the other 80% easier or unnecessary?", descriptionTemplate: "Force rank — pick one, defer the rest visibly." },
        ],
        summaryTemplates: ["Going small on one thing beats going small on everything."],
      },
      {
        id: "health_today",
        cards: [
          { title: "Today's ONE Thing", valueTemplate: "Protect the body first", descriptionTemplate: "Sleep, movement, or nutrition — health is the domino other goals stand on." },
          { title: "Example", valueTemplate: "30-min walk + early bedtime", descriptionTemplate: "One health domino today unlocks tomorrow's focus." },
        ],
        summaryTemplates: ["Keller: poor health habits steal willpower from your ONE Thing."],
      },
      {
        id: "work_week",
        cards: [
          { title: "This week's ONE Thing", valueTemplate: "One milestone, not ten tasks", descriptionTemplate: "Pick the single deliverable that moves your biggest work goal forward." },
          { title: "Example", valueTemplate: "Finish the draft / ship the feature / close the deal step", descriptionTemplate: "Everything else this week serves this domino." },
        ],
        summaryTemplates: ["Block calendar time for this ONE Thing before accepting new requests."],
      },
      {
        id: "framework",
        cards: [
          { title: "Your Focusing Question", valueTemplate: "What's the ONE Thing?", descriptionTemplate: "In your chosen area and time horizon — such that by doing it everything else becomes easier or unnecessary." },
          { title: "Next step", valueTemplate: "Write your answer in one sentence", descriptionTemplate: "If it takes two sentences, it's still too many things." },
        ],
        summaryTemplates: ["Success is sequential — knock over this domino before picking the next."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-today",
      when: "scores.today >= 2",
      title: "Today's ONE Thing ritual",
      steps: [
        "Tonight or first thing: write ONE sentence — today's ONE Thing.",
        "Block 60–90 minutes before any reactive work.",
        "Everything else waits until the block ends — including email.",
        "Evening: did you do it? If not, why — adjust tomorrow's ONE Thing.",
      ],
    },
    {
      id: "rec-week",
      when: "scores.week >= 2",
      title: "This week's ONE Thing ritual",
      steps: [
        "Sunday: name the ONE Thing for the week — one outcome, not a theme.",
        "Break it into daily dominoes — each day serves the weekly ONE.",
        "Decline one commitment that doesn't serve the weekly ONE.",
        "Friday review: did the week serve the ONE Thing? Adjust next week.",
      ],
    },
    {
      id: "rec-month",
      when: "scores.month >= 2",
      title: "This month's ONE Thing ritual",
      steps: [
        "First of month: Focusing Question for the next 30 days.",
        "Identify the lead domino — first action that starts the chain.",
        "Weekly check: is my calendar reflecting the monthly ONE?",
        "Cut one recurring obligation that competes with it.",
      ],
    },
    {
      id: "rec-year",
      when: "scores.year >= 2",
      title: "This year's ONE Thing ritual",
      steps: [
        "Write your someday goal — then ask: what's the ONE Thing this year toward it?",
        "Quarterly review — still the right ONE or needs adjustment?",
        "Say no to goals that split focus — go small to go big.",
        "Use Goal Setting to the Now to connect year → month → week → today.",
      ],
    },
    {
      id: "rec-avoid",
      when: "scores.avoid >= 2",
      title: "When you're avoiding the answer",
      steps: [
        "Write the task you're avoiding — that's likely your ONE Thing.",
        "Shrink to a 5-minute ugly start — permission to do it badly.",
        "Tell someone your ONE Thing today — social accountability.",
        "Block time before you talk yourself out of it.",
      ],
    },
    {
      id: "rec-external",
      when: "scores.external >= 2",
      title: "When others own your calendar",
      steps: [
        "Before opening inbox: write your ONE Thing — non-negotiable block first.",
        "Batch responses twice daily — not on others' schedule.",
        "Script: \"I'm focused on X until noon — can this wait?\"",
        "Take the Four Thieves quiz if saying no is the pattern.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Live the answer",
      steps: [
        "Write your ONE Thing where you'll see it first tomorrow.",
        "Calendar-block time for it before anything else.",
        "When tempted by other tasks, ask: does this serve my ONE Thing?",
        "One domino at a time — sequential success beats simultaneous effort.",
      ],
    },
  ],

  guidance: [
    {
      title: "The full Focusing Question",
      body: "What's the ONE Thing I can do such that by doing it everything else will be easier or unnecessary?",
      list: [
        "Add your time horizon: today, this week, this month, this year",
        "Add your domain: work, health, relationships, etc.",
        "The answer should be singular — one thing, not a list",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Protect time for your ONE Thing",
      description:
        "Reset blocks distracting apps during your ONE Thing block — so the domino you chose actually gets knocked over.",
    },
  },

  faq: [
    {
      question: "What is the Focusing Question?",
      answer:
        "From The ONE Thing by Gary Keller: \"What's the ONE Thing I can do such that by doing it everything else will be easier or unnecessary?\" It's asked for each time horizon — today through someday.",
    },
    {
      question: "How is this different from a to-do list?",
      answer:
        "A to-do list is many things. The Focusing Question forces one domino — the task that makes other tasks easier or unnecessary. Everything else is secondary until the ONE Thing is done.",
    },
    {
      question: "Can I have ONE Things in different life areas?",
      answer:
        "Yes — one per domain per horizon (e.g., one for work today, one for health today). But within each domain at each horizon, pick only one.",
    },
  ],
} satisfies Record<string, unknown>;
