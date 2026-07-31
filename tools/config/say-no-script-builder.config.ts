export const sayNoScriptBuilderConfig = {
  schemaVersion: "1.0" as const,
  id: "say-no-script-builder",
  slug: "say-no-script-builder",
  status: "published" as const,

  seo: {
    title: "Say No Script Builder",
    metaDescription:
      "Build a script to say no without guilt — protect your ONE Thing from meetings, favors, and requests. Answer 4 questions, get words you can use today.",
    primaryKeyword: "how to say no",
    secondaryKeywords: [
      "say no script",
      "say no at work",
      "decline meeting script",
      "protect your time",
      "inability to say no",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/say-no-script-builder",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["one-thing", "boundaries", "communication"],
    cluster: "one-thing",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Say No Script Builder",
    intro:
      "Four questions to build a decline script that fits your relationship and stakes — words you can use today.",
    icon: "shield",
    proseTitle: "About saying no",
    sections: [
      {
        id: "problem",
        heading: "Every yes is a no to your ONE Thing",
        framework: "pas",
        body: "Meetings, favors, and \"quick questions\" fill the calendar because declining feels rude or risky. Each automatic yes steals time from the work only you can do.",
      },
      {
        id: "concept",
        heading: "Thief #1: inability to say no",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) lists inability to say no as the first thief of productivity. A prepared script lowers the social friction — you protect the ONE Thing without improvising under pressure.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A tailored decline script for your situation — boss, colleague, client, or friend — with tone matched to relationship and stakes.",
      },
    ],
    eyebrow: "Script builder",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_request",
    nodes: {
      q_request: {
        type: "question" as const,
        id: "q_request",
        prompt: "What are you being asked to say yes to?",
        input: "single-choice" as const,
        options: [
          { id: "meeting", label: "A meeting or recurring sync", score: { meeting: 3 }, next: "q_relationship" },
          { id: "task", label: "An extra task or project", score: { task: 3 }, next: "q_relationship" },
          { id: "favor", label: "A personal favor or social obligation", score: { favor: 3 }, next: "q_relationship" },
          { id: "always", label: "\"Can you just…\" — small ask that adds up", score: { small: 3 }, next: "q_relationship" },
        ],
      },
      q_relationship: {
        type: "question" as const,
        id: "q_relationship",
        prompt: "Who's asking?",
        input: "single-choice" as const,
        options: [
          { id: "boss", label: "Boss or senior leader", score: { boss: 3 }, next: "q_stakes" },
          { id: "peer", label: "Colleague or peer", score: { peer: 2 }, next: "q_stakes" },
          { id: "client", label: "Client or external partner", score: { client: 3 }, next: "q_stakes" },
          { id: "personal", label: "Friend or family", score: { personal: 2 }, next: "q_stakes" },
        ],
      },
      q_stakes: {
        type: "question" as const,
        id: "q_stakes",
        prompt: "What makes saying no hard?",
        input: "single-choice" as const,
        options: [
          { id: "guilt", label: "Guilt — they'll think I'm not a team player", score: { guilt: 3 }, next: "q_one_thing" },
          { id: "fear", label: "Fear — career or relationship consequences", score: { fear: 3 }, next: "q_one_thing" },
          { id: "habit", label: "Habit — I always say yes before thinking", score: { habit: 2 }, next: "q_one_thing" },
          { id: "unclear", label: "Unclear — I don't have a good reason ready", score: { unclear: 2 }, next: "q_one_thing" },
        ],
      },
      q_one_thing: {
        type: "question" as const,
        id: "q_one_thing",
        prompt: "Do you have a protected ONE Thing this week you can name?",
        input: "single-choice" as const,
        options: [
          { id: "yes", label: "Yes — I can state it in one sentence", score: { has_one: 2 }, next: "branch_result" },
          { id: "vague", label: "Vaguely — busy with important work", score: { vague: 1 }, next: "branch_result" },
          { id: "no", label: "Not yet — that's why everything gets a yes", score: { no_one: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.boss >= 2 && scores.meeting >= 2", next: "result_boss_meeting" },
          { when: "scores.boss >= 2", next: "result_boss" },
          { when: "scores.client >= 2", next: "result_client" },
          { when: "scores.personal >= 2", next: "result_personal" },
          { when: "scores.meeting >= 2", next: "result_meeting" },
        ],
        default: "result_peer",
      },
      result_boss_meeting: { type: "result" as const, id: "result_boss_meeting", resultTemplateId: "boss_meeting" },
      result_boss: { type: "result" as const, id: "result_boss", resultTemplateId: "boss" },
      result_client: { type: "result" as const, id: "result_client", resultTemplateId: "client" },
      result_personal: { type: "result" as const, id: "result_personal", resultTemplateId: "personal" },
      result_meeting: { type: "result" as const, id: "result_meeting", resultTemplateId: "meeting" },
      result_peer: { type: "result" as const, id: "result_peer", resultTemplateId: "peer" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your say-no script.",
    templates: [
      {
        id: "boss_meeting",
        cards: [
          { title: "Your script", valueTemplate: "Decline + alternative", descriptionTemplate: "\"I'm protecting focus time for [ONE Thing] this week — can we async this or shorten to 15 min?\"" },
          { title: "If pushed", valueTemplate: "Trade, don't add", descriptionTemplate: "\"Happy to join if we move [other meeting] — I can't add without dropping my priority.\"" },
        ],
        summaryTemplates: ["Boss nos need a trade or alternative — never a bare no without context."],
      },
      {
        id: "boss",
        cards: [
          { title: "Your script", valueTemplate: "Priority frame", descriptionTemplate: "\"I'm heads-down on [ONE Thing] until [date] — can this wait or go to [person]?\"" },
          { title: "If pushed", valueTemplate: "Clarify priority", descriptionTemplate: "\"Which should drop — [ONE Thing] or this? I can only do one well.\"" },
        ],
        summaryTemplates: ["Force explicit priority ranking — bosses often prefer clarity over silent overload."],
      },
      {
        id: "client",
        cards: [
          { title: "Your script", valueTemplate: "Scope boundary", descriptionTemplate: "\"That's outside this sprint's scope — I can add it if we defer [X]. Which matters more?\"" },
          { title: "If pushed", valueTemplate: "Timeline trade", descriptionTemplate: "\"Yes, but [ONE Thing] moves to [date] — confirm that's OK.\"" },
        ],
        summaryTemplates: ["Client nos are timeline or scope trades — make the cost visible."],
      },
      {
        id: "personal",
        cards: [
          { title: "Your script", valueTemplate: "Warm no", descriptionTemplate: "\"I can't this week — I'm protecting time for something important. Can we do [alternative date]?\"" },
          { title: "If pushed", valueTemplate: "Short truth", descriptionTemplate: "\"I'm at capacity — not a no to you, a yes to something I committed to first.\"" },
        ],
        summaryTemplates: ["Personal nos need warmth + alternative — guilt fades when you offer another option."],
      },
      {
        id: "meeting",
        cards: [
          { title: "Your script", valueTemplate: "Async offer", descriptionTemplate: "\"I can't make that slot — send notes and I'll comment by EOD, or book 15 min if decision needed.\"" },
          { title: "If pushed", valueTemplate: "Optional attendance", descriptionTemplate: "\"Mark me optional — I'll join if my ONE Thing block finishes early.\"" },
        ],
        summaryTemplates: ["Most meetings survive without you — async is a valid no."],
      },
      {
        id: "peer",
        cards: [
          { title: "Your script", valueTemplate: "Direct + kind", descriptionTemplate: "\"I'm at capacity on [ONE Thing] this week — can't take this on without dropping the ball elsewhere.\"" },
          { title: "If pushed", valueTemplate: "Later yes", descriptionTemplate: "\"Not this week — ping me [date] if still needed.\"" },
        ],
        summaryTemplates: ["Peer nos are simplest — direct, no over-explaining."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-no-one",
      when: "scores.no_one >= 2",
      title: "Before the next no — get your ONE Thing",
      steps: [
        "Use the Focusing Question tool — name this week's ONE Thing first.",
        "Write it where you'll see it before saying yes to anything new.",
        "Every no protects that sentence.",
        "Without a ONE Thing, every yes feels equally reasonable.",
      ],
    },
    {
      id: "rec-guilt",
      when: "scores.guilt >= 2",
      title: "Handle guilt after saying no",
      steps: [
        "Remind: a guarded yes to your ONE Thing serves everyone long-term.",
        "Don't over-apologize — one clear sentence, then stop.",
        "Offer alternative when genuine — not to earn permission to say no.",
        "Track nos this week — guilt drops with repetition.",
      ],
    },
    {
      id: "rec-habit",
      when: "scores.habit >= 2",
      title: "Break the auto-yes habit",
      steps: [
        "Default reply: \"Let me check my priorities and get back by [time].\"",
        "Never yes in the moment — 2-hour delay kills reflex yes.",
        "Calendar-block ONE Thing before opening meeting invites.",
        "Practice one no this week — smallest safe request.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Keller's rule on yes",
      steps: [
        "A yes to your ONE Thing requires a no to almost everything else.",
        "Use your script verbatim — don't improvise under pressure.",
        "Save scripts that worked — reuse next time.",
        "Take the Four Thieves quiz if nos stay hard.",
      ],
    },
  ],

  guidance: [
    {
      title: "Thief #1: inability to say no",
      body: "From [The ONE Thing](https://www.the1thing.com/) — when you say yes to everything, you go small on what matters most. A no to a request is a yes to your ONE Thing.",
    },
  ],

  ctas: {
    app: {
      title: "Protect the time you defended",
      description:
        "Reset blocks distracting apps during your ONE Thing block — saying no only works if the time stays protected.",
    },
  },

  faq: [
    {
      question: "How do I say no to my boss?",
      answer:
        "Frame around priority, not refusal: name your ONE Thing, offer async or a trade, or ask which task should drop. Bosses respond to clarity more than silent overload.",
    },
    {
      question: "Is it rude to decline meetings?",
      answer:
        "Offering async updates or optional attendance is professional. Most recurring meetings don't need every attendee — protect focus first.",
    },
    {
      question: "What if I already said yes?",
      answer:
        "Renegotiate: \"I overcommitted — I need to move this or hand off to stay quality on [ONE Thing].\" Early correction beats silent failure.",
    },
  ],
} satisfies Record<string, unknown>;
