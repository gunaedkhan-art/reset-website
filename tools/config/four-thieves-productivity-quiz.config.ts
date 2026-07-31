export const fourThievesProductivityQuizConfig = {
  schemaVersion: "1.0" as const,
  id: "four-thieves-productivity-quiz",
  slug: "four-thieves-productivity-quiz",
  status: "published" as const,

  seo: {
    title: "Four Thieves of Productivity Quiz",
    metaDescription:
      "Which thief is stealing your ONE Thing? Gary Keller's four thieves — can't say no, fear of chaos, poor health, bad environment — diagnose yours and get a fix in 60 seconds.",
    primaryKeyword: "four thieves of productivity",
    secondaryKeywords: [
      "four thieves one thing",
      "why can't I focus on one thing",
      "productivity thieves",
      "can't say no productivity",
      "fear of chaos productivity",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/four-thieves-productivity-quiz",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["one-thing", "productivity", "diagnostic"],
    cluster: "one-thing",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Four Thieves of Productivity Quiz",
    intro:
      "Four questions — identify which thief is stealing your ONE Thing and how to stop it.",
    icon: "quiz",
    proseTitle: "About the four thieves",
    sections: [
      {
        id: "problem",
        heading: "When your ONE Thing never gets time",
        framework: "pas",
        body: "You know the priority — yet meetings, requests, anxiety, and clutter win every week. Something systemic is pulling you off the domino before it falls.",
      },
      {
        id: "concept",
        heading: "Keller's four thieves",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) names four thieves in [The ONE Thing](https://www.the1thing.com/): inability to say no, fear of chaos, poor health habits, and an environment that doesn't support your goals. Each requires a different counter-move.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Your primary thief plus matched fixes — scripts to decline, chaos batching, health boundaries, or environment changes.",
      },
    ],
    eyebrow: "Thief finder",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_pull",
    nodes: {
      q_pull: {
        type: "question" as const,
        id: "q_pull",
        prompt: "What pulls you off your ONE Thing most often?",
        input: "single-choice" as const,
        options: [
          { id: "yes", label: "I can't say no — requests, meetings, and guilt", score: { thief_no: 3 }, next: "q_pattern" },
          { id: "chaos", label: "Fear of chaos — if I focus on one thing, everything else piles up", score: { thief_chaos: 3 }, next: "q_pattern" },
          { id: "health", label: "Low energy — sleep, food, or no movement", score: { thief_health: 3 }, next: "q_pattern" },
          { id: "env", label: "Environment — phone, noise, people, wrong workspace", score: { thief_env: 3 }, next: "q_pattern" },
        ],
      },
      q_pattern: {
        type: "question" as const,
        id: "q_pattern",
        prompt: "When you try to protect time for your ONE Thing, what happens?",
        input: "single-choice" as const,
        options: [
          { id: "overcommit", label: "I agree to new things and the block disappears", score: { thief_no: 2 }, next: "q_secondary" },
          { id: "anxiety", label: "I feel anxious about what's not getting done", score: { thief_chaos: 2 }, next: "q_secondary" },
          { id: "crash", label: "I start strong then run out of steam", score: { thief_health: 2 }, next: "q_secondary" },
          { id: "interrupt", label: "I get interrupted or distract myself quickly", score: { thief_env: 2 }, next: "q_secondary" },
        ],
      },
      q_secondary: {
        type: "question" as const,
        id: "q_secondary",
        prompt: "Which secondary thief might also be active?",
        input: "single-choice" as const,
        options: [
          { id: "no", label: "Saying yes too often / people-pleasing", score: { thief_no: 1 }, next: "q_one_thing" },
          { id: "chaos", label: "Worry that neglected tasks will explode", score: { thief_chaos: 1 }, next: "q_one_thing" },
          { id: "health", label: "Skipping sleep, exercise, or real meals", score: { thief_health: 1 }, next: "q_one_thing" },
          { id: "env", label: "Phone, clutter, or open-plan distractions", score: { thief_env: 1 }, next: "q_one_thing" },
          { id: "none", label: "Probably just the main one", score: { solo: 1 }, next: "q_one_thing" },
        ],
      },
      q_one_thing: {
        type: "question" as const,
        id: "q_one_thing",
        prompt: "Do you currently have a written ONE Thing for this week?",
        input: "single-choice" as const,
        options: [
          { id: "yes", label: "Yes — written and visible", score: { has_one: 2 }, next: "branch_result" },
          { id: "head", label: "In my head but not written", score: { fuzzy: 1 }, next: "branch_result" },
          { id: "no", label: "No — that's part of the problem", score: { no_one: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.thief_no >= 3", next: "result_no" },
          { when: "scores.thief_chaos >= 3", next: "result_chaos" },
          { when: "scores.thief_health >= 3", next: "result_health" },
          { when: "scores.thief_env >= 3", next: "result_env" },
          { when: "scores.thief_no >= 2", next: "result_no" },
          { when: "scores.thief_chaos >= 2", next: "result_chaos" },
        ],
        default: "result_health",
      },
      result_no: { type: "result" as const, id: "result_no", resultTemplateId: "no" },
      result_chaos: { type: "result" as const, id: "result_chaos", resultTemplateId: "chaos" },
      result_health: { type: "result" as const, id: "result_health", resultTemplateId: "health" },
      result_env: { type: "result" as const, id: "result_env", resultTemplateId: "env" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to identify your productivity thief.",
    templates: [
      {
        id: "no",
        cards: [
          { title: "Your thief", valueTemplate: "Inability to say no", descriptionTemplate: "Thief #1 — every yes to someone else is a no to your ONE Thing." },
          { title: "Keller's fix", valueTemplate: "A yes must be guarded", descriptionTemplate: "Saying yes to everything means going small on what matters most." },
        ],
        summaryTemplates: ["Protect your ONE Thing block before you respond to new requests."],
      },
      {
        id: "chaos",
        cards: [
          { title: "Your thief", valueTemplate: "Fear of chaos", descriptionTemplate: "Thief #2 — focusing on one thing feels like letting everything else collapse." },
          { title: "Keller's fix", valueTemplate: "Chaos is the cost of focus", descriptionTemplate: "Some mess is inevitable — batch it, don't let fear veto your ONE Thing." },
        ],
        summaryTemplates: ["Accept temporary chaos in non-ONE areas while your domino falls."],
      },
      {
        id: "health",
        cards: [
          { title: "Your thief", valueTemplate: "Poor health habits", descriptionTemplate: "Thief #3 — willpower is a battery; sleep, food, and movement charge it." },
          { title: "Keller's fix", valueTemplate: "Fuel the ONE Thing", descriptionTemplate: "Neglecting health steals energy from the disciplined pursuit of less." },
        ],
        summaryTemplates: ["Your ONE Thing tomorrow starts with sleep and movement tonight."],
      },
      {
        id: "env",
        cards: [
          { title: "Your thief", valueTemplate: "Unsupported environment", descriptionTemplate: "Thief #4 — your space and tools work against focus by default." },
          { title: "Keller's fix", valueTemplate: "Design for the ONE Thing", descriptionTemplate: "Environment beats willpower — remove friction before relying on discipline." },
        ],
        summaryTemplates: ["Change the room, phone, and signals before trying harder."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-thief-no",
      when: "scores.thief_no >= 2",
      title: "Stop thief #1 — say no",
      steps: [
        "Before any yes: \"Does this serve my ONE Thing this week?\"",
        "Script: \"I'm at capacity on X — I can't take this on without dropping my priority.\"",
        "Batch requests — reply once daily, not on their timeline.",
        "Calendar-block ONE Thing time before opening meeting invites.",
        "Practice one no this week — guilt fades, clarity stays.",
      ],
    },
    {
      id: "rec-thief-chaos",
      when: "scores.thief_chaos >= 2",
      title: "Stop thief #2 — fear of chaos",
      steps: [
        "List \"minimum viable maintenance\" — what truly can't wait 48 hours.",
        "Batch everything else to one 30-min chaos window daily.",
        "Tell stakeholders: \"Focused on X until Thursday — Y waits.\"",
        "Remind yourself: unfocused days create more chaos than focused ones.",
        "Use the Focusing Question — the ONE Thing reduces long-term mess.",
      ],
    },
    {
      id: "rec-thief-health",
      when: "scores.thief_health >= 2",
      title: "Stop thief #3 — health habits",
      steps: [
        "Non-negotiable sleep window — ONE Thing needs a charged brain.",
        "10-minute walk before your ONE Thing block — movement resets willpower.",
        "Protein breakfast or lunch — avoid energy crashes mid-block.",
        "Schedule ONE Thing in peak energy, not depleted scraps.",
        "Health can be your ONE Thing this week if it's the bottleneck.",
      ],
    },
    {
      id: "rec-thief-env",
      when: "scores.thief_env >= 2",
      title: "Stop thief #4 — environment",
      steps: [
        "Phone in another room during ONE Thing block — non-negotiable.",
        "Same place, same start ritual — train the environment cue.",
        "Headphones or closed door = do not disturb signal.",
        "Clear desk to one task only — hide other work physically.",
        "Use Reset to block default distraction apps during the block.",
      ],
    },
    {
      id: "rec-no-one",
      when: "scores.no_one >= 2",
      title: "Write your ONE Thing first",
      steps: [
        "Use the Focusing Question tool — name this week's ONE Thing.",
        "Write it where you'll see it before email.",
        "Thieves thrive when priority is fuzzy — clarity is defense.",
        "Revisit nightly — is tomorrow's task serving the ONE Thing?",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Guard the ONE Thing",
      steps: [
        "Identify your thief — fix it before adding productivity hacks.",
        "Time-block the ONE Thing before thieves get the calendar.",
        "Review weekly: which thief showed up most?",
        "One thief at a time — master saying no before optimizing environment.",
      ],
    },
  ],

  guidance: [
    {
      title: "The four thieves (Keller)",
      body: "From The ONE Thing — four forces that steal focus from your singular priority.",
      list: [
        "1. Inability to say no",
        "2. Fear of chaos when others' priorities pile up",
        "3. Poor health habits — sleep, food, movement",
        "4. Environment doesn't support your goals",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Defend your ONE Thing from thief #4",
      description:
        "Reset blocks distracting apps during your priority block — environment design that stops digital thieves automatically.",
    },
  },

  faq: [
    {
      question: "What are the four thieves of productivity?",
      answer:
        "Gary Keller's framework from The ONE Thing: inability to say no, fear of chaos, poor health habits, and an environment that doesn't support your goals. Each steals time and energy from your ONE Thing.",
    },
    {
      question: "Can I have more than one thief?",
      answer:
        "Yes — most people do. This quiz finds your primary thief. Fix that first; secondary thieves often fade once the main leak is plugged.",
    },
    {
      question: "How is this different from \"Why can't I focus\"?",
      answer:
        "General focus tools diagnose attention. This quiz is ONE Thing-specific — especially fear of chaos and saying no, which aren't covered elsewhere on the site.",
    },
  ],
} satisfies Record<string, unknown>;
