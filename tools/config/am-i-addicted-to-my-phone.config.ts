export const amIAddictedToMyPhoneConfig = {
  schemaVersion: "1.0" as const,
  id: "am-i-addicted-to-my-phone",
  slug: "am-i-addicted-to-my-phone",
  status: "published" as const,

  seo: {
    title: "Am I Addicted to My Phone?",
    metaDescription:
      "Worried about phone addiction? Answer 4 honest questions and get a clear read on your habits plus a personalized recovery plan — free assessment in 60 seconds.",
    primaryKeyword: "am i addicted to my phone",
    secondaryKeywords: [
      "phone addiction",
      "phone addiction test",
      "addicted to phone",
      "smartphone addiction quiz",
      "do i have a phone problem",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/am-i-addicted-to-my-phone",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["phone-addiction", "screen-time", "digital-wellbeing"],
    cluster: "phone-addiction",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Am I Addicted to My Phone?",
    intro:
      "Four honest questions on control, distress, and daily impact — then a plan matched to your level. Not a clinical diagnosis.",
    icon: "phone",
    proseTitle: "About this assessment",
    sections: [
      {
        id: "problem",
        heading: "When the phone stops feeling optional",
        framework: "pas",
        body: "You've tried to cut back and failed. Anxiety spikes when the battery dies. Real life waits while the feed keeps going — and you wonder if this is normal use or something stronger.",
      },
      {
        id: "concept",
        heading: "Control, distress, and function",
        framework: "concept",
        body: "Problematic use shows up as failed attempts to cut back, distress when unavailable, and impact on sleep, work, or relationships. [Cal Newport](https://calnewport.com/) treats intentional technology design — not shame — as the path back to control.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A clear read on habit severity plus a recovery plan scaled to your level — from friction tweaks to structured digital declutter steps.",
      },
    ],
    eyebrow: "Self-assessment",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_control",
    nodes: {
      q_control: {
        type: "question" as const,
        id: "q_control",
        prompt: "Have you tried to use your phone less and failed?",
        input: "single-choice" as const,
        options: [
          { id: "often", label: "Yes — many times", score: { control: 3 }, next: "q_urge" },
          { id: "sometimes", label: "A few times", score: { control: 2 }, next: "q_urge" },
          { id: "rare", label: "Rarely — I mostly choose my use", score: { control: 0 }, next: "q_urge" },
        ],
      },
      q_urge: {
        type: "question" as const,
        id: "q_urge",
        prompt: "Do you feel anxious or irritable without your phone?",
        input: "single-choice" as const,
        options: [
          { id: "yes", label: "Yes — noticeably", score: { withdrawal: 3 }, next: "q_impact" },
          { id: "little", label: "A little uncomfortable", score: { withdrawal: 1 }, next: "q_impact" },
          { id: "no", label: "No — I'm fine without it", score: { withdrawal: 0 }, next: "q_impact" },
        ],
      },
      q_impact: {
        type: "question" as const,
        id: "q_impact",
        prompt: "Has phone use affected work, sleep, or relationships?",
        input: "single-choice" as const,
        options: [
          { id: "all", label: "Yes — multiple areas", score: { impact: 3 }, next: "q_hours" },
          { id: "some", label: "One area, noticeably", score: { impact: 2 }, next: "q_hours" },
          { id: "no", label: "Not really — mostly annoyance", score: { impact: 0 }, next: "q_hours" },
        ],
      },
      q_hours: {
        type: "question" as const,
        id: "q_hours",
        prompt: "Roughly how much non-work phone time per day?",
        input: "single-choice" as const,
        options: [
          { id: "high", label: "4+ hours", score: { hours: 3 }, next: "branch_result" },
          { id: "med", label: "2–4 hours", score: { hours: 2 }, next: "branch_result" },
          { id: "low", label: "Under 2 hours", score: { hours: 0 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.control >= 2 && scores.impact >= 2", next: "result_high" },
          { when: "scores.withdrawal >= 2 && scores.hours >= 2", next: "result_moderate" },
          { when: "scores.hours >= 2", next: "result_heavy" },
          { when: "scores.control >= 2", next: "result_habit" },
        ],
        default: "result_low",
      },
      result_high: { type: "result" as const, id: "result_high", resultTemplateId: "high" },
      result_moderate: { type: "result" as const, id: "result_moderate", resultTemplateId: "moderate" },
      result_heavy: { type: "result" as const, id: "result_heavy", resultTemplateId: "heavy" },
      result_habit: { type: "result" as const, id: "result_habit", resultTemplateId: "habit" },
      result_low: { type: "result" as const, id: "result_low", resultTemplateId: "low" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to assess your phone relationship.",
    templates: [
      { id: "high", cards: [{ title: "Assessment", valueTemplate: "High concern", descriptionTemplate: "Loss of control plus real-life impact — treat this seriously." }], summaryTemplates: ["Your plan uses structured reduction and support — not willpower alone."] },
      { id: "moderate", cards: [{ title: "Assessment", valueTemplate: "Moderate concern", descriptionTemplate: "Strong pull and discomfort without phone — habit is entrenched." }], summaryTemplates: ["Your plan adds hard limits and replacement routines."] },
      { id: "heavy", cards: [{ title: "Assessment", valueTemplate: "Heavy use", descriptionTemplate: "Hours add up — may not be addiction yet, but risk is rising." }], summaryTemplates: ["Your plan cuts hours before they become compulsive."] },
      { id: "habit", cards: [{ title: "Assessment", valueTemplate: "Habitual overuse", descriptionTemplate: "You want less but keep slipping — classic habit loop." }], summaryTemplates: ["Your plan targets triggers and friction, not shame."] },
      { id: "low", cards: [{ title: "Assessment", valueTemplate: "Lower concern", descriptionTemplate: "Some waste, but you mostly stay in control." }], summaryTemplates: ["Your plan prevents drift with light guardrails."] },
    ],
  },

  recommendations: [
    { id: "rec-high", when: "scores.control >= 2 && scores.impact >= 2", title: "Your recovery plan", steps: ["Tell someone you trust — accountability reduces shame.", "Remove worst apps for 14 days — not forever, experiment.", "Phone sleeps outside bedroom — buy a basic alarm if needed.", "If distress is severe, consider a therapist or digital wellbeing program."] },
    { id: "rec-moderate", when: "scores.withdrawal >= 2 && scores.hours >= 2", title: "Your limit plan", steps: ["Daily app limits: 60 min social, hard lock.", "Grayscale during work hours.", "30-minute phone-free blocks after waking and before bed.", "When anxious without phone: 5-minute walk before unlocking."] },
    { id: "rec-heavy", when: "scores.hours >= 2", title: "Your reduction plan", steps: ["Check Screen Time — set 20% lower target this week.", "Delete one app that eats the most time.", "No phone during meals and first hour of morning.", "Replace one scroll session daily with a walk or book."] },
    { id: "rec-habit", when: "scores.control >= 2", title: "Your friction plan", steps: ["Log out of feeds — re-login friction helps.", "Home screen: tools only — social in folders.", "Before unlock: state why you're opening phone.", "Track failed cutbacks without guilt — adjust limits."] },
    { id: "rec-low", when: "true", title: "Your maintenance plan", steps: ["Weekly Screen Time review — catch drift early.", "Keep phone out of bedroom.", "One phone-free hour daily — protect it.", "Use Reset limits before problems grow."] },
  ],

  guidance: [
    {
      title: "Is this a medical diagnosis?",
      body: "No. This tool highlights patterns associated with problematic use. Only a qualified professional can diagnose behavioral addiction or related conditions.",
    },
  ],

  ctas: {
    app: {
      title: "Take back control gradually",
      description:
        "Reset sets daily limits and blocks compulsive app opens — so reducing phone use doesn't depend on white-knuckling every day.",
    },
  },

  faq: [
    {
      question: "What's the difference between habit and addiction?",
      answer:
        "Habit is automatic behavior. Addiction adds loss of control, continued use despite harm, and distress when stopping. This tool checks for those patterns.",
    },
    {
      question: "Should I quit my phone completely?",
      answer:
        "Rarely necessary. Most people recover with limits, friction, bedroom boundaries, and app removal experiments — not total abstinence.",
    },
    {
      question: "How is this different from the phone-checking tool?",
      answer:
        "The checking tool targets frequent pickups. This assessment focuses on control, withdrawal feelings, and life impact — the addiction lens.",
    },
  ],
} satisfies Record<string, unknown>;
