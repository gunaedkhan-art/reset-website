export const iCantStickToHabitsConfig = {
  schemaVersion: "1.0" as const,
  id: "i-cant-stick-to-habits",
  slug: "i-cant-stick-to-habits",
  status: "published" as const,

  seo: {
    title: "I Can't Stick to Habits",
    metaDescription:
      "Habits keep breaking? Answer 4 questions to find why your routines fail and get a plan that actually sticks — free tool in under 60 seconds.",
    primaryKeyword: "i can't stick to habits",
    secondaryKeywords: [
      "can't stick to habits",
      "habits don't stick",
      "why can't i keep habits",
      "build habits that last",
      "habit failure",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/i-cant-stick-to-habits",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["habits", "routines", "consistency"],
    cluster: "habits",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "I Can't Stick to Habits",
    intro:
      "If habits keep dying after a week, the design is wrong — not you. Four questions to find the failure point and rebuild something that lasts.",
    eyebrow: "Habit diagnostic",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_habit",
    nodes: {
      q_habit: {
        type: "question" as const,
        id: "q_habit",
        prompt: "What habit keeps failing?",
        input: "single-choice" as const,
        options: [
          { id: "health", label: "Exercise, diet, or sleep", score: { health: 2 }, next: "q_fail" },
          { id: "productivity", label: "Morning routine or deep work", score: { productivity: 2 }, next: "q_fail" },
          { id: "digital", label: "Less phone or social media", score: { digital: 2 }, next: "q_fail" },
          { id: "many", label: "I try many — none stick", score: { many: 3 }, next: "q_fail" },
        ],
      },
      q_fail: {
        type: "question" as const,
        id: "q_fail",
        prompt: "When does the habit usually break?",
        input: "single-choice" as const,
        options: [
          { id: "days", label: "After a few days", score: { early: 3 }, next: "q_why" },
          { id: "weeks", label: "After 1–2 weeks", score: { mid: 2 }, next: "q_why" },
          { id: "disrupt", label: "When life gets busy or travel hits", score: { disrupt: 3 }, next: "q_why" },
          { id: "never", label: "I rarely get started at all", score: { start: 3 }, next: "q_why" },
        ],
      },
      q_why: {
        type: "question" as const,
        id: "q_why",
        prompt: "What usually kills it?",
        input: "single-choice" as const,
        options: [
          { id: "big", label: "I aimed too big — couldn't sustain", score: { big: 3 }, next: "q_track" },
          { id: "forget", label: "I forget — no cue or reminder", score: { cue: 3 }, next: "q_track" },
          { id: "motivation", label: "Motivation fades", score: { motivation: 3 }, next: "q_track" },
          { id: "environment", label: "Environment works against me", score: { environment: 3 }, next: "q_track" },
        ],
      },
      q_track: {
        type: "question" as const,
        id: "q_track",
        prompt: "Do you track or review the habit?",
        input: "single-choice" as const,
        options: [
          { id: "no", label: "No tracking — wing it", score: { notrack: 2 }, next: "branch_result" },
          { id: "yes", label: "Yes — but I ignore the data", score: { ignore: 1 }, next: "branch_result" },
          { id: "sometimes", label: "Sometimes when motivated", score: { sporadic: 1 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.big >= 2 || scores.early >= 2", next: "result_big" },
          { when: "scores.cue >= 2 || scores.start >= 2", next: "result_cue" },
          { when: "scores.motivation >= 2", next: "result_motivation" },
          { when: "scores.environment >= 2 || scores.digital >= 2", next: "result_environment" },
          { when: "scores.disrupt >= 2", next: "result_disrupt" },
          { when: "scores.many >= 2", next: "result_many" },
        ],
        default: "result_system",
      },
      result_big: { type: "result" as const, id: "result_big", resultTemplateId: "big" },
      result_cue: { type: "result" as const, id: "result_cue", resultTemplateId: "cue" },
      result_motivation: { type: "result" as const, id: "result_motivation", resultTemplateId: "motivation" },
      result_environment: { type: "result" as const, id: "result_environment", resultTemplateId: "environment" },
      result_disrupt: { type: "result" as const, id: "result_disrupt", resultTemplateId: "disrupt" },
      result_many: { type: "result" as const, id: "result_many", resultTemplateId: "many" },
      result_system: { type: "result" as const, id: "result_system", resultTemplateId: "system" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to fix your habit design.",
    templates: [
      { id: "big", cards: [{ title: "Failure point", valueTemplate: "Too ambitious", descriptionTemplate: "The habit was sized for motivation, not maintenance." }], summaryTemplates: ["Your plan shrinks the habit until it's embarrassingly easy."] },
      { id: "cue", cards: [{ title: "Failure point", valueTemplate: "Missing cue", descriptionTemplate: "No trigger — the habit relies on remembering." }], summaryTemplates: ["Your plan anchors the habit to an existing daily action."] },
      { id: "motivation", cards: [{ title: "Failure point", valueTemplate: "Motivation-dependent", descriptionTemplate: "You only do it when inspired — inspiration is inconsistent." }], summaryTemplates: ["Your plan uses identity and streaks, not feelings."] },
      { id: "environment", cards: [{ title: "Failure point", valueTemplate: "Environment mismatch", descriptionTemplate: "Your space or tools fight the habit." }], summaryTemplates: ["Your plan redesigns friction — make good easy, bad hard."] },
      { id: "disrupt", cards: [{ title: "Failure point", valueTemplate: "No disruption plan", descriptionTemplate: "Travel and chaos reset you to zero." }], summaryTemplates: ["Your plan defines a \"minimum viable habit\" for bad days."] },
      { id: "many", cards: [{ title: "Failure point", valueTemplate: "Habit overload", descriptionTemplate: "Too many new habits at once — none get reps." }], summaryTemplates: ["Your plan: one habit only for 30 days."] },
      { id: "system", cards: [{ title: "Failure point", valueTemplate: "No review loop", descriptionTemplate: "You don't inspect what's breaking — so it repeats." }], summaryTemplates: ["Your plan adds weekly review and one adjustment."] },
    ],
  },

  recommendations: [
    { id: "rec-big", when: "scores.big >= 2 || scores.early >= 2", title: "Your tiny habit plan", steps: ["Cut habit to 2 minutes or less — e.g. 1 push-up, 1 page, 1 minute meditate.", "Success metric: show up, not performance.", "Add volume only after 14 consecutive days.", "Never miss twice — one skip OK, two starts the death spiral."] },
    { id: "rec-cue", when: "scores.cue >= 2 || scores.start >= 2", title: "Your anchor plan", steps: ["Pick existing cue: after coffee, after brushing teeth, after closing laptop.", "Link: \"After [cue], I will [tiny habit].\"", "Visual reminder at cue location — sticky note or object.", "Same time and place for 21 days minimum."] },
    { id: "rec-motivation", when: "scores.motivation >= 2", title: "Your identity plan", steps: ["Say: \"I'm someone who ___\" — not \"I want to ___.\"", "Track streak on calendar — X marks only, no perfection.", "Partner or public commitment — daily check-in one word.", "Do it on worst days at minimum dose — identity is built there."] },
    { id: "rec-environment", when: "scores.environment >= 2 || scores.digital >= 2", title: "Your friction plan", steps: ["Make habit path obvious: gym clothes out, book on pillow, app limits set.", "Make bad alternatives harder: log out, hide apps, move TV remote.", "Change one environmental variable this week.", "Use Reset for digital habits — automation beats willpower."] },
    { id: "rec-disrupt", when: "scores.disrupt >= 2", title: "Your minimum plan", steps: ["Define travel/busy version: 20% of normal habit counts as win.", "Never zero — one rep maintains the identity.", "Pack trigger objects: bands, book, headphones.", "Resume full version within 48 hours of return — no \"Monday fresh start.\""] },
    { id: "rec-many", when: "scores.many >= 2", title: "Your one-habit plan", steps: ["Pick ONE habit — pause all others for 30 days.", "Write why this one matters most right now.", "Daily checkbox only — no complex tracking.", "After 30 days, add habit #2 at tiny dose."] },
    { id: "rec-system", when: "true", title: "Your review plan", steps: ["Sunday 5 minutes: Did I do it? What broke it?", "Change one variable — cue, size, or environment.", "Celebrate streaks — loss aversion helps.", "If failed 3 weeks, redesign — don't retry same broken plan."] },
  ],

  guidance: [],
  ctas: {
    app: {
      title: "Habits that survive bad days",
      description:
        "Reset automates digital habit boundaries — limits, blocks, and focus sessions — so the environment supports you when motivation doesn't.",
    },
  },

  faq: [
    {
      question: "How long until a habit sticks?",
      answer:
        "Simple habits often need 4–8 weeks of repetition — complex ones longer. Consistency at tiny scale beats intense bursts that burn out.",
    },
    {
      question: "What if I miss a day?",
      answer:
        "One miss is normal. Two in a row rewires the old pattern — never miss twice. Do the minimum version on hard days.",
    },
    {
      question: "Should I use habit tracker apps?",
      answer:
        "Only if you'll look at them. A calendar X or one checkbox often beats a complex app you abandon in a week.",
    },
  ],
} satisfies Record<string, unknown>;
