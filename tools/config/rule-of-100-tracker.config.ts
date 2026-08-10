export const RULE_OF_100_APP_CTA = {
  title: "Stack daily reps in Reset",
  description:
    "Name your lead measure, log reps on your phone, and get back on track when distraction pulls you away from the work that compounds.",
} as const;

export const ruleOf100TrackerConfig = {
  schemaVersion: "1.0" as const,
  id: "rule-of-100-tracker",
  slug: "rule-of-100-tracker",
  status: "published" as const,

  seo: {
    title: "Rule of 100 Tracker",
    metaDescription:
      "Track Alex Hormozi's Rule of 100 — log daily reps toward 100 outreach messages, content minutes, posts, or any lead measure. Free counter, timer, and habit-style history in your browser.",
    primaryKeyword: "rule of 100 tracker",
    secondaryKeywords: [
      "alex hormozi rule of 100",
      "100 reps tracker",
      "lead measure tracker",
      "daily outreach tracker",
      "volume tracker productivity",
      "habit counter 100 times",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/rule-of-100-tracker",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["rule-of-100", "habits", "tracker", "lead-measures", "volume"],
    cluster: "productivity",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Rule of 100 Tracker",
    intro:
      "Name one lead-measure task, count reps toward 100 each day, and see your history score green at 100, orange from 50–99, and red below 50 — saved in your browser.",
    icon: "target",
    proseTitle: "About this tracker",
    sections: [
      {
        id: "problem",
        heading: "Lag measures lie until volume shows up",
        framework: "pas",
        body: "Revenue, followers, and pipeline feel random when you only track outcomes. You skip the boring daily reps — messages, minutes, drafts — because there is no visible score for the work that actually moves the needle.",
      },
      {
        id: "concept",
        heading: "100 reps of one lead measure",
        framework: "concept",
        body: "[Alex Hormozi's Rule of 100](https://www.acquisition.com/) is simple: pick a lead measure you control and do it 100 times — message 100 prospects, record 100 minutes of content, write 100 lines of copy. Outcomes lag; volume is the input you can bank every day.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A named daily task, tap-to-count reps, an optional focus timer, and a rolling history that shows whether you hit your 100 — without spreadsheets or streak guilt from unrelated habits.",
        list: [
          "Interactive counter with quick +1 / +5 / +10 buttons",
          "Daily target (default 100) you can rename anytime",
          "Color-scored history — green at 100, orange 50–99, below 50 in red",
          "Stored locally in your browser — no signup required",
        ],
      },
    ],
    eyebrow: "Volume tracker",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "rule-of-100" as const,
    inputs: [],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Name your Rule of 100 task to start counting — today's gauge and daily history appear here.",
    templates: [
      {
        id: "default",
      },
    ],
  },

  guidance: [
    {
      title: "Pick a lead measure, not a outcome",
      body: "Choose something you fully control: messages sent, minutes recorded, pages written, calls made. Avoid lag measures like revenue or follower count — those are results of the reps.",
    },
    {
      title: "Why 100?",
      body: "One hundred is enough volume to learn fast and see signal, but small enough to finish in a focused day. You can lower the target for harder tasks (minimum 10) if 100 isn't realistic yet.",
    },
    {
      title: "Read the colors",
      body: "Green means you hit your daily target. Orange means you passed halfway — finish strong. Red means you started but need more reps. Gray is a missed day — reset tomorrow.",
      list: [
        "Green — 100% of daily target or more",
        "Orange — 50–99% of target",
        "Red — 1–49% of target",
        "Gray — zero reps logged",
      ],
    },
  ],

  ctas: {
    app: RULE_OF_100_APP_CTA,
  },

  faq: [
    {
      question: "What is the Rule of 100?",
      answer:
        "It is a volume framework popularized by Alex Hormozi: choose one lead measure (something you control) and repeat it 100 times — for example, 100 outreach messages or 100 minutes of content. Consistent inputs compound into lag-measure results over time.",
    },
    {
      question: "Do I have to use exactly 100 reps?",
      answer:
        "No. One hundred is the default because it matches the framework name, but you can set any daily target between 10 and 500 in task settings — useful when a full 100 is too aggressive for your schedule.",
    },
    {
      question: "What do the daily colors mean?",
      answer:
        "Green means you reached your daily target. Orange means you logged between 50% and 99% of target. Red means you logged some reps but stayed below halfway. Gray means zero reps that day.",
    },
    {
      question: "Is my data saved?",
      answer:
        "Yes — on this device only. Your task name, counts, timer totals, and history are stored in your browser's local storage. There is no account required in this version.",
    },
    {
      question: "Can I track more than one Rule of 100 task?",
      answer:
        "This tracker focuses on one active task at a time so you protect a single lead measure. Archive the current task and start a new one when your priority shifts.",
    },
  ],

  recommendations: [],
};
