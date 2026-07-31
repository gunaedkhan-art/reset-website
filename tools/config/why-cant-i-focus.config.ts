export const whyCantIFocusConfig = {
  schemaVersion: "1.0" as const,
  id: "why-cant-i-focus",
  slug: "why-cant-i-focus",
  status: "published" as const,

  seo: {
    title: "Why Can't I Focus?",
    metaDescription:
      "Answer 4 quick questions to find out why you can't focus — free diagnostic tool with a personalized fix plan in under 60 seconds.",
    primaryKeyword: "why can't i focus",
    secondaryKeywords: [
      "can't focus",
      "trouble focusing",
      "why am i so distracted",
      "focus problems",
      "can't concentrate",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/why-cant-i-focus",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["focus", "distraction", "diagnostic", "attention"],
    cluster: "focus-problems",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Why Can't I Focus?",
    intro:
      "Four questions about when, where, and how you lose focus — get a diagnosis and fix plan matched to your actual blocker.",
    icon: "focus",
    proseTitle: "About focus problems",
    sections: [
      {
        id: "problem",
        heading: "When concentration won't hold",
        framework: "pas",
        body: "You sit down to work and within minutes you're elsewhere — phone, tabs, daydreams, or fatigue. Without naming whether the blocker is environment, energy, or overload, every fix is guesswork.",
      },
      {
        id: "agitation",
        heading: "Interruptions compound",
        framework: "pas",
        body: "[UC Irvine interruption research](https://www.ics.uci.edu/~gmark/chi08-mark.pdf) found recovery from some interruptions can take far longer than the interruption itself — so a \"quick check\" costs more than the seconds it takes.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Your primary focus blocker — phone, environment, sleep, meetings, or unclear tasks — plus matched steps and links to companion tools like the notification cost calculator.",
      },
    ],
    eyebrow: "Interactive diagnostic",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_when",
    nodes: {
      q_when: {
        type: "question" as const,
        id: "q_when",
        prompt: "When is focus hardest for you?",
        input: "single-choice" as const,
        options: [
          {
            id: "morning",
            label: "Morning — I can't get started",
            score: { morning: 2 },
            next: "q_environment",
          },
          {
            id: "afternoon",
            label: "Afternoon — energy crashes",
            score: { energy: 2 },
            next: "q_environment",
          },
          {
            id: "evening",
            label: "Evening — after a long day",
            score: { fatigue: 2 },
            next: "q_environment",
          },
          {
            id: "always",
            label: "Most of the day — it's constant",
            score: { chronic: 3 },
            next: "q_environment",
          },
        ],
      },
      q_environment: {
        type: "question" as const,
        id: "q_environment",
        prompt: "Where are you usually trying to focus?",
        input: "single-choice" as const,
        options: [
          {
            id: "home",
            label: "Home — distractions everywhere",
            score: { environment: 2 },
            next: "q_symptom",
          },
          {
            id: "office",
            label: "Office or shared workspace",
            score: { environment: 2 },
            next: "q_symptom",
          },
          {
            id: "remote",
            label: "Remote — alone but still can't focus",
            score: { internal: 2 },
            next: "q_symptom",
          },
          {
            id: "anywhere",
            label: "Anywhere — location doesn't seem to matter",
            score: { internal: 3 },
            next: "q_symptom",
          },
        ],
      },
      q_symptom: {
        type: "question" as const,
        id: "q_symptom",
        prompt: "What happens when you try to focus?",
        input: "single-choice" as const,
        options: [
          {
            id: "phone",
            label: "I reach for my phone or open distracting tabs",
            score: { distraction: 3 },
            next: "q_sleep",
          },
          {
            id: "fog",
            label: "My mind feels foggy — I read the same line twice",
            score: { fog: 3 },
            next: "q_sleep",
          },
          {
            id: "overwhelm",
            label: "I don't know where to start — too much on my plate",
            score: { overwhelm: 3 },
            next: "q_sleep",
          },
          {
            id: "anxiety",
            label: "My thoughts race or I worry about the outcome",
            score: { anxiety: 3 },
            next: "q_sleep",
          },
          {
            id: "boredom",
            label: "The task bores me — I keep finding \"more urgent\" things",
            score: { boredom: 3 },
            next: "q_sleep",
          },
        ],
      },
      q_sleep: {
        type: "question" as const,
        id: "q_sleep",
        prompt: "How has your sleep been lately?",
        input: "single-choice" as const,
        options: [
          {
            id: "good",
            label: "Solid — 7+ hours most nights",
            score: { sleep: 0 },
            next: "branch_result",
          },
          {
            id: "okay",
            label: "Okay — some short or restless nights",
            score: { sleep: 1 },
            next: "branch_result",
          },
          {
            id: "poor",
            label: "Poor — under 6 hours or very restless",
            score: { sleep: 3 },
            next: "branch_result",
          },
          {
            id: "unknown",
            label: "Not sure — I don't track it",
            score: { sleep: 1 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.sleep >= 3", next: "result_sleep" },
          { when: "scores.distraction >= 2", next: "result_distraction" },
          { when: "scores.anxiety >= 2", next: "result_anxiety" },
          { when: "scores.overwhelm >= 2", next: "result_overwhelm" },
          { when: "scores.fog >= 2 && scores.energy >= 2", next: "result_energy" },
          { when: "scores.fog >= 2", next: "result_fog" },
          { when: "scores.boredom >= 2", next: "result_boredom" },
          { when: "scores.chronic >= 2", next: "result_chronic" },
        ],
        default: "result_general",
      },
      result_sleep: {
        type: "result" as const,
        id: "result_sleep",
        resultTemplateId: "sleep",
      },
      result_distraction: {
        type: "result" as const,
        id: "result_distraction",
        resultTemplateId: "distraction",
      },
      result_anxiety: {
        type: "result" as const,
        id: "result_anxiety",
        resultTemplateId: "anxiety",
      },
      result_overwhelm: {
        type: "result" as const,
        id: "result_overwhelm",
        resultTemplateId: "overwhelm",
      },
      result_energy: {
        type: "result" as const,
        id: "result_energy",
        resultTemplateId: "energy",
      },
      result_fog: {
        type: "result" as const,
        id: "result_fog",
        resultTemplateId: "fog",
      },
      result_boredom: {
        type: "result" as const,
        id: "result_boredom",
        resultTemplateId: "boredom",
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
    emptyMessage: "Answer the questions above to find out why focus is hard and what to do next.",
    templates: [
      {
        id: "sleep",
        cards: [
          {
            title: "Likely blocker",
            valueTemplate: "Sleep debt",
            descriptionTemplate:
              "Your brain can't sustain attention when it's under-rested — focus problems often start the night before.",
          },
        ],
        summaryTemplates: [
          "Fix sleep first. No focus hack outruns chronic tiredness.",
        ],
      },
      {
        id: "distraction",
        cards: [
          {
            title: "Likely blocker",
            valueTemplate: "Environment & digital pull",
            descriptionTemplate:
              "Your setup makes distraction easier than focus — the phone and tabs win by default.",
          },
        ],
        summaryTemplates: [
          "Your plan removes triggers and adds friction before you reach for distractions.",
        ],
      },
      {
        id: "anxiety",
        cards: [
          {
            title: "Likely blocker",
            valueTemplate: "Anxious avoidance",
            descriptionTemplate:
              "Worry about outcomes or performance makes starting feel unsafe — so you drift instead.",
          },
        ],
        summaryTemplates: [
          "Your plan lowers the stakes with a tiny first step and a defined \"good enough\" bar.",
        ],
      },
      {
        id: "overwhelm",
        cards: [
          {
            title: "Likely blocker",
            valueTemplate: "Task overload",
            descriptionTemplate:
              "Too many open loops — your brain can't pick a lane, so it picks none.",
          },
        ],
        summaryTemplates: [
          "Your plan forces one next action and parks everything else out of sight.",
        ],
      },
      {
        id: "energy",
        cards: [
          {
            title: "Likely blocker",
            valueTemplate: "Energy crash",
            descriptionTemplate:
              "Focus fades when your energy dips — afternoons and post-lunch slumps are real blockers.",
          },
        ],
        summaryTemplates: [
          "Your plan aligns hard work with peak energy and uses movement to reset slumps.",
        ],
      },
      {
        id: "fog",
        cards: [
          {
            title: "Likely blocker",
            valueTemplate: "Mental fog",
            descriptionTemplate:
              "You can't hold information in working memory — reading without retaining is a classic sign.",
          },
        ],
        summaryTemplates: [
          "Your plan uses external scaffolding (notes, timers) so your brain does less holding.",
        ],
      },
      {
        id: "boredom",
        cards: [
          {
            title: "Likely blocker",
            valueTemplate: "Motivation gap",
            descriptionTemplate:
              "The task doesn't engage you — willpower fades fast when there's no intrinsic pull.",
          },
        ],
        summaryTemplates: [
          "Your plan adds artificial urgency, rewards, and environment change to create momentum.",
        ],
      },
      {
        id: "chronic",
        cards: [
          {
            title: "Likely blocker",
            valueTemplate: "Scattered attention",
            descriptionTemplate:
              "Focus fails across contexts — this points to habits and lifestyle, not one bad task.",
          },
        ],
        summaryTemplates: [
          "Your plan builds a daily focus ritual instead of one-off fixes.",
        ],
      },
      {
        id: "general",
        cards: [
          {
            title: "Likely blocker",
            valueTemplate: "Mixed factors",
            descriptionTemplate:
              "No single dominant pattern — small improvements across sleep, environment, and task clarity add up.",
          },
        ],
        summaryTemplates: [
          "Your plan stacks three quick wins: one environment change, one task rule, one energy habit.",
        ],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-sleep",
      when: "scores.sleep >= 3",
      title: "Your sleep-first focus plan",
      steps: [
        "Pick a fixed wake time for 7 days — anchor sleep before chasing bedtime.",
        "No screens 30 minutes before bed — replace with reading or stretching.",
        "Delay caffeine until 90 minutes after waking; cut it after 2pm.",
        "Retry focused work only after 3 consecutive nights of 7+ hours.",
      ],
    },
    {
      id: "rec-distraction",
      when: "scores.distraction >= 2",
      title: "Your distraction-proof plan",
      steps: [
        "Phone in another room or drawer for your next 25-minute focus block.",
        "Close all tabs except the one task — use one browser window only.",
        "Block social and news apps during work hours (Reset or Screen Time).",
        "Put a sticky note on your monitor: \"What am I doing right now?\"",
      ],
    },
    {
      id: "rec-anxiety",
      when: "scores.anxiety >= 2",
      title: "Your low-stakes start plan",
      steps: [
        "Define \"done enough\" in one sentence before you start — not perfect, just acceptable.",
        "Set a 10-minute timer; the only goal is to begin, not finish.",
        "Write your worry on paper for 2 minutes — get it out of your head.",
        "Tell someone you'll send a draft by a specific time — gentle accountability.",
      ],
    },
    {
      id: "rec-overwhelm",
      when: "scores.overwhelm >= 2",
      title: "Your one-thing plan",
      steps: [
        "Brain-dump every task onto paper — get it out of your head.",
        "Circle the one item that would make today feel successful.",
        "Break that item into a 2-minute physical next step — do only that.",
        "Hide the rest of the list until the first step is done.",
      ],
    },
    {
      id: "rec-energy",
      when: "scores.fog >= 2 && scores.energy >= 2",
      title: "Your energy alignment plan",
      steps: [
        "Schedule your hardest task in your personal peak window (usually 9–11am for most people).",
        "Take a 10-minute walk before afternoon work — movement resets alertness.",
        "Eat protein at lunch — carb-heavy meals amplify afternoon fog.",
        "Use a 20-minute power nap or quiet rest if you're under 7 hours sleep.",
      ],
    },
    {
      id: "rec-fog",
      when: "scores.fog >= 2",
      title: "Your external-brain plan",
      steps: [
        "Read with a pen — underline one key line per paragraph to force engagement.",
        "Use the Pomodoro technique: 25 minutes on, 5 off — short bursts beat marathon fog.",
        "Say the task out loud before starting — verbalizing activates attention.",
        "Keep a \"parking lot\" note for intrusive thoughts — write and return to task.",
      ],
    },
    {
      id: "rec-boredom",
      when: "scores.boredom >= 2",
      title: "Your momentum plan",
      steps: [
        "Pair the boring task with a reward you only get after 20 minutes of work.",
        "Change location — library, café, or different room breaks the boredom loop.",
        "Use a focus playlist or body double (Focusmate, study stream, or Reset session).",
        "Set a fake deadline 45 minutes out and tell a colleague.",
      ],
    },
    {
      id: "rec-chronic",
      when: "scores.chronic >= 2",
      title: "Your daily focus ritual",
      steps: [
        "Same start time every workday — 15-minute \"focus ramp\": review plan, silence phone, one task.",
        "Track focus hours daily — aim for one protected 90-minute block before anything reactive.",
        "Audit sleep, movement, and screen time weekly — chronic scatter often has physical roots.",
        "Use Reset to block distractions automatically during your focus window.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Your three-quick-wins plan",
      steps: [
        "Environment: clear desk, phone out of sight, one tab open.",
        "Task: write the next physical action in under 10 words — do it for 5 minutes.",
        "Energy: drink water and take 10 deep breaths before starting — low cost, real effect.",
      ],
    },
  ],

  guidance: [],

  ctas: {
    app: {
      title: "Turn diagnosis into daily focus",
      description:
        "Reset blocks distractions during focus windows, tracks your progress, and helps you build the habits this plan starts — so focus gets easier over time.",
    },
  },

  faq: [
    {
      question: "Is this a medical diagnosis?",
      answer:
        "No. This tool offers general productivity and wellness patterns. If focus problems are severe, persistent, or affecting daily life, talk to a healthcare provider — ADHD, anxiety, and sleep disorders are real and treatable.",
    },
    {
      question: "Why only 4 questions?",
      answer:
        "Long assessments get abandoned. Four targeted questions catch the most common focus blockers. Use the action plan immediately — insight without action doesn't help.",
    },
    {
      question: "What if more than one blocker applies?",
      answer:
        "Start with the plan you're given, then revisit after a week. Sleep and distraction fixes often unlock progress on everything else.",
    },
  ],
} satisfies Record<string, unknown>;
