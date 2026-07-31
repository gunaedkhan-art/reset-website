export const howToStopDoomscrollingConfig = {
  schemaVersion: "1.0" as const,
  id: "how-to-stop-doomscrolling",
  slug: "how-to-stop-doomscrolling",
  status: "published" as const,

  seo: {
    title: "How to Stop Doomscrolling",
    metaDescription:
      "Answer 5 quick questions and get a personalized plan to break the doomscrolling habit — free interactive tool, practical steps in under 60 seconds.",
    primaryKeyword: "how to stop doomscrolling",
    secondaryKeywords: [
      "stop doomscrolling",
      "break phone addiction",
      "endless scrolling",
      "social media scrolling habit",
      "phone scrolling at night",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/how-to-stop-doomscrolling",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["doomscrolling", "screen-time", "phone-habits", "social-media"],
    cluster: "doomscrolling",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "How to Stop Doomscrolling",
    intro:
      "Answer a few quick questions about when and why you scroll — and get a rescue plan tailored to your trigger, not generic \"put your phone away\" advice.",
    icon: "phone",
    proseTitle: "About doomscrolling",
    sections: [
      {
        id: "problem",
        heading: "When the feed wins again",
        framework: "pas",
        body: "You open one app for a second and surface an hour later — tired, anxious, and no closer to what you actually wanted. Doomscrolling isn't a willpower failure; it's a designed loop that exploits boredom, stress, and bedtime vulnerability.",
      },
      {
        id: "concept",
        heading: "Digital minimalism, not abstinence",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) argues in [Digital Minimalism](https://calnewport.com/books/digital-minimalism/) that the fix is intentional technology use — matching each app to a value you care about — not trying to white-knuckle through every urge.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A trigger-matched plan for when you scroll — bedtime, boredom, anxiety, or habit drift — with concrete environment and friction changes.",
      },
    ],
    eyebrow: "Interactive tool",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_when",
    nodes: {
      q_when: {
        type: "question" as const,
        id: "q_when",
        prompt: "When do you usually start doomscrolling?",
        input: "single-choice" as const,
        options: [
          {
            id: "morning",
            label: "First thing in the morning",
            score: { morning: 2 },
            next: "q_content",
          },
          {
            id: "work",
            label: "During work or study",
            score: { work: 3 },
            next: "q_content",
          },
          {
            id: "bedtime",
            label: "In bed before sleep",
            score: { bedtime: 3 },
            next: "q_content",
          },
          {
            id: "stress",
            label: "When I'm stressed or anxious",
            score: { anxiety: 2 },
            next: "q_content",
          },
        ],
      },
      q_content: {
        type: "question" as const,
        id: "q_content",
        prompt: "What are you usually scrolling?",
        input: "single-choice" as const,
        options: [
          {
            id: "social",
            label: "Social media feeds",
            score: { social: 3 },
            next: "q_duration",
          },
          {
            id: "news",
            label: "News or current events",
            score: { news: 3 },
            next: "q_duration",
          },
          {
            id: "video",
            label: "Short videos (Reels, TikTok, Shorts)",
            score: { video: 3 },
            next: "q_duration",
          },
          {
            id: "mix",
            label: "A mix of everything",
            score: { mixed: 1 },
            next: "q_duration",
          },
        ],
      },
      q_duration: {
        type: "question" as const,
        id: "q_duration",
        prompt: "How long does a typical session last?",
        input: "single-choice" as const,
        options: [
          {
            id: "short",
            label: "A few minutes — I catch myself quickly",
            score: { severity: 1 },
            next: "q_trigger",
          },
          {
            id: "medium",
            label: "15–30 minutes",
            score: { severity: 2 },
            next: "q_trigger",
          },
          {
            id: "long",
            label: "30–60 minutes",
            score: { severity: 3 },
            next: "q_trigger",
          },
          {
            id: "lost",
            label: "I lose track — often an hour or more",
            score: { severity: 4 },
            next: "q_trigger",
          },
        ],
      },
      q_trigger: {
        type: "question" as const,
        id: "q_trigger",
        prompt: "What usually triggers the scroll?",
        input: "single-choice" as const,
        options: [
          {
            id: "boredom",
            label: "Boredom or waiting",
            score: { boredom: 3 },
            next: "branch_result",
          },
          {
            id: "anxiety",
            label: "Stress, worry, or needing to escape",
            score: { anxiety: 3 },
            next: "branch_result",
          },
          {
            id: "notification",
            label: "A notification or \"just checking\"",
            score: { notification: 3 },
            next: "branch_result",
          },
          {
            id: "habit",
            label: "Pure habit — hand reaches for phone automatically",
            score: { habit: 3 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.bedtime >= 2 && scores.severity >= 2", next: "result_bedtime" },
          { when: "scores.anxiety >= 4", next: "result_anxiety" },
          { when: "scores.news >= 2", next: "result_news" },
          { when: "scores.work >= 2", next: "result_work" },
          { when: "scores.video >= 2", next: "result_video" },
          { when: "scores.notification >= 2", next: "result_notification" },
          { when: "scores.habit >= 2", next: "result_habit" },
          { when: "scores.boredom >= 2", next: "result_boredom" },
        ],
        default: "result_general",
      },
      result_bedtime: {
        type: "result" as const,
        id: "result_bedtime",
        resultTemplateId: "bedtime",
      },
      result_anxiety: {
        type: "result" as const,
        id: "result_anxiety",
        resultTemplateId: "anxiety",
      },
      result_news: {
        type: "result" as const,
        id: "result_news",
        resultTemplateId: "news",
      },
      result_work: {
        type: "result" as const,
        id: "result_work",
        resultTemplateId: "work",
      },
      result_video: {
        type: "result" as const,
        id: "result_video",
        resultTemplateId: "video",
      },
      result_notification: {
        type: "result" as const,
        id: "result_notification",
        resultTemplateId: "notification",
      },
      result_habit: {
        type: "result" as const,
        id: "result_habit",
        resultTemplateId: "habit",
      },
      result_boredom: {
        type: "result" as const,
        id: "result_boredom",
        resultTemplateId: "boredom",
      },
      result_general: {
        type: "result" as const,
        id: "result_general",
        resultTemplateId: "general",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions above to get your personalized doomscroll rescue plan.",
    templates: [
      {
        id: "bedtime",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Bedtime scroll loop",
            descriptionTemplate:
              "Your phone is stealing sleep — blue light and stimulation make winding down harder.",
          },
        ],
        summaryTemplates: [
          "Your plan focuses on a phone-free buffer before sleep and friction at bedtime.",
        ],
      },
      {
        id: "anxiety",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Anxiety escape scroll",
            descriptionTemplate:
              "Scrolling numbs discomfort short-term but keeps your nervous system on high alert.",
          },
        ],
        summaryTemplates: [
          "Your plan replaces the scroll with a 3-minute grounding ritual before any screen time.",
        ],
      },
      {
        id: "news",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "News rabbit hole",
            descriptionTemplate:
              "Bad-news bias keeps you refreshing — each headline pulls you deeper with no satisfying end.",
          },
        ],
        summaryTemplates: [
          "Your plan limits news to one scheduled window and removes infinite feeds.",
        ],
      },
      {
        id: "work",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Focus leak at work",
            descriptionTemplate:
              "Micro-scrolls during tasks fragment attention — recovery time costs more than the scroll itself.",
          },
        ],
        summaryTemplates: [
          "Your plan uses app blocks during work blocks and a phone parking spot.",
        ],
      },
      {
        id: "video",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Short-form trap",
            descriptionTemplate:
              "Algorithmic video is engineered for autoplay — your brain never gets a natural stopping cue.",
          },
        ],
        summaryTemplates: [
          "Your plan removes autoplay and adds a hard session cap with a physical stop ritual.",
        ],
      },
      {
        id: "notification",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Ping-driven scrolling",
            descriptionTemplate:
              "Notifications reopen the loop — each buzz is an invitation to fall back in.",
          },
        ],
        summaryTemplates: [
          "Your plan batches notifications and silences non-essential apps during focus hours.",
        ],
      },
      {
        id: "habit",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Automatic reach",
            descriptionTemplate:
              "Scrolling is muscle memory — your hand opens apps before you decide to.",
          },
        ],
        summaryTemplates: [
          "Your plan adds friction between impulse and app — a 10-second pause rule.",
        ],
      },
      {
        id: "boredom",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Boredom filler",
            descriptionTemplate:
              "The phone fills empty moments — but never satisfies, so you keep reaching.",
          },
        ],
        summaryTemplates: [
          "Your plan pre-loads offline alternatives for the moments you usually scroll.",
        ],
      },
      {
        id: "general",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "General scroll habit",
            descriptionTemplate:
              "No single trigger dominates — you need a simple default rule for all situations.",
          },
        ],
        summaryTemplates: [
          "Your plan uses the one-screen rule: if you're on a second screen without intending to, stop.",
        ],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-bedtime",
      when: "scores.bedtime >= 2 && scores.severity >= 2",
      title: "Your bedtime rescue plan",
      steps: [
        "Charge your phone outside the bedroom — use a basic alarm clock instead.",
        "Set a 30-minute \"screens down\" alarm 30 minutes before your target sleep time.",
        "Replace the scroll with one offline ritual: book, journal, or stretch for 10 minutes.",
        "Enable grayscale and Do Not Disturb automatically at your screens-down time.",
      ],
    },
    {
      id: "rec-anxiety",
      when: "scores.anxiety >= 4",
      title: "Your calm-first rescue plan",
      steps: [
        "When the urge hits, set a 3-minute timer before touching your phone.",
        "Do box breathing: inhale 4, hold 4, exhale 4, hold 4 — repeat until the timer ends.",
        "Ask: \"Am I scrolling to feel better or to avoid something?\" Write one sentence.",
        "If you still want to scroll, limit to one app for 5 minutes — timer visible.",
      ],
    },
    {
      id: "rec-news",
      when: "scores.news >= 2",
      title: "Your news boundary plan",
      steps: [
        "Delete news apps from your home screen — access only via browser bookmark.",
        "Pick one 15-minute news window per day (same time daily).",
        "Use a read-it-later app for links — no live feeds during the day.",
        "When the window ends, close all tabs and put the phone face-down.",
      ],
    },
    {
      id: "rec-work",
      when: "scores.work >= 2",
      title: "Your focus rescue plan",
      steps: [
        "Designate a phone parking spot across the room during work blocks.",
        "Block social and video apps during your top 2 focus hours (built into phone settings or Reset).",
        "Use the 25/5 Pomodoro — phone stays parked for the full 25 minutes.",
        "After each break, write one line: what you'll do in the next block before opening any app.",
      ],
    },
    {
      id: "rec-video",
      when: "scores.video >= 2",
      title: "Your short-video rescue plan",
      steps: [
        "Turn off autoplay on every video app you use.",
        "Set a daily app limit of 20 minutes for short-form video (Screen Time / Digital Wellbeing).",
        "Before opening the app, decide: \"I will watch exactly 3 videos\" — count out loud.",
        "When done, close the app and do 10 push-ups or a 2-minute walk — physical reset.",
      ],
    },
    {
      id: "rec-notification",
      when: "scores.notification >= 2",
      title: "Your notification rescue plan",
      steps: [
        "Turn off all non-human notifications (news, shopping, social likes, promos).",
        "Enable Scheduled Summary or batch notifications to 2–3 times per day.",
        "Remove badges from apps — the red dot is designed to pull you back in.",
        "When you pick up the phone, pause and ask: \"Did I intend to open this, or react to a ping?\"",
      ],
    },
    {
      id: "rec-habit",
      when: "scores.habit >= 2",
      title: "Your friction rescue plan",
      steps: [
        "Move distracting apps off your home screen into a folder labeled \"Pause\" on the last page.",
        "Enable a 10-second delay before opening flagged apps (Screen Time limits or Reset).",
        "Replace your lock screen wallpaper with: \"Why now?\" as a visual interrupt.",
        "Track one day of every unlock — awareness alone cuts mindless opens by 20–30%.",
      ],
    },
    {
      id: "rec-boredom",
      when: "scores.boredom >= 2",
      title: "Your boredom rescue plan",
      steps: [
        "Create a \"boredom list\" in Notes: 5 things you can do in under 2 minutes without a phone.",
        "Keep a book, sketchpad, or fidget within arm's reach where you usually scroll.",
        "When waiting (line, commute), default to looking around or breathing — not the phone.",
        "Delete your most-used boredom app for 7 days — notice what you do instead.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Your one-screen rescue plan",
      steps: [
        "Before opening any app, say out loud what you're looking for (\"check one message,\" \"one video\").",
        "If you reach a second app without finishing the first intention, close the phone immediately.",
        "Set a daily screen-time goal 15 minutes below yesterday's average.",
        "Review Screen Time every Sunday — one small change beats a dramatic reset.",
      ],
    },
  ],

  guidance: [],

  ctas: {
    app: {
      title: "Make the rescue plan stick",
      description:
        "Reset blocks infinite feeds during focus, batches notifications, and tracks your scroll goals — so breaking the habit isn't willpower alone.",
    },
  },

  faq: [
    {
      question: "What's the difference between scrolling and doomscrolling?",
      answer:
        "Doomscrolling is compulsive, hard-to-stop scrolling — often through negative news or endless feeds — even when you want to quit. If you regularly lose track of time or feel worse after, that's the pattern this tool targets.",
    },
    {
      question: "Will deleting apps fix doomscrolling?",
      answer:
        "Removing apps helps, but triggers (boredom, anxiety, habit) usually find another app. This plan addresses the trigger first, then adds friction and boundaries.",
    },
    {
      question: "How long until the habit breaks?",
      answer:
        "Most people see improvement in 1–2 weeks with consistent friction and replacement rituals. Deep habits may take 30+ days — small daily wins matter more than perfect streaks.",
    },
  ],
} satisfies Record<string, unknown>;
