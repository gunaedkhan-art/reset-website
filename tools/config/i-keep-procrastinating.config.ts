export const iKeepProcrastinatingConfig = {
  schemaVersion: "1.0" as const,
  id: "i-keep-procrastinating",
  slug: "i-keep-procrastinating",
  status: "published" as const,

  seo: {
    title: "I Keep Procrastinating",
    metaDescription:
      "Keep putting things off? Answer 4 questions and get a rescue plan matched to why you delay — free tool, personalized steps in under 60 seconds.",
    primaryKeyword: "i keep procrastinating",
    secondaryKeywords: [
      "keep procrastinating",
      "always procrastinating",
      "why do i keep putting things off",
      "chronic procrastination",
      "can't stop procrastinating",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/i-keep-procrastinating",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["procrastination", "habits", "motivation"],
    cluster: "stop-procrastinating",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "I Keep Procrastinating",
    intro:
      "If procrastination keeps winning, the pattern is repeating for a reason. Four questions to break the loop — not just today's task, but the habit.",
    eyebrow: "Pattern breaker",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_repeat",
    nodes: {
      q_repeat: {
        type: "question" as const,
        id: "q_repeat",
        prompt: "What do you procrastinate on most?",
        input: "single-choice" as const,
        options: [
          { id: "work", label: "Work and responsibilities", score: { work: 2 }, next: "q_when" },
          { id: "health", label: "Health, admin, or life tasks", score: { life: 2 }, next: "q_when" },
          { id: "everything", label: "Almost everything", score: { chronic: 3 }, next: "q_when" },
          { id: "important", label: "Things I actually care about", score: { paradox: 3 }, next: "q_when" },
        ],
      },
      q_when: {
        type: "question" as const,
        id: "q_when",
        prompt: "When does procrastination usually win?",
        input: "single-choice" as const,
        options: [
          { id: "start", label: "At the start — I never begin", score: { start: 3 }, next: "q_instead" },
          { id: "middle", label: "In the middle — I stall halfway", score: { middle: 2 }, next: "q_instead" },
          { id: "deadline", label: "Until the last minute", score: { deadline: 3 }, next: "q_instead" },
          { id: "avoid", label: "I avoid until it's too late", score: { avoid: 3 }, next: "q_instead" },
        ],
      },
      q_instead: {
        type: "question" as const,
        id: "q_instead",
        prompt: "What do you do instead?",
        input: "single-choice" as const,
        options: [
          { id: "phone", label: "Phone, social, or videos", score: { phone: 3 }, next: "q_tried" },
          { id: "busy", label: "Easier tasks that feel productive", score: { busywork: 3 }, next: "q_tried" },
          { id: "nothing", label: "Nothing — I freeze or nap", score: { freeze: 2 }, next: "q_tried" },
          { id: "plan", label: "More planning and organizing", score: { planning: 3 }, next: "q_tried" },
        ],
      },
      q_tried: {
        type: "question" as const,
        id: "q_tried",
        prompt: "What have you already tried?",
        input: "single-choice" as const,
        options: [
          { id: "willpower", label: "Willpower and guilt — doesn't stick", score: { willpower: 2 }, next: "branch_result" },
          { id: "lists", label: "To-do lists and planners", score: { lists: 1 }, next: "branch_result" },
          { id: "nothing", label: "Not much — I just feel bad", score: { shame: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.deadline >= 2 || scores.avoid >= 2", next: "result_deadline" },
          { when: "scores.phone >= 2", next: "result_phone" },
          { when: "scores.planning >= 2 || scores.busywork >= 2", next: "result_fake" },
          { when: "scores.paradox >= 2 || scores.start >= 2", next: "result_start" },
          { when: "scores.chronic >= 2", next: "result_chronic" },
        ],
        default: "result_loop",
      },
      result_deadline: { type: "result" as const, id: "result_deadline", resultTemplateId: "deadline" },
      result_phone: { type: "result" as const, id: "result_phone", resultTemplateId: "phone" },
      result_fake: { type: "result" as const, id: "result_fake", resultTemplateId: "fake" },
      result_start: { type: "result" as const, id: "result_start", resultTemplateId: "start" },
      result_chronic: { type: "result" as const, id: "result_chronic", resultTemplateId: "chronic" },
      result_loop: { type: "result" as const, id: "result_loop", resultTemplateId: "loop" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to break your procrastination loop.",
    templates: [
      { id: "deadline", cards: [{ title: "Your loop", valueTemplate: "Deadline adrenaline", descriptionTemplate: "You only move when panic overrides avoidance." }], summaryTemplates: ["Your plan creates artificial deadlines before the real one."] },
      { id: "phone", cards: [{ title: "Your loop", valueTemplate: "Escape to screen", descriptionTemplate: "Discomfort → phone → guilt → repeat." }], summaryTemplates: ["Your plan removes the escape route during work blocks."] },
      { id: "fake", cards: [{ title: "Your loop", valueTemplate: "Productive procrastination", descriptionTemplate: "Busy work feels like progress — important work waits." }], summaryTemplates: ["Your plan ranks tasks by impact, not ease."] },
      { id: "start", cards: [{ title: "Your loop", valueTemplate: "Start barrier", descriptionTemplate: "The gap between intention and action never closes." }], summaryTemplates: ["Your plan makes starting smaller than avoiding."] },
      { id: "chronic", cards: [{ title: "Your loop", valueTemplate: "Chronic delay", descriptionTemplate: "Procrastination is your default — not an exception." }], summaryTemplates: ["Your plan builds a daily start ritual and environment fix."] },
      { id: "loop", cards: [{ title: "Your loop", valueTemplate: "Repeat pattern", descriptionTemplate: "Same delay, different tasks — the trigger is consistent." }], summaryTemplates: ["Your plan identifies the trigger and replaces the routine."] },
    ],
  },

  recommendations: [
    { id: "rec-deadline", when: "scores.deadline >= 2 || scores.avoid >= 2", title: "Your early-deadline plan", steps: ["Set a personal deadline 48 hours before the real one.", "Tell someone you'll send a draft by your date.", "Work in 25-minute blocks — start before you feel ready.", "Track \"started before panic\" as a weekly win."] },
    { id: "rec-phone", when: "scores.phone >= 2", title: "Your no-escape plan", steps: ["Phone in another room during work blocks.", "Block distracting apps 9am–5pm.", "When urge hits: 60-second wait, then ask \"what am I avoiding?\"", "Log one procrastination trigger per day — patterns emerge fast."] },
    { id: "rec-fake", when: "scores.planning >= 2 || scores.busywork >= 2", title: "Your impact-first plan", steps: ["Each morning: one \"important uncomfortable\" task before email.", "No organizing until that task gets 25 minutes.", "Label tasks: Impact vs Comfort — do one Impact first.", "End day naming the important thing you moved."] },
    { id: "rec-start", when: "scores.paradox >= 2 || scores.start >= 2", title: "Your micro-start plan", steps: ["2-minute rule: if it takes less than 2 minutes, do it now.", "For bigger tasks: open the file and write one bad line.", "Pair start with same cue daily — same time, same drink, same seat.", "Never break the chain two days in a row."] },
    { id: "rec-chronic", when: "scores.chronic >= 2", title: "Your system reset plan", steps: ["Same 15-minute \"activation\" ritual every workday.", "Review sleep — chronic delay often means chronic tiredness.", "One accountability partner — daily \"started yes/no\" text.", "Consider professional support if delay affects income or health."] },
    { id: "rec-loop", when: "true", title: "Your trigger swap plan", steps: ["Note what happened right before you procrastinated today.", "Design a replacement: stand up, 3 breaths, open task.", "Reduce friction to start — file open, doc titled, tab ready.", "Repeat the replacement 7 days — habits need repetition."] },
  ],

  guidance: [],
  ctas: { app: { title: "Break the loop for good", description: "Reset blocks the escape routes — feeds, games, endless tabs — so procrastination can't always win the easy fight." } },
  faq: [
    { question: "Why do I keep procrastinating on important things?", answer: "Important tasks carry more emotional weight — fear, perfectionism, or unclear steps. The brain chooses short-term relief. Fix the trigger, not just the task." },
    { question: "Is chronic procrastination a disorder?", answer: "Occasional delay is normal. If it severely affects work, relationships, or health, talk to a professional — ADHD and anxiety can show up as chronic procrastination." },
    { question: "How is this different from other procrastination tools?", answer: "This tool focuses on the repeating loop — when, what you do instead, and what you've tried — not a one-time rescue." },
  ],
} satisfies Record<string, unknown>;
