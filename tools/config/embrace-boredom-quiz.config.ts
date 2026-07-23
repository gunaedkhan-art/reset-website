export const embraceBoredomQuizConfig = {
  schemaVersion: "1.0" as const,
  id: "embrace-boredom-quiz",
  slug: "embrace-boredom-quiz",
  status: "published" as const,

  seo: {
    title: "Embrace Boredom Quiz",
    metaDescription:
      "Cal Newport's Rule #2: embrace boredom instead of reaching for your phone. Answer 4 questions — get your boredom tolerance score and a plan to stop reflexive stimulation.",
    primaryKeyword: "embrace boredom",
    secondaryKeywords: [
      "boredom and focus",
      "phone when bored",
      "boredom tolerance",
      "cal newport embrace boredom",
      "stop reaching for phone when bored",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/embrace-boredom-quiz",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "boredom", "phone"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Embrace Boredom Quiz",
    intro:
      "Newport's second deep work rule: embrace boredom. If you reach for stimulation every idle moment, your brain won't tolerate the lack of novelty deep work requires. Four questions — see your boredom reflex and how to retrain it.",
    eyebrow: "Boredom diagnostic",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_idle",
    nodes: {
      q_idle: {
        type: "question" as const,
        id: "q_idle",
        prompt: "When you have 60 seconds of nothing to do, you usually…",
        input: "single-choice" as const,
        options: [
          { id: "phone", label: "Pull out my phone — automatic", score: { reflex: 3 }, next: "q_deep" },
          { id: "sometimes", label: "Sometimes phone, sometimes just wait", score: { mixed: 2 }, next: "q_deep" },
          { id: "wait", label: "Wait — boredom doesn't bother me much", score: { tolerant: 3 }, next: "q_deep" },
        ],
      },
      q_deep: {
        type: "question" as const,
        id: "q_deep",
        prompt: "During deep work, when the task gets dull for a minute, you…",
        input: "single-choice" as const,
        options: [
          { id: "switch", label: "Switch tabs, check phone, or grab snack", score: { switch: 3 }, next: "q_schedule" },
          { id: "push", label: "Push through — stay on task", score: { push: 2 }, next: "q_schedule" },
          { id: "quit", label: "End the session — \"I'm not in the mood\"", score: { quit: 3 }, next: "q_schedule" },
        ],
      },
      q_schedule: {
        type: "question" as const,
        id: "q_schedule",
        prompt: "How often are you without stimulation (no phone, TV, podcast)?",
        input: "single-choice" as const,
        options: [
          { id: "never", label: "Almost never — always something on", score: { overstim: 3 }, next: "q_goal" },
          { id: "some", label: "Occasionally — walks, waiting in line", score: { some: 1 }, next: "q_goal" },
          { id: "regular", label: "Regular — I schedule unstimulated time", score: { practice: 2 }, next: "q_goal" },
        ],
      },
      q_goal: {
        type: "question" as const,
        id: "q_goal",
        prompt: "What do you most want boredom training for?",
        input: "single-choice" as const,
        options: [
          { id: "deep", label: "Longer deep work sessions", score: { deep: 2 }, next: "branch_result" },
          { id: "phone", label: "Less phone checking overall", score: { phone: 2 }, next: "branch_result" },
          { id: "both", label: "Both — focus and digital habits", score: { both: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.reflex >= 2 && scores.overstim >= 2", next: "result_addicted" },
          { when: "scores.switch >= 2 || scores.quit >= 2", next: "result_deep" },
          { when: "scores.tolerant >= 2", next: "result_ready" },
        ],
        default: "result_retrain",
      },
      result_addicted: { type: "result" as const, id: "result_addicted", resultTemplateId: "addicted" },
      result_deep: { type: "result" as const, id: "result_deep", resultTemplateId: "deep" },
      result_ready: { type: "result" as const, id: "result_ready", resultTemplateId: "ready" },
      result_retrain: { type: "result" as const, id: "result_retrain", resultTemplateId: "retrain" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your embrace-boredom plan.",
    templates: [
      {
        id: "addicted",
        cards: [
          { title: "Boredom reflex", valueTemplate: "Always-on stimulation", descriptionTemplate: "Idle moments always get filled — your brain expects constant novelty." },
          { title: "Deep work impact", valueTemplate: "Depth won't stick", descriptionTemplate: "Deep work is boring at first — reflexive phone use breaks the training." },
        ],
        summaryTemplates: ["Retrain boredom tolerance before expecting 90-minute depth."],
      },
      {
        id: "deep",
        cards: [
          { title: "Boredom reflex", valueTemplate: "Mid-session escape", descriptionTemplate: "You tolerate starting but flee when focus gets flat — classic attention residue trigger." },
          { title: "Deep work impact", valueTemplate: "Quit before flow", descriptionTemplate: "Flow arrives after boredom — you leave too early." },
        ],
        summaryTemplates: ["Stay 10 more minutes when it gets dull — that's where depth begins."],
      },
      {
        id: "ready",
        cards: [
          { title: "Boredom reflex", valueTemplate: "Boredom-tolerant", descriptionTemplate: "You can wait without stimulation — deep work has a foundation." },
          { title: "Deep work impact", valueTemplate: "Maintain the habit", descriptionTemplate: "Keep practicing unstimulated moments — don't backslide on phone reflex." },
        ],
        summaryTemplates: ["Protect boredom tolerance — don't refill idle moments with feeds."],
      },
      {
        id: "retrain",
        cards: [
          { title: "Boredom reflex", valueTemplate: "Mixed — retrainable", descriptionTemplate: "Some reflex, some tolerance — structured practice will shift the default." },
          { title: "Deep work impact", valueTemplate: "Practice needed", descriptionTemplate: "Schedule daily boredom reps separate from deep work." },
        ],
        summaryTemplates: ["Embrace boredom on purpose before asking for longer deep blocks."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-addicted",
      when: "scores.reflex >= 2 || scores.overstim >= 2",
      title: "Boredom retraining — week 1",
      steps: [
        "Daily: 10 min with phone in another room — sit, walk, or wait.",
        "No podcasts, music, or scrolling in those 10 minutes.",
        "When urge hits, notice it — don't act for 60 seconds.",
        "Increase to 15 min after 5 days — boredom is a skill.",
      ],
    },
    {
      id: "rec-deep",
      when: "scores.switch >= 2 || scores.quit >= 2",
      title: "Mid-session boredom protocol",
      steps: [
        "When dullness hits: 10 more minutes before any tab switch.",
        "Phone stays away entire block — boredom isn't an excuse.",
        "Name the feeling: \"This is boredom, not failure.\"",
        "Flow often follows the boring patch — don't quit at minute 12.",
      ],
    },
    {
      id: "rec-ready",
      when: "scores.tolerant >= 2",
      title: "Maintain tolerance",
      steps: [
        "Keep one daily unstimulated window — don't let it slip.",
        "No phone during lines, elevators, or short waits.",
        "Extend deep blocks gradually — tolerance supports length.",
        "Avoid background feeds while working — single-task only.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Newport's embrace boredom rules",
      steps: [
        "Never fill every idle moment — schedule boredom on purpose.",
        "Deep work requires tolerating lack of novelty early in sessions.",
        "Phone away during boredom reps and deep blocks alike.",
        "Boredom tolerance compounds — practice daily, not once.",
      ],
    },
  ],

  guidance: [
    {
      title: "Rule #2: Embrace boredom",
      body: "Cal Newport argues that constant stimulation trains your brain to reject the sustained, low-novelty concentration deep work requires.",
      list: [
        "Idle phone checks weaken focus endurance",
        "Boredom in deep work is normal — not a signal to stop",
        "Practice unstimulated time like a muscle",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Block the boredom reflex",
      description:
        "Reset blocks distracting apps during deep work and idle moments — retrain your brain to tolerate boredom without reaching for stimulation.",
    },
  },

  faq: [
    {
      question: "Why embrace boredom for deep work?",
      answer:
        "Deep work often feels boring before flow arrives. If you're trained to flee boredom via phone or tabs, you'll never sustain the concentration Newport describes.",
    },
    {
      question: "How long should boredom practice take?",
      answer:
        "Start with 10 daily minutes without stimulation. Build to 20–30 over two weeks. Separate from deep work at first, then apply during sessions.",
    },
    {
      question: "Is boredom the same as meditation?",
      answer:
        "Related but simpler — Newport's point is tolerating unstimulated moments. Productive meditation is structured; boredom reps can be just waiting without your phone.",
    },
  ],
} satisfies Record<string, unknown>;
