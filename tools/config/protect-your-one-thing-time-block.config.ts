import { ENGINE_CONSTANTS } from "./constants";

export const protectYourOneThingTimeBlockConfig = {
  schemaVersion: "1.0" as const,
  id: "protect-your-one-thing-time-block",
  slug: "protect-your-one-thing-time-block",
  status: "published" as const,

  seo: {
    title: "Protect Your ONE Thing Time Block",
    metaDescription:
      "When can you actually do your ONE Thing? Enter your work hours, meetings, and obligations — get your minimum time block, best slot, and what must wait until after.",
    primaryKeyword: "time block one thing",
    secondaryKeywords: [
      "schedule my priority",
      "protect time for important work",
      "one thing time blocking",
      "calendar block priority",
      "when to do my one thing",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/protect-your-one-thing-time-block",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["one-thing", "time-blocking", "calendar"],
    cluster: "one-thing",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Protect Your ONE Thing Time Block",
    intro:
      "Enter your typical day — see how much time you can protect, where it fits, and what must wait until after.",
    icon: "shield",
    proseTitle: "About time blocking",
    sections: [
      {
        id: "problem",
        heading: "Priority without protected time is a wish",
        framework: "pas",
        body: "You named your ONE Thing but the calendar filled anyway — meetings, comms, and reactive work ate the morning before your priority got a slot.",
      },
      {
        id: "concept",
        heading: "Time-block the ONE Thing first",
        framework: "concept",
        body: "[Gary Keller](https://www.the1thing.com/) teaches time blocking your ONE Thing before anything else lands on the calendar. The block is non-negotiable infrastructure — not leftover time after everyone else's requests.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "outcome",
        body: "Minimum viable block size, best slot in your day, percentage of work hours to protect, and what shallow work must batch around it.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "work_hours_day",
        type: "number" as const,
        label: "Work hours per day",
        placeholder: "e.g. 8",
        hint: "Your typical paid work day.",
        min: 1,
        max: 16,
        step: 0.5,
        required: true,
      },
      {
        id: "meeting_hours_day",
        type: "number" as const,
        label: "Meeting hours per day",
        placeholder: "e.g. 3",
        hint: "Average scheduled calls and syncs — spread daily.",
        min: 0,
        max: 12,
        step: 0.25,
        required: true,
      },
      {
        id: "reactive_hours_day",
        type: "number" as const,
        label: "Email & reactive work hours per day",
        placeholder: "e.g. 2",
        hint: "Inbox, Slack, requests — shallow but necessary.",
        min: 0,
        max: 12,
        step: 0.25,
        required: true,
      },
      {
        id: "personal_hours_day",
        type: "number" as const,
        label: "Non-work obligations during workday",
        placeholder: "e.g. 0.5",
        hint: "School pickup, appointments, commute buffer — hours lost mid-day.",
        min: 0,
        max: 8,
        step: 0.25,
        required: true,
      },
    ],
    constants: {
      WORK_DAYS_PER_WEEK: 5,
      WEEKS_PER_YEAR: ENGINE_CONSTANTS.WEEKS_PER_YEAR,
      MIN_BLOCK_MINUTES: 45,
      IDEAL_BLOCK_MINUTES: 90,
    },
    expressions: {
      claimedHoursDay:
        "inputs.meeting_hours_day + inputs.reactive_hours_day + inputs.personal_hours_day",
      availableHoursDay: "max(0, inputs.work_hours_day - calcs.claimedHoursDay)",
      availableMinutesDay: "calcs.availableHoursDay * 60",
      oneThingBlockHours: "min(calcs.availableHoursDay, constants.IDEAL_BLOCK_MINUTES / 60)",
      blockPercent: "(calcs.oneThingBlockHours / inputs.work_hours_day) * 100",
      weeklyOneThingHours: "calcs.oneThingBlockHours * constants.WORK_DAYS_PER_WEEK",
      yearlyOneThingHours: "calcs.weeklyOneThingHours * constants.WEEKS_PER_YEAR",
      canFitIdealBlock: "calcs.availableMinutesDay >= constants.IDEAL_BLOCK_MINUTES",
      canFitMinBlock: "calcs.availableMinutesDay >= constants.MIN_BLOCK_MINUTES",
      remainingAfterBlock: "max(0, calcs.availableHoursDay - calcs.oneThingBlockHours)",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your daily hours to see where your ONE Thing block can live on the calendar.",
    templates: [
      {
        id: "default",
        cardColumns: 3 as const,
        cards: [
          {
            title: "Protectable block",
            valueTemplate: "{{calcs.oneThingBlockHours|decimal1}} hrs",
            descriptionTemplate: "{{calcs.blockPercent|decimal1}}% of your workday for ONE Thing",
          },
          {
            title: "Unclaimed time",
            valueTemplate: "{{calcs.availableHoursDay|decimal1}} hrs",
            descriptionTemplate: "After meetings, reactive work, and obligations",
          },
          {
            title: "Weekly ONE Thing",
            valueTemplate: "{{calcs.weeklyOneThingHours|decimal1}} hrs",
            descriptionTemplate: "If you block the same slot daily",
          },
        ],
        summaryTemplates: [
          "Keller's rule: block {{calcs.oneThingBlockHours|decimal1}} hours for your ONE Thing before anything else touches today's calendar.",
        ],
        comparisonTitle: "What this means",
        comparisonRules: [
          {
            when: "calcs.availableHoursDay < 0.75",
            textTemplate:
              "Under 45 minutes free — calendar surgery required. Cut one meeting or batch reactive work before ONE Thing is possible.",
          },
          {
            when: "calcs.canFitIdealBlock >= 1",
            textTemplate:
              "You can fit a 90-minute ONE Thing block — Keller's sweet spot. Schedule it first thing before inbox and meetings.",
          },
          {
            when: "calcs.claimedHoursDay >= inputs.work_hours_day * 0.7",
            textTemplate:
              "Over 70% of your day is claimed before your ONE Thing — you're going small on what matters most.",
          },
          {
            when: "inputs.meeting_hours_day >= 4",
            textTemplate:
              "{{inputs.meeting_hours_day}} meeting hours daily — defend the gap before first call or decline one recurring sync.",
          },
          {
            when: "true",
            textTemplate:
              "Everything except the ONE Thing block is \"everything else\" — batch it after the block ends.",
          },
        ],
        fallbackComparison:
          "If the block feels impossible, your ONE Thing may be too big — shrink the task, not the block.",
      },
    ],
  },

  guidance: [
    {
      title: "Keller's time-blocking rule",
      body: "Block time for your ONE Thing first — before email, meetings, or other people's priorities claim the day.",
      list: [
        "Same time daily when possible — rhythm beats random long blocks",
        "45–90 minutes is the practical ONE Thing block range",
        "Reactive work waits until after the block — not before",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Hold the block you scheduled",
      description:
        "Reset blocks distracting apps during your ONE Thing time block — so the calendar slot you protected isn't lost to phone drift.",
    },
  },

  faq: [
    {
      question: "How long should a ONE Thing time block be?",
      answer:
        "[Gary Keller](https://www.the1thing.com/) recommends blocking substantial time — often 90 minutes or more for knowledge work. If your calendar is tight, start with 45 minutes daily rather than skipping entirely.",
    },
    {
      question: "When should I schedule my ONE Thing block?",
      answer:
        "Before everything else — usually first thing in the workday when willpower is highest. Use the [When to Do Deep Work](/when-to-do-deep-work) tool if you need help picking the clock time.",
    },
    {
      question: "What if meetings fill my morning?",
      answer:
        "Find the first gap — even 45 minutes — or negotiate one no-meeting morning. The calculator shows how much unclaimed time you actually have.",
    },
  ],

  recommendations: [],
};
