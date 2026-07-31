/** Official outbound links for E-E-A-T and SEO citations in tool copy. */

export const authoritativeSources = {
  garyKeller: {
    label: "Gary Keller",
    href: "https://www.the1thing.com/",
  },
  theOneThingBook: {
    label: "The ONE Thing",
    href: "https://www.the1thing.com/",
  },
  calNewport: {
    label: "Cal Newport",
    href: "https://calnewport.com/",
  },
  deepWorkBook: {
    label: "Deep Work",
    href: "https://calnewport.com/books/deep-work/",
  },
  digitalMinimalismBook: {
    label: "Digital Minimalism",
    href: "https://calnewport.com/books/digital-minimalism/",
  },
  ucIrvineInterruptions: {
    label: "UC Irvine interruption research",
    href: "https://www.ics.uci.edu/~gmark/chi08.pdf",
  },
} as const;

/** Markdown link snippets for FAQ and guidance strings in configs. */
export const sourceLinks = {
  garyKeller: `[Gary Keller](${authoritativeSources.garyKeller.href})`,
  theOneThing: `[The ONE Thing](${authoritativeSources.theOneThingBook.href})`,
  calNewport: `[Cal Newport](${authoritativeSources.calNewport.href})`,
  deepWork: `[Deep Work](${authoritativeSources.deepWorkBook.href})`,
  digitalMinimalism: `[Digital Minimalism](${authoritativeSources.digitalMinimalismBook.href})`,
  ucIrvineInterruptions: `[UC Irvine interruption research](${authoritativeSources.ucIrvineInterruptions.href})`,
} as const;
