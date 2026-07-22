export const iCantStopScrollingConfig = {
  schemaVersion: "1.0" as const,
  id: "i-cant-stop-scrolling",
  slug: "i-cant-stop-scrolling",
  status: "published" as const,

  seo: {
    title: "I Can't Stop Scrolling",
    metaDescription:
      "Can't stop scrolling? Answer 4 questions and get a personalized plan to break the feed loop — free interactive tool in under 60 seconds.",
    primaryKeyword: "i can't stop scrolling",
    secondaryKeywords: [
      "can't stop scrolling",
      "compulsive scrolling",
      "addicted to scrolling",
      "stop endless scrolling",
      "doom scrolling help",
    ],
    searchIntent: "how-to" as const,
    canonicalPath: "/i-cant-stop-scrolling",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["scrolling", "doomscrolling", "social-media"],
    cluster: "doomscrolling",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "I Can't Stop Scrolling",
    intro:
      "When one more swipe becomes an hour, the feed is winning. Four questions to find your scroll pattern and a plan to interrupt it.",
    eyebrow: "Scroll interrupt plan",
  },

  mode: "decision-tree" as const,
  flow: {
    type: "decision-tree" as const,
    entry: "q_when",
    nodes: {
      q_when: {
        type: "question" as const,
        id: "q_when",
        prompt: "When does scrolling take over?",
        input: "single-choice" as const,
        options: [
          { id: "morning", label: "First thing in the morning", score: { morning: 2 }, next: "q_app" },
          { id: "breaks", label: "Breaks between tasks", score: { breaks: 3 }, next: "q_app" },
          { id: "night", label: "Late at night in bed", score: { night: 3 }, next: "q_app" },
          { id: "always", label: "Any downtime — it's constant", score: { constant: 3 }, next: "q_app" },
        ],
      },
      q_app: {
        type: "question" as const,
        id: "q_app",
        prompt: "Where do you scroll most?",
        input: "single-choice" as const,
        options: [
          { id: "tiktok", label: "TikTok or short video", score: { short: 3 }, next: "q_feel" },
          { id: "instagram", label: "Instagram or stories", score: { social: 3 }, next: "q_feel" },
          { id: "news", label: "News, Reddit, or X", score: { news: 3 }, next: "q_feel" },
          { id: "mix", label: "Everything — I hop apps", score: { mix: 3 }, next: "q_feel" },
        ],
      },
      q_feel: {
        type: "question" as const,
        id: "q_feel",
        prompt: "How do you feel while scrolling?",
        input: "single-choice" as const,
        options: [
          { id: "numb", label: "Numb — autopilot", score: { numb: 3 }, next: "q_stop" },
          { id: "anxious", label: "Anxious but can't stop", score: { anxious: 3 }, next: "q_stop" },
          { id: "fomo", label: "FOMO — afraid to miss something", score: { fomo: 2 }, next: "q_stop" },
          { id: "escape", label: "Escaping stress or boredom", score: { escape: 3 }, next: "q_stop" },
        ],
      },
      q_stop: {
        type: "question" as const,
        id: "q_stop",
        prompt: "What happens when you try to stop?",
        input: "single-choice" as const,
        options: [
          { id: "back", label: "I'm back within minutes", score: { loop: 3 }, next: "branch_result" },
          { id: "guilt", label: "I stop but feel guilty and tired", score: { guilt: 2 }, next: "branch_result" },
          { id: "cant", label: "I often don't try — it feels pointless", score: { hopeless: 2 }, next: "branch_result" },
        ],
      },
      branch_result: {
        type: "branch" as const,
        id: "branch_result",
        conditions: [
          { when: "scores.night >= 2", next: "result_night" },
          { when: "scores.short >= 2", next: "result_short" },
          { when: "scores.news >= 2", next: "result_news" },
          { when: "scores.escape >= 2 || scores.anxious >= 2", next: "result_escape" },
          { when: "scores.loop >= 2 || scores.constant >= 2", next: "result_loop" },
        ],
        default: "result_general",
      },
      result_night: { type: "result" as const, id: "result_night", resultTemplateId: "night" },
      result_short: { type: "result" as const, id: "result_short", resultTemplateId: "short" },
      result_news: { type: "result" as const, id: "result_news", resultTemplateId: "news" },
      result_escape: { type: "result" as const, id: "result_escape", resultTemplateId: "escape" },
      result_loop: { type: "result" as const, id: "result_loop", resultTemplateId: "loop" },
      result_general: { type: "result" as const, id: "result_general", resultTemplateId: "general" },
    },
  },

  results: {
    emptyMessage: "Answer the questions to get your scroll-break plan.",
    templates: [
      { id: "night", cards: [{ title: "Your pattern", valueTemplate: "Bed scroll trap", descriptionTemplate: "The phone in bed hijacks sleep and recovery." }], summaryTemplates: ["Your plan removes the phone from the bedroom routine."] },
      { id: "short", cards: [{ title: "Your pattern", valueTemplate: "Short-video loop", descriptionTemplate: "Algorithm + quick hits = hours gone in minutes." }], summaryTemplates: ["Your plan adds hard limits and friction to video apps."] },
      { id: "news", cards: [{ title: "Your pattern", valueTemplate: "Outrage / news spiral", descriptionTemplate: "Bad news keeps you hooked — stress without action." }], summaryTemplates: ["Your plan batches news and removes infinite feeds."] },
      { id: "escape", cards: [{ title: "Your pattern", valueTemplate: "Stress escape scroll", descriptionTemplate: "Scrolling numbs discomfort — briefly." }], summaryTemplates: ["Your plan addresses the feeling before the feed."] },
      { id: "loop", cards: [{ title: "Your pattern", valueTemplate: "Compulsive loop", descriptionTemplate: "Stop → restart → stop — the habit is wired." }], summaryTemplates: ["Your plan uses hard stops and replacement rituals."] },
      { id: "general", cards: [{ title: "Your pattern", valueTemplate: "General scroll habit", descriptionTemplate: "Feeds fill every gap — you need a default instead." }], summaryTemplates: ["Your plan pre-assigns scroll-free alternatives for downtime."] },
    ],
  },

  recommendations: [
    { id: "rec-night", when: "scores.night >= 2", title: "Your bedtime plan", steps: ["Charge phone outside bedroom — use a basic alarm if needed.", "Replace scroll with 10 pages of a book or podcast with screen off.", "Set app limits that lock social after 9pm.", "If you wake up, don't touch the phone — water and bathroom only."] },
    { id: "rec-short", when: "scores.short >= 2", title: "Your short-video plan", steps: ["Delete or log out of the worst app for 7 days.", "Set 20-minute daily limit — hard stop when hit.", "Remove app from home screen — search-only access.", "Replace first scroll of the day with 5-minute walk."] },
    { id: "rec-news", when: "scores.news >= 2", title: "Your news diet plan", steps: ["One 15-minute news window per day — timer enforced.", "Unfollow outrage accounts — curate or quit.", "No news in bed or first hour of morning.", "Subscribe to one digest email instead of infinite feeds."] },
    { id: "rec-escape", when: "scores.escape >= 2 || scores.anxious >= 2", title: "Your urge plan", steps: ["When urge hits: name the feeling (bored, stressed, lonely).", "2-minute timer — sit with feeling before opening app.", "Do 10 push-ups or walk to another room.", "If you still scroll, log duration — awareness reduces time."] },
    { id: "rec-loop", when: "scores.loop >= 2 || scores.constant >= 2", title: "Your hard-stop plan", steps: ["Grayscale mode during work and evenings.", "Screen Time / Digital Wellbeing: 30 min social max.", "When timer ends, phone in drawer — 10-minute walk mandatory.", "Use Reset to block feeds during focus and sleep hours."] },
    { id: "rec-general", when: "true", title: "Your default swap plan", steps: ["List 3 scroll triggers (waiting, tired, after meals).", "Assign replacement for each: stretch, text a friend, one song.", "Keep phone face-down in pocket during transitions.", "Track scroll minutes daily — aim 10% less each week."] },
  ],

  guidance: [],
  ctas: { app: { title: "Stop the infinite feed", description: "Reset blocks social feeds during focus and sleep hours — so scrolling stops being the default when you have a free moment." } },
  faq: [
    { question: "Why can't I stop scrolling even when I want to?", answer: "Feeds are engineered for variable rewards — your brain keeps seeking the next hit. Willpower loses to design; you need limits and friction." },
    { question: "Is scrolling addiction real?", answer: "Compulsive scrolling shares patterns with behavioral addiction — loss of control, distress, repeated failed attempts to cut back. Tools and limits help; severe cases may need professional support." },
    { question: "Should I delete all social apps?", answer: "Not required. Many people succeed with limits, grayscale, off-home-screen, and scheduled windows. Delete if softer boundaries fail after 2 weeks." },
  ],
} satisfies Record<string, unknown>;
