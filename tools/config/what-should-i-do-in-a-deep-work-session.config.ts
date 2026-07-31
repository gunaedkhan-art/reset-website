export const whatShouldIDoInADeepWorkSessionConfig = {
  schemaVersion: "1.0" as const,
  id: "what-should-i-do-in-a-deep-work-session",
  slug: "what-should-i-do-in-a-deep-work-session",
  status: "published" as const,

  seo: {
    title: "What Should I Do in a Deep Work Session?",
    metaDescription:
      "Starting a deep work session? Answer 4 questions about your task, time, and energy — get a first-15-minutes plan and session structure that fits Newport-style depth.",
    primaryKeyword: "what should i do in a deep work session",
    secondaryKeywords: [
      "deep work session plan",
      "first minutes of deep work",
      "how to start a deep work session",
      "deep work session structure",
      "deep work warmup",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/what-should-i-do-in-a-deep-work-session",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "session", "getting-started"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "What Should I Do in a Deep Work Session?",
    intro:
      "Four questions about your task, block length, and where you left off — get a session opener and structure for the rest of the block.",
    icon: "checklist",
    proseTitle: "About session structure",
    sections: [
      {
        id: "problem",
        heading: "The first fifteen minutes decide everything",
        framework: "pas",
        body: "You blocked 90 minutes, sat down, and spent twenty minutes deciding what to do, checking one thing, and warming up badly. Without a session opener, the block dissolves before real depth begins.",
      },
      {
        id: "concept",
        heading: "Structure the entry, not just the calendar",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) treats deep work as ritualized concentration — clear task, defined done criteria, environment set before the timer starts. The first minutes should be mechanical: open file, read last note, write one line — not renegotiate the goal.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A first-15-minutes plan and session structure matched to whether you're continuing, starting fresh, or tackling something unfamiliar.",
      },
    ],
    eyebrow: "Session planner",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_state",
    nodes: {
      q_state: {
        type: "question" as const,
        id: "q_state",
        prompt: "Where are you with this task?",
        input: "single-choice" as const,
        options: [
          { id: "fresh", label: "Starting fresh — haven't begun yet", score: { fresh: 3 }, next: "q_task" },
          { id: "resume", label: "Resuming — I have a clear stopping point from last time", score: { resume: 3 }, next: "q_task" },
          { id: "stuck", label: "Stuck — started before but lost the thread", score: { stuck: 3 }, next: "q_task" },
        ],
      },
      q_task: {
        type: "question" as const,
        id: "q_task",
        prompt: "What type of deep work is this?",
        input: "single-choice" as const,
        options: [
          { id: "create", label: "Creating — writing, designing, building", score: { create: 2 }, next: "q_length" },
          { id: "analyze", label: "Analyzing — research, code, problem-solving", score: { analyze: 2 }, next: "q_length" },
          { id: "learn", label: "Learning — hard material, practice", score: { learn: 2 }, next: "q_length" },
        ],
      },
      q_length: {
        type: "question" as const,
        id: "q_length",
        prompt: "How long is your deep work block?",
        input: "single-choice" as const,
        options: [
          { id: "short", label: "45 minutes or less", score: { short: 2 }, next: "q_clarity" },
          { id: "medium", label: "60–90 minutes", score: { medium: 2 }, next: "q_clarity" },
          { id: "long", label: "2+ hours", score: { long: 2 }, next: "q_clarity" },
        ],
      },
      q_clarity: {
        type: "question" as const,
        id: "q_clarity",
        prompt: "How clear is \"done\" for this session?",
        input: "single-choice" as const,
        options: [
          { id: "clear", label: "Clear — I know exactly what finished looks like", score: { clear: 2 }, next: "branch_result" },
          { id: "fuzzy", label: "Fuzzy — general direction only", score: { fuzzy: 3 }, next: "branch_result" },
          { id: "none", label: "Not defined — that's part of the problem", score: { none: 3 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.stuck >= 2", next: "result_stuck" },
          { when: "scores.fresh >= 2 && scores.fuzzy >= 2", next: "result_fresh_fuzzy" },
          { when: "scores.resume >= 2", next: "result_resume" },
          { when: "scores.none >= 2", next: "result_define" },
          { when: "scores.create >= 2", next: "result_create" },
        ],
        default: "result_standard",
      },
      result_stuck: { type: "result" as const, id: "result_stuck", resultTemplateId: "stuck" },
      result_fresh_fuzzy: { type: "result" as const, id: "result_fresh_fuzzy", resultTemplateId: "fresh_fuzzy" },
      result_resume: { type: "result" as const, id: "result_resume", resultTemplateId: "resume" },
      result_define: { type: "result" as const, id: "result_define", resultTemplateId: "define" },
      result_create: { type: "result" as const, id: "result_create", resultTemplateId: "create" },
      result_standard: { type: "result" as const, id: "result_standard", resultTemplateId: "standard" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to plan your deep work session.",
    templates: [
      {
        id: "stuck",
        cards: [
          { title: "First 15 minutes", valueTemplate: "Re-entry ritual", descriptionTemplate: "Read last notes 5 min → write next action 5 min → start ugly 5 min." },
          { title: "Session goal", valueTemplate: "One small output", descriptionTemplate: "Not \"make progress\" — one paragraph, one function, one section." },
        ],
        summaryTemplates: ["Stuck sessions need re-entry, not heroics — clarity before speed."],
      },
      {
        id: "fresh_fuzzy",
        cards: [
          { title: "First 15 minutes", valueTemplate: "Define then draft", descriptionTemplate: "Minutes 1–10: write session \"done\" in one sentence. Minutes 11–15: ugly first output." },
          { title: "Session goal", valueTemplate: "Definition + start", descriptionTemplate: "Leaving with words on screen counts as success." },
        ],
        summaryTemplates: ["Fuzzy tasks need definition inside the block — budget time for it."],
      },
      {
        id: "resume",
        cards: [
          { title: "First 15 minutes", valueTemplate: "Warm reload", descriptionTemplate: "Open exactly where you stopped → read last paragraph/code → continue without editing first." },
          { title: "Session goal", valueTemplate: "Continue thread", descriptionTemplate: "Same task, same files — no scope creep this block." },
        ],
        summaryTemplates: ["Resume sessions waste least time when you left a clear stopping note."],
      },
      {
        id: "define",
        cards: [
          { title: "First 15 minutes", valueTemplate: "Done-definition sprint", descriptionTemplate: "Write: \"In this block I will finish ___\" — must be observable. Then start." },
          { title: "Session goal", valueTemplate: "Clarity is the deliverable", descriptionTemplate: "If only definition fits today, that's the session." },
        ],
        summaryTemplates: ["No \"done\" defined means no deep work yet — define first."],
      },
      {
        id: "create",
        cards: [
          { title: "First 15 minutes", valueTemplate: "Create mode", descriptionTemplate: "No editing — generate only. Timer 15 min, quantity over quality." },
          { title: "Session goal", valueTemplate: "Volume in block", descriptionTemplate: "Edit in a later session — creation and critique don't share a block." },
        ],
        summaryTemplates: ["Creative deep work: separate create blocks from edit blocks."],
      },
      {
        id: "standard",
        cards: [
          { title: "First 15 minutes", valueTemplate: "Standard opener", descriptionTemplate: "Phone away → open task only → read goal → start timer → work." },
          { title: "Session goal", valueTemplate: "Your defined done", descriptionTemplate: "Stop when timer rings or done achieved — whichever first." },
        ],
        summaryTemplates: ["Same opener every session — ritual beats motivation."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-stuck",
      when: "scores.stuck >= 2",
      title: "Stuck session structure",
      steps: [
        "Min 1–5: read where you left off — no new research.",
        "Min 6–10: write next physical action in 10 words.",
        "Min 11–15: do that action only — ugly is fine.",
        "Remainder: continue same thread — no pivot.",
      ],
    },
    {
      id: "rec-fuzzy",
      when: "scores.fuzzy >= 2 || scores.none >= 2",
      title: "Define-done session structure",
      steps: [
        "First 10 min: \"Done looks like ___\" — one sentence, measurable.",
        "Next 5 min: gather only files needed for that done.",
        "Remainder: work toward done — stop when hit or timer ends.",
        "Last 2 min: note where to resume — shutdown snippet.",
      ],
    },
    {
      id: "rec-resume",
      when: "scores.resume >= 2",
      title: "Resume session structure",
      steps: [
        "Open same apps/files as last session — zero setup drift.",
        "Read last 2 minutes of work — rebuild context.",
        "Continue forward — no editing old work first 20 min.",
        "End: write one-line resume note for next block.",
      ],
    },
    {
      id: "rec-long",
      when: "scores.long >= 2",
      title: "Long session structure",
      steps: [
        "Min 0–15: standard opener (above).",
        "Min 45: 5-min walk — no phone.",
        "Min 90: assess — continue or shutdown with note.",
        "No email/Slack until full block ends.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Every deep work session",
      steps: [
        "Before timer: phone away, one task, done defined.",
        "First 15 min: no inbox, no research detours.",
        "Mid-block boredom: stay — embrace boredom quiz if you quit early.",
        "After: shutdown note — where to resume tomorrow.",
      ],
    },
  ],

  guidance: [
    {
      title: "Session structure",
      body: "Newport-style deep work sessions have a defined start, single task, and clear done — the first 15 minutes establish all three.",
      list: [
        "Warm-up: environment + goal review",
        "Core: uninterrupted work toward one outcome",
        "Close: resume note for next session",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Run the session you planned",
      description:
        "Reset blocks distracting apps for your full deep work session — so the first 15 minutes aren't lost to a phone check.",
    },
  },

  faq: [
    {
      question: "What should I do first in a deep work session?",
      answer:
        "Phone away, open only task files, read your \"done\" definition, start timer, then work — no inbox or research detours in the first 15 minutes.",
    },
    {
      question: "How is this different from deep work blocks?",
      answer:
        "Deep work blocks tool sizes length and frequency. This tool structures what happens inside a session you're about to start.",
    },
    {
      question: "Should I warm up before deep work?",
      answer:
        "Yes — 5–15 minutes of goal review and re-entry beats diving into email first. Warm-up is part of the block, not before it.",
    },
  ],
} satisfies Record<string, unknown>;
