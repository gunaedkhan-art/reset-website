export const helpMeFocusNowConfig = {
  schemaVersion: "1.0" as const,
  id: "help-me-focus-now",
  slug: "help-me-focus-now",
  status: "published" as const,

  seo: {
    title: "Help Me Focus Now",
    metaDescription:
      "Need to focus right now? Answer 4 questions and get an immediate focus protocol — free rescue plan in under 60 seconds.",
    primaryKeyword: "help me focus now",
    secondaryKeywords: [
      "focus now",
      "need to focus immediately",
      "can't focus help",
      "focus right now",
      "emergency focus",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/help-me-focus-now",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["focus", "deep-work", "rescue"],
    cluster: "focus-problems",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Help Me Focus Now",
    intro:
      "No time for a life overhaul — you need focus in the next 25 minutes. Four questions, then a protocol you can run immediately.",
    eyebrow: "Focus protocol",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_task",
    nodes: {
      q_task: {
        type: "question" as const,
        id: "q_task",
        prompt: "Do you know exactly what to work on?",
        input: "single-choice" as const,
        options: [
          { id: "yes", label: "Yes — task is clear", score: { clear: 2 }, next: "q_blocker" },
          { id: "vague", label: "Vaguely — need to pick", score: { vague: 3 }, next: "q_blocker" },
          { id: "no", label: "No — I'm just panicking", score: { panic: 3 }, next: "q_blocker" },
        ],
      },
      q_blocker: {
        type: "question" as const,
        id: "q_blocker",
        prompt: "Biggest focus killer right now?",
        input: "single-choice" as const,
        options: [
          { id: "phone", label: "Phone / notifications", score: { phone: 3 }, next: "q_time" },
          { id: "tabs", label: "Too many tabs / apps", score: { tabs: 3 }, next: "q_time" },
          { id: "mind", label: "Racing thoughts", score: { mind: 3 }, next: "q_time" },
          { id: "tired", label: "Sleepy or foggy", score: { tired: 3 }, next: "q_time" },
        ],
      },
      q_time: {
        type: "question" as const,
        id: "q_time",
        prompt: "How long do you need to focus?",
        input: "single-choice" as const,
        options: [
          { id: "short", label: "15–25 minutes", score: { sprint: 2 }, next: "branch_result" },
          { id: "medium", label: "45–60 minutes", score: { block: 2 }, next: "branch_result" },
          { id: "long", label: "90+ minutes", score: { deep: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.phone >= 2", next: "result_phone" },
          { when: "scores.mind >= 2 || scores.panic >= 2", next: "result_mind" },
          { when: "scores.tired >= 2", next: "result_tired" },
          { when: "scores.vague >= 2", next: "result_clarity" },
          { when: "scores.tabs >= 2", next: "result_tabs" },
        ],
        default: "result_sprint",
      },
      result_phone: { type: "result" as const, id: "result_phone", resultTemplateId: "phone" },
      result_mind: { type: "result" as const, id: "result_mind", resultTemplateId: "mind" },
      result_tired: { type: "result" as const, id: "result_tired", resultTemplateId: "tired" },
      result_clarity: { type: "result" as const, id: "result_clarity", resultTemplateId: "clarity" },
      result_tabs: { type: "result" as const, id: "result_tabs", resultTemplateId: "tabs" },
      result_sprint: { type: "result" as const, id: "result_sprint", resultTemplateId: "sprint" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your focus protocol.",
    templates: [
      { id: "phone", cards: [{ title: "Focus protocol", valueTemplate: "Phone exile + sprint", descriptionTemplate: "Phone in another room. Do Not Disturb. One task. Timer on." }], summaryTemplates: ["No exceptions until timer ends."] },
      { id: "mind", cards: [{ title: "Focus protocol", valueTemplate: "Brain dump + single task", descriptionTemplate: "2-min worry list, then one sentence task, then 25-min timer." }], summaryTemplates: ["Externalize noise — don't negotiate with it."] },
      { id: "tired", cards: [{ title: "Focus protocol", valueTemplate: "Activate then sprint", descriptionTemplate: "Cold water, 3-min walk, then 15-min easy-start timer." }], summaryTemplates: ["Don't force 90 min when depleted — sprint first."] },
      { id: "clarity", cards: [{ title: "Focus protocol", valueTemplate: "Clarity first", descriptionTemplate: "Write one outcome + one next action in 10 words. Then timer." }], summaryTemplates: ["Unclear tasks can't hold focus — define, then do."] },
      { id: "tabs", cards: [{ title: "Focus protocol", valueTemplate: "One-tab rule", descriptionTemplate: "Close everything except one window. Full screen. Timer." }], summaryTemplates: ["Tab bankruptcy is allowed — bookmarks exist."] },
      { id: "sprint", cards: [{ title: "Focus protocol", valueTemplate: "Standard sprint", descriptionTemplate: "25 min work, 5 min break. Phone away. Task written visible." }], summaryTemplates: ["Repeat sprint up to 4 cycles — then long break."] },
    ],
  },

  recommendations: [
    { id: "rec-phone", when: "scores.phone >= 2", title: "Run this now", steps: ["Stand up — walk phone to another room.", "Enable DND / focus mode.", "Write task on sticky note at monitor.", "Timer 25 min — start before you feel ready."] },
    { id: "rec-mind", when: "scores.mind >= 2 || scores.panic >= 2", title: "Run this now", steps: ["Paper — dump every thought 2 minutes.", "Circle task-related items only.", "One next action — verbalize it.", "Timer 25 — return worries to paper if they return."] },
    { id: "rec-tired", when: "scores.tired >= 2", title: "Run this now", steps: ["Splash cold water on face.", "Walk 3 minutes — outside if possible.", "Easiest part of task only — 15 min timer.", "Reassess — continue or nap 20 min."] },
    { id: "rec-clarity", when: "scores.vague >= 2", title: "Run this now", steps: ["Finish: \"When timer ends, I will have ___.\"", "Must be observable — sent email, 1 page read, etc.", "If still vague, shrink until it is.", "Timer starts only after sentence is written."] },
    { id: "rec-tabs", when: "scores.tabs >= 2", title: "Run this now", steps: ["Bookmark open tabs if needed — close all.", "Open ONE file or site.", "Full screen mode.", "25-min timer — no new tabs."] },
    { id: "rec-sprint", when: "true", title: "Run this now", steps: ["Phone away.", "Task written.", "25-min timer.", "5-min break — walk, no phone.", "Repeat if needed."] },
  ],

  guidance: [],
  ctas: { app: { title: "Focus mode that sticks", description: "Reset enforces focus blocks automatically — so \"focus now\" doesn't depend on remembering to silence your phone." } },
  faq: [
    { question: "How is this different from \"I can't focus\"?", answer: "\"I can't focus\" diagnoses patterns. This tool is a protocol — steps to run in the next 5 minutes." },
    { question: "What if I break focus mid-sprint?", answer: "Note what interrupted you. Reset timer or subtract elapsed — don't abandon. One break isn't failure." },
    { question: "Can I use this multiple times a day?", answer: "Yes — standard Pomodoro cadence is 4–8 sprints. Rest between deep blocks." },
  ],
} satisfies Record<string, unknown>;
