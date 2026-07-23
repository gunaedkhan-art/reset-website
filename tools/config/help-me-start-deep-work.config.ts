export const helpMeStartDeepWorkConfig = {
  schemaVersion: "1.0" as const,
  id: "help-me-start-deep-work",
  slug: "help-me-start-deep-work",
  status: "published" as const,

  seo: {
    title: "Help Me Start Deep Work",
    metaDescription:
      "Need to start deep work right now? Answer 3 quick questions — get one physical action for the next 5 minutes and a minimal block plan to begin before you talk yourself out of it.",
    primaryKeyword: "help me start deep work",
    secondaryKeywords: [
      "start deep work now",
      "begin deep work",
      "deep work right now",
      "how to start deep work session",
      "kickstart deep work",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/help-me-start-deep-work",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "activation", "getting-started"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Help Me Start Deep Work",
    intro:
      "Not a system — a start. Three questions about right now: energy, task, and friction. You get one 5-minute action and a minimal deep block plan you can begin before motivation fades.",
    eyebrow: "Start now",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_now",
    nodes: {
      q_now: {
        type: "question" as const,
        id: "q_now",
        prompt: "Right now, you feel…",
        input: "single-choice" as const,
        options: [
          { id: "avoid", label: "Avoiding — I'll do anything except the hard task", score: { avoid: 3 }, next: "q_task" },
          { id: "ready", label: "Ready-ish — need a push to sit down", score: { ready: 2 }, next: "q_task" },
          { id: "wired", label: "Restless — can't settle", score: { wired: 3 }, next: "q_task" },
        ],
      },
      q_task: {
        type: "question" as const,
        id: "q_task",
        prompt: "Your deep work task is…",
        input: "single-choice" as const,
        options: [
          { id: "named", label: "Named — I know exactly what to work on", score: { named: 2 }, next: "q_friction" },
          { id: "vague", label: "Vague — general area, unclear next step", score: { vague: 3 }, next: "q_friction" },
          { id: "none", label: "Not picked — I want depth but no task chosen", score: { none: 3 }, next: "q_friction" },
        ],
      },
      q_friction: {
        type: "question" as const,
        id: "q_friction",
        prompt: "Biggest friction to starting in the next 60 seconds?",
        input: "single-choice" as const,
        options: [
          { id: "phone", label: "Phone — I'll scroll instead", score: { phone: 3 }, next: "branch_result" },
          { id: "setup", label: "Setup — too many steps before work", score: { setup: 3 }, next: "branch_result" },
          { id: "fear", label: "Fear — it won't be good enough", score: { fear: 3 }, next: "branch_result" },
          { id: "energy", label: "Energy — body wants to move not sit", score: { energy: 3 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.none >= 2", next: "result_pick" },
          { when: "scores.phone >= 2", next: "result_phone" },
          { when: "scores.fear >= 2 || scores.avoid >= 2", next: "result_fear" },
          { when: "scores.wired >= 2 || scores.energy >= 2", next: "result_energy" },
          { when: "scores.vague >= 2", next: "result_vague" },
        ],
        default: "result_go",
      },
      result_pick: { type: "result" as const, id: "result_pick", resultTemplateId: "pick" },
      result_phone: { type: "result" as const, id: "result_phone", resultTemplateId: "phone" },
      result_fear: { type: "result" as const, id: "result_fear", resultTemplateId: "fear" },
      result_energy: { type: "result" as const, id: "result_energy", resultTemplateId: "energy" },
      result_vague: { type: "result" as const, id: "result_vague", resultTemplateId: "vague" },
      result_go: { type: "result" as const, id: "result_go", resultTemplateId: "go" },
    },
  },

  results: {
    emptyMessage: "Answer the questions — get your start-deep-work plan.",
    templates: [
      {
        id: "pick",
        cards: [
          { title: "Next 5 minutes", valueTemplate: "Pick one task", descriptionTemplate: "Write ONE sentence: \"Deep work = ___\" — then open only that file." },
          { title: "Then", valueTemplate: "45-min block", descriptionTemplate: "Phone in another room → timer 45 min → start ugly." },
        ],
        summaryTemplates: ["No task chosen means no deep work — pick in 5 min, then begin."],
      },
      {
        id: "phone",
        cards: [
          { title: "Next 5 minutes", valueTemplate: "Phone in another room", descriptionTemplate: "Physical move first — then open task, then timer." },
          { title: "Then", valueTemplate: "45-min block", descriptionTemplate: "Reset or DND on — work before any check." },
        ],
        summaryTemplates: ["Starting deep work starts with phone placement, not willpower."],
      },
      {
        id: "fear",
        cards: [
          { title: "Next 5 minutes", valueTemplate: "Bad draft timer", descriptionTemplate: "Title doc \"TRASH DRAFT\" → 5 min typing only — zero editing." },
          { title: "Then", valueTemplate: "45-min block", descriptionTemplate: "Continue same draft — permission to be bad all block." },
        ],
        summaryTemplates: ["Fear fades after ugly motion — start bad, edit later."],
      },
      {
        id: "energy",
        cards: [
          { title: "Next 5 minutes", valueTemplate: "Move then sit", descriptionTemplate: "20 jumping jacks or walk around block → water → desk." },
          { title: "Then", valueTemplate: "30-min block", descriptionTemplate: "Shorter block today — 30 min counts." },
        ],
        summaryTemplates: ["Restless body needs motion before stillness — then start short."],
      },
      {
        id: "vague",
        cards: [
          { title: "Next 5 minutes", valueTemplate: "Next action only", descriptionTemplate: "Complete: \"I will physically ___\" — one verb, 5 min max." },
          { title: "Then", valueTemplate: "45-min block", descriptionTemplate: "Same task — no pivot once timer runs." },
        ],
        summaryTemplates: ["Vague tasks need a physical next step — not more planning."],
      },
      {
        id: "go",
        cards: [
          { title: "Next 5 minutes", valueTemplate: "Sit and timer", descriptionTemplate: "Phone away → open task → start 45-min timer → first keystroke." },
          { title: "Then", valueTemplate: "Full block", descriptionTemplate: "No inbox until timer — you're ready enough." },
        ],
        summaryTemplates: ["You're ready — starting beats preparing more."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-phone",
      when: "scores.phone >= 2",
      title: "Start protocol — phone",
      steps: [
        "Stand up — phone to another room now.",
        "Return — open one file only.",
        "Start timer before perfect setup.",
        "First 5 min: any forward motion counts.",
      ],
    },
    {
      id: "rec-fear",
      when: "scores.fear >= 2 || scores.avoid >= 2",
      title: "Start protocol — fear",
      steps: [
        "Say aloud: \"Bad work counts today.\"",
        "5-min ugly sprint — share with no one.",
        "Extend to 45 if momentum appears.",
        "Edit tomorrow — create today.",
      ],
    },
    {
      id: "rec-vague",
      when: "scores.vague >= 2 || scores.none >= 2",
      title: "Start protocol — clarity",
      steps: [
        "10 words max: next physical action.",
        "Do that action 5 min — timer running.",
        "Stop planning — motion creates clarity.",
        "Use Focusing Question later for bigger priority.",
      ],
    },
    {
      id: "rec-energy",
      when: "scores.wired >= 2 || scores.energy >= 2",
      title: "Start protocol — restless",
      steps: [
        "Move 3 min — body before brain.",
        "30-min block not 90 — win small.",
        "Standing ok for first 10 min if helps.",
        "Extend only if flow arrives.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Universal 5-minute start",
      steps: [
        "Phone out of room.",
        "One task written.",
        "Timer started.",
        "One keystroke before self-doubt.",
      ],
    },
  ],

  guidance: [
    {
      title: "Start now, optimize later",
      body: "This tool gives a immediate start — not a deep work lifestyle. Systems come after you've begun today.",
    },
  ],

  ctas: {
    app: {
      title: "Start and stay in the block",
      description:
        "Reset blocks distracting apps the moment you start deep work — so the 5-minute start becomes a 45-minute session.",
    },
  },

  faq: [
    {
      question: "How is this different from \"feels impossible to start\"?",
      answer:
        "That tool diagnoses why starting feels hard emotionally. This one assumes you're ready for action — it gives the next 5 minutes and a minimal block plan immediately.",
    },
    {
      question: "What if I still don't start?",
      answer:
        "Shrink further — 2-minute timer, one sentence only. Or take why-cant-i-do-deep-work if the problem is systemic, not today's activation.",
    },
    {
      question: "How long should my first block be?",
      answer:
        "45 minutes default — 30 if energy is low. Success is starting, not marathon length.",
    },
  ],
} satisfies Record<string, unknown>;
