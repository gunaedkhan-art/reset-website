export const whatAreDeepWorkBlocksConfig = {
  schemaVersion: "1.0" as const,
  id: "what-are-deep-work-blocks",
  slug: "what-are-deep-work-blocks",
  status: "published" as const,

  seo: {
    title: "What Are Deep Work Blocks?",
    metaDescription:
      "What are deep work blocks and sessions? Learn the definition, then answer 4 questions to get your first block length, frequency, and example schedule — sized to your calendar.",
    primaryKeyword: "what are deep work blocks",
    secondaryKeywords: [
      "what are deep work sessions",
      "deep work block length",
      "how long is a deep work session",
      "deep work block schedule",
      "first deep work block",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/what-are-deep-work-blocks",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "beginner", "scheduling"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "What Are Deep Work Blocks?",
    intro:
      "Answer four questions to size your first block — length, frequency, and an example schedule that fits your calendar.",
    icon: "blocks",
    proseTitle: "About deep work blocks",
    sections: [
      {
        id: "problem",
        heading: "Vague intentions don't protect time",
        framework: "pas",
        body: "\"I'll do deep work tomorrow\" isn't a block — it's a wish. Without a defined length, start time, and single task, the hours get absorbed by whatever pings first.",
      },
      {
        id: "concept",
        heading: "Blocks are calendar events with rules",
        framework: "concept",
        body: "A deep work block is a pre-scheduled stretch of distraction-free time for one hard task — usually 45–120 minutes. [Cal Newport](https://calnewport.com/) treats them like meetings with yourself: one outcome, phone away, inbox closed, timer running.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Recommended block length, weekly frequency, and an example schedule — sized to your experience level and calendar constraints, not an idealized creator routine.",
      },
    ],
    eyebrow: "Block sizer",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_experience",
    nodes: {
      q_experience: {
        type: "question" as const,
        id: "q_experience",
        prompt: "How much deep work have you done before?",
        input: "single-choice" as const,
        options: [
          {
            id: "never",
            label: "Almost never — I'm starting from zero",
            score: { beginner: 3 },
            next: "q_task",
          },
          {
            id: "sometimes",
            label: "Sometimes — a few good sessions, nothing consistent",
            score: { intermediate: 2 },
            next: "q_task",
          },
          {
            id: "regular",
            label: "Regular — I already block focus time weekly",
            score: { advanced: 2 },
            next: "q_task",
          },
        ],
      },
      q_task: {
        type: "question" as const,
        id: "q_task",
        prompt: "What will you use deep work blocks for most?",
        input: "single-choice" as const,
        options: [
          {
            id: "writing",
            label: "Writing, strategy, or creative output",
            score: { long: 2 },
            next: "q_gap",
          },
          {
            id: "code",
            label: "Coding or technical building",
            score: { long: 2 },
            next: "q_gap",
          },
          {
            id: "learning",
            label: "Learning — reading, courses, research",
            score: { medium: 2 },
            next: "q_gap",
          },
          {
            id: "mixed",
            label: "Mixed — different deep tasks each week",
            score: { medium: 1 },
            next: "q_gap",
          },
        ],
      },
      q_gap: {
        type: "question" as const,
        id: "q_gap",
        prompt: "What's the longest uninterrupted window you can usually protect?",
        input: "single-choice" as const,
        options: [
          {
            id: "short",
            label: "30 minutes or less — calendar is tight",
            score: { short: 3 },
            next: "q_meetings",
          },
          {
            id: "medium",
            label: "About 60–90 minutes — one gap most days",
            score: { medium: 2 },
            next: "q_meetings",
          },
          {
            id: "long",
            label: "2+ hours — I can protect long stretches",
            score: { long: 2 },
            next: "q_meetings",
          },
        ],
      },
      q_meetings: {
        type: "question" as const,
        id: "q_meetings",
        prompt: "How meeting-heavy is your typical week?",
        input: "single-choice" as const,
        options: [
          {
            id: "heavy",
            label: "Heavy — most days are fragmented",
            score: { fragmented: 3 },
            next: "branch_result",
          },
          {
            id: "moderate",
            label: "Moderate — some open mornings or afternoons",
            score: { moderate: 1 },
            next: "branch_result",
          },
          {
            id: "light",
            label: "Light — I control most of my calendar",
            score: { open: 2 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.beginner >= 2 && scores.short >= 2", next: "result_starter_short" },
          { when: "scores.beginner >= 2", next: "result_starter" },
          { when: "scores.advanced >= 2 && scores.long >= 1", next: "result_advanced" },
          { when: "scores.fragmented >= 2", next: "result_fragmented" },
          { when: "scores.long >= 2", next: "result_long" },
        ],
        default: "result_standard",
      },
      result_starter_short: {
        type: "result" as const,
        id: "result_starter_short",
        resultTemplateId: "starter_short",
      },
      result_starter: {
        type: "result" as const,
        id: "result_starter",
        resultTemplateId: "starter",
      },
      result_advanced: {
        type: "result" as const,
        id: "result_advanced",
        resultTemplateId: "advanced",
      },
      result_fragmented: {
        type: "result" as const,
        id: "result_fragmented",
        resultTemplateId: "fragmented",
      },
      result_long: {
        type: "result" as const,
        id: "result_long",
        resultTemplateId: "long",
      },
      result_standard: {
        type: "result" as const,
        id: "result_standard",
        resultTemplateId: "standard",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your deep work block prescription.",
    templates: [
      {
        id: "starter_short",
        cards: [
          {
            title: "Your first block",
            valueTemplate: "25–30 minutes",
            descriptionTemplate: "3 sessions per week — same time if possible",
          },
          {
            title: "Example",
            valueTemplate: "Tue / Thu / Sat, 7:30am",
            descriptionTemplate: "One task only — phone in another room",
          },
        ],
        summaryTemplates: ["Start smaller than you think — consistency beats duration."],
      },
      {
        id: "starter",
        cards: [
          {
            title: "Your first block",
            valueTemplate: "45 minutes",
            descriptionTemplate: "3–4 sessions per week",
          },
          {
            title: "Example",
            valueTemplate: "Mon–Wed–Fri, 8:00–8:45am",
            descriptionTemplate: "Define \"done\" before each block starts",
          },
        ],
        summaryTemplates: ["45 minutes is Newport's practical minimum for real depth."],
      },
      {
        id: "standard",
        cards: [
          {
            title: "Your block",
            valueTemplate: "60–90 minutes",
            descriptionTemplate: "4–5 sessions per week",
          },
          {
            title: "Example",
            valueTemplate: "Daily 9:00–10:30am",
            descriptionTemplate: "Rhythmic — same window every workday",
          },
        ],
        summaryTemplates: ["One daily block is the rhythmic deep work sweet spot."],
      },
      {
        id: "long",
        cards: [
          {
            title: "Your block",
            valueTemplate: "90–120 minutes",
            descriptionTemplate: "5 sessions per week",
          },
          {
            title: "Example",
            valueTemplate: "Mon–Fri, 8:00–10:00am",
            descriptionTemplate: "Full morning protected — shallow work after 10",
          },
        ],
        summaryTemplates: ["Long blocks suit writing and code — include 5-min warmup inside."],
      },
      {
        id: "fragmented",
        cards: [
          {
            title: "Your block",
            valueTemplate: "25 min (pomodoro-style)",
            descriptionTemplate: "Daily — in calendar gaps between meetings",
          },
          {
            title: "Example",
            valueTemplate: "First free gap each morning",
            descriptionTemplate: "Journalistic mode — depth when you can grab it",
          },
        ],
        summaryTemplates: ["Tight calendars need shorter blocks more often — not zero depth."],
      },
      {
        id: "advanced",
        cards: [
          {
            title: "Your block",
            valueTemplate: "2–4 hour blocks",
            descriptionTemplate: "2–3 deep days per week",
          },
          {
            title: "Example",
            valueTemplate: "Tue & Thu deep days",
            descriptionTemplate: "Bimodal — batch shallow work on other days",
          },
        ],
        summaryTemplates: ["You're ready for bimodal scheduling — long blocks, fewer of them."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-starter-short",
      when: "scores.beginner >= 2 && scores.short >= 2",
      title: "How to run your first block",
      steps: [
        "Calendar-invite yourself — title the specific task, not \"deep work.\"",
        "Phone in another room before the timer starts.",
        "25 minutes only — stop when timer rings even if flow continues (build trust).",
        "Log completed blocks on paper — aim for 3 this week.",
      ],
    },
    {
      id: "rec-starter",
      when: "scores.beginner >= 2",
      title: "How to run your first block",
      steps: [
        "Write \"done looks like ___\" in one sentence before opening tools.",
        "45-minute timer — no email, Slack, or tabs except task.",
        "Same start ritual every session: close apps, phone away, timer on.",
        "After block: 5-minute break, then shallow work is allowed.",
      ],
    },
    {
      id: "rec-fragmented",
      when: "scores.fragmented >= 2",
      title: "How to run blocks in a fragmented calendar",
      steps: [
        "Keep a \"depth list\" — next 3 tasks ready when a gap opens.",
        "Book 25-minute holds between meetings — treat as real appointments.",
        "Never wait for a perfect 2-hour window — grab pomodoros.",
        "Stack 2×25 min back-to-back when a 60-minute gap appears.",
      ],
    },
    {
      id: "rec-long",
      when: "scores.long >= 2",
      title: "How to run longer blocks",
      steps: [
        "First 5 minutes: review task note only — no inbox.",
        "90–120 min max for most people — break at natural stopping point.",
        "Water and bathroom before block — no mid-block wandering.",
        "Shutdown note at end — where to resume next session.",
      ],
    },
    {
      id: "rec-advanced",
      when: "scores.advanced >= 2",
      title: "Level up to bimodal blocks",
      steps: [
        "Pick 2 deep days — zero meetings if negotiable.",
        "Batch all shallow work to non-deep days.",
        "4-hour block max with 10-min walk at halfway.",
        "Take the deep work schedule quiz to formalize your philosophy.",
      ],
    },
    {
      id: "rec-standard",
      when: "true",
      title: "How to run your block",
      steps: [
        "Recurring calendar event — same time daily or 4× weekly.",
        "One task per block — split projects across multiple blocks.",
        "Phone away, notifications off — treat interruptions like meeting intrusions.",
        "Track weekly deep hours — aim to grow 1 hour per month.",
      ],
    },
  ],

  guidance: [
    {
      title: "Blocks vs sessions",
      body: "\"Deep work block\" and \"deep work session\" mean the same thing — a bounded period of focused work. \"Block\" emphasizes calendar placement; \"session\" emphasizes the timed effort.",
      list: [
        "One block = one primary task",
        "45–90 minutes is the common range for knowledge work",
        "Blocks are scheduled in advance, not squeezed in reactively",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Keep blocks uninterrupted",
      description:
        "Reset blocks distracting apps for the length of your deep work session — so a 45-minute block stays 45 minutes of depth.",
    },
  },

  faq: [
    {
      question: "What are deep work blocks?",
      answer:
        "Pre-scheduled periods of distraction-free concentration on a single cognitively demanding task — typically 45–120 minutes, with phone and messaging off.",
    },
    {
      question: "What's the difference between a block and a session?",
      answer:
        "No practical difference — both refer to one bounded period of deep work. Use whichever term you prefer.",
    },
    {
      question: "How many deep work blocks per week?",
      answer:
        "Beginners: 3×45 minutes. Intermediate: one 60–90 minute block daily. Advanced: 2–4 hour blocks on dedicated deep days. This tool sizes yours to your calendar.",
    },
  ],
} satisfies Record<string, unknown>;
