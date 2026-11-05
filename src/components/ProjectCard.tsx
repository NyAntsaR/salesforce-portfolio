import Link from "next/link";
import type { Project } from "@/content/types";
import { StatusBadge } from "./StatusBadge";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const built = project.capabilities.filter((c) => c.status === "done").length;
  const partial = project.capabilities.filter((c) => c.status === "partial").length;

  return (
    <article
      className={`relative flex flex-col rounded-xl border border-border bg-surface p-6 transition-shadow focus-within:shadow-md hover:shadow-md ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">
          {/* The stretched link makes the whole card clickable while keeping one focus stop. */}
          <Link href={`/projects/${project.slug}/`} className="after:absolute after:inset-0 after:rounded-xl">
            {project.title}
          </Link>
        </h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-3 text-muted">{project.tagline}</p>
      <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
        {project.stack.slice(0, featured ? 8 : 4).map((tech) => (
          <li key={tech} className="rounded-md bg-surface-muted px-2 py-1 font-mono text-xs text-muted">
            {tech}
          </li>
        ))}
      </ul>
      <p className="mt-auto pt-6 text-sm text-muted">
        {built + partial > 0
          ? `${built} of ${project.capabilities.length} capabilities built` + (partial > 0 ? `, ${partial} partly built` : "")
          : "Design stage: nothing built yet"}
        <span aria-hidden="true" className="ml-2 text-accent">
          Read case study →
        </span>
      </p>
    </article>
  );
}
