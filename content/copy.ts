// Static page copy, taken verbatim from the landing page spec (sections 5.1 to 5.10, 7).
// Items marked [PLACEHOLDER] stay visible on purpose until real values exist.

export const copy = {
  nav: {
    wordmark: "ALMA MATER",
    badge: "CENTRE: IIT (BHU) · NOW LIVE",
    forAlumniLink: "For alumni",
    joinButton: "Join the waitlist",
  },

  hero: {
    eyebrowTemplate: "{USE CASE}",
    primaryCta: "JOIN THE WAITLIST",
    secondaryCta: "I’m an alum. I want to help.",
    stamp: ["LIFE IS UNFAIR.", "USE YOUR UNFAIR ADVANTAGE."],
    cardHeaderTemplate: "ALUMNI ADMIT CARD · MATCH FOR: {USE CASE}",
    searching: "Matching your question to an alum…",
    illustrativeCaption: "Illustrative example",
    cardFields: {
      name: "NAME",
      batchBranch: "BATCH · BRANCH",
      currently: "CURRENTLY",
      whyThem: "WHY THEM",
      reachOut: "REACH OUT",
    },
  },

  gap: {
    heading: "NOTE TO CANDIDATES",
    body: "Most people never use their alumni network.",
    followUp: "Not because alumni won’t help. Because nobody knows which one can.",
    contrastLeft: "An alumni directory: 1,000s of names. Now what?",
    contrastRight: "Alma Mater: the one alum who’s done what you need",
  },

  howItWorks: {
    heading: "INSTRUCTIONS TO CANDIDATES",
    steps: [
      {
        n: 1,
        title: "Write your question.",
        body: "Tell us what you’re trying to get done, in plain words.",
      },
      {
        n: 2,
        title: "Get matched.",
        body: "We find the alum who’s already done it, and show you why they’re the right one.",
      },
      {
        n: 3,
        title: "Reach out.",
        body: "Ask for help from someone who shares your campus.",
      },
    ],
  },

  forAlumni: {
    anchorId: "alumni",
    heading: "BE SOMEONE’S ANSWER KEY.",
    body: "Somewhere on campus, someone is stuck on a question you’ve already answered. Alma Mater sends them to you, only for the things you choose to help with.",
    sampleTags: ["Happy to refer", "Open to mentoring", "Open to business"],
    cta: "Join the waitlist as an alum",
  },

  buildTogether: {
    heading: "YOUR NEXT DEAL MIGHT BE WITH AN ALUM.",
    body: "Shared campus means shared trust. That means less vetting, faster deals, and no middlemen.",
    cards: ["First customer", "Supplier", "Co-founder"],
    stamp: "TRUSTED: SAME CAMPUS.",
  },

  examCentres: {
    items: ["IIT (BHU) — LIVE", "OTHER IITs — NEXT", "IIMs — AFTER THAT"],
  },

  waitlist: {
    anchorId: "waitlist",
    heading: "CLAIM YOUR ADMIT CARD.",
    subheading: "Be first in when we open.",
    emailLabel: "Email",
    roleLabel: "I am a:",
    roles: ["Student", "Recent graduate", "Alum"],
    collegeLabel: "College",
    collegeDefault: "IIT (BHU)",
    collegeOther: "Other",
    firstNeedLabel: "What would you ask an alum for first?",
    submit: "ISSUE MY ADMIT CARD.",
    success: {
      stamp: "REGISTERED",
      message: "You’re on the list. We’ll email you when Alma Mater opens.",
    },
    duplicate: "You’re already on the list",
  },

  footer: {
    wordmark: "ALMA MATER",
    tagline: "Made for alumni, by an alum.",
    contactEmail: "[PLACEHOLDER: contact email]",
  },

  seo: {
    title: "Alma Mater — Find the alum who can help",
    description:
      "Tell us what you need. We’ll find the alum who’s already done it. Now live for IIT (BHU).",
    ogImage: "[PLACEHOLDER: OG image]",
    favicon: "[PLACEHOLDER]",
  },
} as const;
