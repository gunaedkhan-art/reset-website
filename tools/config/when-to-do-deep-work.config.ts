export const whenToDoDeepWorkConfig = {
  schemaVersion: "1.0" as const,
  id: "when-to-do-deep-work",
  slug: "when-to-do-deep-work",
  status: "published" as const,

  seo: {
    title: "When to Do Deep Work",
    metaDescription:
      "When should you schedule deep work? Answer 4 questions about your energy, calendar, and chronotype — get the best time of day and week for your first protected block.",
    primaryKeyword: "when to do deep work",
    secondaryKeywords: [
      "best time for deep work",
      "when to schedule deep work",
      "deep work morning or evening",
      "deep work time of day",
      "peak focus time",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/when-to-do-deep-work",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["deep-work", "scheduling", "energy"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "When to Do Deep Work",
    intro:
      "Deep work timing isn't one-size-fits-all. The best slot depends on when your brain peaks, when meetings hit, and whether you're a morning or evening focuser. Four questions to place your block where it will actually survive.",
    eyebrow: "Timing finder",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_peak",
    nodes: {
      q_peak: {
        type: "question" as const,
        id: "q_peak",
        prompt: "When do you feel sharpest for hard thinking?",
        input: "single-choice" as const,
        options: [
          {
            id: "morning",
            label: "Morning — first 2–3 hours after waking",
            score: { morning: 3 },
            next: "q_meetings",
          },
          {
            id: "midday",
            label: "Midday — late morning through early afternoon",
            score: { midday: 3 },
            next: "q_meetings",
          },
          {
            id: "evening",
            label: "Evening — after dinner or late night",
            score: { evening: 3 },
            next: "q_meetings",
          },
          {
            id: "variable",
            label: "It varies — no consistent peak",
            score: { variable: 2 },
            next: "q_meetings",
          },
        ],
      },
      q_meetings: {
        type: "question" as const,
        id: "q_meetings",
        prompt: "When are meetings worst on your calendar?",
        input: "single-choice" as const,
        options: [
          {
            id: "morning",
            label: "Mornings — calls start early",
            score: { meet_morning: 3 },
            next: "q_life",
          },
          {
            id: "afternoon",
            label: "Afternoons — post-lunch syncs fill the day",
            score: { meet_afternoon: 3 },
            next: "q_life",
          },
          {
            id: "spread",
            label: "Spread all day — no clear pattern",
            score: { meet_spread: 2 },
            next: "q_life",
          },
          {
            id: "light",
            label: "Light — I have open blocks most days",
            score: { meet_light: 1 },
            next: "q_life",
          },
        ],
      },
      q_life: {
        type: "question" as const,
        id: "q_life",
        prompt: "What life constraint matters most?",
        input: "single-choice" as const,
        options: [
          {
            id: "kids",
            label: "Kids or family — mornings or evenings are spoken for",
            score: { family: 2 },
            next: "q_workplace",
          },
          {
            id: "commute",
            label: "Commute — I lose time at day edges",
            score: { commute: 2 },
            next: "q_workplace",
          },
          {
            id: "none",
            label: "Few constraints — work hours are mostly mine",
            score: { free: 2 },
            next: "q_workplace",
          },
          {
            id: "second_job",
            label: "Side project or school — deep work competes with main job",
            score: { split: 2 },
            next: "q_workplace",
          },
        ],
      },
      q_workplace: {
        type: "question" as const,
        id: "q_workplace",
        prompt: "Where do you do your best deep work?",
        input: "single-choice" as const,
        options: [
          {
            id: "home",
            label: "Home — quiet space I control",
            score: { home: 2 },
            next: "branch_result",
          },
          {
            id: "office",
            label: "Office — before others arrive or in a booked room",
            score: { office: 2 },
            next: "branch_result",
          },
          {
            id: "anywhere",
            label: "Anywhere with headphones — café, library, co-working",
            score: { flexible: 1 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.morning >= 2 && scores.meet_morning >= 2", next: "result_early_bird" },
          { when: "scores.evening >= 2", next: "result_night" },
          { when: "scores.meet_afternoon >= 2 && scores.morning >= 2", next: "result_morning_window" },
          { when: "scores.meet_spread >= 2", next: "result_gaps" },
          { when: "scores.split >= 2", next: "result_side" },
          { when: "scores.family >= 2", next: "result_family" },
        ],
        default: "result_peak",
      },
      result_early_bird: {
        type: "result" as const,
        id: "result_early_bird",
        resultTemplateId: "early_bird",
      },
      result_night: {
        type: "result" as const,
        id: "result_night",
        resultTemplateId: "night",
      },
      result_morning_window: {
        type: "result" as const,
        id: "result_morning_window",
        resultTemplateId: "morning_window",
      },
      result_gaps: {
        type: "result" as const,
        id: "result_gaps",
        resultTemplateId: "gaps",
      },
      result_side: {
        type: "result" as const,
        id: "result_side",
        resultTemplateId: "side",
      },
      result_family: {
        type: "result" as const,
        id: "result_family",
        resultTemplateId: "family",
      },
      result_peak: {
        type: "result" as const,
        id: "result_peak",
        resultTemplateId: "peak",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions to find when to schedule deep work.",
    templates: [
      {
        id: "early_bird",
        cards: [
          {
            title: "Best time",
            valueTemplate: "Before meetings start",
            descriptionTemplate: "Wake → 60–90 min deep block → shallow work after",
          },
          {
            title: "Example slot",
            valueTemplate: "6:30–8:00am weekdays",
            descriptionTemplate: "Or first 90 min of workday if WFH",
          },
        ],
        summaryTemplates: ["Your peak and meeting load both favor the early edge — defend it first."],
      },
      {
        id: "morning_window",
        cards: [
          {
            title: "Best time",
            valueTemplate: "Morning peak window",
            descriptionTemplate: "Schedule deep work before afternoon meetings eat the day",
          },
          {
            title: "Example slot",
            valueTemplate: "9:00–10:30am Mon–Fri",
            descriptionTemplate: "Recurring hold — \"Do not schedule\"",
          },
        ],
        summaryTemplates: ["Afternoon meetings make mornings your only reliable depth window."],
      },
      {
        id: "night",
        cards: [
          {
            title: "Best time",
            valueTemplate: "Evening quiet hours",
            descriptionTemplate: "When the house or office is finally still",
          },
          {
            title: "Example slot",
            valueTemplate: "8:30–10:00pm, 3 nights/week",
            descriptionTemplate: "Protect sleep — cap at 90 minutes",
          },
        ],
        summaryTemplates: ["Evening depth works — but guard sleep or activation gets harder."],
      },
      {
        id: "gaps",
        cards: [
          {
            title: "Best time",
            valueTemplate: "First calendar gap daily",
            descriptionTemplate: "Journalistic — depth follows availability, not clock",
          },
          {
            title: "Example slot",
            valueTemplate: "25–45 min between meetings",
            descriptionTemplate: "Keep depth list ready — start within 60 seconds of gap",
          },
        ],
        summaryTemplates: ["Fragmented calendars need gap-based depth — always know your next task."],
      },
      {
        id: "family",
        cards: [
          {
            title: "Best time",
            valueTemplate: "Micro-window you control",
            descriptionTemplate: "Often pre-family morning or post-bedtime — 45 min max",
          },
          {
            title: "Example slot",
            valueTemplate: "5:30–6:15am or 9:00–9:45pm",
            descriptionTemplate: "Same slot 3× weekly beats random long blocks",
          },
        ],
        summaryTemplates: ["Family constraints mean shorter blocks at fixed times — rhythm over length."],
      },
      {
        id: "side",
        cards: [
          {
            title: "Best time",
            valueTemplate: "Opposite of main job peak",
            descriptionTemplate: "Side-project depth when day-job brain is off",
          },
          {
            title: "Example slot",
            valueTemplate: "Sat 8–11am + two weeknight evenings",
            descriptionTemplate: "Bimodal — batch side deep work on protected days",
          },
        ],
        summaryTemplates: ["Split schedules need dedicated deep days — daily blocks rarely survive both jobs."],
      },
      {
        id: "peak",
        cards: [
          {
            title: "Best time",
            valueTemplate: "Your natural peak",
            descriptionTemplate: "Align block with sharpest hours — shallow work in the trough",
          },
          {
            title: "Example slot",
            valueTemplate: "First 90 min of peak window",
            descriptionTemplate: "Calendar-invite yourself — same time weekly",
          },
        ],
        summaryTemplates: ["Match block to energy peak — admin and email fill the rest."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-early",
      when: "scores.morning >= 2 && scores.meet_morning >= 2",
      title: "Your timing playbook",
      steps: [
        "Block 6:30–8:00am (or first 90 min at desk) — before Slack wakes up.",
        "No email before the block ends — ever.",
        "Prep materials tonight — zero morning decision friction.",
        "Tell team: \"I'm offline until 9am for focus.\"",
      ],
    },
    {
      id: "rec-morning",
      when: "scores.meet_afternoon >= 2",
      title: "Your timing playbook",
      steps: [
        "9:00–10:30am recurring deep hold — decline conflicting invites.",
        "Move optional afternoon meetings to batch days.",
        "Shallow work (email, admin) only after 11am.",
        "Protein breakfast — avoid post-lunch depth if energy crashes.",
      ],
    },
    {
      id: "rec-night",
      when: "scores.evening >= 2",
      title: "Your timing playbook",
      steps: [
        "Max 90 minutes evening blocks — stop 1 hour before sleep.",
        "Same 3 nights weekly — ritual beats random late sessions.",
        "Shutdown ritual after — don't carry work to bed.",
        "If tired, skip — evening depth requires rest.",
      ],
    },
    {
      id: "rec-gaps",
      when: "scores.meet_spread >= 2",
      title: "Your timing playbook",
      steps: [
        "Sunday: write depth list for the week — tasks ready to grab.",
        "Scan calendar nightly — book 25-min holds in tomorrow's gaps.",
        "Start within 60 seconds of gap opening — no \"quick checks\" first.",
        "Take the deep work schedule quiz for journalistic mode tips.",
      ],
    },
    {
      id: "rec-family",
      when: "scores.family >= 2",
      title: "Your timing playbook",
      steps: [
        "Negotiate one protected 45-min window with household — visible on calendar.",
        "Prep night before — clothes, coffee, task note ready.",
        "Phone stays off during micro-block — quality over length.",
        "Weekend morning swap with partner if possible — one deep block each.",
      ],
    },
    {
      id: "rec-side",
      when: "scores.split >= 2",
      title: "Your timing playbook",
      steps: [
        "One weekend deep day for side work — 3-hour block minimum.",
        "Two weeknight 45-min sessions max — don't sacrifice sleep.",
        "Main job gets weekday peaks — side project gets protected off-hours.",
        "Batch shallow side tasks separately from deep building.",
      ],
    },
    {
      id: "rec-peak",
      when: "true",
      title: "Your timing playbook",
      steps: [
        "Identify peak 2-hour window this week — track energy hourly once.",
        "Place 60–90 min deep block inside peak — recurring.",
        "Move meetings out of peak if negotiable — even one helps.",
        "Shallow work in energy trough — usually post-lunch or late afternoon.",
      ],
    },
  ],

  guidance: [
    {
      title: "When beats how long",
      body: "A 45-minute block at your peak outperforms a 2-hour block when you're depleted. Newport's rhythmic philosophy works because timing becomes automatic.",
      list: [
        "Protect peak hours for depth — never for email",
        "Same time daily builds habit faster than random long blocks",
        "If timing fails repeatedly, shrink the block — don't abandon the slot",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Hold the time slot you chose",
      description:
        "Reset blocks distracting apps during your scheduled deep work window — so the slot you picked isn't lost to mid-block phone drift.",
    },
  },

  faq: [
    {
      question: "Is morning or evening better for deep work?",
      answer:
        "Whichever matches your chronotype and calendar. Most people peak mid-morning, but night owls with quiet evenings can depth just as well — if sleep stays protected.",
    },
    {
      question: "How is this different from the deep work schedule quiz?",
      answer:
        "The schedule quiz picks your philosophy (rhythmic, bimodal, etc.). This tool picks the clock time and day — when on the calendar, not how you structure weeks.",
    },
    {
      question: "What if my best time is always interrupted?",
      answer:
        "Defend it like a client meeting — status messages, declining invites, or shifting to 30 minutes earlier. If defense fails, use gap-based 25-minute blocks instead.",
    },
  ],
} satisfies Record<string, unknown>;
