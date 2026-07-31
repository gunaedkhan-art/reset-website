export const shutdownRitualBuilderConfig = {
  schemaVersion: "1.0" as const,
  id: "shutdown-ritual-builder",
  slug: "shutdown-ritual-builder",
  status: "published" as const,

  seo: {
    title: "Shutdown Ritual Builder",
    metaDescription:
      "Build a personalized end-of-day shutdown ritual — Cal Newport's method to stop work thoughts, plan tomorrow, and actually disconnect tonight.",
    primaryKeyword: "shutdown ritual",
    secondaryKeywords: [
      "end of work day ritual",
      "work shutdown routine",
      "stop thinking about work",
      "cal newport shutdown ritual",
      "end workday checklist",
    ],
    searchIntent: "checklist" as const,
    canonicalPath: "/shutdown-ritual-builder",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["deep-work", "shutdown", "boundaries"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Shutdown Ritual Builder",
    intro:
      "Four questions to build an end-of-day ritual that captures open loops — so work thoughts don't follow you home.",
    icon: "shield",
    proseTitle: "About the shutdown ritual",
    sections: [
      {
        id: "problem",
        heading: "When work never actually ends",
        framework: "pas",
        body: "You close the laptop but replay tomorrow's tasks at dinner. Open loops — unfinished drafts, vague worries, unread pings — keep your brain in work mode long after you stop.",
      },
      {
        id: "concept",
        heading: "Newport's shutdown ritual",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) describes a fixed end-of-day shutdown in [Deep Work](https://calnewport.com/books/deep-work/): review tasks, capture next actions, say a phrase that signals \"work is done.\" The ritual tells your mind it's safe to disengage — and makes tomorrow's start faster.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A personalized shutdown checklist matched to what keeps you mentally \"at work\" — open loops, tomorrow anxiety, or boundary leaks — plus steps to run it in under 10 minutes.",
      },
    ],
    eyebrow: "Interactive tool",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_leak",
    nodes: {
      q_leak: {
        type: "question" as const,
        id: "q_leak",
        prompt: "What keeps work on your mind after you stop?",
        input: "single-choice" as const,
        options: [
          {
            id: "open_loops",
            label: "Open loops — tasks I might forget tomorrow",
            score: { capture: 3 },
            next: "q_tomorrow",
          },
          {
            id: "phone",
            label: "Phone and Slack — I keep checking after hours",
            score: { digital: 3 },
            next: "q_tomorrow",
          },
          {
            id: "no_boundary",
            label: "No clear stop — I drift from work into evening",
            score: { boundary: 3 },
            next: "q_tomorrow",
          },
          {
            id: "anxiety",
            label: "Anxiety — replaying what I didn't finish",
            score: { anxiety: 3 },
            next: "q_tomorrow",
          },
        ],
      },
      q_tomorrow: {
        type: "question" as const,
        id: "q_tomorrow",
        prompt: "Do you usually know your top priority for tomorrow?",
        input: "single-choice" as const,
        options: [
          {
            id: "no",
            label: "No — I figure it out in the morning",
            score: { plan: 3 },
            next: "q_setup",
          },
          {
            id: "vague",
            label: "Vaguely — a general area but no single task",
            score: { plan: 2 },
            next: "q_setup",
          },
          {
            id: "yes",
            label: "Yes — I already know the first deep task",
            score: { plan: 0 },
            next: "q_setup",
          },
        ],
      },
      q_setup: {
        type: "question" as const,
        id: "q_setup",
        prompt: "Where do you work most often?",
        input: "single-choice" as const,
        options: [
          {
            id: "home",
            label: "Home — same space for work and life",
            score: { home: 3 },
            next: "q_phrase",
          },
          {
            id: "office",
            label: "Office — I leave a physical workplace",
            score: { office: 2 },
            next: "q_phrase",
          },
          {
            id: "hybrid",
            label: "Hybrid — mix of both",
            score: { home: 1, office: 1 },
            next: "q_phrase",
          },
        ],
      },
      q_phrase: {
        type: "question" as const,
        id: "q_phrase",
        prompt: "Would saying a phrase out loud help you mentally \"close\" the day?",
        input: "single-choice" as const,
        options: [
          {
            id: "yes",
            label: "Yes — I like explicit rituals and cues",
            score: { ritual: 2 },
            next: "branch_result",
          },
          {
            id: "maybe",
            label: "Maybe — I'll try it if the steps are simple",
            score: { ritual: 1 },
            next: "branch_result",
          },
          {
            id: "no",
            label: "No — just give me a practical checklist",
            score: { ritual: 0 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.digital >= 2", next: "result_digital" },
          { when: "scores.home >= 2 && scores.boundary >= 2", next: "result_wfh" },
          { when: "scores.anxiety >= 2", next: "result_anxiety" },
          { when: "scores.capture >= 2 || scores.plan >= 2", next: "result_capture" },
        ],
        default: "result_standard",
      },
      result_digital: {
        type: "result" as const,
        id: "result_digital",
        resultTemplateId: "digital",
      },
      result_wfh: {
        type: "result" as const,
        id: "result_wfh",
        resultTemplateId: "wfh",
      },
      result_anxiety: {
        type: "result" as const,
        id: "result_anxiety",
        resultTemplateId: "anxiety",
      },
      result_capture: {
        type: "result" as const,
        id: "result_capture",
        resultTemplateId: "capture",
      },
      result_standard: {
        type: "result" as const,
        id: "result_standard",
        resultTemplateId: "standard",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions above to build your shutdown ritual.",
    templates: [
      {
        id: "digital",
        cards: [
          {
            title: "Focus",
            valueTemplate: "Digital boundary",
            descriptionTemplate:
              "Work follows you through your phone — the ritual ends with hard offline rules.",
          },
        ],
        summaryTemplates: ["Your shutdown ritual cuts the after-hours digital tether."],
      },
      {
        id: "wfh",
        cards: [
          {
            title: "Focus",
            valueTemplate: "Physical separation",
            descriptionTemplate:
              "Home blur means your brain never gets a \"leaving work\" signal — the ritual creates one.",
          },
        ],
        summaryTemplates: ["Your shutdown ritual replaces a commute with deliberate closure."],
      },
      {
        id: "anxiety",
        cards: [
          {
            title: "Focus",
            valueTemplate: "Anxiety relief",
            descriptionTemplate:
              "Unfinished work loops in your head — the ritual externalizes them so you can rest.",
          },
        ],
        summaryTemplates: ["Your shutdown ritual trades rumination for a trusted capture system."],
      },
      {
        id: "capture",
        cards: [
          {
            title: "Focus",
            valueTemplate: "Capture & plan",
            descriptionTemplate:
              "Open tasks and vague tomorrow plans keep you mentally at work — the ritual closes the loop.",
          },
        ],
        summaryTemplates: ["Your shutdown ritual ensures tomorrow is planned before tonight begins."],
      },
      {
        id: "standard",
        cards: [
          {
            title: "Focus",
            valueTemplate: "Complete shutdown",
            descriptionTemplate:
              "A simple end-of-day sequence — review, capture, plan, close — so work stays at work.",
          },
        ],
        summaryTemplates: ["Your shutdown ritual follows Newport's core four-step pattern."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-digital",
      when: "scores.digital >= 2",
      title: "Your shutdown ritual — digital edition",
      steps: [
        "Review today's task list — check off done, star tomorrow's top 1–3.",
        "Write tomorrow's first deep task in one sentence.",
        "Log out of Slack/email on phone — or remove work apps from home screen after 6pm.",
        "Say aloud: \"Shutdown complete\" — Newport's phrase to signal the brain.",
        "If you slip and check work after shutdown, repeat the phrase and close the app.",
      ],
    },
    {
      id: "rec-wfh",
      when: "scores.home >= 2",
      title: "Your shutdown ritual — WFH edition",
      steps: [
        "Last 10 minutes at desk: inbox scan — nothing new starts, only capture.",
        "Write tomorrow's schedule block for deep work on paper or calendar.",
        "Close laptop, clear desk, change clothes — physical \"leaving work\" cues.",
        "Leave the work zone — different room if possible for the rest of the evening.",
        "Say \"Shutdown complete\" — same phrase every day builds the trigger.",
      ],
    },
    {
      id: "rec-anxiety",
      when: "scores.anxiety >= 2",
      title: "Your shutdown ritual — anxiety edition",
      steps: [
        "Brain dump: list everything unfinished — get it out of your head onto paper.",
        "Circle only what must happen tomorrow — everything else waits.",
        "For each tomorrow item: one next action, not the whole project.",
        "Remind yourself: \"I've captured it — thinking tonight won't help.\"",
        "End with \"Shutdown complete\" — trust the system, not midnight worry.",
      ],
    },
    {
      id: "rec-capture",
      when: "scores.capture >= 2 || scores.plan >= 2",
      title: "Your shutdown ritual — capture edition",
      steps: [
        "Scan calendar and inbox — anything tomorrow? Add to task list, don't act tonight.",
        "Pick ONE deep task for tomorrow morning — write it where you'll see it first.",
        "Review weekly goals — does tomorrow's task connect? Adjust if not.",
        "Close all work tabs and apps — clean desktop = clean stop.",
        "Say \"Shutdown complete\" — ritual phrase marks the boundary.",
      ],
    },
    {
      id: "rec-standard",
      when: "true",
      title: "Newport's core shutdown ritual",
      steps: [
        "Review task list — ensure nothing urgent is missed.",
        "Update calendar for tomorrow — block deep work first.",
        "Write tomorrow's #1 priority in one sentence.",
        "Say \"Shutdown complete\" aloud — same words every day.",
        "No work email or Slack until tomorrow's planned start time.",
      ],
    },
  ],

  guidance: [
    {
      title: "Why a shutdown ritual works",
      body: "Cal Newport argues that incomplete plans keep the brain in \"work mode.\" A fixed ritual captures open loops and gives your mind permission to disengage.",
      list: [
        "Same steps daily — the ritual becomes automatic",
        "The phrase \"Shutdown complete\" is a cognitive off-switch",
        "Planning tomorrow reduces morning decision fatigue",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Keep evenings work-free",
      description:
        "Reset enforces app limits after your shutdown time — so the ritual isn't undone by a reflexive Slack or social check before bed.",
    },
  },

  faq: [
    {
      question: "What is Cal Newport's shutdown ritual?",
      answer:
        "A fixed end-of-day routine: review tasks, plan tomorrow, capture open loops, and say \"Shutdown complete\" — signaling that work thinking is done until the next session.",
    },
    {
      question: "How long should it take?",
      answer:
        "5–15 minutes once practiced. Speed comes from repetition — the value is consistency, not length.",
    },
    {
      question: "What if urgent work comes up after shutdown?",
      answer:
        "True emergencies are rare. If you must re-open work, run a mini-shutdown again when done — don't leave the day ambiguously \"open.\"",
    },
  ],
} satisfies Record<string, unknown>;
