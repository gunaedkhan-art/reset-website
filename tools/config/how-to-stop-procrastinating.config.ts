export const howToStopProcrastinatingConfig = {
  schemaVersion: "1.0" as const,
  id: "how-to-stop-procrastinating",
  slug: "how-to-stop-procrastinating",
  status: "published" as const,

  seo: {
    title: "How to Stop Procrastinating",
    metaDescription:
      "Answer 5 quick questions and get a personalized procrastination rescue plan — free interactive tool, results in under 60 seconds.",
    primaryKeyword: "how to stop procrastinating",
    secondaryKeywords: [
      "stop procrastinating",
      "procrastination help",
      "procrastination action plan",
      "overcome procrastination",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/how-to-stop-procrastinating",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["procrastination", "focus", "productivity"],
    cluster: "stop-procrastinating",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "How to Stop Procrastinating",
    intro:
      "Answer a few quick questions and get a personalized rescue plan based on what's actually blocking you — not generic advice.",
    icon: "clock",
    proseTitle: "About this plan",
    sections: [
      {
        id: "problem",
        heading: "When generic advice fails",
        framework: "pas",
        body: "You've tried timers, lists, and guilt — still avoiding the work. Procrastination usually has a specific trigger: fear, overwhelm, boredom, fatigue, or unclear next steps. A generic fix misses the real blocker.",
      },
      {
        id: "concept",
        heading: "Match the fix to the trigger",
        framework: "concept",
        body: "Behavior change sticks when the intervention fits the cause. An anxious task needs lower stakes; an unclear task needs a defined next action; a boring task needs structure — not the same lecture about discipline.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A personalized rescue plan from five quick questions — matched steps, not a one-size-fits-all productivity lecture.",
      },
    ],
    eyebrow: "Interactive tool",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_avoiding",
    nodes: {
      q_avoiding: {
        type: "question" as const,
        id: "q_avoiding",
        prompt: "What are you avoiding right now?",
        input: "single-choice" as const,
        options: [
          { id: "task", label: "A specific task", next: "q_delay" },
          { id: "project", label: "A whole project", next: "q_delay" },
          { id: "unclear", label: "I'm not sure — I just can't start", next: "q_feeling" },
        ],
      },
      q_delay: {
        type: "question" as const,
        id: "q_delay",
        prompt: "How long have you been putting it off?",
        input: "single-choice" as const,
        options: [
          { id: "hours", label: "Hours", score: { avoidance: 1 }, next: "q_feeling" },
          { id: "days", label: "Days", score: { avoidance: 2 }, next: "q_feeling" },
          { id: "weeks", label: "Weeks or longer", score: { avoidance: 3 }, next: "q_feeling" },
        ],
      },
      q_feeling: {
        type: "question" as const,
        id: "q_feeling",
        prompt: "What happens when you think about starting?",
        input: "single-choice" as const,
        options: [
          {
            id: "overwhelm",
            label: "I feel overwhelmed",
            score: { overwhelm: 2 },
            next: "q_deadline",
          },
          {
            id: "fear",
            label: "I worry it won't be good enough",
            score: { perfectionism: 3 },
            next: "q_deadline",
          },
          {
            id: "boredom",
            label: "I'm bored or uninterested",
            score: { boredom: 2 },
            next: "q_deadline",
          },
          {
            id: "dread",
            label: "I dread the discomfort",
            score: { fear: 2 },
            next: "q_deadline",
          },
        ],
      },
      q_deadline: {
        type: "question" as const,
        id: "q_deadline",
        prompt: "Is there a deadline?",
        input: "single-choice" as const,
        options: [
          { id: "today", label: "Yes — today or tomorrow", score: { urgency: 3 }, next: "branch_result" },
          { id: "soon", label: "Yes — within a week", score: { urgency: 2 }, next: "branch_result" },
          { id: "none", label: "No real deadline", score: { urgency: 0 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.perfectionism >= 2", next: "result_perfectionism" },
          { when: "scores.overwhelm >= 2", next: "result_overwhelm" },
          { when: "scores.boredom >= 2", next: "result_boredom" },
          { when: "scores.fear >= 2", next: "result_fear" },
          { when: "scores.avoidance >= 2", next: "result_avoidance" },
        ],
        default: "result_general",
      },
      result_perfectionism: {
        type: "result" as const,
        id: "result_perfectionism",
        resultTemplateId: "perfectionism",
      },
      result_overwhelm: {
        type: "result" as const,
        id: "result_overwhelm",
        resultTemplateId: "overwhelm",
      },
      result_boredom: {
        type: "result" as const,
        id: "result_boredom",
        resultTemplateId: "boredom",
      },
      result_fear: {
        type: "result" as const,
        id: "result_fear",
        resultTemplateId: "fear",
      },
      result_avoidance: {
        type: "result" as const,
        id: "result_avoidance",
        resultTemplateId: "avoidance",
      },
      result_general: {
        type: "result" as const,
        id: "result_general",
        resultTemplateId: "general",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions above to get your personalized plan.",
    templates: [
      {
        id: "perfectionism",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Perfectionism paralysis",
            descriptionTemplate:
              "You're delaying because the bar feels too high — not because you're lazy.",
          },
        ],
        summaryTemplates: [
          "Your rescue plan focuses on lowering the bar and shipping a rough first pass.",
        ],
      },
      {
        id: "overwhelm",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Overwhelm freeze",
            descriptionTemplate: "The task feels too big to know where to start.",
          },
        ],
        summaryTemplates: [
          "Your rescue plan breaks the work into one tiny, physical next action.",
        ],
      },
      {
        id: "boredom",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Motivation mismatch",
            descriptionTemplate: "The task doesn't engage you — willpower alone won't fix it.",
          },
        ],
        summaryTemplates: [
          "Your rescue plan adds artificial urgency and a immediate reward hook.",
        ],
      },
      {
        id: "fear",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Discomfort avoidance",
            descriptionTemplate: "Starting feels emotionally costly — so you escape instead.",
          },
        ],
        summaryTemplates: [
          "Your rescue plan uses a timed micro-commitment to reduce the activation energy.",
        ],
      },
      {
        id: "avoidance",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Chronic avoidance",
            descriptionTemplate: "This has been building — it needs a structured reset, not a pep talk.",
          },
        ],
        summaryTemplates: [
          "Your rescue plan uses a 15-minute sprint with a clear stop time.",
        ],
      },
      {
        id: "general",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "General resistance",
            descriptionTemplate: "Nothing specific — you just can't seem to begin.",
          },
        ],
        summaryTemplates: ["Your rescue plan uses the 2-minute rule to break inertia."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-perfectionism",
      when: "scores.perfectionism >= 2",
      title: "Your 10-minute rescue plan",
      steps: [
        "Set a timer for 10 minutes — permission to stop when it rings.",
        "Write the worst acceptable version of the outcome (deliberately messy).",
        "Do one physical action: open the file, write one sentence, send the draft.",
        "When the timer ends, decide: stop (win) or continue 10 more minutes.",
      ],
    },
    {
      id: "rec-overwhelm",
      when: "scores.overwhelm >= 2",
      title: "Your 10-minute rescue plan",
      steps: [
        "Write the task as a single verb + object (e.g. \"Draft intro paragraph\").",
        "Break it until the next step takes under 2 minutes.",
        "Do only that 2-minute step — nothing else.",
        "Repeat once, then take a 5-minute break.",
      ],
    },
    {
      id: "rec-boredom",
      when: "scores.boredom >= 2",
      title: "Your 10-minute rescue plan",
      steps: [
        "Pair the task with a reward you only get after 15 minutes of work.",
        "Set a fake deadline 30 minutes from now and tell someone.",
        "Use a focus timer — work only until it ends.",
        "Change environment: new location, headphones, phone in another room.",
      ],
    },
    {
      id: "rec-fear",
      when: "scores.fear >= 2",
      title: "Your 10-minute rescue plan",
      steps: [
        "Name the discomfort out loud — \"I'm avoiding because…\"",
        "Commit to 2 minutes only. Starting is the only goal.",
        "Use a body double (call a friend, focus room, or app session).",
        "Stop on time — building trust with yourself matters more than one session.",
      ],
    },
    {
      id: "rec-avoidance",
      when: "scores.avoidance >= 2",
      title: "Your 15-minute rescue plan",
      steps: [
        "Block 15 minutes on your calendar right now — treat it like a meeting.",
        "Remove one friction point before starting (open tabs, clear desk, silence phone).",
        "Work the full 15 minutes on the smallest slice of the task.",
        "When done, write one line: what you'll do in the next session.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Your 2-minute rescue plan",
      steps: [
        "Set a 2-minute timer.",
        "Do the smallest physical version of the task (open doc, one line, one email).",
        "When the timer ends, you're done — unless you want to keep going.",
      ],
    },
  ],

  guidance: [],

  ctas: {
    app: {
      title: "Make starting easier every day",
      description:
        "Reset turns your rescue plan into focus sessions, distraction blocks, and daily start rituals — so procrastination doesn't win by default.",
    },
  },

  faq: [
    {
      question: "Is this medical or therapeutic advice?",
      answer:
        "No. This tool offers general productivity strategies. If procrastination severely affects your life, consider speaking with a qualified professional.",
    },
    {
      question: "Why only 10 minutes?",
      answer:
        "Short commitments reduce activation energy. Most people continue once they've started — the hard part is the first two minutes.",
    },
    {
      question: "What if I already know why I procrastinate?",
      answer:
        "Use the plan anyway. Insight without action doesn't change behavior — the steps are designed to be done immediately.",
    },
  ],
} satisfies Record<string, unknown>;
