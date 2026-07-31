export const iCantFocusConfig = {
  schemaVersion: "1.0" as const,
  id: "i-cant-focus",
  slug: "i-cant-focus",
  status: "published" as const,

  seo: {
    title: "I Can't Focus",
    metaDescription:
      "Can't focus right now? Answer 4 quick questions and get a personalized fix for this moment — free tool, results in under 60 seconds.",
    primaryKeyword: "i can't focus",
    secondaryKeywords: [
      "can't focus",
      "cant focus",
      "unable to focus",
      "can't concentrate",
      "focus help now",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/i-cant-focus",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["focus", "distraction", "attention"],
    cluster: "focus-problems",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "I Can't Focus",
    intro:
      "Four quick questions — then a plan matched to this moment, not a generic productivity lecture.",
    icon: "focus",
    proseTitle: "About this diagnostic",
    sections: [
      {
        id: "problem",
        heading: "Focus failed today",
        framework: "pas",
        body: "You're trying to work but attention slides away — phone, tabs, fog, or a buzzing mind. Right now you need a diagnosis for this moment, not a life overhaul.",
      },
      {
        id: "concept",
        heading: "Match the fix to now",
        framework: "concept",
        body: "Same-day focus failure has different causes: sleep debt, anxiety, unclear task, or environment. [Cal Newport](https://calnewport.com/) separates rescue protocols from long-term depth practice — start with what's blocking the next hour.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Today's blocker and an immediate fix — or a link to the focus protocol tool if you need steps for the next 25 minutes.",
      },
    ],
    eyebrow: "Right-now diagnostic",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_now",
    nodes: {
      q_now: {
        type: "question" as const,
        id: "q_now",
        prompt: "What are you trying to focus on?",
        input: "single-choice" as const,
        options: [
          { id: "work", label: "Work or study", score: { work: 2 }, next: "q_blocker" },
          { id: "creative", label: "Creative or open-ended work", score: { creative: 2 }, next: "q_blocker" },
          { id: "reading", label: "Reading or learning", score: { reading: 2 }, next: "q_blocker" },
          { id: "anything", label: "Honestly — anything", score: { general: 3 }, next: "q_blocker" },
        ],
      },
      q_blocker: {
        type: "question" as const,
        id: "q_blocker",
        prompt: "What's pulling you away right now?",
        input: "single-choice" as const,
        options: [
          { id: "phone", label: "Phone, feeds, or messages", score: { phone: 3 }, next: "q_body" },
          { id: "thoughts", label: "Racing or looping thoughts", score: { mind: 3 }, next: "q_body" },
          { id: "noise", label: "Noise or people around me", score: { environment: 3 }, next: "q_body" },
          { id: "nothing", label: "Nothing specific — I just drift", score: { fog: 3 }, next: "q_body" },
        ],
      },
      q_body: {
        type: "question" as const,
        id: "q_body",
        prompt: "How does your body feel?",
        input: "single-choice" as const,
        options: [
          { id: "tired", label: "Tired or heavy", score: { tired: 3 }, next: "q_time" },
          { id: "wired", label: "Restless or wired", score: { wired: 2 }, next: "q_time" },
          { id: "ok", label: "Fine physically", score: { ok: 0 }, next: "q_time" },
          { id: "hungry", label: "Hungry, thirsty, or uncomfortable", score: { physical: 2 }, next: "q_time" },
        ],
      },
      q_time: {
        type: "question" as const,
        id: "q_time",
        prompt: "How long have you been trying to focus?",
        input: "single-choice" as const,
        options: [
          { id: "just", label: "Just sat down — already stuck", score: { start: 2 }, next: "branch_result" },
          { id: "while", label: "20–60 minutes of fake work", score: { stall: 2 }, next: "branch_result" },
          { id: "hours", label: "Hours — nothing real yet", score: { chronic: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.tired >= 2", next: "result_tired" },
          { when: "scores.phone >= 2", next: "result_phone" },
          { when: "scores.mind >= 2", next: "result_mind" },
          { when: "scores.environment >= 2", next: "result_environment" },
          { when: "scores.fog >= 2", next: "result_fog" },
          { when: "scores.physical >= 2", next: "result_physical" },
        ],
        default: "result_reset",
      },
      result_tired: { type: "result" as const, id: "result_tired", resultTemplateId: "tired" },
      result_phone: { type: "result" as const, id: "result_phone", resultTemplateId: "phone" },
      result_mind: { type: "result" as const, id: "result_mind", resultTemplateId: "mind" },
      result_environment: { type: "result" as const, id: "result_environment", resultTemplateId: "environment" },
      result_fog: { type: "result" as const, id: "result_fog", resultTemplateId: "fog" },
      result_physical: { type: "result" as const, id: "result_physical", resultTemplateId: "physical" },
      result_reset: { type: "result" as const, id: "result_reset", resultTemplateId: "reset" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get a focus fix for right now.",
    templates: [
      { id: "tired", cards: [{ title: "Right now", valueTemplate: "Energy first", descriptionTemplate: "Your brain won't focus while your body is depleted." }], summaryTemplates: ["Fix the body before forcing the mind."] },
      { id: "phone", cards: [{ title: "Right now", valueTemplate: "Digital pull", descriptionTemplate: "Your phone is winning the attention battle." }], summaryTemplates: ["Remove the phone from the equation for the next 25 minutes."] },
      { id: "mind", cards: [{ title: "Right now", valueTemplate: "Mental noise", descriptionTemplate: "Thoughts are louder than the task." }], summaryTemplates: ["Externalize the noise, then return with one tiny step."] },
      { id: "environment", cards: [{ title: "Right now", valueTemplate: "Environment friction", descriptionTemplate: "Your space isn't supporting focus." }], summaryTemplates: ["Change one thing in your environment in the next 2 minutes."] },
      { id: "fog", cards: [{ title: "Right now", valueTemplate: "Attention fog", descriptionTemplate: "You're present but not engaged." }], summaryTemplates: ["Use a timer and verbalize the task to wake up attention."] },
      { id: "physical", cards: [{ title: "Right now", valueTemplate: "Physical need", descriptionTemplate: "Discomfort is stealing bandwidth." }], summaryTemplates: ["Eat, drink, or move — then retry for 10 minutes only."] },
      { id: "reset", cards: [{ title: "Right now", valueTemplate: "Quick reset", descriptionTemplate: "No single blocker — you need a hard restart." }], summaryTemplates: ["Stand up, 10 breaths, one 5-minute task. Momentum beats motivation."] },
    ],
  },

  recommendations: [
    { id: "rec-tired", when: "scores.tired >= 2", title: "Do this in the next 10 minutes", steps: ["Drink water and eat something with protein.", "Walk for 5 minutes — movement beats caffeine if you're crashed.", "Set a 15-minute timer for the easiest part of the task only.", "If still exhausted, stop forcing — schedule focus for your peak window tomorrow."] },
    { id: "rec-phone", when: "scores.phone >= 2", title: "Do this in the next 10 minutes", steps: ["Phone in another room or drawer — not on silent, gone.", "Close all tabs except one.", "Write the task in one sentence on paper.", "25-minute timer — no unlocks until it rings."] },
    { id: "rec-mind", when: "scores.mind >= 2", title: "Do this in the next 10 minutes", steps: ["Brain-dump every worry for 2 minutes — paper only.", "Circle the one thought related to your task.", "Say the next action out loud.", "Do that action for 5 minutes — nothing else."] },
    { id: "rec-environment", when: "scores.environment >= 2", title: "Do this in the next 10 minutes", steps: ["Headphones on or move to a quieter spot.", "Face away from foot traffic or door.", "Put a \"focus\" sign up if others interrupt.", "One tab, one task, 20-minute block."] },
    { id: "rec-fog", when: "scores.fog >= 2", title: "Do this in the next 10 minutes", steps: ["Read one paragraph and underline the main point.", "Set Pomodoro: 25 on, 5 off.", "Change seats — different chair or room.", "Pair task with instrumental music or brown noise."] },
    { id: "rec-physical", when: "scores.physical >= 2", title: "Do this in the next 10 minutes", steps: ["Fix hunger/thirst first — brain runs on fuel.", "Adjust temperature or lighting.", "Stretch neck and shoulders for 60 seconds.", "Retry focus for 10 minutes — stop if body still protests."] },
    { id: "rec-reset", when: "true", title: "Do this in the next 10 minutes", steps: ["Stand up and leave the desk for 2 minutes.", "Write the smallest possible next step.", "Set a 5-minute timer and start — permission to stop after.", "No phone until the timer ends."] },
  ],

  guidance: [],
  ctas: { app: { title: "Make focus easier tomorrow", description: "Reset blocks distractions during focus windows so the next session starts clean — not another fight with your phone." } },
  faq: [
    { question: "Why can't I focus even when I want to?", answer: "Focus fails when energy, environment, or emotional load exceeds capacity — not because you don't care. Match the fix to the blocker, not willpower." },
    { question: "How is this different from \"Why can't I focus?\"", answer: "That tool diagnoses longer patterns. This one gives an immediate action plan for the moment you're stuck." },
    { question: "What if nothing works today?", answer: "Stop grinding. Protect sleep, reduce inputs, and try a 90-minute focus block tomorrow at your peak energy time." },
  ],
} satisfies Record<string, unknown>;
