export const whyCantIDoDeepWorkConfig = {
  schemaVersion: "1.0" as const,
  id: "why-cant-i-do-deep-work",
  slug: "why-cant-i-do-deep-work",
  status: "published" as const,

  seo: {
    title: "Why Can't I Do Deep Work?",
    metaDescription:
      "Why can't you do deep work consistently? Diagnose the real blocker — schedule, environment, shallow overload, or habits — and get a fix matched to your pattern.",
    primaryKeyword: "why can't i do deep work",
    secondaryKeywords: [
      "can't do deep work",
      "why deep work doesn't work for me",
      "deep work not working",
      "struggling with deep work",
      "deep work problems",
    ],
    searchIntent: "why" as const,
    canonicalPath: "/why-cant-i-do-deep-work",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "diagnostic", "habits"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Why Can't I Do Deep Work?",
    intro:
      "Deep work fails for different reasons — some people never find time, others can't sustain focus, others drown in shallow work. Four questions to name your pattern and fix the system, not just try harder.",
    eyebrow: "Deep work diagnostic",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_pattern",
    nodes: {
      q_pattern: {
        type: "question" as const,
        id: "q_pattern",
        prompt: "What best describes your deep work struggle?",
        input: "single-choice" as const,
        options: [
          { id: "never", label: "I never get long enough uninterrupted time", score: { time: 3 }, next: "q_calendar" },
          { id: "start", label: "I start but drift within 20 minutes", score: { drift: 3 }, next: "q_calendar" },
          { id: "avoid", label: "I avoid hard tasks — busy with easy work instead", score: { avoid: 3 }, next: "q_calendar" },
          { id: "inconsistent", label: "Good days then weeks of nothing", score: { inconsistent: 3 }, next: "q_calendar" },
        ],
      },
      q_calendar: {
        type: "question" as const,
        id: "q_calendar",
        prompt: "What does your calendar look like most days?",
        input: "single-choice" as const,
        options: [
          { id: "meetings", label: "Fragmented — meetings every hour", score: { meetings: 3 }, next: "q_env" },
          { id: "open", label: "Open blocks — time exists but I don't use it", score: { open: 2 }, next: "q_env" },
          { id: "reactive", label: "Reactive — inbox and Slack all day", score: { reactive: 3 }, next: "q_env" },
        ],
      },
      q_env: {
        type: "question" as const,
        id: "q_env",
        prompt: "Your environment during attempted focus?",
        input: "single-choice" as const,
        options: [
          { id: "phone", label: "Phone and tabs always within reach", score: { phone: 3 }, next: "q_habit" },
          { id: "noise", label: "Noise and interruptions — people or open office", score: { noise: 3 }, next: "q_habit" },
          { id: "ok", label: "Environment is OK — problem is elsewhere", score: { env_ok: 1 }, next: "q_habit" },
        ],
      },
      q_habit: {
        type: "question" as const,
        id: "q_habit",
        prompt: "Do you have a recurring deep work block on calendar?",
        input: "single-choice" as const,
        options: [
          { id: "no", label: "No — I fit depth in when I can", score: { no_block: 3 }, next: "branch_result" },
          { id: "sometimes", label: "Sometimes — I skip when busy", score: { weak_block: 2 }, next: "branch_result" },
          { id: "yes", label: "Yes — recurring but I break it often", score: { broken_block: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.meetings >= 2 && scores.time >= 2", next: "result_calendar" },
          { when: "scores.reactive >= 2 || scores.avoid >= 2", next: "result_shallow" },
          { when: "scores.phone >= 2 || scores.drift >= 2", next: "result_environment" },
          { when: "scores.no_block >= 2 || scores.inconsistent >= 2", next: "result_habit" },
          { when: "scores.noise >= 2", next: "result_noise" },
        ],
        default: "result_mixed",
      },
      result_calendar: { type: "result" as const, id: "result_calendar", resultTemplateId: "calendar" },
      result_shallow: { type: "result" as const, id: "result_shallow", resultTemplateId: "shallow" },
      result_environment: { type: "result" as const, id: "result_environment", resultTemplateId: "environment" },
      result_habit: { type: "result" as const, id: "result_habit", resultTemplateId: "habit" },
      result_noise: { type: "result" as const, id: "result_noise", resultTemplateId: "noise" },
      result_mixed: { type: "result" as const, id: "result_mixed", resultTemplateId: "mixed" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to learn why deep work isn't working.",
    templates: [
      {
        id: "calendar",
        cards: [
          { title: "Root cause", valueTemplate: "Calendar owns you", descriptionTemplate: "Meetings fragment the day — deep work never gets a 90-minute runway." },
          { title: "Fix direction", valueTemplate: "Calendar surgery", descriptionTemplate: "Protect mornings, batch meetings, decline optional syncs." },
        ],
        summaryTemplates: ["You can't deep work in 15-minute gaps — change the calendar, not your willpower."],
      },
      {
        id: "shallow",
        cards: [
          { title: "Root cause", valueTemplate: "Shallow work wins", descriptionTemplate: "Email, Slack, and easy tasks fill every open hour — depth never gets priority." },
          { title: "Fix direction", valueTemplate: "Drain the shallows", descriptionTemplate: "Batch comms, block deep first, audit shallow ratio." },
        ],
        summaryTemplates: ["Reactive mode feels productive — it's stealing depth."],
      },
      {
        id: "environment",
        cards: [
          { title: "Root cause", valueTemplate: "Environment leak", descriptionTemplate: "Phone and tabs pull you out before depth builds — attention never compounds." },
          { title: "Fix direction", valueTemplate: "Environment redesign", descriptionTemplate: "Phone away, notifications off, one-tab rule." },
        ],
        summaryTemplates: ["You may have time — your setup won't let you use it."],
      },
      {
        id: "habit",
        cards: [
          { title: "Root cause", valueTemplate: "No deep work habit", descriptionTemplate: "Depth is optional, not scheduled — journalistic mode without the skill." },
          { title: "Fix direction", valueTemplate: "Rhythmic scheduling", descriptionTemplate: "Same 60–90 min block daily — recurring calendar hold." },
        ],
        summaryTemplates: ["Deep work needs rhythm — same time, same ritual, same non-negotiable."],
      },
      {
        id: "noise",
        cards: [
          { title: "Root cause", valueTemplate: "Physical interruptions", descriptionTemplate: "Noise and drop-ins break concentration before flow arrives." },
          { title: "Fix direction", valueTemplate: "Interruption shield", descriptionTemplate: "Headphones, booked room, focus signal to team." },
        ],
        summaryTemplates: ["Environment includes social friction — signal focus time clearly."],
      },
      {
        id: "mixed",
        cards: [
          { title: "Root cause", valueTemplate: "Stacked blockers", descriptionTemplate: "Calendar, shallow work, and environment all leak — no single fix." },
          { title: "Fix direction", valueTemplate: "One leak per week", descriptionTemplate: "Week 1: morning block. Week 2: batch email. Week 3: phone away." },
        ],
        summaryTemplates: ["Fix sequentially — Newport: success is sequential, not simultaneous."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-calendar",
      when: "scores.meetings >= 2 || scores.time >= 2",
      title: "Fix calendar-first",
      steps: [
        "Block 90 min tomorrow 8–9:30 — title like a client meeting.",
        "Decline or shorten one recurring meeting this week.",
        "No-meeting mornings twice weekly if negotiable.",
        "Run fixed-schedule calculator — see if deep fits your cap.",
      ],
    },
    {
      id: "rec-shallow",
      when: "scores.reactive >= 2 || scores.avoid >= 2",
      title: "Fix shallow-first",
      steps: [
        "Run shallow work audit — quantify the ratio.",
        "Deep block before first email check — ever.",
        "Use batch shallow work planner for comms windows.",
        "Deep-or-shallow quiz on tasks you keep choosing instead.",
      ],
    },
    {
      id: "rec-env",
      when: "scores.phone >= 2 || scores.drift >= 2",
      title: "Fix environment-first",
      steps: [
        "Take deep work environment checklist — score setup.",
        "Phone in another room next block — measure drift.",
        "Reset blocks apps during 45-min trial block.",
        "If still can't start — use \"feels impossible to start\" tool.",
      ],
    },
    {
      id: "rec-habit",
      when: "scores.no_block >= 2 || scores.inconsistent >= 2",
      title: "Fix habit-first",
      steps: [
        "Recurring daily deep block — same time 5 days.",
        "Same startup: close tabs, phone away, one task written.",
        "Track streak on paper — 5 deep days in 7.",
        "Take deep work schedule quiz — pick rhythmic philosophy.",
      ],
    },
    {
      id: "rec-noise",
      when: "scores.noise >= 2",
      title: "Fix interruption-first",
      steps: [
        "Book quiet room or library for deep blocks.",
        "Headphones + do-not-disturb signal to team.",
        "Stand when approached — shorter drop-in conversations.",
        "WFH: household sign during focus window.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Deep work recovery plan",
      steps: [
        "Pick one root cause from results — fix only that this week.",
        "One 45-min block daily minimum — build before extending.",
        "Shutdown ritual tonight — tomorrow's deep task written.",
        "Review Friday: what broke the block? Fix one leak.",
      ],
    },
  ],

  guidance: [
    {
      title: "System vs willpower",
      body: "When deep work consistently fails, the problem is usually schedule, shallow overload, or environment — not motivation alone.",
    },
  ],

  ctas: {
    app: {
      title: "Make deep work actually happen",
      description:
        "Reset blocks distracting apps during deep work blocks — fix the environment leak while you fix calendar and shallow habits.",
    },
  },

  faq: [
    {
      question: "Why can't I do deep work even when I have time?",
      answer:
        "Open time often fills with shallow work and phone drift. Without a scheduled block, environment rules, and batched comms, depth loses by default.",
    },
    {
      question: "How is this different from \"feels impossible to start\"?",
      answer:
        "That tool fixes activation — starting the first 5 minutes. This one diagnoses why deep work fails as a practice over weeks — calendar, shallow ratio, habits.",
    },
    {
      question: "How long until deep work gets easier?",
      answer:
        "Most people need 2–3 weeks of rhythmic 45–90 min blocks with fixed environment rules before depth feels natural — not one perfect day.",
    },
  ],
} satisfies Record<string, unknown>;
