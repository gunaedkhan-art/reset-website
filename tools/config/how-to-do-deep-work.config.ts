export const howToDoDeepWorkConfig = {
  schemaVersion: "1.0" as const,
  id: "how-to-do-deep-work",
  slug: "how-to-do-deep-work",
  status: "published" as const,

  seo: {
    title: "How to Do Deep Work",
    metaDescription:
      "Answer 4 questions and get a Cal Newport–style deep work plan — scheduling, environment, shallow-work cuts, and your first protected focus block.",
    primaryKeyword: "how to do deep work",
    secondaryKeywords: [
      "deep work guide",
      "deep work tips",
      "start deep work",
      "deep work routine",
      "cal newport deep work",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/how-to-do-deep-work",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "focus", "productivity"],
    cluster: "deep-work",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "How to Do Deep Work",
    intro:
      "Deep work is distraction-free concentration on hard, valuable tasks — not longer hours. Four questions to find your biggest blocker and a plan you can start tomorrow.",
    eyebrow: "Interactive tool",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_blocker",
    nodes: {
      q_blocker: {
        type: "question" as const,
        id: "q_blocker",
        prompt: "What stops you from doing deep work most often?",
        input: "single-choice" as const,
        options: [
          {
            id: "interrupts",
            label: "Constant interruptions — meetings, Slack, email",
            score: { shallow: 3 },
            next: "q_control",
          },
          {
            id: "phone",
            label: "Phone and digital distractions",
            score: { phone: 3 },
            next: "q_control",
          },
          {
            id: "unclear",
            label: "I don't know what to work on — tasks feel vague",
            score: { unclear: 3 },
            next: "q_control",
          },
          {
            id: "fatigue",
            label: "Low energy — I can't sustain focus long enough",
            score: { fatigue: 3 },
            next: "q_control",
          },
          {
            id: "never",
            label: "I've never really tried — no system yet",
            score: { beginner: 3 },
            next: "q_control",
          },
        ],
      },
      q_control: {
        type: "question" as const,
        id: "q_control",
        prompt: "How much control do you have over your daily schedule?",
        input: "single-choice" as const,
        options: [
          {
            id: "high",
            label: "High — I set most of my own hours and priorities",
            score: { control: 3 },
            next: "q_experience",
          },
          {
            id: "medium",
            label: "Some — meetings exist but I can block time",
            score: { control: 2 },
            next: "q_experience",
          },
          {
            id: "low",
            label: "Low — calendar and requests mostly decide my day",
            score: { control: 1 },
            next: "q_experience",
          },
        ],
      },
      q_experience: {
        type: "question" as const,
        id: "q_experience",
        prompt: "What's your experience with focused deep work blocks?",
        input: "single-choice" as const,
        options: [
          {
            id: "none",
            label: "Almost none — multitasking is my default",
            score: { novice: 3 },
            next: "q_work",
          },
          {
            id: "inconsistent",
            label: "Occasionally — I start strong then drift",
            score: { inconsistent: 2 },
            next: "q_work",
          },
          {
            id: "regular",
            label: "Regular — I have some protected focus time",
            score: { regular: 1 },
            next: "q_work",
          },
        ],
      },
      q_work: {
        type: "question" as const,
        id: "q_work",
        prompt: "What kind of work needs your deepest focus?",
        input: "single-choice" as const,
        options: [
          {
            id: "creative",
            label: "Creative or strategic — writing, design, planning, code",
            score: { creative: 2 },
            next: "branch_result",
          },
          {
            id: "learning",
            label: "Learning — studying, research, skill-building",
            score: { learning: 2 },
            next: "branch_result",
          },
          {
            id: "mixed",
            label: "Mixed — deep tasks plus lots of admin",
            score: { mixed: 2 },
            next: "branch_result",
          },
          {
            id: "reactive",
            label: "Mostly reactive — support, ops, or client requests",
            score: { reactive: 2 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.shallow >= 2", next: "result_shallow" },
          { when: "scores.phone >= 2", next: "result_phone" },
          { when: "scores.unclear >= 2", next: "result_unclear" },
          { when: "scores.fatigue >= 2", next: "result_fatigue" },
          { when: "scores.beginner >= 2", next: "result_beginner" },
          { when: "scores.control <= 1", next: "result_low_control" },
        ],
        default: "result_general",
      },
      result_shallow: {
        type: "result" as const,
        id: "result_shallow",
        resultTemplateId: "shallow",
      },
      result_phone: {
        type: "result" as const,
        id: "result_phone",
        resultTemplateId: "phone",
      },
      result_unclear: {
        type: "result" as const,
        id: "result_unclear",
        resultTemplateId: "unclear",
      },
      result_fatigue: {
        type: "result" as const,
        id: "result_fatigue",
        resultTemplateId: "fatigue",
      },
      result_beginner: {
        type: "result" as const,
        id: "result_beginner",
        resultTemplateId: "beginner",
      },
      result_low_control: {
        type: "result" as const,
        id: "result_low_control",
        resultTemplateId: "low_control",
      },
      result_general: {
        type: "result" as const,
        id: "result_general",
        resultTemplateId: "general",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions above to get your deep work plan.",
    templates: [
      {
        id: "shallow",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Shallow work overload",
            descriptionTemplate:
              "Meetings and messaging fill the day — deep work never gets a protected slot.",
          },
        ],
        summaryTemplates: ["Your plan drains the shallows and guards one daily deep block."],
      },
      {
        id: "phone",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Digital pull",
            descriptionTemplate:
              "Your environment may allow focus — but your phone wins during any gap.",
          },
        ],
        summaryTemplates: ["Your plan removes digital friction before the first deep block."],
      },
      {
        id: "unclear",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Vague targets",
            descriptionTemplate:
              "Without a concrete task and \"done\" definition, deep work feels impossible to start.",
          },
        ],
        summaryTemplates: ["Your plan defines one deep task before you sit down."],
      },
      {
        id: "fatigue",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Energy mismatch",
            descriptionTemplate:
              "You're attempting hard focus when your brain is depleted or overstimulated.",
          },
        ],
        summaryTemplates: ["Your plan matches block length and timing to your energy."],
      },
      {
        id: "beginner",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "No deep work habit",
            descriptionTemplate:
              "You haven't built rituals yet — willpower alone won't survive a normal workday.",
          },
        ],
        summaryTemplates: ["Your plan starts with one small, repeatable deep work ritual."],
      },
      {
        id: "low_control",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Calendar owns you",
            descriptionTemplate:
              "Others schedule your day — deep work has to be stolen, not assumed.",
          },
        ],
        summaryTemplates: ["Your plan finds deep work in the gaps you can still control."],
      },
      {
        id: "general",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Mixed friction",
            descriptionTemplate:
              "Several leaks compete — environment, schedule, and habits all need tightening.",
          },
        ],
        summaryTemplates: ["Your plan stacks three deep work habits this week."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-shallow",
      when: "scores.shallow >= 2",
      title: "Drain the shallows first",
      steps: [
        "Audit one week: log meetings, email, Slack — tag each as deep or shallow.",
        "Batch comms to 11am and 4pm — status \"Deep work until then.\"",
        "Decline or shorten one recurring meeting — propose async update.",
        "Block 90 minutes tomorrow morning before any shallow work touches you.",
      ],
    },
    {
      id: "rec-phone",
      when: "scores.phone >= 2",
      title: "Make deep work phone-free",
      steps: [
        "Phone in another room or drawer for every deep block — non-negotiable week one.",
        "Enable Do Not Disturb — allow calls from favorites only.",
        "Remove social apps from home screen before your first block tomorrow.",
        "Start with 45 minutes phone-free — extend once the habit sticks.",
      ],
    },
    {
      id: "rec-unclear",
      when: "scores.unclear >= 2",
      title: "Define the block before you start",
      steps: [
        "Tonight: write one sentence — \"Tomorrow I will finish ___ by ___.\"",
        "Break it into a 60-minute chunk — if it can't fit, pick a smaller piece.",
        "Open only the files/tabs needed for that one task before the block.",
        "No inbox or task list during the block — decide beforehand.",
      ],
    },
    {
      id: "rec-fatigue",
      when: "scores.fatigue >= 2",
      title: "Match depth to energy",
      steps: [
        "Schedule deep work in your peak 2-hour window — protect it like a client meeting.",
        "Start with 45-minute blocks, not 4-hour marathons — depth beats duration early on.",
        "10-minute walk before the block — movement resets alertness.",
        "Cut caffeine after 2pm if afternoon focus crashes.",
      ],
    },
    {
      id: "rec-beginner",
      when: "scores.beginner >= 2",
      title: "Your first deep work ritual",
      steps: [
        "Same time daily — even 45 minutes — rhythm beats intensity.",
        "Same place, same startup: close tabs, phone away, one task written down.",
        "Use a visible timer — work until it rings, then stop completely.",
        "Track streak on paper — aim for 5 deep days in the next 7.",
      ],
    },
    {
      id: "rec-low-control",
      when: "scores.control <= 1",
      title: "Deep work in a crowded calendar",
      steps: [
        "Find 25-minute gaps between meetings — one pomodoro beats zero.",
        "Ask to move one recurring meeting — trade for async notes.",
        "Arrive 30 minutes early or stay 30 late twice a week for protected depth.",
        "Friday: propose \"no-meeting mornings\" for the team — even one day helps.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Three deep work wins this week",
      steps: [
        "Block one 60-minute slot tomorrow — title it like a meeting with yourself.",
        "Phone out of sight inside that block.",
        "End the day with a shutdown ritual — write tomorrow's one deep task before closing.",
      ],
    },
  ],

  guidance: [
    {
      title: "What counts as deep work?",
      body: "Cal Newport defines deep work as professional activity performed in a distraction-free state that pushes your cognitive abilities to their limit.",
      list: [
        "Writing, coding, strategic planning, learning hard material",
        "Not email, Slack, most meetings, or routine admin",
        "Quality of attention matters more than hours logged",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Protect deep work from your phone",
      description:
        "Reset blocks distracting apps during focus sessions — so your deep work block survives notifications and muscle-memory scrolling.",
    },
  },

  faq: [
    {
      question: "How long should a deep work session be?",
      answer:
        "Start with 45–90 minutes. Newport's research suggests 1–4 hour blocks for experts, but a consistent shorter block beats an occasional marathon.",
    },
    {
      question: "How is this different from \"How to focus at work\"?",
      answer:
        "That tool targets workplace distractions. This one follows the Deep Work framework — scheduling philosophy, draining shallow work, and building focus rituals.",
    },
    {
      question: "Can I do deep work with a busy job?",
      answer:
        "Yes — even 25-minute gaps and batched comms add up. The low-control plan shows how to find depth when your calendar isn't fully yours.",
    },
  ],
} satisfies Record<string, unknown>;
