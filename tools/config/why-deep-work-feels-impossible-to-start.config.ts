export const whyDeepWorkFeelsImpossibleToStartConfig = {
  schemaVersion: "1.0" as const,
  id: "why-deep-work-feels-impossible-to-start",
  slug: "why-deep-work-feels-impossible-to-start",
  status: "published" as const,

  seo: {
    title: "Why Deep Work Feels Impossible to Start",
    metaDescription:
      "Deep work feels impossible to start? Answer 4 questions to name the real blocker — dread, vagueness, perfectionism, or energy — and get a first-5-minutes ritual, not another lecture.",
    primaryKeyword: "why deep work feels impossible to start",
    secondaryKeywords: [
      "can't start deep work",
      "deep work procrastination",
      "deep work feels hard",
      "why can't i start deep work",
      "deep work activation",
    ],
    searchIntent: "why" as const,
    canonicalPath: "/why-deep-work-feels-impossible-to-start",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "procrastination", "activation"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Why Deep Work Feels Impossible to Start",
    intro:
      "Wanting deep work and starting deep work are different problems. You don't need a better system yet — you need to know what's blocking the first five minutes. Four questions, then a starter ritual matched to your friction.",
    eyebrow: "Activation diagnostic",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_feeling",
    nodes: {
      q_feeling: {
        type: "question" as const,
        id: "q_feeling",
        prompt: "When you think about starting deep work right now, you feel…",
        input: "single-choice" as const,
        options: [
          {
            id: "dread",
            label: "Dread — I'd rather do almost anything else",
            score: { dread: 3 },
            next: "q_task",
          },
          {
            id: "blank",
            label: "Blank — I don't know what to open or do first",
            score: { vague: 3 },
            next: "q_task",
          },
          {
            id: "pressure",
            label: "Pressure — it has to be good, not rough",
            score: { perfection: 3 },
            next: "q_task",
          },
          {
            id: "wired",
            label: "Restless — I can't sit still long enough",
            score: { restless: 3 },
            next: "q_task",
          },
        ],
      },
      q_task: {
        type: "question" as const,
        id: "q_task",
        prompt: "The deep work task in front of you is…",
        input: "single-choice" as const,
        options: [
          {
            id: "huge",
            label: "Huge — a project, not a session-sized piece",
            score: { overwhelm: 3 },
            next: "q_avoidance",
          },
          {
            id: "unclear",
            label: "Unclear — I know the area but not the next step",
            score: { vague: 2 },
            next: "q_avoidance",
          },
          {
            id: "hard",
            label: "Hard — I might fail or look incompetent",
            score: { fear: 2 },
            next: "q_avoidance",
          },
          {
            id: "fine",
            label: "Fine on paper — I just can't make myself begin",
            score: { friction: 2 },
            next: "q_avoidance",
          },
        ],
      },
      q_avoidance: {
        type: "question" as const,
        id: "q_avoidance",
        prompt: "How long have you been avoiding this?",
        input: "single-choice" as const,
        options: [
          {
            id: "today",
            label: "Today — I've been putting it off for hours",
            score: { acute: 2 },
            next: "q_body",
          },
          {
            id: "days",
            label: "Days — it's been on my list all week",
            score: { chronic: 2 },
            next: "q_body",
          },
          {
            id: "never",
            label: "I keep restarting — never get a real block going",
            score: { habit: 2 },
            next: "q_body",
          },
        ],
      },
      q_body: {
        type: "question" as const,
        id: "q_body",
        prompt: "Right now, physically, you are…",
        input: "single-choice" as const,
        options: [
          {
            id: "tired",
            label: "Tired — low sleep or drained",
            score: { tired: 3 },
            next: "branch_result",
          },
          {
            id: "ok",
            label: "OK — body is fine, mind is the problem",
            score: { ok: 0 },
            next: "branch_result",
          },
          {
            id: "caffeine",
            label: "Over-caffeinated or jittery",
            score: { wired: 1, restless: 1 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.tired >= 2", next: "result_energy" },
          { when: "scores.perfection >= 2 || scores.fear >= 2", next: "result_perfection" },
          { when: "scores.overwhelm >= 2 || scores.dread >= 2", next: "result_overwhelm" },
          { when: "scores.vague >= 3", next: "result_vague" },
          { when: "scores.restless >= 2", next: "result_restless" },
          { when: "scores.friction >= 2 || scores.habit >= 2", next: "result_friction" },
        ],
        default: "result_vague",
      },
      result_energy: {
        type: "result" as const,
        id: "result_energy",
        resultTemplateId: "energy",
      },
      result_perfection: {
        type: "result" as const,
        id: "result_perfection",
        resultTemplateId: "perfection",
      },
      result_overwhelm: {
        type: "result" as const,
        id: "result_overwhelm",
        resultTemplateId: "overwhelm",
      },
      result_vague: {
        type: "result" as const,
        id: "result_vague",
        resultTemplateId: "vague",
      },
      result_restless: {
        type: "result" as const,
        id: "result_restless",
        resultTemplateId: "restless",
      },
      result_friction: {
        type: "result" as const,
        id: "result_friction",
        resultTemplateId: "friction",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions to learn why deep work feels impossible to start.",
    templates: [
      {
        id: "energy",
        cards: [
          {
            title: "Why starting feels impossible",
            valueTemplate: "Energy mismatch",
            descriptionTemplate:
              "You're asking for peak cognition when your body is running on empty — resistance is biological, not weak will.",
          },
        ],
        summaryTemplates: ["Don't force a deep block now — fix fuel first, then schedule depth."],
      },
      {
        id: "perfection",
        cards: [
          {
            title: "Why starting feels impossible",
            valueTemplate: "Perfection barrier",
            descriptionTemplate:
              "Starting makes imperfect output real — your brain treats \"begin\" as \"be judged.\"",
          },
        ],
        summaryTemplates: ["Your first 5 minutes must be deliberately bad — permission, not quality."],
      },
      {
        id: "overwhelm",
        cards: [
          {
            title: "Why starting feels impossible",
            valueTemplate: "Project too big",
            descriptionTemplate:
              "You're trying to start a whole project, not a session — the scale triggers shutdown.",
          },
        ],
        summaryTemplates: ["Shrink the block until starting feels almost silly — then begin."],
      },
      {
        id: "vague",
        cards: [
          {
            title: "Why starting feels impossible",
            valueTemplate: "No clear entry point",
            descriptionTemplate:
              "\"Deep work on X\" isn't actionable — your brain can't picture the first physical move.",
          },
        ],
        summaryTemplates: ["Define one visible next action before you touch the task."],
      },
      {
        id: "restless",
        cards: [
          {
            title: "Why starting feels impossible",
            valueTemplate: "Under-stimulated body",
            descriptionTemplate:
              "Sitting still for depth fights your current arousal level — easier stimulation wins.",
          },
        ],
        summaryTemplates: ["Move first, then start with a shorter block than you think you need."],
      },
      {
        id: "friction",
        cards: [
          {
            title: "Why starting feels impossible",
            valueTemplate: "Startup friction",
            descriptionTemplate:
              "The task is fine — your environment and habits make beginning harder than continuing.",
          },
        ],
        summaryTemplates: ["Remove one physical step between you and the work — then start immediately."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-energy",
      when: "scores.tired >= 2",
      title: "First 5 minutes — energy edition",
      steps: [
        "Don't start deep work tonight if you can avoid it — schedule tomorrow's peak window.",
        "If you must work: 10-minute walk, water, protein — then only admin.",
        "Write tomorrow's deep task on paper before bed — decision already made.",
        "Protect sleep — depth without rest is why starting feels impossible repeatedly.",
      ],
    },
    {
      id: "rec-perfection",
      when: "scores.perfection >= 2 || scores.fear >= 2",
      title: "First 5 minutes — perfection edition",
      steps: [
        "Title a doc \"BAD DRAFT — DELETE LATER\" — lowers stakes instantly.",
        "Set timer 5 minutes — goal is words/lines on screen, not quality.",
        "No editing during the timer — typing only.",
        "When timer rings, stop or continue guilt-free — you already started.",
      ],
    },
    {
      id: "rec-overwhelm",
      when: "scores.overwhelm >= 2 || scores.dread >= 2",
      title: "First 5 minutes — overwhelm edition",
      steps: [
        "Ask: \"What's the smallest piece that still counts as progress?\"",
        "Write that piece as one sentence — must fit in 25 minutes.",
        "Open only the one file/tab for that piece — nothing else.",
        "Start timer 5 minutes — any motion beats planning the whole project.",
      ],
    },
    {
      id: "rec-vague",
      when: "scores.vague >= 2",
      title: "First 5 minutes — clarity edition",
      steps: [
        "Complete: \"In the next 5 minutes I will physically ___\" — verb required.",
        "Examples: open doc and write title, run one command, read one page.",
        "No research rabbit holes — if stuck, pick the most obvious first move.",
        "Do that action before checking email, Slack, or phone.",
      ],
    },
    {
      id: "rec-restless",
      when: "scores.restless >= 2",
      title: "First 5 minutes — restless edition",
      steps: [
        "20 jumping jacks or walk around the block — burn restlessness first.",
        "Start with 15-minute block, not 90 — success builds tolerance.",
        "Standing desk or walk-and-think for planning phase only.",
        "Phone in another room before timer starts.",
      ],
    },
    {
      id: "rec-friction",
      when: "scores.friction >= 2 || scores.habit >= 2",
      title: "First 5 minutes — friction edition",
      steps: [
        "Tonight: leave task open on screen, notes visible — zero setup tomorrow.",
        "Same chair, same time, same playlist — ritual beats motivation.",
        "Phone in drawer before sitting down — not after you feel stuck.",
        "Tell someone \"starting in 5\" — social clock beats internal delay.",
      ],
    },
  ],

  guidance: [
    {
      title: "Starting ≠ finishing",
      body: "Deep work systems matter after you begin. This tool only solves activation — the gap between intention and the first keystroke.",
    },
  ],

  ctas: {
    app: {
      title: "Remove the phone barrier to starting",
      description:
        "Reset blocks distracting apps the moment you sit down for deep work — so startup friction doesn't become a scroll session.",
    },
  },

  faq: [
    {
      question: "How is this different from \"How to do deep work\"?",
      answer:
        "That tool builds a full deep work system. This one diagnoses why you can't begin right now and gives a 5-minute starter ritual — use it when you're stuck at the threshold.",
    },
    {
      question: "What if I feel impossible to start every day?",
      answer:
        "Repeated activation failure usually means energy timing, task sizing, or shallow work overload — run the shallow work audit and try rhythmic scheduling after fixing today's start.",
    },
    {
      question: "Is dread about deep work normal?",
      answer:
        "Yes — hard tasks trigger avoidance. The fix is almost always smaller scope, lower stakes, or clearer next action — not more willpower.",
    },
  ],
} satisfies Record<string, unknown>;
