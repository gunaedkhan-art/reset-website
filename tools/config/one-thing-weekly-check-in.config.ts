export const oneThingWeeklyCheckInConfig = {
  schemaVersion: "1.0" as const,
  id: "one-thing-weekly-check-in",
  slug: "one-thing-weekly-check-in",
  status: "published" as const,

  seo: {
    title: "ONE Thing Weekly Check-In Tracker",
    metaDescription:
      "Set your ONE Thing for the week and check in daily — yes, partial, or missed. Free weekly tracker based on Gary Keller's Focusing Question. Saved in your browser.",
    primaryKeyword: "one thing weekly check in",
    secondaryKeywords: [
      "weekly one thing tracker",
      "one thing habit tracker",
      "weekly priority tracker",
      "focusing question tracker",
      "one thing weekly review",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/one-thing-weekly-check-in",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["one-thing", "weekly-planning", "tracker", "goals"],
    cluster: "one-thing",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "ONE Thing Weekly Check-In",
    intro:
      "Name your ONE Thing for the week, check in daily with yes / partial / no, tag blockers, and close the week with a short review — saved in your browser.",
    icon: "target",
    proseTitle: "About this tracker",
    sections: [
      {
        id: "problem",
        heading: "Weeks without a single priority",
        framework: "pas",
        body: "You plan on Sunday, then Monday's inbox rewrites the week. Without a daily signal, the ONE Thing becomes a note you never reopen — and Friday arrives with the same guilt.",
      },
      {
        id: "concept",
        heading: "One priority, seven honest check-ins",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) connects weekly planning to the [Focusing Question](https://www.the1thing.com/): what's the ONE Thing I can do this week such that everything else becomes easier? This tracker makes that answer visible — one line for the week, one tap per day.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A saved weekly ONE Thing, daily check-ins you can complete in seconds, and a running score so you see whether the calendar matched the intention.",
        list: [
          "Set your ONE Thing, optional lead domino, and week start",
          "7-day visual strip plus daily check-ins (today first)",
          "Blocker tags on partial/missed days and end-of-week review",
          "Stored locally in your browser — no signup required",
        ],
      },
    ],
    eyebrow: "Weekly tracker",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "one-thing-weekly" as const,
    inputs: [],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Set your ONE Thing and week start date — your daily check-ins and week score will appear here.",
    templates: [
      {
        id: "default",
      },
    ],
  },

  guidance: [
    {
      title: "How to check in",
      body: "Yes = you protected meaningful time for your ONE Thing. Partial = some progress but the block was interrupted or shortened. No = the day went to everything else. Be honest — the score is for you, not a grade.",
    },
    {
      title: "When to set your week",
      body: "Sunday evening or Monday morning works for most people — before meetings and inbox noise claim the calendar. Pair with [Weekly Planning Score](/weekly-planning-score) if you're unsure your planning habits are solid.",
    },
    {
      title: "Pre-fill from other tools",
      body: "Open from [The Focusing Question](/the-focusing-question) or [Goal Setting to the Now](/goal-setting-to-the-now) with `?oneThing=` and optional `?leadDomino=` in the URL — or use Track this week when those tools add the button.",
    },
    {
      title: "Keep the ONE Thing small enough",
      body: "If you log partial or missed most days, the task may be too big for one week. Shrink to a lead domino — use [What's My Lead Domino](/whats-my-lead-domino) to find a smaller first move.",
    },
  ],

  ctas: {
    app: {
      title: "Defend the block you scheduled",
      description:
        "Reset blocks distracting apps during your ONE Thing time block — so the week you planned on paper survives contact with your phone.",
    },
  },

  faq: [
    {
      question: "What counts as protecting my ONE Thing?",
      answer:
        "Any deliberate block where your ONE Thing was the primary task — not multitasking it with Slack. [Gary Keller](https://www.the1thing.com/) recommends substantial blocks; even 45 focused minutes counts as yes if that was the plan.",
    },
    {
      question: "How is this different from Weekly Planning Score?",
      answer:
        "The [Weekly Planning Score](/weekly-planning-score) diagnoses planning habits once. This tracker is for repeat use — set the week's ONE Thing and log daily through Friday.",
    },
    {
      question: "What happens when the week ends?",
      answer:
        "Start a new week with a fresh ONE Thing. Your previous week is archived locally so you can compare how many yes days you logged.",
    },
    {
      question: "Is my data saved?",
      answer:
        "Yes — in your browser on this device only. There is no account or cloud sync in this version. Clearing site data will reset the tracker.",
    },
    {
      question: "Can I change my ONE Thing mid-week?",
      answer:
        "Yes — update the text and save. Check-ins you already logged stay attached to that week. If the priority truly changed, start a new week with the revised ONE Thing.",
    },
  ],

  recommendations: [],
};
