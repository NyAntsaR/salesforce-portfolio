/**
 * Content model for the portfolio. Every claim about a project carries a status,
 * so unfinished work can never be presented as done.
 */

/** Overall project state, shown as a badge on cards and case studies. */
export type ProjectStatus = "in-progress" | "planned" | "complete";

/** State of an individual capability, component, or diagram node. */
export type ItemStatus = "done" | "partial" | "planned";

/** A link that may not exist yet. Omit href to render a visible placeholder. */
export interface MaybeLink {
  label: string;
  href?: string;
}

export interface Capability {
  label: string;
  status: ItemStatus;
  /** What exists today, and what is still missing. */
  detail: string;
}

export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  /** Grid position: column (left to right) and row (top to bottom), starting at 0. */
  column: number;
  row: number;
  status: ItemStatus;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ArchitectureDiagram {
  title: string;
  /** One or two sentences describing the flow, used as the SVG description. */
  description: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface ComponentEntry {
  name: string;
  /** e.g. "Apex class", "Custom object", "Lightning page". */
  kind: string;
  description: string;
  /** Link to the source file, when it is in a public repository. */
  sourceHref?: string;
  status: ItemStatus;
}

export interface DesignDecision {
  title: string;
  detail: string;
}

export interface Screenshot {
  /** Path under /public, e.g. "/screenshots/case-page.png". Omit for a placeholder. */
  src?: string;
  alt: string;
  caption: string;
}

export interface Project {
  slug: string;
  title: string;
  /** One line for cards. */
  tagline: string;
  status: ProjectStatus;
  /** Two or three sentences for the top of the case study. */
  summary: string;
  problem: string;
  stack: string[];
  capabilities: Capability[];
  architecture: ArchitectureDiagram;
  components: ComponentEntry[];
  decisions: DesignDecision[];
  /** Describe only tests that exist and results you have observed. */
  testing?: {
    summary: string;
    points: string[];
  };
  screenshots: Screenshot[];
  demo: MaybeLink & { note: string };
  links: MaybeLink[];
  /** Date the facts on the page were last checked against the source, YYYY-MM-DD. */
  lastVerified?: string;
}
