export const iDontKnowMyPrioritiesConfig = {
  schemaVersion: "1.0" as const,
  id: "i-dont-know-my-priorities",
  slug: "i-dont-know-my-priorities",
  status: "published" as const,

  seo: {
    title: "I Don't Know My Priorities",
    metaDescription:
      "Unclear on what matters most? Answer 4 questions and get a simple priority framework — free tool to find your top focus in under 60 seconds.",
    primaryKeyword: "i don't know my priorities",
    secondaryKeywords: [
      "don't know priorities",
      "how to prioritize",
      "what should i focus on",
      "too many priorities",
      "priority confusion",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/i-dont-know-my-priorities",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["priorities", "planning", "focus"],
    cluster: "weekly-planning",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "I Don't Know My Priorities",
    intro:
      "Four questions to cut through noise and name what actually deserves your energy this week.",
    icon: "target",
    proseTitle: "About priority confusion",
    sections: [
      {
        id: "problem",
        heading: "When everything is urgent",
        framework: "pas",
        body: "Ten things demand attention — boss, family, health, side project, inbox. Without a filter, you react to the loudest signal and finish the week without moving what matters.",
      },
      {
        id: "concept",
        heading: "Priorities come from questions, not lists",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) uses the [Focusing Question](https://www.the1thing.com/) to collapse options: what's the ONE Thing such that by doing it everything else becomes easier? Clarity is sequential — pick one horizon, then one answer.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A simple priority framework for this week — one top focus plus what to defer, batch, or drop.",
      },
    ],
    eyebrow: "Priority finder",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_feel",
    nodes: {
      q_feel: {
        type: "question" as const,
        id: "q_feel",
        prompt: "What best describes your situation?",
        input: "single-choice" as const,
        options: [
          { id: "many", label: "Too many things feel equally important", score: { many: 3 }, next: "q_horizon" },
          { id: "none", label: "Nothing feels important — I'm drifting", score: { none: 3 }, next: "q_horizon" },
          { id: "conflict", label: "Work vs life pull in opposite directions", score: { conflict: 3 }, next: "q_horizon" },
          { id: "others", label: "Other people's priorities became mine", score: { external: 3 }, next: "q_horizon" },
        ],
      },
      q_horizon: {
        type: "question" as const,
        id: "q_horizon",
        prompt: "What time frame are you planning for?",
        input: "single-choice" as const,
        options: [
          { id: "today", label: "Today — I need clarity now", score: { today: 2 }, next: "q_stakes" },
          { id: "week", label: "This week", score: { week: 2 }, next: "q_stakes" },
          { id: "longer", label: "Month or longer", score: { long: 2 }, next: "q_stakes" },
        ],
      },
      q_stakes: {
        type: "question" as const,
        id: "q_stakes",
        prompt: "What happens if you pick wrong?",
        input: "single-choice" as const,
        options: [
          { id: "high", label: "Real consequences — job, money, relationships", score: { high: 2 }, next: "q_clarity" },
          { id: "low", label: "Mostly inconvenience — I can adjust", score: { low: 1 }, next: "q_clarity" },
          { id: "unknown", label: "I don't know — that's part of the problem", score: { unknown: 2 }, next: "q_clarity" },
        ],
      },
      q_clarity: {
        type: "question" as const,
        id: "q_clarity",
        prompt: "Do you have a list of everything on your plate?",
        input: "single-choice" as const,
        options: [
          { id: "no", label: "No — it's all in my head", score: { head: 3 }, next: "branch_result" },
          { id: "yes", label: "Yes — but I can't rank it", score: { list: 2 }, next: "branch_result" },
          { id: "partial", label: "Partial — some written, some not", score: { partial: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.none >= 2", next: "result_none" },
          { when: "scores.external >= 2", next: "result_external" },
          { when: "scores.conflict >= 2", next: "result_conflict" },
          { when: "scores.many >= 2", next: "result_many" },
          { when: "scores.head >= 2", next: "result_head" },
        ],
        default: "result_rank",
      },
      result_none: { type: "result" as const, id: "result_none", resultTemplateId: "none" },
      result_external: { type: "result" as const, id: "result_external", resultTemplateId: "external" },
      result_conflict: { type: "result" as const, id: "result_conflict", resultTemplateId: "conflict" },
      result_many: { type: "result" as const, id: "result_many", resultTemplateId: "many" },
      result_head: { type: "result" as const, id: "result_head", resultTemplateId: "head" },
      result_rank: { type: "result" as const, id: "result_rank", resultTemplateId: "rank" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to find your priorities.",
    templates: [
      { id: "none", cards: [{ title: "Your blocker", valueTemplate: "Flat priorities", descriptionTemplate: "Nothing pulls — you may need values clarity before a to-do rank." }], summaryTemplates: ["Your plan reconnects actions to what you want this season."] },
      { id: "external", cards: [{ title: "Your blocker", valueTemplate: "Borrowed priorities", descriptionTemplate: "You're living by others' urgencies, not your choices." }], summaryTemplates: ["Your plan separates \"theirs\" from \"mine\" this week."] },
      { id: "conflict", cards: [{ title: "Your blocker", valueTemplate: "Domain conflict", descriptionTemplate: "Work and life compete — no single list wins." }], summaryTemplates: ["Your plan picks one domain to lead this week."] },
      { id: "many", cards: [{ title: "Your blocker", valueTemplate: "Priority inflation", descriptionTemplate: "When everything is #1, nothing is." }], summaryTemplates: ["Your plan forces one outcome and demotes the rest."] },
      { id: "head", cards: [{ title: "Your blocker", valueTemplate: "Invisible load", descriptionTemplate: "Open loops in your head block clear ranking." }], summaryTemplates: ["Your plan externalizes the list, then ranks brutally."] },
      { id: "rank", cards: [{ title: "Your blocker", valueTemplate: "Ranking gap", descriptionTemplate: "You have the list — you need a decision rule." }], summaryTemplates: ["Your plan uses impact × urgency to pick one winner."] },
    ],
  },

  recommendations: [
    { id: "rec-none", when: "scores.none >= 2", title: "Your values-first plan", steps: ["Write: \"In 90 days I want to feel ___ and have ___.\"", "List 5 tasks — mark only those that move those outcomes.", "Pick one task for this week — ignore the rest temporarily.", "Revisit values monthly — priorities follow meaning."] },
    { id: "rec-external", when: "scores.external >= 2", title: "Your ownership plan", steps: ["Two columns: \"Their urgency\" vs \"My choice\".", "Today: one hour on My choice before Their inbox.", "Practice: \"I can't take that on this week.\"", "Weekly: review what you said yes to — default to no next time."] },
    { id: "rec-conflict", when: "scores.conflict >= 2", title: "Your domain plan", steps: ["This week: work OR personal leads — not both equally.", "Name the leading domain's #1 outcome.", "Minimum viable attention on the other domain only.", "Swap lead domain next week if needed."] },
    { id: "rec-many", when: "scores.many >= 2", title: "Your one-winner plan", steps: ["If only ONE thing finished this week, what would matter most?", "Write it at top of list — everything else is B-tier.", "Max 3 tasks per day — no more.", "Defer or delete anything that didn't make top 3 for the week."] },
    { id: "rec-head", when: "scores.head >= 2", title: "Your brain-dump plan", steps: ["15-minute dump — every task, worry, and reminder on paper.", "Mark: Do / Schedule / Delete for each line.", "Circle one Do item for today.", "Keep one capture list — never two systems."] },
    { id: "rec-rank", when: "true", title: "Your impact matrix plan", steps: ["Rate top 5 tasks: High/Low impact and High/Low urgency.", "Do high impact + urgent first, then high impact + not urgent.", "Delete or delegate low impact items when possible.", "Re-rank every Sunday — priorities shift."] },
  ],

  guidance: [],
  ctas: { app: { title: "Protect what you prioritized", description: "Reset defends the time you chose for your top priority — blocking distractions that pull you back to everyone else's list." } },
  faq: [
    { question: "How many priorities should I have?", answer: "One main outcome per week, up to three daily focuses. More than that and you're back to \"everything is urgent.\"" },
    { question: "What if my boss sets all my priorities?", answer: "Clarify their top one explicitly. Protect one personal or growth priority outside work — balance prevents burnout." },
    { question: "How is this different from weekly planning score?", answer: "Weekly planning scores your habits. This tool finds what should be on the plan when you're unclear." },
  ],
} satisfies Record<string, unknown>;
