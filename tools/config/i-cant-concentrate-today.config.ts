export const iCantConcentrateTodayConfig = {
  schemaVersion: "1.0" as const,
  id: "i-cant-concentrate-today",
  slug: "i-cant-concentrate-today",
  status: "published" as const,

  seo: {
    title: "I Can't Concentrate Today",
    metaDescription:
      "Can't concentrate today? Answer 4 questions to find out why and get a same-day fix — free tool with practical steps in under 60 seconds.",
    primaryKeyword: "i can't concentrate today",
    secondaryKeywords: [
      "can't concentrate today",
      "can't focus today",
      "brain fog today",
      "trouble concentrating",
      "concentration problems today",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/i-cant-concentrate-today",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["concentration", "brain-fog", "today"],
    cluster: "focus-problems",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "I Can't Concentrate Today",
    intro:
      "Four questions to find today's blocker and a realistic same-day plan — not \"try harder,\" but fix what's actually wrong.",
    icon: "brain",
    proseTitle: "About today's concentration",
    sections: [
      {
        id: "problem",
        heading: "When today is off",
        framework: "pas",
        body: "Some days your brain simply won't cooperate — fog, anxiety, poor sleep, or emotional weight. Pushing through with guilt makes it worse; naming the cause lets you choose a realistic response.",
      },
      {
        id: "concept",
        heading: "Same-day triage",
        framework: "concept",
        body: "Not every day deserves deep work. Sleep debt, stress, and illness need recovery or shallow work — not heroic focus sessions. Match expectations to capacity, then protect tomorrow's peak window.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Today's likely blocker — sleep, stress, environment, or overload — plus a same-day fix: rest, movement, admin-only mode, or a shortened focus sprint.",
      },
    ],
    eyebrow: "Same-day fix",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_sleep",
    nodes: {
      q_sleep: {
        type: "question" as const,
        id: "q_sleep",
        prompt: "How did you sleep last night?",
        input: "single-choice" as const,
        options: [
          { id: "bad", label: "Poor — under 6 hours or restless", score: { sleep: 3 }, next: "q_input" },
          { id: "ok", label: "OK — not great, not terrible", score: { sleep: 1 }, next: "q_input" },
          { id: "good", label: "Fine — sleep probably isn't the issue", score: { sleep: 0 }, next: "q_input" },
        ],
      },
      q_input: {
        type: "question" as const,
        id: "q_input",
        prompt: "What's your environment like today?",
        input: "single-choice" as const,
        options: [
          { id: "noisy", label: "Noisy or chaotic", score: { noise: 3 }, next: "q_mind" },
          { id: "phone", label: "Fine — but I keep checking my phone", score: { phone: 3 }, next: "q_mind" },
          { id: "ok", label: "Quiet and OK", score: { ok: 0 }, next: "q_mind" },
        ],
      },
      q_mind: {
        type: "question" as const,
        id: "q_mind",
        prompt: "What's your mental state?",
        input: "single-choice" as const,
        options: [
          { id: "worried", label: "Worried or stressed about something", score: { stress: 3 }, next: "q_food" },
          { id: "fog", label: "Foggy — reading doesn't stick", score: { fog: 3 }, next: "q_food" },
          { id: "scattered", label: "Scattered — jumping between things", score: { scattered: 3 }, next: "q_food" },
        ],
      },
      q_food: {
        type: "question" as const,
        id: "q_food",
        prompt: "Food and hydration today?",
        input: "single-choice" as const,
        options: [
          { id: "skipped", label: "Skipped meals or mostly caffeine", score: { fuel: 3 }, next: "branch_result" },
          { id: "heavy", label: "Heavy carb lunch — crash", score: { crash: 2 }, next: "branch_result" },
          { id: "ok", label: "Normal meals and water", score: { fuel: 0 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.sleep >= 2", next: "result_sleep" },
          { when: "scores.phone >= 2", next: "result_phone" },
          { when: "scores.stress >= 2", next: "result_stress" },
          { when: "scores.fuel >= 2 || scores.crash >= 2", next: "result_fuel" },
          { when: "scores.fog >= 2", next: "result_fog" },
          { when: "scores.scattered >= 2", next: "result_scattered" },
        ],
        default: "result_default",
      },
      result_sleep: { type: "result" as const, id: "result_sleep", resultTemplateId: "sleep" },
      result_phone: { type: "result" as const, id: "result_phone", resultTemplateId: "phone" },
      result_stress: { type: "result" as const, id: "result_stress", resultTemplateId: "stress" },
      result_fuel: { type: "result" as const, id: "result_fuel", resultTemplateId: "fuel" },
      result_fog: { type: "result" as const, id: "result_fog", resultTemplateId: "fog" },
      result_scattered: { type: "result" as const, id: "result_scattered", resultTemplateId: "scattered" },
      result_default: { type: "result" as const, id: "result_default", resultTemplateId: "default" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get today's concentration fix.",
    templates: [
      { id: "sleep", cards: [{ title: "Today's blocker", valueTemplate: "Sleep debt", descriptionTemplate: "Concentration is biochemistry today — not character." }], summaryTemplates: ["Do easy tasks only; protect tonight's sleep aggressively."] },
      { id: "phone", cards: [{ title: "Today's blocker", valueTemplate: "Attention fragments", descriptionTemplate: "Each check scatters focus — today never gelled." }], summaryTemplates: ["Phone away for 2 hours — see if concentration returns."] },
      { id: "stress", cards: [{ title: "Today's blocker", valueTemplate: "Stress load", descriptionTemplate: "Your mind is solving problems in the background." }], summaryTemplates: ["Name the worry, 5-min brain dump, then one small task."] },
      { id: "fuel", cards: [{ title: "Today's blocker", valueTemplate: "Low fuel", descriptionTemplate: "Brain without food/water runs on fumes." }], summaryTemplates: ["Eat protein, drink water, wait 20 min, retry."] },
      { id: "fog", cards: [{ title: "Today's blocker", valueTemplate: "Mental fog", descriptionTemplate: "Working memory is weak — complex tasks won't land today." }], summaryTemplates: ["Use Pomodoro + write everything down externally."] },
      { id: "scattered", cards: [{ title: "Today's blocker", valueTemplate: "Context switching", descriptionTemplate: "Too many threads open — none get depth." }], summaryTemplates: ["One tab, one task, 25 min — repeat twice max."] },
      { id: "default", cards: [{ title: "Today's blocker", valueTemplate: "Off day", descriptionTemplate: "No single culprit — stack small fixes." }], summaryTemplates: ["Walk, water, one easy win — reassess in an hour."] },
    ],
  },

  recommendations: [
    { id: "rec-sleep", when: "scores.sleep >= 2", title: "Today's plan", steps: ["Avoid hard cognitive work if possible — admin and meetings only.", "20-min power nap before 3pm if you can.", "No caffeine after 2pm — protect tonight.", "Early bedtime — tomorrow is the real fix."] },
    { id: "rec-phone", when: "scores.phone >= 2", title: "Today's plan", steps: ["Phone in drawer 2 hours — test concentration.", "Grayscale mode rest of day.", "Batch messages at lunch only.", "Notice if focus returns — that's your answer."] },
    { id: "rec-stress", when: "scores.stress >= 2", title: "Today's plan", steps: ["Write worry list — 3 min.", "One action on biggest worry if any.", "Box breathing 4 rounds.", "Lower expectations for output today — damage control mode OK."] },
    { id: "rec-fuel", when: "scores.fuel >= 2 || scores.crash >= 2", title: "Today's plan", steps: ["Eat protein + veg — not sugar alone.", "Full glass of water now.", "Walk 10 min after eating.", "Retry focus task in 30 min — don't grind hungry."] },
    { id: "rec-fog", when: "scores.fog >= 2", title: "Today's plan", steps: ["Read with pen — underline every paragraph.", "15-min Pomodoros only.", "Say task out loud before starting.", "Avoid multitasking entirely today."] },
    { id: "rec-scattered", when: "scores.scattered >= 2", title: "Today's plan", steps: ["Close all tabs — one window.", "Write single task on paper at desk.", "25-min timer — no switching.", "After 2 sprints, stop — scattered days need limits."] },
    { id: "rec-default", when: "true", title: "Today's plan", steps: ["10-min walk outside.", "Water + snack.", "One 15-min easy task.", "If still foggy, shift hard work to tomorrow AM."] },
  ],

  guidance: [],
  ctas: { app: { title: "Better concentration days ahead", description: "Reset reduces daily attention leaks — so off days don't become off weeks." } },
  faq: [
    { question: "Why can't I concentrate today but could yesterday?", answer: "Sleep, food, stress, and interruptions vary daily. One bad variable is enough — fix basics before self-blame." },
    { question: "Should I push through brain fog?", answer: "Light push on easy tasks OK. Forcing deep work through heavy fog wastes time — reschedule if possible." },
    { question: "When should I see a doctor about concentration?", answer: "If brain fog is frequent, sudden, or paired with headaches, mood changes, or sleep apnea symptoms — get checked." },
  ],
} satisfies Record<string, unknown>;
