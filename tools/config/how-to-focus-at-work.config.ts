export const howToFocusAtWorkConfig = {
  schemaVersion: "1.0" as const,
  id: "how-to-focus-at-work",
  slug: "how-to-focus-at-work",
  status: "published" as const,

  seo: {
    title: "How to Focus at Work",
    metaDescription:
      "Answer 4 quick questions and get a personalized plan to focus at work — for open offices, remote setups, meeting-heavy days, and more.",
    primaryKeyword: "how to focus at work",
    secondaryKeywords: [
      "can't focus at work",
      "focus at the office",
      "workplace distractions",
      "deep work at work",
      "concentrate at work",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/how-to-focus-at-work",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["work", "office", "deep-work"],
    cluster: "focus-problems",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "How to Focus at Work",
    intro:
      "Work focus fails for different reasons — noisy offices, back-to-back meetings, Slack overload, or WFH isolation. Four questions to get a plan that fits your setup.",
    eyebrow: "Interactive tool",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_setup",
    nodes: {
      q_setup: {
        type: "question" as const,
        id: "q_setup",
        prompt: "Where do you usually work?",
        input: "single-choice" as const,
        options: [
          {
            id: "open",
            label: "Open office or shared workspace",
            score: { noise: 3 },
            next: "q_interrupt",
          },
          {
            id: "remote",
            label: "Remote — home or co-working",
            score: { remote: 2 },
            next: "q_interrupt",
          },
          {
            id: "hybrid",
            label: "Hybrid — mix of office and home",
            score: { hybrid: 2 },
            next: "q_interrupt",
          },
          {
            id: "solo",
            label: "Private office or solo space",
            score: { solo: 1 },
            next: "q_interrupt",
          },
        ],
      },
      q_interrupt: {
        type: "question" as const,
        id: "q_interrupt",
        prompt: "What interrupts you most during work?",
        input: "single-choice" as const,
        options: [
          {
            id: "meetings",
            label: "Meetings — calendar is fragmented all day",
            score: { meetings: 3 },
            next: "q_comms",
          },
          {
            id: "slack",
            label: "Slack, Teams, or email — constant pings",
            score: { async: 3 },
            next: "q_comms",
          },
          {
            id: "people",
            label: "Colleagues stopping by or calling over",
            score: { noise: 2 },
            next: "q_comms",
          },
          {
            id: "phone",
            label: "My phone or personal distractions",
            score: { phone: 3 },
            next: "q_comms",
          },
        ],
      },
      q_comms: {
        type: "question" as const,
        id: "q_comms",
        prompt: "How async-friendly is your team culture?",
        input: "single-choice" as const,
        options: [
          {
            id: "sync",
            label: "Very synchronous — quick replies expected",
            score: { sync: 3 },
            next: "q_energy",
          },
          {
            id: "mixed",
            label: "Mixed — depends on the person or project",
            score: { mixed: 2 },
            next: "q_energy",
          },
          {
            id: "async",
            label: "Mostly async — deep work is respected",
            score: { async_ok: 1 },
            next: "q_energy",
          },
          {
            id: "unknown",
            label: "Unclear — I haven't tried pushing back",
            score: { mixed: 2 },
            next: "q_energy",
          },
        ],
      },
      q_energy: {
        type: "question" as const,
        id: "q_energy",
        prompt: "When is focus hardest?",
        input: "single-choice" as const,
        options: [
          {
            id: "morning",
            label: "Morning — slow to start",
            score: { morning: 2 },
            next: "branch_result",
          },
          {
            id: "afternoon",
            label: "Afternoon — post-lunch crash",
            score: { afternoon: 3 },
            next: "branch_result",
          },
          {
            id: "all",
            label: "All day — never get into flow",
            score: { chronic: 3 },
            next: "branch_result",
          },
          {
            id: "deadline",
            label: "Only under deadline pressure",
            score: { deadline: 2 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.meetings >= 2", next: "result_meetings" },
          { when: "scores.async >= 2 && scores.sync >= 2", next: "result_comms" },
          { when: "scores.phone >= 2", next: "result_phone" },
          { when: "scores.noise >= 2", next: "result_noise" },
          { when: "scores.remote >= 2 && scores.phone >= 1", next: "result_remote" },
          { when: "scores.afternoon >= 2", next: "result_energy" },
          { when: "scores.chronic >= 2", next: "result_chronic" },
        ],
        default: "result_general",
      },
      result_meetings: {
        type: "result" as const,
        id: "result_meetings",
        resultTemplateId: "meetings",
      },
      result_comms: {
        type: "result" as const,
        id: "result_comms",
        resultTemplateId: "comms",
      },
      result_phone: {
        type: "result" as const,
        id: "result_phone",
        resultTemplateId: "phone",
      },
      result_noise: {
        type: "result" as const,
        id: "result_noise",
        resultTemplateId: "noise",
      },
      result_remote: {
        type: "result" as const,
        id: "result_remote",
        resultTemplateId: "remote",
      },
      result_energy: {
        type: "result" as const,
        id: "result_energy",
        resultTemplateId: "energy",
      },
      result_chronic: {
        type: "result" as const,
        id: "result_chronic",
        resultTemplateId: "chronic",
      },
      result_general: {
        type: "result" as const,
        id: "result_general",
        resultTemplateId: "general",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions above to get your workplace focus plan.",
    templates: [
      {
        id: "meetings",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Calendar fragmentation",
            descriptionTemplate:
              "Meetings eat the day — deep work only happens in scraps between calls.",
          },
        ],
        summaryTemplates: ["Your plan protects focus blocks and cuts meeting load."],
      },
      {
        id: "comms",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Always-on messaging",
            descriptionTemplate:
              "Slack and email expect instant replies — you're never off-call.",
          },
        ],
        summaryTemplates: ["Your plan batches comms and sets team expectations."],
      },
      {
        id: "phone",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Personal digital pull",
            descriptionTemplate:
              "Work environment is fine — your phone and feeds win during gaps.",
          },
        ],
        summaryTemplates: ["Your plan removes phone triggers during work hours."],
      },
      {
        id: "noise",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Physical interruptions",
            descriptionTemplate:
              "Noise and drop-ins break concentration before you reach flow.",
          },
        ],
        summaryTemplates: ["Your plan signals focus time and controls your environment."],
      },
      {
        id: "remote",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "WFH blur",
            descriptionTemplate:
              "Home boundaries are weak — work and personal distractions blend together.",
          },
        ],
        summaryTemplates: ["Your plan separates work space, time, and signals."],
      },
      {
        id: "energy",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Energy timing",
            descriptionTemplate:
              "You're working hard tasks when your brain is at its lowest.",
          },
        ],
        summaryTemplates: ["Your plan aligns deep work with your peak window."],
      },
      {
        id: "chronic",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "No protected focus",
            descriptionTemplate:
              "Nothing in your workday is designed for uninterrupted deep work.",
          },
        ],
        summaryTemplates: ["Your plan creates one non-negotiable focus block daily."],
      },
      {
        id: "general",
        cards: [
          {
            title: "Main blocker",
            valueTemplate: "Mixed friction",
            descriptionTemplate:
              "Several small blockers add up — environment, comms, and habits.",
          },
        ],
        summaryTemplates: ["Your plan stacks three workplace focus habits this week."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-meetings",
      when: "scores.meetings >= 2",
      title: "Your calendar defense plan",
      steps: [
        "Block 90 minutes every morning as \"Focus — do not schedule.\"",
        "Decline or shorten one recurring meeting this week — propose async update instead.",
        "Batch 1:1s and reviews on two days, not spread across five.",
        "End meetings 5 minutes early — recovery time between calls matters.",
      ],
    },
    {
      id: "rec-comms",
      when: "scores.async >= 2 && scores.sync >= 2",
      title: "Your async comms plan",
      steps: [
        "Check Slack/email at 11am and 4pm only — set status to \"Focus until then.\"",
        "Use async video (Loom) instead of live calls when possible.",
        "Add auto-responder: \"I batch messages twice daily — urgent? call.\"",
        "Close chat apps after each check — don't leave them open.",
      ],
    },
    {
      id: "rec-phone",
      when: "scores.phone >= 2",
      title: "Your phone-free work plan",
      steps: [
        "Phone in drawer or another room during focus blocks.",
        "Enable Do Not Disturb on work hours — allow calls from favorites only.",
        "Remove social apps from home screen — friction beats willpower.",
        "Use Reset or Screen Time limits during 9–5.",
      ],
    },
    {
      id: "rec-noise",
      when: "scores.noise >= 2",
      title: "Your interruption shield plan",
      steps: [
        "Headphones on = do not disturb — tell team the signal.",
        "Book a small room or quiet corner for deep work blocks.",
        "Use noise-canceling headphones or brown noise if you can't relocate.",
        "Stand up when someone approaches — shorter conversations, fewer drop-ins.",
      ],
    },
    {
      id: "rec-remote",
      when: "scores.remote >= 2",
      title: "Your WFH boundary plan",
      steps: [
        "Same start ritual daily — commute walk, coffee, then desk.",
        "Work-only zone — don't work from bed or couch.",
        "End-of-day shutdown ritual — close laptop, change clothes, leave the room.",
        "Tell household your focus blocks — visible sign on door.",
      ],
    },
    {
      id: "rec-energy",
      when: "scores.afternoon >= 2",
      title: "Your energy alignment plan",
      steps: [
        "Schedule hardest work 9–11am — protect it like a client meeting.",
        "10-minute walk before afternoon tasks — movement resets alertness.",
        "Protein-heavy lunch — avoid carb crash.",
        "Save admin and email for low-energy windows.",
      ],
    },
    {
      id: "rec-chronic",
      when: "scores.chronic >= 2",
      title: "Your daily focus block plan",
      steps: [
        "One 90-minute focus block daily — non-negotiable, calendar-invite yourself.",
        "No email, Slack, or meetings inside the block — zero exceptions week one.",
        "Track focus hours daily — aim for 5 protected hours per week to start.",
        "Review what broke the block each Friday — fix one leak per week.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Your three workplace wins",
      steps: [
        "Block one 60-minute focus slot tomorrow — title it like a meeting.",
        "Batch messages twice daily instead of constant checking.",
        "Phone out of sight during that block — start there.",
      ],
    },
  ],

  guidance: [],

  ctas: {
    app: {
      title: "Focus at work without fighting your phone",
      description:
        "Reset blocks distracting apps during work hours and helps you protect focus blocks — so deep work survives open offices and WFH alike.",
    },
  },

  faq: [
    {
      question: "How is this different from \"Why can't I focus?\"",
      answer:
        "That tool diagnoses general focus blockers. This one targets workplace specifics — meetings, Slack culture, open offices, and remote blur.",
    },
    {
      question: "Can I use this if my boss expects instant replies?",
      answer:
        "Yes — the comms plan includes scripts and batching strategies that work even in synchronous cultures. Start with one protected hour, then expand.",
    },
    {
      question: "What if my company won't reduce meetings?",
      answer:
        "Protect the gaps — 25-minute blocks between calls, no-meeting mornings, and declining optional syncs. Small calendar wins compound.",
    },
  ],
} satisfies Record<string, unknown>;
