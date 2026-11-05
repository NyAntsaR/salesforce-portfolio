import type { MaybeLink } from "./types";

/**
 * Personal details for the portfolio.
 * Values marked TODO are placeholders: fill them in before publishing.
 * A link without an href renders as a visible "pending" placeholder.
 */
export const site = {
  name: "Ny Antsa",
  role: "Salesforce Developer",
  yearsOfExperience: 6,
  intro:
    "I build Salesforce solutions with Apex, Lightning Web Components, and Service Cloud, " +
    "and I design integrations between Salesforce and external systems over REST APIs.",
  focus:
    "This portfolio documents integration projects I am building in the open, " +
    "with the status of each part stated plainly.",

  // Absolute URL of the deployed site, used for SEO metadata and the sitemap.
  // The deploy workflow sets NEXT_PUBLIC_SITE_URL; this default matches a
  // repository named "salesforce-portfolio" under github.com/NyAntsaR.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nyantsar.github.io/salesforce-portfolio",

  github: { label: "GitHub", href: "https://github.com/NyAntsaR" } as MaybeLink,
  // TODO: your LinkedIn profile URL.
  linkedin: { label: "LinkedIn" } as MaybeLink,
  // TODO: a contact email you are happy to publish (a mailto: link).
  email: { label: "Email" } as MaybeLink,
  // TODO: add your resume as public/resume/resume.pdf, then set href to "/resume/resume.pdf".
  resume: { label: "Download resume (PDF)" } as MaybeLink,
};

export interface SkillGroup {
  title: string;
  skills: string[];
}

/**
 * Skills from your stated experience, plus tools used in the projects on this site.
 * Add to this list; do not list anything you have not worked with.
 */
export const skillGroups: SkillGroup[] = [
  {
    title: "Salesforce development",
    skills: [
      "Apex",
      "Lightning Web Components",
      "Queueable Apex",
      "SOQL (user mode)",
      "Apex unit testing",
    ],
  },
  {
    title: "Service Cloud & platform",
    skills: [
      "Service Cloud",
      "Lightning App Builder",
      "Dynamic Forms",
      "Custom objects & metadata types",
      "Permission sets",
    ],
  },
  {
    title: "Integration & architecture",
    skills: [
      "REST API integrations",
      "Named & External Credentials",
      "OAuth 2.0",
      "Integration logging",
      "Salesforce architecture",
    ],
  },
  {
    title: "Tooling",
    skills: ["Salesforce CLI (sf)", "Salesforce DX", "Git & GitHub"],
  },
];
