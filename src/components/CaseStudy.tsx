import Link from "next/link";
import type { Project } from "@/content/types";
import { withBasePath } from "@/lib/paths";
import { ArchitectureDiagram } from "./diagrams/ArchitectureDiagram";
import { LinkOrPlaceholder } from "./LinkOrPlaceholder";
import { StatusBadge } from "./StatusBadge";

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-semibold tracking-tight sm:text-2xl">
      {children}
    </h2>
  );
}

/**
 * Reusable case-study layout. Renders any Project from src/content/projects;
 * sections with no content are left out, so planned projects stay short.
 */
export function CaseStudy({ project }: { project: Project }) {
  const statusNote =
    project.status === "planned"
      ? "This project is planned. The page describes intended scope only; nothing below has been built yet."
      : project.status === "in-progress"
        ? "This project is in progress. Each capability below is marked as built, partly built, or planned."
        : null;

  return (
    <article className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <header className="border-b border-border py-10 sm:py-14">
        <Link href="/#projects" className="text-sm text-muted hover:text-foreground">
          ← All projects
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-4 max-w-3xl text-lg text-muted">{project.summary}</p>
        {statusNote && (
          <p className="mt-6 max-w-3xl rounded-lg border border-border bg-surface-muted px-4 py-3 text-sm" role="note">
            {statusNote}
          </p>
        )}
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {project.links.map((link) => (
            <li key={link.label}>
              <LinkOrPlaceholder link={link} />
            </li>
          ))}
        </ul>
        {project.lastVerified && (
          <p className="mt-4 text-xs text-muted">
            Details checked against the source code on <time dateTime={project.lastVerified}>{project.lastVerified}</time>.
          </p>
        )}
      </header>

      <section aria-labelledby="problem" className="mt-12">
        <SectionHeading id="problem">The problem</SectionHeading>
        <p className="mt-4 max-w-3xl">{project.problem}</p>
      </section>

      <section aria-labelledby="capabilities" className="mt-12">
        <SectionHeading id="capabilities">Scope and status</SectionHeading>
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-surface">
          {project.capabilities.map((capability) => (
            <li key={capability.label} className="flex flex-col gap-2 p-4 sm:flex-row sm:gap-6">
              <div className="sm:w-28 sm:shrink-0">
                <StatusBadge status={capability.status} />
              </div>
              <div>
                <p className="font-medium">{capability.label}</p>
                {capability.detail !== "Planned." && <p className="mt-1 text-sm text-muted">{capability.detail}</p>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="architecture" className="mt-12">
        <SectionHeading id="architecture">Architecture</SectionHeading>
        <div className="mt-6">
          <ArchitectureDiagram diagram={project.architecture} id={`${project.slug}-diagram`} />
        </div>
      </section>

      {project.components.length > 0 && (
        <section aria-labelledby="components" className="mt-12">
          <SectionHeading id="components">What&apos;s in the code</SectionHeading>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {project.components.map((component) => (
              <li key={component.name} className="flex flex-col rounded-xl border border-border bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-mono text-sm font-semibold">{component.name}</p>
                    <p className="text-xs text-muted">{component.kind}</p>
                  </div>
                  <StatusBadge status={component.status} />
                </div>
                <p className="mt-3 text-sm text-muted">{component.description}</p>
                {component.sourceHref && (
                  <p className="mt-auto pt-4 text-sm">
                    <LinkOrPlaceholder link={{ label: "View source", href: component.sourceHref }} />
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.decisions.length > 0 && (
        <section aria-labelledby="decisions" className="mt-12">
          <SectionHeading id="decisions">Key design decisions</SectionHeading>
          <dl className="mt-6 grid gap-6 md:grid-cols-2">
            {project.decisions.map((decision) => (
              <div key={decision.title} className="border-l-2 border-accent pl-4">
                <dt className="font-medium">{decision.title}</dt>
                <dd className="mt-1 text-sm text-muted">{decision.detail}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {project.testing && (
        <section aria-labelledby="testing" className="mt-12">
          <SectionHeading id="testing">Testing</SectionHeading>
          <p className="mt-4 max-w-3xl">{project.testing.summary}</p>
          <ul className="mt-4 max-w-3xl list-disc space-y-1 pl-5 text-sm text-muted">
            {project.testing.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </section>
      )}

      {(project.screenshots.length > 0 || project.status !== "planned") && (
        <section aria-labelledby="screenshots" className="mt-12">
          <SectionHeading id="screenshots">Screenshots and demo</SectionHeading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.screenshots.map((shot) => (
              <figure key={shot.caption} className="overflow-hidden rounded-xl border border-border bg-surface">
                {shot.src ? (
                  // Plain <img>: a static export serves images as-is.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={withBasePath(shot.src)} alt={shot.alt} className="aspect-video w-full object-cover" loading="lazy" />
                ) : (
                  <div
                    className="flex aspect-video items-center justify-center bg-surface-muted p-4 text-center text-sm text-muted"
                    role="img"
                    aria-label={`Screenshot placeholder: ${shot.alt}`}
                  >
                    Screenshot coming soon
                  </div>
                )}
                <figcaption className="p-3 text-sm text-muted">{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-4 text-sm">
            <LinkOrPlaceholder link={project.demo} pendingText="not recorded yet" />
            <span className="text-muted"> — {project.demo.note}</span>
          </p>
        </section>
      )}

      <section aria-labelledby="stack" className="mt-12">
        <SectionHeading id="stack">Technology</SectionHeading>
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-sm">
              {tech}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
