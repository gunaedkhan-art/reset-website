export const deepWorkEnvironmentChecklistConfig = {
  schemaVersion: "1.0" as const,
  id: "deep-work-environment-checklist",
  slug: "deep-work-environment-checklist",
  status: "published" as const,

  seo: {
    title: "Deep Work Environment Checklist",
    metaDescription:
      "Score your deep work environment — notifications, phone, noise, space, and boundaries. Answer 4 questions and get a setup checklist to protect focus.",
    primaryKeyword: "deep work environment",
    secondaryKeywords: [
      "deep work setup",
      "focus environment checklist",
      "distraction free workspace",
      "deep work space",
      "environment for focus",
    ],
    searchIntent: "checklist" as const,
    canonicalPath: "/deep-work-environment-checklist",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "environment", "setup"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Deep Work Environment Checklist",
    intro:
      "Four questions about your space, phone, noise, and boundaries — get an environment score and fixes ranked by impact.",
    icon: "checklist",
    proseTitle: "About your environment",
    sections: [
      {
        id: "problem",
        heading: "Willpower loses to a bad setup",
        framework: "pas",
        body: "Phone on the desk, Slack badges glowing, open-plan noise — your environment is designed for interruption. Trying to focus harder while signals scream for attention is fighting physics with guilt.",
      },
      {
        id: "concept",
        heading: "Make depth the path of least resistance",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) treats environment as a deep work rule: remove cues for distraction before the session starts. Phone in another room, notifications off, visible task note — friction should block shallow, not depth.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "An environment score across phone, noise, space, and boundary signals — plus ranked fixes for the highest-impact leaks first.",
      },
    ],
    eyebrow: "Environment score",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_phone",
    nodes: {
      q_phone: {
        type: "question" as const,
        id: "q_phone",
        prompt: "Where is your phone during deep work?",
        input: "single-choice" as const,
        options: [
          { id: "away", label: "Another room or drawer — out of reach", score: { phone_good: 3 }, next: "q_notifications" },
          { id: "dnd", label: "On desk — Do Not Disturb on", score: { phone_ok: 1 }, next: "q_notifications" },
          { id: "visible", label: "Visible — face up, notifications on", score: { phone_bad: 3 }, next: "q_notifications" },
        ],
      },
      q_notifications: {
        type: "question" as const,
        id: "q_notifications",
        prompt: "Desktop notifications during focus?",
        input: "single-choice" as const,
        options: [
          { id: "off", label: "Off — Slack, email, browser alerts disabled", score: { notif_good: 3 }, next: "q_space" },
          { id: "some", label: "Some off — email quiet, Slack still pings", score: { notif_ok: 1 }, next: "q_space" },
          { id: "all", label: "All on — I might miss something important", score: { notif_bad: 3 }, next: "q_space" },
        ],
      },
      q_space: {
        type: "question" as const,
        id: "q_space",
        prompt: "Your physical workspace for deep work?",
        input: "single-choice" as const,
        options: [
          { id: "dedicated", label: "Dedicated — same desk/room for focus only", score: { space_good: 3 }, next: "q_boundary" },
          { id: "shared", label: "Shared — open office or kitchen table", score: { space_ok: 1 }, next: "q_boundary" },
          { id: "bad", label: "Chaotic — clutter, wrong room, or bed/couch", score: { space_bad: 3 }, next: "q_boundary" },
        ],
      },
      q_boundary: {
        type: "question" as const,
        id: "q_boundary",
        prompt: "Do others know when you're in deep work?",
        input: "single-choice" as const,
        options: [
          { id: "clear", label: "Clear signal — headphones, sign, calendar block", score: { boundary_good: 3 }, next: "branch_result" },
          { id: "weak", label: "Weak — they sometimes forget", score: { boundary_ok: 1 }, next: "branch_result" },
          { id: "none", label: "No signal — interruptions expected", score: { boundary_bad: 3 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.phone_bad >= 2", next: "result_phone" },
          { when: "scores.notif_bad >= 2", next: "result_notif" },
          { when: "scores.space_bad >= 2", next: "result_space" },
          { when: "scores.boundary_bad >= 2", next: "result_boundary" },
          { when: "scores.phone_good >= 2 && scores.notif_good >= 2", next: "result_ready" },
        ],
        default: "result_mixed",
      },
      result_phone: { type: "result" as const, id: "result_phone", resultTemplateId: "phone" },
      result_notif: { type: "result" as const, id: "result_notif", resultTemplateId: "notif" },
      result_space: { type: "result" as const, id: "result_space", resultTemplateId: "space" },
      result_boundary: { type: "result" as const, id: "result_boundary", resultTemplateId: "boundary" },
      result_ready: { type: "result" as const, id: "result_ready", resultTemplateId: "ready" },
      result_mixed: { type: "result" as const, id: "result_mixed", resultTemplateId: "mixed" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to score your deep work environment.",
    templates: [
      {
        id: "phone",
        cards: [
          { title: "Environment score", valueTemplate: "Phone is the leak", descriptionTemplate: "Visible phone kills depth — environment works against you." },
          { title: "Priority fix", valueTemplate: "Phone leaves the room", descriptionTemplate: "Before next deep block — non-negotiable week one." },
        ],
        summaryTemplates: ["Fix phone placement before optimizing anything else."],
      },
      {
        id: "notif",
        cards: [
          { title: "Environment score", valueTemplate: "Notification overload", descriptionTemplate: "Desktop pings train reactive mode — deep work can't survive." },
          { title: "Priority fix", valueTemplate: "Kill all alerts", descriptionTemplate: "Slack DND, email off, browser notifications disabled during block." },
        ],
        summaryTemplates: ["One uninterrupted hour beats three interrupted hours."],
      },
      {
        id: "space",
        cards: [
          { title: "Environment score", valueTemplate: "Space works against focus", descriptionTemplate: "Wrong room or clutter adds friction every session." },
          { title: "Priority fix", valueTemplate: "One focus zone", descriptionTemplate: "Clear desk, same chair, work-only — not bed or couch." },
        ],
        summaryTemplates: ["Environment design beats willpower — fix the room first."],
      },
      {
        id: "boundary",
        cards: [
          { title: "Environment score", valueTemplate: "No interruption shield", descriptionTemplate: "Others don't know you're in depth — drop-ins win." },
          { title: "Priority fix", valueTemplate: "Visible focus signal", descriptionTemplate: "Headphones on, calendar block, door sign — tell the team once." },
        ],
        summaryTemplates: ["Social environment matters as much as digital."],
      },
      {
        id: "ready",
        cards: [
          { title: "Environment score", valueTemplate: "Depth-ready", descriptionTemplate: "Phone away, notifications off, space and signals support focus." },
          { title: "Maintain", valueTemplate: "Same setup every block", descriptionTemplate: "Ritual consistency — don't change what works." },
        ],
        summaryTemplates: ["Your environment supports deep work — protect these defaults."],
      },
      {
        id: "mixed",
        cards: [
          { title: "Environment score", valueTemplate: "Mixed support", descriptionTemplate: "Some friction fixed, some leaks remain — pick one upgrade." },
          { title: "Priority fix", valueTemplate: "Biggest leak first", descriptionTemplate: "Phone, then notifications, then space — in that order." },
        ],
        summaryTemplates: ["One environment fix this week — don't overhaul everything at once."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-phone",
      when: "scores.phone_bad >= 2",
      title: "Phone environment fix",
      steps: [
        "Deep block rule: phone in another room before timer starts.",
        "Remove social apps from home screen — add friction.",
        "Use Reset or Screen Time limits during focus hours.",
        "Allow calls from favorites only — everything else waits.",
      ],
    },
    {
      id: "rec-notif",
      when: "scores.notif_bad >= 2",
      title: "Notification environment fix",
      steps: [
        "Quit Slack and email during block — not minimized.",
        "Disable browser notifications globally during focus.",
        "One-tab rule — only task-related tabs open.",
        "Batch comms in shallow windows — see batch shallow work planner.",
      ],
    },
    {
      id: "rec-space",
      when: "scores.space_bad >= 2",
      title: "Physical space fix",
      steps: [
        "Clear desk to one task — hide other work physically.",
        "Same seat daily — brain associates spot with depth.",
        "Never deep work from bed or couch — blur kills shutdown.",
        "Book quiet room or library if home is noisy.",
      ],
    },
    {
      id: "rec-boundary",
      when: "scores.boundary_bad >= 2",
      title: "Social boundary fix",
      steps: [
        "Calendar-invite yourself — \"Deep work — do not schedule.\"",
        "Headphones on = do not disturb — tell team the signal.",
        "Door sign or Slack status during block.",
        "Stand when someone approaches — shorter interruptions.",
      ],
    },
    {
      id: "rec-ready",
      when: "scores.phone_good >= 2",
      title: "Maintain depth-ready environment",
      steps: [
        "Same startup checklist every block — don't skip steps.",
        "Review monthly: what new leak appeared?",
        "Teach household/team your signal — consistency matters.",
        "Pair with shutdown ritual — environment closes at end too.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Environment checklist (every block)",
      steps: [
        "Phone away · notifications off · one task visible · signal on.",
        "Water and bathroom before timer — no mid-block wandering.",
        "Close extra apps and tabs — clean desktop.",
        "Timer visible — work until it rings.",
      ],
    },
  ],

  guidance: [
    {
      title: "Work deeply — environment matters",
      body: "Newport's deep work rules include making your environment support concentration — not fighting it every session.",
      list: [
        "Phone visibility is the #1 environment leak",
        "Notifications recreate reactive shallow work",
        "Same place + same ritual builds focus cues",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Automate your environment fix",
      description:
        "Reset blocks distracting apps during deep work — environment enforcement when willpower isn't enough.",
    },
  },

  faq: [
    {
      question: "What makes a good deep work environment?",
      answer:
        "Phone out of reach, notifications off, dedicated workspace, clear don't-interrupt signal, and only the tools needed for one task visible.",
    },
    {
      question: "Can I do deep work in a noisy office?",
      answer:
        "Yes with headphones, booked rooms, and visible focus signals — but phone and notifications must still be controlled.",
    },
    {
      question: "How is this different from \"How to focus at work\"?",
      answer:
        "That tool covers workplace culture and meetings. This one scores your physical and digital environment setup for depth.",
    },
  ],
} satisfies Record<string, unknown>;
