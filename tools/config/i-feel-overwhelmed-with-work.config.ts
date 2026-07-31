export const iFeelOverwhelmedWithWorkConfig = {
  schemaVersion: "1.0" as const,
  id: "i-feel-overwhelmed-with-work",
  slug: "i-feel-overwhelmed-with-work",
  status: "published" as const,

  seo: {
    title: "I Feel Overwhelmed With Work",
    metaDescription:
      "Overwhelmed at work? Answer 4 questions and get a practical triage plan — free tool to shrink the pile and start moving in under 60 seconds.",
    primaryKeyword: "i feel overwhelmed with work",
    secondaryKeywords: [
      "overwhelmed at work",
      "work overwhelm",
      "too much work stress",
      "can't cope with workload",
      "work anxiety overwhelm",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/i-feel-overwhelmed-with-work",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["overwhelm", "work", "stress"],
    cluster: "overwhelm",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "I Feel Overwhelmed With Work",
    intro:
      "Four questions to find what's crushing you and a triage plan to make today survivable.",
    icon: "checklist",
    proseTitle: "About work overwhelm",
    sections: [
      {
        id: "problem",
        heading: "When work won't fit in the week",
        framework: "pas",
        body: "Deadlines stack, inbox never empties, and every meeting adds homework. Working harder just adds hours — without clarifying what actually moves the needle today.",
      },
      {
        id: "concept",
        heading: "Work triage, not heroics",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) distinguishes shallow overload from deep priorities — triage means naming what ships today, what waits, and what gets declined, not clearing every notification.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Your work-overwhelm type — volume, unclear priorities, people demands, or perfection — plus a same-day triage plan.",
      },
    ],
    eyebrow: "Work triage",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_source",
    nodes: {
      q_source: {
        type: "question" as const,
        id: "q_source",
        prompt: "What's driving the overwhelm?",
        input: "single-choice" as const,
        options: [
          { id: "volume", label: "Too many tasks — can't see the bottom", score: { volume: 3 }, next: "q_meetings" },
          { id: "unclear", label: "Unclear expectations from boss/clients", score: { unclear: 3 }, next: "q_meetings" },
          { id: "quality", label: "Everything must be perfect", score: { perfection: 3 }, next: "q_meetings" },
          { id: "people", label: "Constant pings and interruptions", score: { pings: 3 }, next: "q_meetings" },
        ],
      },
      q_meetings: {
        type: "question" as const,
        id: "q_meetings",
        prompt: "How's your calendar?",
        input: "single-choice" as const,
        options: [
          { id: "backtoback", label: "Back-to-back meetings — no focus time", score: { meetings: 3 }, next: "q_feel" },
          { id: "some", label: "Some meetings but manageable", score: { some: 1 }, next: "q_feel" },
          { id: "open", label: "Open calendar — still overwhelmed", score: { self: 2 }, next: "q_feel" },
        ],
      },
      q_feel: {
        type: "question" as const,
        id: "q_feel",
        prompt: "How are you coping?",
        input: "single-choice" as const,
        options: [
          { id: "freeze", label: "Frozen — can't start anything", score: { freeze: 3 }, next: "branch_result" },
          { id: "busy", label: "Busy all day — nothing important done", score: { busy: 3 }, next: "branch_result" },
          { id: "overtime", label: "Working late — still behind", score: { overtime: 3 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.meetings >= 2", next: "result_meetings" },
          { when: "scores.pings >= 2", next: "result_pings" },
          { when: "scores.perfection >= 2", next: "result_perfection" },
          { when: "scores.volume >= 2 && scores.freeze >= 2", next: "result_freeze" },
          { when: "scores.unclear >= 2", next: "result_unclear" },
          { when: "scores.overtime >= 2", next: "result_overtime" },
        ],
        default: "result_triage",
      },
      result_meetings: { type: "result" as const, id: "result_meetings", resultTemplateId: "meetings" },
      result_pings: { type: "result" as const, id: "result_pings", resultTemplateId: "pings" },
      result_perfection: { type: "result" as const, id: "result_perfection", resultTemplateId: "perfection" },
      result_freeze: { type: "result" as const, id: "result_freeze", resultTemplateId: "freeze" },
      result_unclear: { type: "result" as const, id: "result_unclear", resultTemplateId: "unclear" },
      result_overtime: { type: "result" as const, id: "result_overtime", resultTemplateId: "overtime" },
      result_triage: { type: "result" as const, id: "result_triage", resultTemplateId: "triage" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your work triage plan.",
    templates: [
      { id: "meetings", cards: [{ title: "Root cause", valueTemplate: "Calendar owns you", descriptionTemplate: "No blocks for deep work — tasks pile up between calls." }], summaryTemplates: ["Today's fix: protect 60 minutes tomorrow AM — decline optional syncs."] },
      { id: "pings", cards: [{ title: "Root cause", valueTemplate: "Always-on culture", descriptionTemplate: "Slack and email fragment every hour into scraps." }], summaryTemplates: ["Today's fix: batch messages twice — status set to focus."] },
      { id: "perfection", cards: [{ title: "Root cause", valueTemplate: "Perfection tax", descriptionTemplate: "Everything takes 3× because good enough isn't defined." }], summaryTemplates: ["Today's fix: ship one B+ deliverable — define done enough in writing."] },
      { id: "freeze", cards: [{ title: "Root cause", valueTemplate: "Volume paralysis", descriptionTemplate: "Too many open loops — brain shuts down." }], summaryTemplates: ["Today's fix: brain-dump, pick one task, 25-minute sprint."] },
      { id: "unclear", cards: [{ title: "Root cause", valueTemplate: "Expectation gap", descriptionTemplate: "You're guessing what matters — rework multiplies load." }], summaryTemplates: ["Today's fix: one email — \"What's the #1 priority this week?\""] },
      { id: "overtime", cards: [{ title: "Root cause", valueTemplate: "Unsustainable pace", descriptionTemplate: "More hours aren't clearing the pile — system is broken." }], summaryTemplates: ["Today's fix: stop at a set time — triage tomorrow with fresh limits."] },
      { id: "triage", cards: [{ title: "Root cause", valueTemplate: "Mixed overload", descriptionTemplate: "Several leaks at once — need ruthless prioritization today." }], summaryTemplates: ["Today's fix: three tasks max — everything else waits."] },
    ],
  },

  recommendations: [
    { id: "rec-meetings", when: "scores.meetings >= 2", title: "Work triage plan", steps: ["Block 90 min tomorrow before meetings — non-negotiable.", "Decline or shorten one recurring meeting this week.", "Ask which meetings can be async updates.", "End calls 5 min early — write next action before next call."] },
    { id: "rec-pings", when: "scores.pings >= 2", title: "Work triage plan", steps: ["Slack/email at 11 and 4 only today.", "Status: \"Focus block — urgent call if needed.\"", "Close chat apps after each check.", "Turn off non-human notifications."] },
    { id: "rec-perfection", when: "scores.perfection >= 2", title: "Work triage plan", steps: ["Pick one deliverable due soon.", "Write \"done enough\" criteria — 3 bullets max.", "Set timer — ship at 80% when timer ends.", "Ask manager if direction is right early — not after polish."] },
    { id: "rec-freeze", when: "scores.volume >= 2 && scores.freeze >= 2", title: "Work triage plan", steps: ["15-min dump — every task on paper.", "Star what boss/client mentioned most recently.", "25-min sprint on starred item only.", "Email stakeholders: \"Prioritizing X today — Y moves to tomorrow.\""] },
    { id: "rec-unclear", when: "scores.unclear >= 2", title: "Work triage plan", steps: ["One clarifying email: \"Confirm top priority?\"", "Don't start ambiguous projects until reply.", "Meanwhile: clear small blocking tasks.", "Document answers — reduce future ambiguity."] },
    { id: "rec-overtime", when: "scores.overtime >= 2", title: "Work triage plan", steps: ["Set hard stop time tonight.", "List what didn't finish — schedule tomorrow.", "Identify one thing to drop or delegate.", "If chronic, discuss workload with manager — data helps."] },
    { id: "rec-triage", when: "true", title: "Work triage plan", steps: ["Three tasks only for rest of today.", "Communicate delays proactively — one sentence each.", "One 25-min focus block before inbox.", "Leave on time — rest prevents tomorrow's overwhelm."] },
  ],

  guidance: [],
  ctas: { app: { title: "Work without constant interruption", description: "Reset blocks distracting apps during focus blocks so work overwhelm doesn't restart every time you pick up your phone." } },
  faq: [
    { question: "Should I tell my boss I'm overwhelmed?", answer: "Often yes — with solutions: \"Here's what I can finish by Friday; should I deprioritize X?\" Data and options beat vague stress." },
    { question: "How is this different from \"I'm overwhelmed\"?", answer: "The general tool covers life-wide overwhelm. This one targets work-specific causes — meetings, pings, workload, expectations." },
    { question: "When is work overwhelm burnout?", answer: "If you feel cynical, exhausted for weeks, and detached from work — not just busy — consider burnout. Talk to HR or a professional." },
  ],
} satisfies Record<string, unknown>;
