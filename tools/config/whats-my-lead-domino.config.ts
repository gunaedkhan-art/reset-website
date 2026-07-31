export const whatsMyLeadDominoConfig = {
  schemaVersion: "1.0" as const,
  id: "whats-my-lead-domino",
  slug: "whats-my-lead-domino",
  status: "published" as const,

  seo: {
    title: "What's My Lead Domino?",
    metaDescription:
      "Find your lead domino — the first action that makes everything else easier or unnecessary. Gary Keller's domino effect applied to your project in 4 questions.",
    primaryKeyword: "lead domino",
    secondaryKeywords: [
      "what's my lead domino",
      "domino effect productivity",
      "first domino to knock over",
      "one thing domino",
      "sequential success",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/whats-my-lead-domino",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["one-thing", "domino", "getting-started"],
    cluster: "one-thing",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "What's My Lead Domino?",
    intro:
      "Knock over one thing and the rest becomes easier. Four questions to find the first domino — not the whole project, just the action that starts the chain.",
    icon: "target",
    proseTitle: "About the domino effect",
    sections: [
      {
        id: "problem",
        heading: "When the goal feels as big as the first step",
        framework: "pas",
        body: "You know where you want to end up, but nothing moves. The first action feels as heavy as the finish line — so you plan, research, or wait instead of starting.",
      },
      {
        id: "concept",
        heading: "Success is sequential",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) describes the domino effect in [The ONE Thing](https://www.the1thing.com/): extraordinary results come from lining up dominoes and knocking them over one at a time — not from simultaneous effort on everything.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A lead domino type matched to your blocker — micro-start, unblock, ugly-first draft, decision, or action — plus concrete steps to knock it over today.",
      },
    ],
    eyebrow: "Domino finder",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_goal",
    nodes: {
      q_goal: {
        type: "question" as const,
        id: "q_goal",
        prompt: "What bigger outcome is this domino serving?",
        input: "single-choice" as const,
        options: [
          { id: "ship", label: "Ship something — product, project, or deliverable", score: { ship: 3 }, next: "q_stuck" },
          { id: "learn", label: "Learn a skill or pass a milestone", score: { learn: 3 }, next: "q_stuck" },
          { id: "change", label: "Change a habit or health outcome", score: { habit: 3 }, next: "q_stuck" },
          { id: "relationship", label: "Improve a relationship or resolve conflict", score: { relation: 3 }, next: "q_stuck" },
        ],
      },
      q_stuck: {
        type: "question" as const,
        id: "q_stuck",
        prompt: "Why hasn't the chain started yet?",
        input: "single-choice" as const,
        options: [
          { id: "big", label: "The first step feels as big as the whole goal", score: { too_big: 3 }, next: "q_type" },
          { id: "unclear", label: "I don't know which domino comes first", score: { unclear: 3 }, next: "q_type" },
          { id: "deps", label: "Waiting on someone or something else", score: { blocked: 3 }, next: "q_type" },
          { id: "fear", label: "Avoiding the scariest domino", score: { fear: 3 }, next: "q_type" },
        ],
      },
      q_type: {
        type: "question" as const,
        id: "q_type",
        prompt: "Which kind of domino usually unlocks progress for you?",
        input: "single-choice" as const,
        options: [
          { id: "decision", label: "A decision — choose direction, then act", score: { decision: 2 }, next: "q_time" },
          { id: "draft", label: "A rough draft — bad first version on paper", score: { draft: 2 }, next: "q_time" },
          { id: "conversation", label: "A conversation — alignment or feedback", score: { talk: 2 }, next: "q_time" },
          { id: "system", label: "A system — schedule, tool, or environment change", score: { system: 2 }, next: "q_time" },
        ],
      },
      q_time: {
        type: "question" as const,
        id: "q_time",
        prompt: "How much time does your lead domino need?",
        input: "single-choice" as const,
        options: [
          { id: "five", label: "5 minutes or less", score: { micro: 2 }, next: "branch_result" },
          { id: "thirty", label: "About 30 minutes", score: { short: 2 }, next: "branch_result" },
          { id: "long", label: "2+ hours — it's a real work block", score: { long: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.too_big >= 2", next: "result_shrink" },
          { when: "scores.blocked >= 2", next: "result_blocked" },
          { when: "scores.fear >= 2", next: "result_fear" },
          { when: "scores.unclear >= 2", next: "result_unclear" },
          { when: "scores.decision >= 2", next: "result_decision" },
          { when: "scores.draft >= 2", next: "result_draft" },
        ],
        default: "result_action",
      },
      result_shrink: { type: "result" as const, id: "result_shrink", resultTemplateId: "shrink" },
      result_blocked: { type: "result" as const, id: "result_blocked", resultTemplateId: "blocked" },
      result_fear: { type: "result" as const, id: "result_fear", resultTemplateId: "fear" },
      result_unclear: { type: "result" as const, id: "result_unclear", resultTemplateId: "unclear" },
      result_decision: { type: "result" as const, id: "result_decision", resultTemplateId: "decision" },
      result_draft: { type: "result" as const, id: "result_draft", resultTemplateId: "draft" },
      result_action: { type: "result" as const, id: "result_action", resultTemplateId: "action" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to find your lead domino.",
    templates: [
      {
        id: "shrink",
        cards: [
          { title: "Lead domino type", valueTemplate: "Micro-domino", descriptionTemplate: "Your first domino is too big — shrink until it fits in 5 minutes." },
          { title: "Ask", valueTemplate: "What's the smallest physical start?", descriptionTemplate: "Open the file, write the title, send one email — not \"finish the project.\"" },
        ],
        summaryTemplates: ["Success is sequential — a tiny domino still starts the chain."],
      },
      {
        id: "blocked",
        cards: [
          { title: "Lead domino type", valueTemplate: "Unblock domino", descriptionTemplate: "Your lead domino isn't the main work — it's removing the blocker." },
          { title: "Ask", valueTemplate: "What one ask unblocks the rest?", descriptionTemplate: "One email, one approval, one purchased tool — name it and send today." },
        ],
        summaryTemplates: ["Waiting is rarely passive — the domino is often the chase."],
      },
      {
        id: "fear",
        cards: [
          { title: "Lead domino type", valueTemplate: "Ugly-first domino", descriptionTemplate: "The scariest domino is usually the lead domino — you're avoiding the real start." },
          { title: "Ask", valueTemplate: "What would a bad draft look like?", descriptionTemplate: "5-minute permission to do it poorly — quality comes domino #2." },
        ],
        summaryTemplates: ["Knock over the scary domino first — everything else gets easier."],
      },
      {
        id: "unclear",
        cards: [
          { title: "Lead domino type", valueTemplate: "Research-then-act domino", descriptionTemplate: "Clarity domino: 15 min max research, then pick and act." },
          { title: "Ask", valueTemplate: "Who already did this — what's their first step?", descriptionTemplate: "Copy someone's lead domino — don't invent from zero." },
        ],
        summaryTemplates: ["Clarity follows the first domino more often than the reverse."],
      },
      {
        id: "decision",
        cards: [
          { title: "Lead domino type", valueTemplate: "Decision domino", descriptionTemplate: "Pick one path — the domino is choosing, not doing everything." },
          { title: "Example", valueTemplate: "Write the decision in one sentence", descriptionTemplate: "\"We're doing X, not Y\" — then schedule domino #2." },
        ],
        summaryTemplates: ["Indecision blocks the whole chain — decide is the lead domino."],
      },
      {
        id: "draft",
        cards: [
          { title: "Lead domino type", valueTemplate: "Draft domino", descriptionTemplate: "First ugly version — the domino is output on screen, not perfection." },
          { title: "Example", valueTemplate: "20-minute bad draft timer", descriptionTemplate: "No editing — words, lines, or slides that exist beat plans." },
        ],
        summaryTemplates: ["Draft dominoes unlock feedback, momentum, and domino #2."],
      },
      {
        id: "action",
        cards: [
          { title: "Lead domino type", valueTemplate: "Action domino", descriptionTemplate: "One physical next step — verb, object, done criteria." },
          { title: "Ask", valueTemplate: "What can I finish in one block?", descriptionTemplate: "If it needs multiple blocks, it's not the lead domino — split smaller." },
        ],
        summaryTemplates: ["Line up domino #2 only after #1 falls — sequential, not simultaneous."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-shrink",
      when: "scores.too_big >= 2 || scores.micro >= 2",
      title: "Knock over domino #1 today",
      steps: [
        "Write the lead domino in 10 words or fewer — must be physical action.",
        "Set 5-minute timer — start before you feel ready.",
        "When timer rings: stop or continue, but domino #1 counts as down.",
        "Tomorrow: name domino #2 — only after #1 is done.",
      ],
    },
    {
      id: "rec-blocked",
      when: "scores.blocked >= 2",
      title: "Unblock first",
      steps: [
        "Identify who holds the blocker — one person, not \"the system.\"",
        "Send one specific ask today — deadline included.",
        "While waiting: is there a domino that doesn't need the blocker?",
        "If wait exceeds 48 hours: escalate or work around.",
      ],
    },
    {
      id: "rec-fear",
      when: "scores.fear >= 2",
      title: "Scary domino protocol",
      steps: [
        "Title work \"DRAFT — DELETE\" — lower stakes.",
        "5 minutes only — fear shrinks with motion.",
        "Share ugly output with one trusted person — feedback is domino #2.",
        "Perfection is domino #10, not #1.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Domino discipline",
      steps: [
        "One domino at a time — Keller: success is sequential.",
        "Lead domino goes in your ONE Thing block tomorrow.",
        "Don't line up 10 dominoes — knock #1, then pick #2.",
        "Use Goal Setting to the Now if dominoes don't connect to bigger goals.",
      ],
    },
  ],

  guidance: [
    {
      title: "The domino effect",
      body: "Extraordinary results come from focusing on one thing at a time — each domino makes the next easier to knock over.",
      list: [
        "Lead domino = first action, not the whole goal",
        "Small dominoes still start momentum",
        "Simultaneous goals mean going small on all of them",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Protect time to knock the domino",
      description:
        "Reset blocks distractions during your ONE Thing block — so lead domino #1 actually falls today.",
    },
  },

  faq: [
    {
      question: "What's a lead domino?",
      answer:
        "The first action in a chain — the ONE Thing that makes subsequent tasks easier or unnecessary. From [The ONE Thing](https://www.the1thing.com/) by [Gary Keller](https://www.the1thing.com/): success is built sequentially, one domino at a time.",
    },
    {
      question: "How is this different from the Focusing Question?",
      answer:
        "The Focusing Question picks your priority for a time horizon. The lead domino is the first physical action that starts progress on that priority.",
    },
    {
      question: "Can I have multiple lead dominoes?",
      answer:
        "One at a time. Multiple lead dominoes means simultaneous effort — Keller's economic reality says you go small on all of them.",
    },
  ],
} satisfies Record<string, unknown>;
