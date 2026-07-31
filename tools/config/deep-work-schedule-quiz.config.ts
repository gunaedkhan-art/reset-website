export const deepWorkScheduleQuizConfig = {
  schemaVersion: "1.0" as const,
  id: "deep-work-schedule-quiz",
  slug: "deep-work-schedule-quiz",
  status: "published" as const,

  seo: {
    title: "Deep Work Schedule Quiz",
    metaDescription:
      "Find your deep work scheduling style — monastic, bimodal, rhythmic, or journalistic — based on Cal Newport's four philosophies and your real-life constraints.",
    primaryKeyword: "deep work schedule",
    secondaryKeywords: [
      "deep work scheduling",
      "how to schedule deep work",
      "deep work philosophy",
      "monastic deep work",
      "rhythmic deep work",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/deep-work-schedule-quiz",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["deep-work", "scheduling", "planning"],
    cluster: "deep-work",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Deep Work Schedule Quiz",
    intro:
      "Four questions to see which scheduling philosophy fits your job, constraints, and personality — monastic, bimodal, rhythmic, or journalistic.",
    icon: "calendar",
    proseTitle: "About scheduling philosophies",
    sections: [
      {
        id: "problem",
        heading: "One-size-fits-all schedules fail",
        framework: "pas",
        body: "Copying a creator's 4-hour morning block doesn't work when you have standups at 9 and kids at 3. Without a philosophy matched to your constraints, deep work stays aspirational — something you'll start \"when things calm down.\"",
      },
      {
        id: "concept",
        heading: "Newport's four philosophies",
        framework: "concept",
        body: "In [Deep Work](https://calnewport.com/books/deep-work/), [Cal Newport](https://calnewport.com/) describes four ways to fit depth into life: monastic (eliminate shallow), bimodal (long deep stretches), rhythmic (daily at the same time), and journalistic (grab gaps when they appear). Each fits different roles and life stages.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Your best-fit philosophy plus a playbook — concrete steps for protecting blocks, handling shallow obligations, and graduating to a stronger schedule over time.",
      },
    ],
    eyebrow: "Interactive tool",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_flexibility",
    nodes: {
      q_flexibility: {
        type: "question" as const,
        id: "q_flexibility",
        prompt: "How flexible is your work schedule?",
        input: "single-choice" as const,
        options: [
          {
            id: "full",
            label: "Very flexible — I control most of my time",
            score: { flexible: 3 },
            next: "q_obligations",
          },
          {
            id: "partial",
            label: "Partially — some fixed meetings, rest is mine",
            score: { partial: 2 },
            next: "q_obligations",
          },
          {
            id: "fixed",
            label: "Mostly fixed — 9–5 with a packed calendar",
            score: { fixed: 3 },
            next: "q_obligations",
          },
        ],
      },
      q_obligations: {
        type: "question" as const,
        id: "q_obligations",
        prompt: "How much shallow obligation do you carry?",
        input: "single-choice" as const,
        options: [
          {
            id: "minimal",
            label: "Minimal — output matters more than availability",
            score: { monastic: 3 },
            next: "q_routine",
          },
          {
            id: "moderate",
            label: "Moderate — meetings and comms, but negotiable",
            score: { bimodal: 2, rhythmic: 1 },
            next: "q_routine",
          },
          {
            id: "heavy",
            label: "Heavy — I'm expected to be responsive all day",
            score: { journalistic: 2 },
            next: "q_routine",
          },
        ],
      },
      q_routine: {
        type: "question" as const,
        id: "q_routine",
        prompt: "Do you work better with fixed daily routines?",
        input: "single-choice" as const,
        options: [
          {
            id: "yes",
            label: "Yes — same time every day helps me start",
            score: { rhythmic: 3 },
            next: "q_seasons",
          },
          {
            id: "no",
            label: "No — I grab focus when I can find it",
            score: { journalistic: 2 },
            next: "q_seasons",
          },
          {
            id: "blocks",
            label: "I prefer longer blocks — days or weeks at a time",
            score: { bimodal: 3 },
            next: "q_seasons",
          },
        ],
      },
      q_seasons: {
        type: "question" as const,
        id: "q_seasons",
        prompt: "Could you take periodic \"deep seasons\" away from normal work?",
        input: "single-choice" as const,
        options: [
          {
            id: "yes",
            label: "Yes — sabbatical weeks, off-site days, or quiet seasons",
            score: { bimodal: 3 },
            next: "branch_result",
          },
          {
            id: "sometimes",
            label: "Sometimes — a quiet Friday or monthly focus day",
            score: { bimodal: 1, rhythmic: 1 },
            next: "branch_result",
          },
          {
            id: "no",
            label: "No — daily life doesn't allow disappearing",
            score: { rhythmic: 2, journalistic: 1 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.monastic >= 2 && scores.flexible >= 2", next: "result_monastic" },
          { when: "scores.bimodal >= 3", next: "result_bimodal" },
          { when: "scores.rhythmic >= 3", next: "result_rhythmic" },
          { when: "scores.journalistic >= 2 && scores.fixed >= 2", next: "result_journalistic" },
          { when: "scores.rhythmic >= 2", next: "result_rhythmic" },
          { when: "scores.bimodal >= 2", next: "result_bimodal" },
        ],
        default: "result_journalistic",
      },
      result_monastic: {
        type: "result" as const,
        id: "result_monastic",
        resultTemplateId: "monastic",
      },
      result_bimodal: {
        type: "result" as const,
        id: "result_bimodal",
        resultTemplateId: "bimodal",
      },
      result_rhythmic: {
        type: "result" as const,
        id: "result_rhythmic",
        resultTemplateId: "rhythmic",
      },
      result_journalistic: {
        type: "result" as const,
        id: "result_journalistic",
        resultTemplateId: "journalistic",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions above to find your deep work schedule style.",
    templates: [
      {
        id: "monastic",
        cards: [
          {
            title: "Your style",
            valueTemplate: "Monastic",
            descriptionTemplate:
              "Minimize shallow obligations — long stretches of depth with few interruptions.",
          },
        ],
        summaryTemplates: [
          "Best for writers, researchers, and independents who can say no to most reactive work.",
        ],
      },
      {
        id: "bimodal",
        cards: [
          {
            title: "Your style",
            valueTemplate: "Bimodal",
            descriptionTemplate:
              "Alternate between deep seasons and normal availability — depth in dedicated blocks of days or weeks.",
          },
        ],
        summaryTemplates: [
          "Best when you can protect multi-day focus periods without losing your job or relationships.",
        ],
      },
      {
        id: "rhythmic",
        cards: [
          {
            title: "Your style",
            valueTemplate: "Rhythmic",
            descriptionTemplate:
              "Same deep work window every day — depth becomes a habit, not a special event.",
          },
        ],
        summaryTemplates: [
          "Best for most knowledge workers — predictable, sustainable, and easy to defend on a calendar.",
        ],
      },
      {
        id: "journalistic",
        cards: [
          {
            title: "Your style",
            valueTemplate: "Journalistic",
            descriptionTemplate:
              "Fit deep work into whatever gaps appear — requires skill at switching into depth quickly.",
          },
        ],
        summaryTemplates: [
          "Best for reactive roles — but hardest to master. Use only if rhythm or bimodal blocks aren't possible.",
        ],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-monastic",
      when: "scores.monastic >= 2",
      title: "Monastic schedule — your playbook",
      steps: [
        "Batch all shallow work to one half-day per week — inbox, admin, calls.",
        "Set auto-responder: \"I check messages on Fridays only — urgent? call.\"",
        "Protect 4-hour morning blocks Mon–Thu — zero meetings inside.",
        "Review monthly: cut any obligation that doesn't serve your core output.",
      ],
    },
    {
      id: "rec-bimodal",
      when: "scores.bimodal >= 2",
      title: "Bimodal schedule — your playbook",
      steps: [
        "Book one \"deep day\" per week — no meetings, no email, one hard project.",
        "Quarterly: take 2–3 consecutive deep days if your role allows.",
        "Tell stakeholders in advance — \"I'm offline for output, back Thursday.\"",
        "Use normal days for collaboration — don't let shallow work bleed into deep days.",
      ],
    },
    {
      id: "rec-rhythmic",
      when: "scores.rhythmic >= 2",
      title: "Rhythmic schedule — your playbook",
      steps: [
        "Same 90-minute block daily — e.g. 8:00–9:30 before the world wakes up.",
        "Calendar-invite yourself — recurring, non-negotiable, titled \"Deep work.\"",
        "Same startup ritual: phone away, one task written, timer on.",
        "Track streak — 5 deep mornings per week is a strong target.",
      ],
    },
    {
      id: "rec-journalistic",
      when: "true",
      title: "Journalistic schedule — your playbook",
      steps: [
        "Keep a \"depth list\" — next 3 hard tasks ready when a gap opens.",
        "Practice 5-minute warm-up: close everything, read task note, start timer.",
        "Protect even 25-minute gaps — one pomodoro beats waiting for a free afternoon.",
        "Graduate toward rhythmic if possible — journalistic mode burns willpower fast.",
      ],
    },
  ],

  guidance: [
    {
      title: "Newport's four scheduling philosophies",
      body: "From Deep Work — each is a different way to fit cognitively demanding work into a real life.",
      list: [
        "Monastic — eliminate shallow work almost entirely",
        "Bimodal — long deep stretches separated by normal work",
        "Rhythmic — daily deep work at the same time",
        "Journalistic — deep work whenever you can grab it",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Make your deep work window stick",
      description:
        "Reset blocks apps during your scheduled deep work blocks — so rhythmic or journalistic sessions aren't broken by reflexive phone checks.",
    },
  },

  faq: [
    {
      question: "Which deep work schedule is best?",
      answer:
        "Rhythmic fits most people with regular jobs. Monastic suits independents. Bimodal works if you can protect multi-day blocks. Journalistic is a fallback for highly reactive roles.",
    },
    {
      question: "Can I combine scheduling styles?",
      answer:
        "Yes — many people use rhythmic daily blocks plus bimodal quarterly deep days. Start with one philosophy and layer later.",
    },
    {
      question: "What if my quiz result doesn't match my job?",
      answer:
        "Use the playbook as a target, not a verdict. Even partial adoption — one rhythmic morning block — moves the needle.",
    },
  ],
} satisfies Record<string, unknown>;
