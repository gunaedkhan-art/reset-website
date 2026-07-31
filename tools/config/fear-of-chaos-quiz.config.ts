export const fearOfChaosQuizConfig = {
  schemaVersion: "1.0" as const,
  id: "fear-of-chaos-quiz",
  slug: "fear-of-chaos-quiz",
  status: "published" as const,

  seo: {
    title: "Fear of Chaos Quiz",
    metaDescription:
      "Afraid to focus on one thing because everything else will fall apart? Keller's fear-of-chaos thief — diagnose your pattern and get a batching plan in 60 seconds.",
    primaryKeyword: "fear of chaos productivity",
    secondaryKeywords: [
      "afraid to focus on one thing",
      "everything urgent except my priority",
      "fear of chaos one thing",
      "can't focus one thing piles up",
      "productivity chaos anxiety",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/fear-of-chaos-quiz",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["one-thing", "anxiety", "chaos"],
    cluster: "one-thing",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Fear of Chaos Quiz",
    intro:
      "Four questions to name your chaos pattern and batch the mess without abandoning your priority.",
    icon: "quiz",
    proseTitle: "About fear of chaos",
    sections: [
      {
        id: "problem",
        heading: "If I focus on one thing, everything else will collapse",
        framework: "pas",
        body: "Inbox piles up, laundry waits, Slack explodes — the moment you protect ONE Thing time, anxiety screams that you're neglecting the rest. So you stay reactive and the priority never wins.",
      },
      {
        id: "concept",
        heading: "Thief #2: fear of chaos",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) calls this the fear of chaos — mistaking busy maintenance for progress. The fix is batching shallow work into defined windows so ONE Thing time doesn't require pretending chaos doesn't exist.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "Your chaos pattern — inbox, home, work requests, or guilt — plus a batching plan that protects priority time without denial.",
      },
    ],
    eyebrow: "Chaos diagnostic",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_fear",
    nodes: {
      q_fear: {
        type: "question" as const,
        id: "q_fear",
        prompt: "When you block time for your ONE Thing, you worry most about…",
        input: "single-choice" as const,
        options: [
          { id: "inbox", label: "Email and messages piling up — people waiting", score: { inbox: 3 }, next: "q_role" },
          { id: "tasks", label: "Small tasks stacking — admin and errands", score: { tasks: 3 }, next: "q_role" },
          { id: "people", label: "Disappointing people — they'll think I don't care", score: { people: 3 }, next: "q_role" },
          { id: "work", label: "Work quality elsewhere slipping — fires I'll have to fix", score: { fires: 3 }, next: "q_role" },
        ],
      },
      q_role: {
        type: "question" as const,
        id: "q_role",
        prompt: "What's your role context?",
        input: "single-choice" as const,
        options: [
          { id: "support", label: "Support or ops — others depend on quick replies", score: { support: 2 }, next: "q_block" },
          { id: "manager", label: "Manager — team needs access to me", score: { manager: 2 }, next: "q_block" },
          { id: "solo", label: "Individual contributor — output is mine alone", score: { solo: 2 }, next: "q_block" },
          { id: "parent", label: "Parent or caregiver — home can't pause", score: { parent: 2 }, next: "q_block" },
        ],
      },
      q_block: {
        type: "question" as const,
        id: "q_block",
        prompt: "How long can you realistically block ONE Thing time?",
        input: "single-choice" as const,
        options: [
          { id: "short", label: "30–45 minutes — short window", score: { short: 2 }, next: "q_batch" },
          { id: "medium", label: "60–90 minutes — solid block", score: { medium: 2 }, next: "q_batch" },
          { id: "long", label: "Half day or more — rare but possible", score: { long: 2 }, next: "q_batch" },
        ],
      },
      q_batch: {
        type: "question" as const,
        id: "q_batch",
        prompt: "Do you currently batch \"everything else\" or handle it all day?",
        input: "single-choice" as const,
        options: [
          { id: "all_day", label: "All day — constant reactive mode", score: { reactive: 3 }, next: "branch_result" },
          { id: "sometimes", label: "Sometimes batch — inconsistent", score: { mixed: 2 }, next: "branch_result" },
          { id: "batch", label: "Already batch — chaos fear still wins", score: { batching: 1 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.inbox >= 2 && scores.reactive >= 2", next: "result_inbox" },
          { when: "scores.people >= 2", next: "result_people" },
          { when: "scores.fires >= 2", next: "result_fires" },
          { when: "scores.parent >= 2", next: "result_parent" },
          { when: "scores.tasks >= 2", next: "result_tasks" },
        ],
        default: "result_general",
      },
      result_inbox: { type: "result" as const, id: "result_inbox", resultTemplateId: "inbox" },
      result_people: { type: "result" as const, id: "result_people", resultTemplateId: "people" },
      result_fires: { type: "result" as const, id: "result_fires", resultTemplateId: "fires" },
      result_parent: { type: "result" as const, id: "result_parent", resultTemplateId: "parent" },
      result_tasks: { type: "result" as const, id: "result_tasks", resultTemplateId: "tasks" },
      result_general: { type: "result" as const, id: "result_general", resultTemplateId: "general" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your fear-of-chaos plan.",
    templates: [
      {
        id: "inbox",
        cards: [
          { title: "Chaos pattern", valueTemplate: "Inbox avalanche", descriptionTemplate: "You fear unread messages mean failure — so you never leave the inbox." },
          { title: "Truth", valueTemplate: "Batch beats constant", descriptionTemplate: "Twice-daily inbox windows contain chaos — constant checking creates more." },
        ],
        summaryTemplates: ["Your ONE Thing block comes before the first inbox check."],
      },
      {
        id: "people",
        cards: [
          { title: "Chaos pattern", valueTemplate: "People-pleasing chaos", descriptionTemplate: "Focus feels selfish — you prioritize others' urgency over your ONE Thing." },
          { title: "Truth", valueTemplate: "Communicate the block", descriptionTemplate: "Telling people your focus window reduces guilt and sets expectations." },
        ],
        summaryTemplates: ["A visible ONE Thing block is more professional than silent overload."],
      },
      {
        id: "fires",
        cards: [
          { title: "Chaos pattern", valueTemplate: "Firefighter mode", descriptionTemplate: "Neglected areas feel like they'll explode — so you never stop reacting." },
          { title: "Truth", valueTemplate: "Minimum viable maintenance", descriptionTemplate: "List what truly can't wait 48 hours — batch the rest." },
        ],
        summaryTemplates: ["Most \"fires\" are batchable — only a few are real emergencies."],
      },
      {
        id: "parent",
        cards: [
          { title: "Chaos pattern", valueTemplate: "No pause button", descriptionTemplate: "Home obligations can't stop — ONE Thing time feels impossible." },
          { title: "Truth", valueTemplate: "Micro-block + swap", descriptionTemplate: "45-minute protected windows and traded childcare beat zero focus." },
        ],
        summaryTemplates: ["Chaos at home needs negotiated windows — not abandonment of ONE Thing."],
      },
      {
        id: "tasks",
        cards: [
          { title: "Chaos pattern", valueTemplate: "Admin snowball", descriptionTemplate: "Small tasks feel urgent in aggregate — they crowd out the ONE Thing." },
          { title: "Truth", valueTemplate: "Chaos hour", descriptionTemplate: "One daily 30-min chaos window — everything else waits." },
        ],
        summaryTemplates: ["Admin chaos is real but schedulable — don't let it veto priority time."],
      },
      {
        id: "general",
        cards: [
          { title: "Chaos pattern", valueTemplate: "Diffuse anxiety", descriptionTemplate: "General sense that focus equals collapse — without naming what actually breaks." },
          { title: "Truth", valueTemplate: "Name the fear", descriptionTemplate: "Write what you think will happen if you focus 90 minutes — often it's manageable." },
        ],
        summaryTemplates: ["Test the fear once — focus 45 min and see what actually breaks."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-inbox",
      when: "scores.inbox >= 2",
      title: "Contain inbox chaos",
      steps: [
        "ONE Thing block before opening email — non-negotiable.",
        "Auto-responder or status: \"Checking messages at 11 and 4.\"",
        "30-min chaos window after ONE Thing — process inbox then close.",
        "Urgent = phone call — everything else waits for batch.",
      ],
    },
    {
      id: "rec-people",
      when: "scores.people >= 2",
      title: "Contain people chaos",
      steps: [
        "Tell boss/team: \"Protected focus 9–10:30 on [ONE Thing] — async unless emergency.\"",
        "Use say-no script builder for new requests during block.",
        "Remind yourself: undivided output helps them more than instant replies.",
        "Schedule relationship maintenance in chaos window — not during ONE Thing.",
      ],
    },
    {
      id: "rec-fires",
      when: "scores.fires >= 2",
      title: "Contain firefighter chaos",
      steps: [
        "List minimum viable maintenance — 5 items max that can't slip 48 hrs.",
        "Do those in chaos window only — not during ONE Thing.",
        "Delegate or defer one recurring \"fire\" this week.",
        "Track: did the world end after a 90-min ONE Thing block? Evidence beats fear.",
      ],
    },
    {
      id: "rec-parent",
      when: "scores.parent >= 2",
      title: "Contain home chaos",
      steps: [
        "Negotiate one 45-min window — partner, nap time, or early morning.",
        "Prep chaos tasks night before — zero morning decisions.",
        "Lower ONE Thing scope — depth in 45 min beats zero in 4 hours imagined.",
        "Household sign: \"Focus until [time]\" — visible boundary.",
      ],
    },
    {
      id: "rec-reactive",
      when: "scores.reactive >= 2",
      title: "Exit all-day reactive mode",
      steps: [
        "Morning: ONE Thing block before Slack, email, or requests.",
        "Afternoon: 30-min chaos batch for everything that piled up.",
        "Evening: shutdown ritual — tomorrow's ONE Thing written before stopping.",
        "Repeat 5 days — chaos fear drops when batching proves safe.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Keller's chaos trade",
      steps: [
        "Accept: some mess is the cost of focus — temporary, not permanent.",
        "Batch chaos daily — don't eliminate it, schedule it.",
        "ONE Thing first, chaos second — order matters.",
        "Take Four Thieves quiz if chaos isn't your only thief.",
      ],
    },
  ],

  guidance: [
    {
      title: "Thief #2: fear of chaos",
      body: "When you concentrate on ONE Thing, other things don't get done — Keller says accepting temporary chaos is the price of extraordinary results.",
      list: [
        "Chaos is batched, not ignored forever",
        "Most anxiety overstates what actually breaks",
        "A protected block + chaos window beats all-day reactivity",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Hold the line during ONE Thing time",
      description:
        "Reset blocks distracting apps during your priority block — chaos waits in the batch window, not mid-focus.",
    },
  },

  faq: [
    {
      question: "What is fear of chaos in The ONE Thing?",
      answer:
        "Keller's second thief of productivity — the worry that focusing on your priority means everything else collapses. The fix is batching \"everything else,\" not abandoning your ONE Thing.",
    },
    {
      question: "How is this different from the Four Thieves quiz?",
      answer:
        "Four Thieves identifies all four thieves. This tool goes deep on chaos fear — inbox, people, fires, and home — with specific batching plans.",
    },
    {
      question: "What if something really is urgent?",
      answer:
        "True emergencies are rare. Define \"urgent\" as phone-call level — not unread Slack. Most chaos survives a 90-minute ONE Thing block.",
    },
  ],
} satisfies Record<string, unknown>;
