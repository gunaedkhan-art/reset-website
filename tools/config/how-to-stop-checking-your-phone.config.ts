export const howToStopCheckingYourPhoneConfig = {
  schemaVersion: "1.0" as const,
  id: "how-to-stop-checking-your-phone",
  slug: "how-to-stop-checking-your-phone",
  status: "published" as const,

  seo: {
    title: "How to Stop Checking Your Phone",
    metaDescription:
      "Answer 4 quick questions and get a personalized plan to break compulsive phone checking — free interactive tool with practical steps in under 60 seconds.",
    primaryKeyword: "how to stop checking your phone",
    secondaryKeywords: [
      "stop checking phone constantly",
      "phone addiction help",
      "compulsive phone checking",
      "reduce phone pickups",
      "phone habit breaker",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/how-to-stop-checking-your-phone",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["phone-checking", "pickups", "notifications", "focus"],
    cluster: "phone-checking",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "How to Stop Checking Your Phone",
    intro:
      "Answer a few quick questions about how often and why you reach for your phone — and get a rescue plan built for your pattern, not a one-size-fits-all digital detox.",
    eyebrow: "Interactive tool",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_frequency",
    nodes: {
      q_frequency: {
        type: "question" as const,
        id: "q_frequency",
        prompt: "How often do you check your phone without a clear reason?",
        input: "single-choice" as const,
        options: [
          {
            id: "constant",
            label: "Every few minutes — it's almost constant",
            score: { frequency: 4 },
            next: "q_first",
          },
          {
            id: "hourly",
            label: "Roughly once an hour throughout the day",
            score: { frequency: 2 },
            next: "q_first",
          },
          {
            id: "transitions",
            label: "At transitions — between tasks, meetings, or rooms",
            score: { transition: 3 },
            next: "q_first",
          },
          {
            id: "anxious",
            label: "When I feel anxious or FOMO",
            score: { fomo: 3 },
            next: "q_first",
          },
        ],
      },
      q_first: {
        type: "question" as const,
        id: "q_first",
        prompt: "What do you usually open first?",
        input: "single-choice" as const,
        options: [
          {
            id: "messages",
            label: "Messages or group chats",
            score: { social: 3 },
            next: "q_location",
          },
          {
            id: "social",
            label: "Social media feeds",
            score: { social: 3 },
            next: "q_location",
          },
          {
            id: "email",
            label: "Email or work apps",
            score: { work: 3 },
            next: "q_location",
          },
          {
            id: "nothing",
            label: "Nothing specific — I just unlock and look",
            score: { reflex: 3 },
            next: "q_location",
          },
        ],
      },
      q_location: {
        type: "question" as const,
        id: "q_location",
        prompt: "Where is your phone most of the day?",
        input: "single-choice" as const,
        options: [
          {
            id: "hand",
            label: "In my hand or on my desk within reach",
            score: { proximity: 3 },
            next: "q_after",
          },
          {
            id: "pocket",
            label: "In my pocket — I feel it buzz constantly",
            score: { proximity: 2 },
            next: "q_after",
          },
          {
            id: "faceup",
            label: "Face-up on the desk — I see every notification",
            score: { visibility: 3 },
            next: "q_after",
          },
          {
            id: "away",
            label: "Usually in another room — but I still go get it",
            score: { compulsion: 3 },
            next: "q_after",
          },
        ],
      },
      q_after: {
        type: "question" as const,
        id: "q_after",
        prompt: "What happens right after you check?",
        input: "single-choice" as const,
        options: [
          {
            id: "putdown",
            label: "I put it down — checking was the whole thing",
            score: { quick: 2 },
            next: "branch_result",
          },
          {
            id: "rabbit",
            label: "I fall into an app for way longer than planned",
            score: { rabbit: 3 },
            next: "branch_result",
          },
          {
            id: "repeat",
            label: "I lock it, then check again within minutes",
            score: { loop: 4 },
            next: "branch_result",
          },
          {
            id: "relief",
            label: "I feel relief if something's new, anxious if it's not",
            score: { fomo: 3 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.loop >= 3 || scores.frequency >= 4", next: "result_compulsive" },
          { when: "scores.fomo >= 5", next: "result_fomo" },
          { when: "scores.visibility >= 2", next: "result_visibility" },
          { when: "scores.work >= 2", next: "result_work" },
          { when: "scores.social >= 2 && scores.rabbit >= 2", next: "result_social" },
          { when: "scores.reflex >= 2", next: "result_reflex" },
          { when: "scores.transition >= 2", next: "result_transition" },
          { when: "scores.compulsion >= 2", next: "result_compulsion" },
        ],
        default: "result_general",
      },
      result_compulsive: {
        type: "result" as const,
        id: "result_compulsive",
        resultTemplateId: "compulsive",
      },
      result_fomo: {
        type: "result" as const,
        id: "result_fomo",
        resultTemplateId: "fomo",
      },
      result_visibility: {
        type: "result" as const,
        id: "result_visibility",
        resultTemplateId: "visibility",
      },
      result_work: {
        type: "result" as const,
        id: "result_work",
        resultTemplateId: "work",
      },
      result_social: {
        type: "result" as const,
        id: "result_social",
        resultTemplateId: "social",
      },
      result_reflex: {
        type: "result" as const,
        id: "result_reflex",
        resultTemplateId: "reflex",
      },
      result_transition: {
        type: "result" as const,
        id: "result_transition",
        resultTemplateId: "transition",
      },
      result_compulsion: {
        type: "result" as const,
        id: "result_compulsion",
        resultTemplateId: "compulsion",
      },
      result_general: {
        type: "result" as const,
        id: "result_general",
        resultTemplateId: "general",
      },
    },
  },

  results: {
    emptyMessage:
      "Answer the questions above to get your personalized phone-checking rescue plan.",
    templates: [
      {
        id: "compulsive",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Check–lock–repeat loop",
            descriptionTemplate:
              "You're stuck in micro-checks — each unlock feels necessary but never satisfies for long.",
          },
        ],
        summaryTemplates: [
          "Your plan adds a mandatory pause between pickups and caps checks per hour.",
        ],
      },
      {
        id: "fomo",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "FOMO checking",
            descriptionTemplate:
              "You're scanning for something new — the anxiety of missing out drives the reach.",
          },
        ],
        summaryTemplates: [
          "Your plan batches updates and replaces random checks with scheduled windows.",
        ],
      },
      {
        id: "visibility",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Visual trigger checking",
            descriptionTemplate:
              "Every notification and screen glow pulls your attention — the phone is always calling.",
          },
        ],
        summaryTemplates: [
          "Your plan removes visual triggers: face-down, grayscale, and silenced badges.",
        ],
      },
      {
        id: "work",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Work inbox loop",
            descriptionTemplate:
              "Email and Slack checks feel productive but fragment deep work all day.",
          },
        ],
        summaryTemplates: [
          "Your plan limits work-app access to defined windows with async defaults.",
        ],
      },
      {
        id: "social",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Social check spiral",
            descriptionTemplate:
              "A quick message check becomes a feed — social apps are the gateway drug.",
          },
        ],
        summaryTemplates: [
          "Your plan separates messaging from feeds and adds a 5-minute gate before social apps.",
        ],
      },
      {
        id: "reflex",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Unlock reflex",
            descriptionTemplate:
              "Your thumb opens the phone before your brain decides — pure autopilot.",
          },
        ],
        summaryTemplates: [
          "Your plan inserts friction at unlock: grayscale home screen and a breath before apps.",
        ],
      },
      {
        id: "transition",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Transition filler",
            descriptionTemplate:
              "Every gap between activities becomes a phone moment — waiting, walking, thinking.",
          },
        ],
        summaryTemplates: [
          "Your plan pre-assigns phone-free rituals for the transitions where you usually reach.",
        ],
      },
      {
        id: "compulsion",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Distance compulsion",
            descriptionTemplate:
              "Even when the phone is away, the urge to go get it wins — proximity isn't the issue.",
          },
        ],
        summaryTemplates: [
          "Your plan addresses the urge directly with a substitute action before each walk to the phone.",
        ],
      },
      {
        id: "general",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "General phone habit",
            descriptionTemplate:
              "No single pattern dominates — you need a simple default rule for every pickup.",
          },
        ],
        summaryTemplates: [
          "Your plan uses the one-purpose rule: every unlock needs a stated reason before you open an app.",
        ],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-compulsive",
      when: "scores.loop >= 3 || scores.frequency >= 4",
      title: "Your check-limit rescue plan",
      steps: [
        "Set a hard cap: max 6 unprompted checks per hour (use a tally on paper or a counter app).",
        "When you want to check, wait 30 seconds and ask: \"What am I looking for?\" — if no answer, don't unlock.",
        "Enable Screen Time pickup tracking — awareness alone reduces checks within a week.",
        "Replace every other check with one deep breath and looking at something 20 feet away (20-20-20 rule).",
      ],
    },
    {
      id: "rec-fomo",
      when: "scores.fomo >= 5",
      title: "Your FOMO rescue plan",
      steps: [
        "Schedule two 10-minute \"catch-up\" windows per day — all messaging and social happens then only.",
        "Turn off badge counts and notification previews — they manufacture urgency.",
        "Tell close contacts you're batching messages — reduces anxiety about delayed replies.",
        "When FOMO hits, write: \"What would I miss in the next 2 hours that's truly urgent?\" — almost always nothing.",
      ],
    },
    {
      id: "rec-visibility",
      when: "scores.visibility >= 2",
      title: "Your visibility rescue plan",
      steps: [
        "Keep the phone face-down or in a drawer during focus blocks — out of sight, out of mind.",
        "Enable grayscale mode during work hours — color is designed to pull attention.",
        "Disable lock-screen notifications for all non-human alerts.",
        "Use a smartwatch or desktop for truly urgent calls only — not full phone access.",
      ],
    },
    {
      id: "rec-work",
      when: "scores.work >= 2",
      title: "Your inbox rescue plan",
      steps: [
        "Check email and Slack at 11am and 4pm only — add an auto-responder explaining your schedule.",
        "Close all work comms apps after each check — don't leave them open in tabs.",
        "Use \"async by default\" — if it doesn't need a reply within 4 hours, it can wait.",
        "Batch process: read, decide, act — never re-read the same message twice in one day.",
      ],
    },
    {
      id: "rec-social",
      when: "scores.social >= 2 && scores.rabbit >= 2",
      title: "Your social gate rescue plan",
      steps: [
        "Remove social apps from home screen — access only through search (adds 3 seconds of friction).",
        "Reply to messages in the messaging app only — never tap through to the feed.",
        "Set a 5-minute timer before opening any social app — when it rings, close immediately.",
        "Use Reset or Screen Time limits: 20 minutes total social per day, hard stop.",
      ],
    },
    {
      id: "rec-reflex",
      when: "scores.reflex >= 2",
      title: "Your reflex interrupt rescue plan",
      steps: [
        "Change your lock screen to a solid color with text: \"Why am I here?\"",
        "Move all apps off the first home screen — force search or folder navigation.",
        "Practice the 3-breath rule: three slow breaths before every unlock for 3 days.",
        "Log every unlock for one day — the shame of seeing \"87 unlocks\" is a powerful reset.",
      ],
    },
    {
      id: "rec-transition",
      when: "scores.transition >= 2",
      title: "Your transition rescue plan",
      steps: [
        "List your top 5 transition moments (elevator, bathroom, between meetings) — these are your danger zones.",
        "For each, assign a replacement: stretch, look out a window, or review one note — not the phone.",
        "Keep phone in bag or pocket during walks between rooms — never in hand.",
        "Use the \"hands busy\" trick: coffee, pen, or keys in your dominant hand during transitions.",
      ],
    },
    {
      id: "rec-compulsion",
      when: "scores.compulsion >= 2",
      title: "Your urge-surfing rescue plan",
      steps: [
        "When the urge to get your phone hits, set a 2-minute timer and sit with the discomfort.",
        "Do 10 wall push-ups or a quick walk to another room — physical reset beats willpower.",
        "Keep a rubber band on your wrist — snap it when you notice the urge, then wait 60 seconds.",
        "If you still need the phone after 2 minutes, get it with one stated purpose — then put it back.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Your one-purpose rescue plan",
      steps: [
        "Before every unlock, say out loud what you need (\"check calendar,\" \"reply to Sam\").",
        "If you open an app that wasn't the stated purpose, close the phone immediately — no exceptions.",
        "Review Screen Time pickups every Sunday — aim for 10% fewer than last week.",
        "Charge your phone outside your primary workspace during deep work hours.",
      ],
    },
  ],

  guidance: [],

  ctas: {
    app: {
      title: "Fewer pickups, more focus",
      description:
        "Reset tracks daily pickups, blocks impulsive app opens, and helps you stick to check windows — so your phone works for you, not the other way around.",
    },
  },

  faq: [
    {
      question: "How many times a day is normal to check your phone?",
      answer:
        "Studies suggest average users pick up their phone 50–100+ times daily. If checks feel automatic, anxiety-driven, or interrupt work, that's the habit this tool targets — not occasional intentional use.",
    },
    {
      question: "Should I delete social media apps?",
      answer:
        "Not necessarily. Many people fix compulsive checking with friction (limits, grayscale, off home screen) without deleting. Start with the rescue plan — delete only if softer boundaries fail after 2 weeks.",
    },
    {
      question: "How is this different from the doomscrolling tool?",
      answer:
        "Doomscrolling focuses on long, compulsive feed sessions. This tool targets frequent pickups and micro-checks — often the gateway to longer scrolls. Use both if you struggle with either pattern.",
    },
  ],
} satisfies Record<string, unknown>;
