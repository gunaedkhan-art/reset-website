export const deepOrShallowWorkQuizConfig = {
  schemaVersion: "1.0" as const,
  id: "deep-or-shallow-work-quiz",
  slug: "deep-or-shallow-work-quiz",
  status: "published" as const,

  seo: {
    title: "Deep or Shallow Work Quiz",
    metaDescription:
      "Is this task deep or shallow work? Answer 4 questions about any task and get a clear verdict — protect, batch, delegate, or eliminate — based on Cal Newport's framework.",
    primaryKeyword: "deep or shallow work",
    secondaryKeywords: [
      "is this deep work",
      "deep vs shallow work",
      "shallow work examples",
      "deep work examples",
      "classify my task",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/deep-or-shallow-work-quiz",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["deep-work", "shallow-work", "priorities"],
    cluster: "deep-work",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Deep or Shallow Work Quiz",
    intro:
      "Not every task deserves your best brain. Describe one task on your list — four questions tell you whether to protect it, batch it, delegate it, or drop it.",
    icon: "brain",
    proseTitle: "About deep vs shallow work",
    sections: [
      {
        id: "problem",
        heading: "When everything feels equally urgent",
        framework: "pas",
        body: "Email, Slack, and status updates fill the calendar while the work that actually moves your career or project forward never gets protected hours. Without a clear verdict, shallow tasks eat deep time by default.",
      },
      {
        id: "concept",
        heading: "Cal Newport's framework",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) defines [Deep Work](https://calnewport.com/books/deep-work/) as professional activities performed in distraction-free concentration that push cognitive limits. Shallow work is logistical — necessary, but not cognitively demanding.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A clear verdict on one task — deep, shallow, batch, delegate, or question — plus matched steps for how to handle it on your calendar.",
      },
    ],
    eyebrow: "Interactive tool",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_concentration",
    nodes: {
      q_concentration: {
        type: "question" as const,
        id: "q_concentration",
        prompt: "Does this task require uninterrupted concentration to do well?",
        input: "single-choice" as const,
        options: [
          {
            id: "yes",
            label: "Yes — quality drops if I'm interrupted",
            score: { deep: 3 },
            next: "q_value",
          },
          {
            id: "somewhat",
            label: "Somewhat — I can do it between other things",
            score: { shallow: 2 },
            next: "q_value",
          },
          {
            id: "no",
            label: "No — it's routine or quick",
            score: { shallow: 3 },
            next: "q_value",
          },
        ],
      },
      q_value: {
        type: "question" as const,
        id: "q_value",
        prompt: "Does this task create new value or just maintain the status quo?",
        input: "single-choice" as const,
        options: [
          {
            id: "create",
            label: "Creates value — output, insight, or skill that compounds",
            score: { deep: 2 },
            next: "q_reactive",
          },
          {
            id: "maintain",
            label: "Maintains — keeps things running but doesn't move the needle",
            score: { shallow: 2 },
            next: "q_reactive",
          },
          {
            id: "unclear",
            label: "Unclear — hard to tell if it matters",
            score: { eliminate: 1 },
            next: "q_reactive",
          },
        ],
      },
      q_reactive: {
        type: "question" as const,
        id: "q_reactive",
        prompt: "Is this task mostly reactive (responding to others) or proactive (you initiating)?",
        input: "single-choice" as const,
        options: [
          {
            id: "proactive",
            label: "Proactive — I chose it toward a goal",
            score: { deep: 2 },
            next: "q_delegate",
          },
          {
            id: "mixed",
            label: "Mixed — some initiative, some responding",
            score: { batch: 1 },
            next: "q_delegate",
          },
          {
            id: "reactive",
            label: "Reactive — inbox, requests, or someone else's urgency",
            score: { shallow: 2, batch: 1 },
            next: "q_delegate",
          },
        ],
      },
      q_delegate: {
        type: "question" as const,
        id: "q_delegate",
        prompt: "Could someone else do this at 80% quality with brief training?",
        input: "single-choice" as const,
        options: [
          {
            id: "yes",
            label: "Yes — it's not uniquely mine",
            score: { delegate: 3 },
            next: "branch_result",
          },
          {
            id: "partially",
            label: "Partially — parts could be handed off",
            score: { delegate: 1, batch: 1 },
            next: "branch_result",
          },
          {
            id: "no",
            label: "No — only I can do this well",
            score: { deep: 1 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.delegate >= 2", next: "result_delegate" },
          { when: "scores.eliminate >= 1 && scores.deep <= 1", next: "result_eliminate" },
          { when: "scores.deep >= 4", next: "result_deep" },
          { when: "scores.shallow >= 3", next: "result_shallow" },
          { when: "scores.deep >= 2 && scores.shallow <= 2", next: "result_deep" },
        ],
        default: "result_batch",
      },
      result_deep: {
        type: "result" as const,
        id: "result_deep",
        resultTemplateId: "deep",
      },
      result_shallow: {
        type: "result" as const,
        id: "result_shallow",
        resultTemplateId: "shallow",
      },
      result_batch: {
        type: "result" as const,
        id: "result_batch",
        resultTemplateId: "batch",
      },
      result_delegate: {
        type: "result" as const,
        id: "result_delegate",
        resultTemplateId: "delegate",
      },
      result_eliminate: {
        type: "result" as const,
        id: "result_eliminate",
        resultTemplateId: "eliminate",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions above to classify your task.",
    templates: [
      {
        id: "deep",
        cards: [
          {
            title: "Verdict",
            valueTemplate: "Deep work",
            descriptionTemplate:
              "This task deserves protected, distraction-free time — schedule it, don't squeeze it in.",
          },
        ],
        summaryTemplates: ["Protect this on your calendar like a client meeting."],
      },
      {
        id: "shallow",
        cards: [
          {
            title: "Verdict",
            valueTemplate: "Shallow work",
            descriptionTemplate:
              "Necessary but not cognitively demanding — don't let it eat your best hours.",
          },
        ],
        summaryTemplates: ["Batch this away from your peak focus window."],
      },
      {
        id: "batch",
        cards: [
          {
            title: "Verdict",
            valueTemplate: "Batch it",
            descriptionTemplate:
              "Mixed task — fine to do, but group it with similar shallow work in one window.",
          },
        ],
        summaryTemplates: ["Handle this in a dedicated shallow block — not between deep sessions."],
      },
      {
        id: "delegate",
        cards: [
          {
            title: "Verdict",
            valueTemplate: "Delegate",
            descriptionTemplate:
              "Someone else could handle this — your deep work hours are too valuable for it.",
          },
        ],
        summaryTemplates: ["Hand off or automate — free your calendar for what only you can do."],
      },
      {
        id: "eliminate",
        cards: [
          {
            title: "Verdict",
            valueTemplate: "Question it",
            descriptionTemplate:
              "Low clarity on value — this may not deserve any time. Confirm it matters before doing it.",
          },
        ],
        summaryTemplates: ["Ask \"What happens if I don't do this?\" — often the answer is nothing."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-deep",
      when: "scores.deep >= 2",
      title: "Protect this for deep work",
      steps: [
        "Block 60–90 minutes on calendar — title with the specific task.",
        "Phone away, comms closed — zero exceptions during the block.",
        "Define \"done\" in one sentence before you start.",
        "Do this in your peak energy window, not leftover scraps.",
      ],
    },
    {
      id: "rec-shallow",
      when: "scores.shallow >= 2",
      title: "Keep this shallow",
      steps: [
        "Never do this first thing in the morning — save peak hours for depth.",
        "Batch with similar tasks — one 30-minute admin block beats ten micro-sessions.",
        "Set a timer — shallow work expands to fill time if unchecked.",
        "Automate or template recurring versions.",
      ],
    },
    {
      id: "rec-delegate",
      when: "scores.delegate >= 2",
      title: "Get this off your plate",
      steps: [
        "Write a 3-step handoff doc — someone else can follow it.",
        "Assign with a deadline — don't take it back unless quality fails.",
        "Review output weekly, not task-by-task.",
        "Reinvest freed time into one deep work block.",
      ],
    },
    {
      id: "rec-eliminate",
      when: "scores.eliminate >= 1",
      title: "Challenge this task",
      steps: [
        "Ask your manager or yourself: \"Is this still necessary?\"",
        "Skip one cycle and see if anyone notices.",
        "Replace with a simpler check-in if it's a status ritual.",
        "Drop guilt — busywork disguised as work is common.",
      ],
    },
    {
      id: "rec-batch",
      when: "true",
      title: "Batch this task",
      steps: [
        "Pick one daily 30-minute \"shallow block\" for email, admin, and tasks like this.",
        "Don't touch it outside that window.",
        "Use a checklist — process similar items together.",
        "Keep deep blocks sacred — no shallow bleed-over.",
      ],
    },
  ],

  guidance: [
    {
      title: "When in doubt",
      body: "Cal Newport's rule of thumb: if you'd need months to train a smart college grad to do it, it's probably deep work. If they could do it in a week, it's shallow.",
    },
  ],

  ctas: {
    app: {
      title: "Stop shallow tasks from hijacking deep time",
      description:
        "Reset blocks distracting apps during deep work blocks — so shallow urgency (Slack, feeds) doesn't pull you out of high-value tasks.",
    },
  },

  faq: [
    {
      question: "Can shallow work become deep work?",
      answer:
        "Sometimes — writing a thoughtful strategy memo is deep; firing off a quick status update is shallow. Same domain, different cognitive demand.",
    },
    {
      question: "Should I eliminate all shallow work?",
      answer:
        "No — shallow work keeps organizations running. The goal is to batch and minimize it so deep work gets protected hours.",
    },
    {
      question: "What if my boss assigns mostly shallow tasks?",
      answer:
        "Use the delegate and batch recommendations, and negotiate protected focus time. Run the shallow work audit to quantify the problem with data.",
    },
  ],
} satisfies Record<string, unknown>;
