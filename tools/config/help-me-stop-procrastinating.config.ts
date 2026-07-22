export const helpMeStopProcrastinatingConfig = {
  schemaVersion: "1.0" as const,
  id: "help-me-stop-procrastinating",
  slug: "help-me-stop-procrastinating",
  status: "published" as const,

  seo: {
    title: "Help Me Stop Procrastinating",
    metaDescription:
      "Need to stop procrastinating right now? Answer 4 questions and get an immediate rescue plan — free interactive help in under 60 seconds.",
    primaryKeyword: "help me stop procrastinating",
    secondaryKeywords: [
      "stop procrastinating now",
      "procrastination help",
      "can't stop procrastinating",
      "procrastination rescue",
      "get me unstuck",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/help-me-stop-procrastinating",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["procrastination", "rescue", "focus"],
    cluster: "stop-procrastinating",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Help Me Stop Procrastinating",
    intro:
      "You asked for help — that's step one. Four quick questions and you'll get a rescue plan you can run in the next 10 minutes, not someday.",
    eyebrow: "Immediate rescue",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_now",
    nodes: {
      q_now: {
        type: "question" as const,
        id: "q_now",
        prompt: "What are you procrastinating on right now?",
        input: "single-choice" as const,
        options: [
          { id: "task", label: "One specific task", score: { task: 2 }, next: "q_feel" },
          { id: "project", label: "A big project", score: { project: 3 }, next: "q_feel" },
          { id: "everything", label: "Everything on my list", score: { all: 3 }, next: "q_feel" },
        ],
      },
      q_feel: {
        type: "question" as const,
        id: "q_feel",
        prompt: "What are you doing instead?",
        input: "single-choice" as const,
        options: [
          { id: "phone", label: "Phone or scrolling", score: { phone: 3 }, next: "q_deadline" },
          { id: "busy", label: "Easier busywork", score: { busy: 3 }, next: "q_deadline" },
          { id: "nothing", label: "Nothing — staring or avoiding", score: { freeze: 2 }, next: "q_deadline" },
        ],
      },
      q_deadline: {
        type: "question" as const,
        id: "q_deadline",
        prompt: "How urgent is it?",
        input: "single-choice" as const,
        options: [
          { id: "now", label: "Due today or tomorrow", score: { urgent: 3 }, next: "branch_result" },
          { id: "soon", label: "This week", score: { soon: 2 }, next: "branch_result" },
          { id: "later", label: "No hard deadline", score: { later: 1 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.urgent >= 2 && scores.phone >= 2", next: "result_urgent_phone" },
          { when: "scores.project >= 2 || scores.all >= 2", next: "result_shrink" },
          { when: "scores.phone >= 2", next: "result_phone" },
          { when: "scores.busy >= 2", next: "result_busy" },
          { when: "scores.freeze >= 2", next: "result_freeze" },
        ],
        default: "result_start",
      },
      result_urgent_phone: { type: "result" as const, id: "result_urgent_phone", resultTemplateId: "urgent_phone" },
      result_shrink: { type: "result" as const, id: "result_shrink", resultTemplateId: "shrink" },
      result_phone: { type: "result" as const, id: "result_phone", resultTemplateId: "phone" },
      result_busy: { type: "result" as const, id: "result_busy", resultTemplateId: "busy" },
      result_freeze: { type: "result" as const, id: "result_freeze", resultTemplateId: "freeze" },
      result_start: { type: "result" as const, id: "result_start", resultTemplateId: "start" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your procrastination rescue plan.",
    templates: [
      { id: "urgent_phone", cards: [{ title: "Rescue mode", valueTemplate: "Emergency 25", descriptionTemplate: "Phone gone. One task. Timer 25 minutes. Due soon — no perfection." }], summaryTemplates: ["Ship something rough beats shipping nothing."] },
      { id: "shrink", cards: [{ title: "Rescue mode", valueTemplate: "Shrink to 2 minutes", descriptionTemplate: "Big project? Do one micro-action only — open file, one line, one call." }], summaryTemplates: ["You can't finish today — you can start today."] },
      { id: "phone", cards: [{ title: "Rescue mode", valueTemplate: "Phone lockdown", descriptionTemplate: "Another room. Block apps. 25-minute single-task sprint." }], summaryTemplates: ["The scroll can wait — this can't."] },
      { id: "busy", cards: [{ title: "Rescue mode", valueTemplate: "Stop fake work", descriptionTemplate: "Close email. Name the real task. Do it first for 20 minutes." }], summaryTemplates: ["Busy isn't progress — one hard thing is."] },
      { id: "freeze", cards: [{ title: "Rescue mode", valueTemplate: "Physical start", descriptionTemplate: "Stand up. Write one verb on paper. Do that action 5 minutes." }], summaryTemplates: ["Motion unfreezes — thinking keeps you stuck."] },
      { id: "start", cards: [{ title: "Rescue mode", valueTemplate: "5-minute rule", descriptionTemplate: "Commit to 5 minutes only — timer visible, full permission to stop." }], summaryTemplates: ["Starting is the whole battle today."] },
    ],
  },

  recommendations: [
    { id: "rec-urgent", when: "scores.urgent >= 2", title: "Do this in the next 10 minutes", steps: ["Phone off or in another room.", "Open the task — write \"done enough\" definition in one sentence.", "Timer 25 min — ugly progress only.", "Send/submit partial if deadline hits — iterate later."] },
    { id: "rec-shrink", when: "scores.project >= 2 || scores.all >= 2", title: "Do this in the next 10 minutes", steps: ["List everything — hide the list.", "Circle ONE next physical action.", "Do it 5 minutes.", "Stop — you broke the freeze."] },
    { id: "rec-phone", when: "scores.phone >= 2", title: "Do this in the next 10 minutes", steps: ["Enable app limits or hand phone to someone.", "Close all tabs except task.", "25-minute timer — no unlocks.", "Reward after: bounded break, not open scroll."] },
    { id: "rec-busy", when: "scores.busy >= 2", title: "Do this in the next 10 minutes", steps: ["Write the avoided task at top of paper.", "Do it before checking email again.", "Batch busywork after — not before.", "Tell someone what you'll finish by when."] },
    { id: "rec-freeze", when: "scores.freeze >= 2", title: "Do this in the next 10 minutes", steps: ["Change location — different chair or room.", "Say task out loud.", "Do the smallest physical step.", "If still frozen, walk 5 min and retry once."] },
    { id: "rec-start", when: "true", title: "Do this in the next 10 minutes", steps: ["5-minute timer — start now.", "No prep, no organizing desk.", "When timer ends, choose: continue or stop guilt-free.", "Schedule next 5-minute block tomorrow same time."] },
  ],

  guidance: [],
  ctas: { app: { title: "Stop the escape routes", description: "Reset blocks the apps you use to procrastinate during focus sessions — so help actually means doing the thing." } },
  faq: [
    { question: "How is this different from \"How to stop procrastinating\"?", answer: "That tool maps long-term patterns. This one is a right-now rescue — what to do in the next 10 minutes." },
    { question: "What if I procrastinate again tomorrow?", answer: "Normal. Use this rescue again, then read your pattern with the \"Why do I procrastinate?\" tool when calm." },
    { question: "Does guilt help stop procrastinating?", answer: "Rarely — shame often triggers more avoidance. Action in tiny steps beats self-criticism." },
  ],
} satisfies Record<string, unknown>;
