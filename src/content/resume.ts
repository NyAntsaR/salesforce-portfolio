/**
 * Resume content. The /resume/ page renders this, and the downloadable PDF is
 * printed from that page (see README), so edit here and regenerate the PDF.
 *
 * Only facts from Ny's own resume are used. The phone number is intentionally
 * left out of this public version.
 */

export interface ResumeRole {
  company: string;
  location: string;
  title: string;
  start: string;
  end: string;
  highlights: string[];
}

export interface ResumeProject {
  name: string;
  status: string;
  href: string;
  highlights: string[];
}

export const resume = {
  name: "Ny Antsa Rajaonarison",
  headline: "Salesforce Developer · Apex, Lightning Web Components & Integrations",
  location: "Scottsdale, AZ",

  summary:
    "Salesforce Developer with 6+ years designing, building, and deploying custom applications in enterprise and consulting " +
    "environments, currently at Google. Specializes in Apex (triggers, Batch and Queueable), Lightning Web Components, and " +
    "REST/SOAP integrations, writing bulkified, governor-limit-safe code and maintainable security models. Has led delivery of " +
    "four Salesforce implementations and works directly with stakeholders from requirements through release. " +
    "9x Salesforce Certified, including Platform Developer II.",

  skills: [
    {
      title: "Development",
      items: [
        "Apex (triggers, classes, Batch, Queueable)",
        "Lightning Web Components",
        "Visualforce",
        "Dynamic SOQL/SOSL",
        "Flow Builder",
      ],
    },
    {
      title: "Integrations",
      items: ["REST & SOAP web services", "Webhooks", "JSON/XML parsing", "Middleware integration", "Named Credentials"],
    },
    {
      title: "Architecture & security",
      items: ["Object modeling", "Sharing rules", "Permission sets & Permission Set Groups", "Role hierarchy", "Data security"],
    },
    {
      title: "Delivery & tooling",
      items: [
        "Git",
        "Salesforce CLI",
        "VS Code",
        "CI/CD pipelines",
        "Change sets",
        "Unit testing & coverage",
        "Code reviews",
        "Agile/Scrum",
      ],
    },
  ],

  experience: [
    {
      company: "Google",
      location: "Arizona",
      title: "Salesforce Developer",
      start: "Sep 2025",
      end: "Present",
      highlights: [
        "Architecting the migration of legacy permission structures to a Permission Set Group model, reducing technical debt and simplifying user provisioning and lifecycle management.",
        "Deliver automated workflows and custom logic that streamline internal business processes and improve team efficiency.",
      ],
    },
    {
      company: "AAA – The Auto Club Group",
      location: "Dearborn, MI",
      title: "Salesforce Developer",
      start: "Mar 2023",
      end: "Sep 2025",
      highlights: [
        "Built Apex REST callouts and JSON parsing to retrieve data from external systems and populate Salesforce records asynchronously within governor limits.",
        "Turned requirements from multiple business teams into scalable solutions using Apex, Lightning Web Components, and Flow.",
        "Designed features that reduced manual data entry and improved workflow efficiency and user experience.",
        "Partnered with stakeholders to prioritize the enhancement backlog and deliver the highest-impact work first.",
      ],
    },
    {
      company: "Slalom",
      location: "New York, NY",
      title: "Salesforce Developer",
      start: "Sep 2022",
      end: "Mar 2023",
      highlights: [
        "Led delivery of four Salesforce implementations, aligning technical solutions with each client's business goals.",
        "Defined product requirements and solution strategy directly with client stakeholders.",
        "Prioritized features and coordinated cross-functional teams to deliver on schedule, maintaining quality through testing and iterative feedback.",
      ],
    },
    {
      company: "Cognizant",
      location: "New Jersey",
      title: "Salesforce Developer",
      start: "Feb 2020",
      end: "Sep 2022",
      highlights: [
        "Delivered features supporting a large-scale CRM integration for Petco.",
        "Defined and refined requirements with stakeholders, acting as the bridge between business and engineering teams.",
        "Facilitated Agile ceremonies and improved the team's delivery efficiency.",
      ],
    },
    {
      company: "Thales",
      location: "Paris, France",
      title: "Project Manager",
      start: "Jan 2018",
      end: "Feb 2019",
      highlights: [
        "Managed product delivery for supply-chain and training applications, setting roadmap priorities and aligning stakeholders.",
        "Translated business needs into actionable development plans.",
      ],
    },
  ] satisfies ResumeRole[],

  projects: [
    {
      name: "Salesforce ↔ GitHub Integration",
      status: "In progress",
      href: "https://nyantsar.github.io/salesforce-portfolio/projects/salesforce-github-integration/",
      highlights: [
        "Service Cloud Case escalation that creates GitHub Issues through Queueable Apex callouts, authenticated with a Named Credential and OAuth.",
        "Duplicate prevention with row locking and user-mode security, an integration log object, and repository settings in Custom Metadata.",
        "26 Apex test methods with mocked callouts covering success, validation, and error paths.",
      ],
    },
  ] satisfies ResumeProject[],

  certifications: {
    // TODO: list the other five certification names so the full set of nine is shown.
    summary: "9x Salesforce Certified",
    names: ["Platform Developer II", "Platform Developer I", "Administrator", "Platform App Builder"],
  },

  education: [
    { name: "Master's in Information Systems & Technology", school: "IONIS-STM", location: "Paris, France" },
    { name: "Master's in International Business", school: "IAE Poitiers", location: "France" },
    { name: "Software Engineering Immersive", school: "General Assembly", location: "San Francisco, CA" },
    { name: "Salesforce Developer Apprenticeship", school: "Quintrix", location: "Jersey City, NJ" },
  ],
};
