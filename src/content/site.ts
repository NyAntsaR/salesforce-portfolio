import type { MaybeLink } from "./types";

/**
 * Personal details for the portfolio.
 * A link without an href renders as a visible "pending" placeholder.
 */
export const site = {
  name: "Ny Antsa",
  role: "Salesforce Developer",
  yearsOfExperience: 6,
  intro:
    "I build Salesforce solutions with Apex, Lightning Web Components, and Service Cloud, " +
    "and I design integrations between Salesforce and external systems over REST APIs.",
  credentials: "Salesforce Developer at Google · 9x Salesforce Certified, including Platform Developer II",
  focus:
    "This portfolio documents integration projects I am building in the open, " +
    "with the status of each part stated plainly.",

  // Absolute URL of the deployed site, used for SEO metadata and the sitemap.
  // The deploy workflow sets NEXT_PUBLIC_SITE_URL; this default matches a
  // repository named "salesforce-portfolio" under github.com/NyAntsaR.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nyantsar.github.io/salesforce-portfolio",

  github: { label: "GitHub", href: "https://github.com/NyAntsaR" } as MaybeLink,
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/nyantsarajaonarison/" } as MaybeLink,
  // TODO: your Trailblazer profile URL (the link in the resume PDF points to the generic profile page).
  trailblazer: { label: "Trailblazer profile" } as MaybeLink,
  email: { label: "Email", href: "mailto:nyantsa.rajaonarison@gmail.com" } as MaybeLink,
  // Generated from the /resume/ page; see "Updating the resume" in the README.
  resume: { label: "Download resume (PDF)", href: "/resume/ny-antsa-rajaonarison-resume.pdf" } as MaybeLink,
};

export interface SkillGroup {
  title: string;
  skills: string[];
}

/** Skills from Ny's resume, plus tools used in the projects on this site. */
export const skillGroups: SkillGroup[] = [
  {
    title: "Salesforce development",
    skills: [
      "Apex",
      "Triggers",
      "Batch & Queueable Apex",
      "Lightning Web Components",
      "Visualforce",
      "Dynamic SOQL/SOSL",
      "Flow Builder",
      "Apex unit testing",
    ],
  },
  {
    title: "Integration",
    skills: [
      "REST & SOAP web services",
      "Webhooks",
      "JSON/XML parsing",
      "Middleware integration",
      "Named & External Credentials",
      "OAuth 2.0",
    ],
  },
  {
    title: "Architecture & security",
    skills: [
      "Object modeling",
      "Sharing rules",
      "Permission Set Groups",
      "Role hierarchy",
      "Service Cloud",
      "Dynamic Forms",
    ],
  },
  {
    title: "Delivery & tooling",
    skills: ["Git", "Salesforce CLI", "VS Code", "CI/CD pipelines", "Change sets", "Code reviews", "Agile/Scrum"],
  },
];
