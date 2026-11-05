import type { Project } from "../types";

/**
 * Case-study template. To add a project:
 *  1. Copy this file to src/content/projects/<your-project>.ts and rename the export.
 *  2. Fill in only what exists. Use status "planned" or "partial" for anything unfinished,
 *     and leave href undefined for links you don't have yet (they render as placeholders).
 *  3. Add the export to the list in src/content/projects/index.ts.
 * The page at /projects/<slug>/ is generated automatically.
 */
export const projectTemplate: Project = {
  slug: "my-project",
  title: "Project title",
  tagline: "One sentence for the project card.",
  status: "planned",
  summary: "Two or three sentences: what it does and how far along it is.",
  problem: "The business problem this solves.",
  stack: ["Apex"],
  capabilities: [
    { label: "A capability", status: "planned", detail: "What exists today and what is missing." },
  ],
  architecture: {
    title: "Flow",
    description: "One or two sentences describing the diagram for screen readers.",
    nodes: [
      { id: "a", label: "Source", column: 0, row: 0, status: "planned" },
      { id: "b", label: "Target", column: 1, row: 0, status: "planned" },
    ],
    edges: [{ from: "a", to: "b" }],
  },
  components: [],
  decisions: [],
  // testing: { summary: "Only results you have actually observed.", points: [] },
  screenshots: [],
  demo: { label: "Demo", note: "Not recorded yet." },
  links: [{ label: "Source code" }],
};
