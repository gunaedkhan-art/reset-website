export const batchShallowWorkPlannerConfig = {
  schemaVersion: "1.0" as const,
  id: "batch-shallow-work-planner",
  slug: "batch-shallow-work-planner",
  status: "published" as const,

  seo: {
    title: "Batch Shallow Work Planner",
    metaDescription:
      "When should you batch email, Slack, and admin? Cal Newport's drain-the-shallows plan — answer 4 questions and get your shallow-work windows around deep work.",
    primaryKeyword: "batch shallow work",
    secondaryKeywords: [
      "drain the shallows",
      "batch email and slack",
      "shallow work schedule",
      "when to check email",
      "batch admin work",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/batch-shallow-work-planner",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["deep-work", "shallow-work", "scheduling"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Batch Shallow Work Planner",
    intro:
      "Four questions to place your email, Slack, and admin windows so deep work survives — not sprinkled through the day.",
    icon: "calendar",
    proseTitle: "About batching shallow work",
    sections: [
      {
        id: "problem",
        heading: "Death by a thousand inbox checks",
        framework: "pas",
        body: "Email at 8:02, Slack at 8:17, admin at 8:45 — shallow work fragments the day into unusable scraps. Deep blocks can't survive when reactive tasks bleed into every gap.",
      },
      {
        id: "concept",
        heading: "Drain the shallows by batching",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) recommends fixed shallow windows in [Deep Work](https://calnewport.com/books/deep-work/) — process comms in batches, protect mornings for depth, and treat availability as a choice rather than a default.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Recommended shallow-work windows around your role and schedule — when to check email, batch Slack, and handle admin without cannibalizing deep time.",
      },
    ],
    eyebrow: "Shallow batch planner",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_role",
    nodes: {
      q_role: {
        type: "question" as const,
        id: "q_role",
        prompt: "What's your work context?",
        input: "single-choice" as const,
        options: [
          { id: "office", label: "Office — meetings and drop-ins", score: { office: 2 }, next: "q_deep" },
          { id: "remote", label: "Remote — async but always online", score: { remote: 2 }, next: "q_deep" },
          { id: "flex", label: "Flexible — mix of both", score: { flex: 1 }, next: "q_deep" },
        ],
      },
      q_deep: {
        type: "question" as const,
        id: "q_deep",
        prompt: "When is your protected deep work block?",
        input: "single-choice" as const,
        options: [
          { id: "morning", label: "Morning — first 1–2 hours", score: { morning_deep: 3 }, next: "q_volume" },
          { id: "midday", label: "Midday — late morning slot", score: { midday_deep: 2 }, next: "q_volume" },
          { id: "none", label: "No block yet — need to create one", score: { no_deep: 3 }, next: "q_volume" },
        ],
      },
      q_volume: {
        type: "question" as const,
        id: "q_volume",
        prompt: "How much shallow work hits you daily?",
        input: "single-choice" as const,
        options: [
          { id: "heavy", label: "Heavy — 4+ hours email, Slack, admin", score: { heavy: 3 }, next: "q_culture" },
          { id: "moderate", label: "Moderate — 2–3 hours", score: { moderate: 2 }, next: "q_culture" },
          { id: "light", label: "Light — under 2 hours", score: { light: 1 }, next: "q_culture" },
        ],
      },
      q_culture: {
        type: "question" as const,
        id: "q_culture",
        prompt: "How fast are replies expected?",
        input: "single-choice" as const,
        options: [
          { id: "instant", label: "Instant — Slack culture, quick replies", score: { sync: 3 }, next: "branch_result" },
          { id: "same_day", label: "Same day — email by EOD is fine", score: { async_ok: 2 }, next: "branch_result" },
          { id: "flexible", label: "Flexible — async is accepted", score: { async: 1 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.no_deep >= 2", next: "result_no_deep" },
          { when: "scores.sync >= 2 && scores.heavy >= 2", next: "result_sync_heavy" },
          { when: "scores.morning_deep >= 2", next: "result_morning" },
          { when: "scores.heavy >= 2", next: "result_heavy" },
        ],
        default: "result_standard",
      },
      result_no_deep: { type: "result" as const, id: "result_no_deep", resultTemplateId: "no_deep" },
      result_sync_heavy: { type: "result" as const, id: "result_sync_heavy", resultTemplateId: "sync_heavy" },
      result_morning: { type: "result" as const, id: "result_morning", resultTemplateId: "morning" },
      result_heavy: { type: "result" as const, id: "result_heavy", resultTemplateId: "heavy" },
      result_standard: { type: "result" as const, id: "result_standard", resultTemplateId: "standard" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your shallow-work batch schedule.",
    templates: [
      {
        id: "no_deep",
        cards: [
          { title: "Start here", valueTemplate: "Block deep first", descriptionTemplate: "Without a deep block, batching shallow work just fills the day." },
          { title: "Then batch", valueTemplate: "11am + 4pm shallow windows", descriptionTemplate: "Two 30–45 min batches after you schedule 90 min deep tomorrow AM." },
        ],
        summaryTemplates: ["Schedule deep work before designing shallow batches."],
      },
      {
        id: "sync_heavy",
        cards: [
          { title: "Shallow windows", valueTemplate: "11:00–11:45 + 3:30–4:30", descriptionTemplate: "Deep block 8:30–10:00 — status \"Focus until 11\"" },
          { title: "Rule", valueTemplate: "No inbox before 11", descriptionTemplate: "Auto-responder: batch replies twice daily — urgent = call." },
        ],
        summaryTemplates: ["Sync cultures need visible boundaries — batching + status messages."],
      },
      {
        id: "morning",
        cards: [
          { title: "Shallow windows", valueTemplate: "11:00–12:00 + 4:00–4:45", descriptionTemplate: "Deep block 8:00–10:00 — zero shallow inside" },
          { title: "Rule", valueTemplate: "Admin after lunch", descriptionTemplate: "Expenses, scheduling, status updates in afternoon batch only." },
        ],
        summaryTemplates: ["Morning depth, afternoon shallows — Newport's classic split."],
      },
      {
        id: "heavy",
        cards: [
          { title: "Shallow windows", valueTemplate: "Three 30-min batches", descriptionTemplate: "10:30, 1:30, 4:30 — process, don't drip all day" },
          { title: "Rule", valueTemplate: "Timer on batches", descriptionTemplate: "Shallow expands to fill time — cap each window hard." },
        ],
        summaryTemplates: ["Heavy shallow load needs three batches — still no email during deep block."],
      },
      {
        id: "standard",
        cards: [
          { title: "Shallow windows", valueTemplate: "11:30–12:00 + 4:00–4:30", descriptionTemplate: "Midday + end-of-day batches around your deep block" },
          { title: "Rule", valueTemplate: "Close apps after batch", descriptionTemplate: "Slack and email off between windows — not minimized." },
        ],
        summaryTemplates: ["Two batches daily beats constant shallow drip."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-no-deep",
      when: "scores.no_deep >= 2",
      title: "Drain the shallows — step 1",
      steps: [
        "Tomorrow: calendar-block 90 min deep work 8–9:30am first.",
        "Then add shallow batches at 11am and 4pm only.",
        "Run shallow work audit — quantify before/after.",
        "Decline one optional meeting — fund the deep block.",
      ],
    },
    {
      id: "rec-sync",
      when: "scores.sync >= 2",
      title: "Batch in a sync culture",
      steps: [
        "Set Slack status: \"Batching messages — focus until [time].\"",
        "Auto-reply on email with batch times twice daily.",
        "Allow calls from favorites only during deep block.",
        "Tell manager once: \"I'm batching for focus — same output, fewer pings.\"",
      ],
    },
    {
      id: "rec-morning",
      when: "scores.morning_deep >= 2",
      title: "Morning deep, batched shallow",
      steps: [
        "Deep block before opening email — ever.",
        "First shallow batch: late morning — triage only.",
        "Second batch: late afternoon — replies and admin.",
        "Shutdown ritual after final batch — don't reopen tonight.",
      ],
    },
    {
      id: "rec-heavy",
      when: "scores.heavy >= 2",
      title: "Heavy shallow load protocol",
      steps: [
        "Three timed batches — 30 min max each, alarm when done.",
        "Use templates for recurring replies — speed batching.",
        "Delegate or delete one shallow category this week.",
        "Protect morning deep — shallow can't eat peak hours.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Newport's batching rules",
      steps: [
        "Deep work never shares time with inbox — separate windows.",
        "Process shallow work in batches — don't interleave.",
        "Close comms apps between batches — out of sight.",
        "Weekly: cut one shallow obligation permanently.",
      ],
    },
  ],

  guidance: [
    {
      title: "Drain the shallows",
      body: "[Cal Newport](https://calnewport.com/) argues shallow work expands to fill available time unless batched and capped — deep work gets what's left otherwise. See [Deep Work](https://calnewport.com/books/deep-work/).",
      list: [
        "Email, Slack, admin = shallow — batch together",
        "Deep work gets protected blocks first",
        "Close apps between batches — not minimized",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Keep deep blocks shallow-free",
      description:
        "Reset blocks email and social apps during deep work — shallow batches stay in their windows, not mid-focus.",
    },
  },

  faq: [
    {
      question: "What is batching shallow work?",
      answer:
        "Processing email, Slack, and admin in fixed windows instead of all day — so deep work blocks stay uninterrupted. Core to [Cal Newport](https://calnewport.com/)'s \"drain the shallows\" in [Deep Work](https://calnewport.com/books/deep-work/).",
    },
    {
      question: "How often should I check email?",
      answer:
        "Twice daily works for most knowledge workers — late morning and late afternoon. Sync cultures may need a third batch; never during deep work.",
    },
    {
      question: "How is this different from the shallow work audit?",
      answer:
        "The audit quantifies how much is shallow. This tool schedules when to process it — run the [Shallow Work Audit](/shallow-work-audit) first, then batch here.",
    },
  ],
} satisfies Record<string, unknown>;
