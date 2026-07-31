export const whyAmIProcrastinatingConfig = {
  schemaVersion: "1.0" as const,
  id: "why-am-i-procrastinating",
  slug: "why-am-i-procrastinating",
  status: "published" as const,

  seo: {
    title: "Why Am I Procrastinating?",
    metaDescription:
      "Why am I procrastinating on this? Answer 4 questions to find the real reason and get a fix matched to your trigger — free diagnostic in 60 seconds.",
    primaryKeyword: "why am i procrastinating",
    secondaryKeywords: [
      "why do i procrastinate",
      "reasons i procrastinate",
      "why am i avoiding work",
      "procrastination reasons",
      "what causes my procrastination",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/why-am-i-procrastinating",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["procrastination", "diagnostic", "self-awareness"],
    cluster: "procrastination",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Why Am I Procrastinating?",
    intro:
      "You're not lazy — there's usually a reason procrastination wins. Four questions to name yours and change the approach, not just try harder.",
    icon: "clock",
    proseTitle: "About this diagnostic",
    sections: [
      {
        id: "problem",
        heading: "When trying harder doesn't work",
        framework: "pas",
        body: "You care about the goal but still avoid starting. Guilt piles on, which makes the task feel heavier — and the cycle repeats. Willpower alone rarely fixes an emotional or environmental blocker.",
      },
      {
        id: "concept",
        heading: "Procrastination is usually a signal",
        framework: "concept",
        body: "Research on task avoidance shows delay is often driven by fear, overwhelm, unclear next steps, low energy, or habit — not character flaws. Match the fix to the trigger and progress becomes possible again.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A named reason you're delaying — fear, overwhelm, fatigue, boredom, unclear start, habit, or skill gap — plus a matched action plan for that specific trigger.",
      },
    ],
    eyebrow: "Reason finder",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_task",
    nodes: {
      q_task: {
        type: "question" as const,
        id: "q_task",
        prompt: "What are you putting off?",
        input: "single-choice" as const,
        options: [
          { id: "hard", label: "Something difficult or unfamiliar", score: { hard: 3 }, next: "q_emotion" },
          { id: "boring", label: "Something boring but necessary", score: { boring: 3 }, next: "q_emotion" },
          { id: "important", label: "Something high-stakes", score: { stakes: 3 }, next: "q_emotion" },
          { id: "unclear", label: "I'm not sure what to do", score: { unclear: 3 }, next: "q_emotion" },
        ],
      },
      q_emotion: {
        type: "question" as const,
        id: "q_emotion",
        prompt: "When you think about starting, you feel…",
        input: "single-choice" as const,
        options: [
          { id: "anxious", label: "Anxious or pressured", score: { anxiety: 3 }, next: "q_body" },
          { id: "overwhelmed", label: "Overwhelmed — too much", score: { overwhelm: 3 }, next: "q_body" },
          { id: "flat", label: "Flat — zero interest", score: { flat: 3 }, next: "q_body" },
          { id: "fine", label: "Fine — I just drift to other things", score: { habit: 2 }, next: "q_body" },
        ],
      },
      q_body: {
        type: "question" as const,
        id: "q_body",
        prompt: "How's your physical state?",
        input: "single-choice" as const,
        options: [
          { id: "tired", label: "Tired or sleep-deprived", score: { tired: 3 }, next: "branch_result" },
          { id: "ok", label: "OK", score: { ok: 0 }, next: "branch_result" },
          { id: "wired", label: "Wired / can't sit still", score: { wired: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.anxiety >= 2 || scores.stakes >= 2", next: "result_fear" },
          { when: "scores.overwhelm >= 2", next: "result_overwhelm" },
          { when: "scores.tired >= 2", next: "result_tired" },
          { when: "scores.boring >= 2 || scores.flat >= 2", next: "result_boring" },
          { when: "scores.unclear >= 2", next: "result_unclear" },
          { when: "scores.habit >= 2", next: "result_habit" },
        ],
        default: "result_hard",
      },
      result_fear: { type: "result" as const, id: "result_fear", resultTemplateId: "fear" },
      result_overwhelm: { type: "result" as const, id: "result_overwhelm", resultTemplateId: "overwhelm" },
      result_tired: { type: "result" as const, id: "result_tired", resultTemplateId: "tired" },
      result_boring: { type: "result" as const, id: "result_boring", resultTemplateId: "boring" },
      result_unclear: { type: "result" as const, id: "result_unclear", resultTemplateId: "unclear" },
      result_habit: { type: "result" as const, id: "result_habit", resultTemplateId: "habit" },
      result_hard: { type: "result" as const, id: "result_hard", resultTemplateId: "hard" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to learn why you're procrastinating.",
    templates: [
      { id: "fear", cards: [{ title: "Why you're delaying", valueTemplate: "Fear of judgment", descriptionTemplate: "Starting makes failure or criticism feel possible — avoidance feels safer." }], summaryTemplates: ["Fix: lower stakes with a deliberately rough first draft."] },
      { id: "overwhelm", cards: [{ title: "Why you're delaying", valueTemplate: "Task overload", descriptionTemplate: "The whole project is in your head at once — your brain opts out." }], summaryTemplates: ["Fix: one 2-minute physical next step only."] },
      { id: "tired", cards: [{ title: "Why you're delaying", valueTemplate: "Low energy", descriptionTemplate: "Willpower needs fuel — tired brains procrastinate by default." }], summaryTemplates: ["Fix: rest or move first; schedule hard work at peak energy."] },
      { id: "boring", cards: [{ title: "Why you're delaying", valueTemplate: "No reward signal", descriptionTemplate: "The task doesn't engage you — easier stimulation wins." }], summaryTemplates: ["Fix: artificial deadline + reward after 20 focused minutes."] },
      { id: "unclear", cards: [{ title: "Why you're delaying", valueTemplate: "Unclear start", descriptionTemplate: "You can't act because the next step isn't defined." }], summaryTemplates: ["Fix: write the next action in 10 words or fewer."] },
      { id: "habit", cards: [{ title: "Why you're delaying", valueTemplate: "Default drift", descriptionTemplate: "Procrastination is the habit — phone or busywork is the path of least resistance." }], summaryTemplates: ["Fix: change environment before relying on motivation."] },
      { id: "hard", cards: [{ title: "Why you're delaying", valueTemplate: "Skill gap anxiety", descriptionTemplate: "The task feels beyond current ability — you wait to feel ready." }], summaryTemplates: ["Fix: learn one micro-skill or ask one specific question, then start."] },
    ],
  },

  recommendations: [
    { id: "rec-fear", when: "scores.anxiety >= 2 || scores.stakes >= 2", title: "What to do about it", steps: ["Define \"good enough\" in one sentence.", "10-minute ugly start — share with no one.", "Separate draft from final — drafts are allowed to be bad.", "If anxiety is severe, consider support from a professional."] },
    { id: "rec-overwhelm", when: "scores.overwhelm >= 2", title: "What to do about it", steps: ["Brain-dump all pieces — hide list.", "One circle: smallest high-impact piece.", "2-minute action on that piece only.", "Defer everything else visibly — out of sight."] },
    { id: "rec-tired", when: "scores.tired >= 2", title: "What to do about it", steps: ["Don't force hard work tonight if possible.", "Sleep, food, short walk first.", "Schedule task in tomorrow's peak window.", "Do admin-only if you must work now."] },
    { id: "rec-boring", when: "scores.boring >= 2 || scores.flat >= 2", title: "What to do about it", steps: ["Pair task with reward after 20 min.", "Change location — library, café, standing desk.", "Body double or focus music.", "Fake deadline to someone else."] },
    { id: "rec-unclear", when: "scores.unclear >= 2", title: "What to do about it", steps: ["Ask: what's the next physical action?", "Google one example of someone starting similar task.", "15-min research cap — then act on best guess.", "Clarity follows action more often than the reverse."] },
    { id: "rec-habit", when: "scores.habit >= 2", title: "What to do about it", steps: ["Phone in another room before work block.", "Same start cue daily — time + place.", "Track \"started\" not \"finished\" for 2 weeks.", "Use Reset to block default drift apps."] },
    { id: "rec-hard", when: "scores.hard >= 2", title: "What to do about it", steps: ["Identify one sub-skill you lack — learn 15 min.", "Ask expert one question — email, forum, colleague.", "Do a \"practice version\" with no stakes.", "Start before you feel ready — readiness is a myth."] },
  ],

  guidance: [],
  ctas: { app: { title: "Act on the reason, not the guilt", description: "Reset removes the default escape routes once you know why you're procrastinating — so the fix has room to work." } },
  faq: [
    { question: "Why am I procrastinating if I care about the goal?", answer: "Caring increases stakes — fear and perfectionism rise. Emotional avoidance, not lack of care, drives delay." },
    { question: "Is procrastination always emotional?", answer: "Often yes — fear, overwhelm, boredom, fatigue. Sometimes it's unclear tasks or bad environment. Rarely laziness." },
    { question: "How is this different from \"Why do I procrastinate?\"", answer: "Same family of tools — this one uses \"am I\" framing and focuses on the current task's emotional trigger." },
  ],
} satisfies Record<string, unknown>;
