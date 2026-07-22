export const whyDoIProcrastinateConfig = {
  schemaVersion: "1.0" as const,
  id: "why-do-i-procrastinate",
  slug: "why-do-i-procrastinate",
  status: "published" as const,

  seo: {
    title: "Why Do I Procrastinate?",
    metaDescription:
      "Answer 4 quick questions to find out why you procrastinate — free diagnostic with a personalized fix plan in under 60 seconds.",
    primaryKeyword: "why do i procrastinate",
    secondaryKeywords: [
      "why am i procrastinating",
      "reasons for procrastination",
      "procrastination causes",
      "can't start tasks",
      "procrastination quiz",
    ],
    searchIntent: "diagnostic" as const,
    canonicalPath: "/why-do-i-procrastinate",
  },

  taxonomy: {
    category: "productivity" as const,
    tags: ["procrastination", "diagnostic", "motivation"],
    cluster: "procrastination",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Why Do I Procrastinate?",
    intro:
      "Procrastination isn't laziness — it's usually a mismatch between the task and your brain's needs. Four questions to find your pattern and fix it.",
    eyebrow: "Interactive diagnostic",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_task",
    nodes: {
      q_task: {
        type: "question" as const,
        id: "q_task",
        prompt: "What kind of task do you procrastinate on most?",
        input: "single-choice" as const,
        options: [
          {
            id: "boring",
            label: "Boring or repetitive work",
            score: { boring: 3 },
            next: "q_feeling",
          },
          {
            id: "hard",
            label: "Hard or unfamiliar — I'm not sure how to start",
            score: { unclear: 3 },
            next: "q_feeling",
          },
          {
            id: "important",
            label: "Important work with high stakes",
            score: { perfection: 3 },
            next: "q_feeling",
          },
          {
            id: "everything",
            label: "Almost everything — even small tasks",
            score: { chronic: 3 },
            next: "q_feeling",
          },
        ],
      },
      q_feeling: {
        type: "question" as const,
        id: "q_feeling",
        prompt: "How do you feel right before you avoid the task?",
        input: "single-choice" as const,
        options: [
          {
            id: "anxious",
            label: "Anxious — worried about failing or being judged",
            score: { fear: 3 },
            next: "q_substitute",
          },
          {
            id: "overwhelmed",
            label: "Overwhelmed — the task feels too big",
            score: { overwhelm: 3 },
            next: "q_substitute",
          },
          {
            id: "restless",
            label: "Restless — I'd rather do literally anything else",
            score: { boring: 2 },
            next: "q_substitute",
          },
          {
            id: "fine",
            label: "Fine — I just \"forget\" or run out of time",
            score: { avoidance: 2 },
            next: "q_substitute",
          },
        ],
      },
      q_substitute: {
        type: "question" as const,
        id: "q_substitute",
        prompt: "What do you usually do instead?",
        input: "single-choice" as const,
        options: [
          {
            id: "phone",
            label: "Phone, social media, or videos",
            score: { distraction: 3 },
            next: "q_deadline",
          },
          {
            id: "busywork",
            label: "Easier work — email, organizing, small chores",
            score: { busywork: 3 },
            next: "q_deadline",
          },
          {
            id: "nothing",
            label: "Nothing productive — I stall or nap",
            score: { paralysis: 3 },
            next: "q_deadline",
          },
          {
            id: "planning",
            label: "More planning — lists and research, no action",
            score: { planning: 3 },
            next: "q_deadline",
          },
        ],
      },
      q_deadline: {
        type: "question" as const,
        id: "q_deadline",
        prompt: "When does the work usually get done?",
        input: "single-choice" as const,
        options: [
          {
            id: "panic",
            label: "Last minute — panic mode before the deadline",
            score: { deadline: 3 },
            next: "branch_result",
          },
          {
            id: "never",
            label: "Often never — or I miss deadlines",
            score: { chronic: 2 },
            next: "branch_result",
          },
          {
            id: "help",
            label: "When someone else pushes or helps",
            score: { external: 2 },
            next: "branch_result",
          },
          {
            id: "early",
            label: "Eventually, but with a lot of guilt and stress",
            score: { guilt: 2 },
            next: "branch_result",
          },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.fear >= 2 || scores.perfection >= 2", next: "result_fear" },
          { when: "scores.overwhelm >= 2", next: "result_overwhelm" },
          { when: "scores.boring >= 3", next: "result_boring" },
          { when: "scores.unclear >= 2", next: "result_unclear" },
          { when: "scores.planning >= 2", next: "result_planning" },
          { when: "scores.distraction >= 2", next: "result_distraction" },
          { when: "scores.deadline >= 2", next: "result_deadline" },
          { when: "scores.chronic >= 3", next: "result_chronic" },
        ],
        default: "result_general",
      },
      result_fear: {
        type: "result" as const,
        id: "result_fear",
        resultTemplateId: "fear",
      },
      result_overwhelm: {
        type: "result" as const,
        id: "result_overwhelm",
        resultTemplateId: "overwhelm",
      },
      result_boring: {
        type: "result" as const,
        id: "result_boring",
        resultTemplateId: "boring",
      },
      result_unclear: {
        type: "result" as const,
        id: "result_unclear",
        resultTemplateId: "unclear",
      },
      result_planning: {
        type: "result" as const,
        id: "result_planning",
        resultTemplateId: "planning",
      },
      result_distraction: {
        type: "result" as const,
        id: "result_distraction",
        resultTemplateId: "distraction",
      },
      result_deadline: {
        type: "result" as const,
        id: "result_deadline",
        resultTemplateId: "deadline",
      },
      result_chronic: {
        type: "result" as const,
        id: "result_chronic",
        resultTemplateId: "chronic",
      },
      result_general: {
        type: "result" as const,
        id: "result_general",
        resultTemplateId: "general",
      },
    },
  },

  results: {
    emptyMessage: "Answer the questions above to find your procrastination pattern.",
    templates: [
      {
        id: "fear",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Fear of failure",
            descriptionTemplate:
              "You delay because starting makes the outcome feel real — and risky.",
          },
        ],
        summaryTemplates: ["Your plan lowers stakes with a tiny, imperfect first step."],
      },
      {
        id: "overwhelm",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Task overwhelm",
            descriptionTemplate:
              "The project feels too big — so your brain chooses nothing instead of something.",
          },
        ],
        summaryTemplates: ["Your plan shrinks the task to one 2-minute physical action."],
      },
      {
        id: "boring",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Low engagement",
            descriptionTemplate:
              "The task doesn't reward you quickly — willpower loses to easier stimulation.",
          },
        ],
        summaryTemplates: ["Your plan adds urgency, rewards, and environment change."],
      },
      {
        id: "unclear",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Unclear start",
            descriptionTemplate:
              "You don't know the first step — so you wait for clarity that never arrives.",
          },
        ],
        summaryTemplates: ["Your plan defines the next physical action in under 10 words."],
      },
      {
        id: "planning",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Productive procrastination",
            descriptionTemplate:
              "Planning and researching feel like progress — but nothing ships.",
          },
        ],
        summaryTemplates: ["Your plan caps planning at 15 minutes, then forces execution."],
      },
      {
        id: "distraction",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Distraction escape",
            descriptionTemplate:
              "You reach for phones and feeds when the task gets uncomfortable.",
          },
        ],
        summaryTemplates: ["Your plan removes triggers before you need willpower."],
      },
      {
        id: "deadline",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Deadline-driven",
            descriptionTemplate:
              "You only move when time pressure overrides avoidance — stressful but familiar.",
          },
        ],
        summaryTemplates: ["Your plan creates artificial deadlines before the real one."],
      },
      {
        id: "chronic",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Chronic avoidance",
            descriptionTemplate:
              "Avoidance spans many tasks — habits and environment need a full reset.",
          },
        ],
        summaryTemplates: ["Your plan builds a daily start ritual, not one-off hacks."],
      },
      {
        id: "general",
        cards: [
          {
            title: "Your pattern",
            valueTemplate: "Mixed triggers",
            descriptionTemplate:
              "No single dominant cause — small fixes across clarity, environment, and stakes help.",
          },
        ],
        summaryTemplates: ["Your plan stacks three quick wins you can try today."],
      },
    ],
  },

  recommendations: [
    {
      id: "rec-fear",
      when: "scores.fear >= 2 || scores.perfection >= 2",
      title: "Your low-stakes start plan",
      steps: [
        "Write \"done enough\" in one sentence — not perfect, just acceptable.",
        "Set a 10-minute timer; goal is to begin, not finish.",
        "Share a rough draft deadline with one person — gentle accountability.",
        "Ship something small today — momentum beats perfection.",
      ],
    },
    {
      id: "rec-overwhelm",
      when: "scores.overwhelm >= 2",
      title: "Your shrink-the-task plan",
      steps: [
        "Brain-dump every subtask — then hide the list.",
        "Circle one item that moves the needle 1%.",
        "Define the next physical action (open doc, write one line, send one email).",
        "Do only that action for 5 minutes — stop even if you want to continue.",
      ],
    },
    {
      id: "rec-boring",
      when: "scores.boring >= 3",
      title: "Your engagement plan",
      steps: [
        "Pair the task with a reward you only get after 20 focused minutes.",
        "Change location — different room or café breaks the boredom loop.",
        "Use a body double or focus playlist for artificial company.",
        "Set a fake deadline 45 minutes out and tell a colleague.",
      ],
    },
    {
      id: "rec-unclear",
      when: "scores.unclear >= 2",
      title: "Your clarity plan",
      steps: [
        "Ask: \"What's the very next physical step?\" — write it in 10 words or fewer.",
        "If still stuck, find one example of someone who did this — copy their first step.",
        "Time-box research to 15 minutes — then act on the best guess.",
        "Done beats perfect when you're unclear — iterate after starting.",
      ],
    },
    {
      id: "rec-planning",
      when: "scores.planning >= 2",
      title: "Your execution plan",
      steps: [
        "Set a 15-minute planning timer — when it rings, start doing.",
        "Ban new tabs during planning — one doc, one list only.",
        "Your output must be action, not another plan — one sent email counts.",
        "Track \"started\" not \"planned\" — green check only for shipped work.",
      ],
    },
    {
      id: "rec-distraction",
      when: "scores.distraction >= 2",
      title: "Your trigger-removal plan",
      steps: [
        "Phone in another room for your first 25-minute block.",
        "Block social and news during work hours.",
        "Close all tabs except the one task.",
        "Put a note on your monitor: \"What am I doing right now?\"",
      ],
    },
    {
      id: "rec-deadline",
      when: "scores.deadline >= 2",
      title: "Your early-deadline plan",
      steps: [
        "Set a personal deadline 48 hours before the real one.",
        "Tell someone you'll send a draft by your early date.",
        "Break the project into daily micro-deadlines — one deliverable per day.",
        "Use Reset or calendar blocks to protect pre-deadline work time.",
      ],
    },
    {
      id: "rec-chronic",
      when: "scores.chronic >= 3",
      title: "Your daily ritual plan",
      steps: [
        "Same start time every workday — 10-minute \"activation\" ritual.",
        "One non-negotiable task before email or messages.",
        "Review sleep, movement, and screen time weekly — chronic avoidance has physical roots.",
        "Consider professional support if avoidance affects health or income.",
      ],
    },
    {
      id: "rec-general",
      when: "true",
      title: "Your three quick wins",
      steps: [
        "Write the next physical action in 10 words — do it for 5 minutes.",
        "Remove one distraction from your environment right now.",
        "Tell one person what you'll finish by end of day.",
      ],
    },
  ],

  guidance: [],

  ctas: {
    app: {
      title: "Turn insight into daily momentum",
      description:
        "Reset blocks distractions during focus blocks and helps you protect time for the tasks you've been avoiding — one session at a time.",
    },
  },

  faq: [
    {
      question: "Is procrastination the same as laziness?",
      answer:
        "No. Procrastination is often emotional avoidance — fear, overwhelm, or unclear tasks — not lack of ability or care. The fix matches the trigger, not \"try harder.\"",
    },
    {
      question: "How is this different from the procrastination cost calculator?",
      answer:
        "The calculator shows time and money lost. This diagnostic finds why you delay and gives a matched action plan.",
    },
    {
      question: "What if I relate to multiple patterns?",
      answer:
        "Start with the plan you're given, then revisit after a week. Fear and distraction fixes often unlock progress on everything else.",
    },
  ],
} satisfies Record<string, unknown>;
