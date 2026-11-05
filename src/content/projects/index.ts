import type { Project } from "../types";
import { githubIntegration } from "./github-integration";
import { orderFulfillment } from "./order-fulfillment";
import { batchSync } from "./batch-sync";

/** Projects in display order. The template in _template.ts is intentionally not listed. */
export const projects: Project[] = [githubIntegration, orderFulfillment, batchSync];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
