import Link from "next/link";
import { LinkOrPlaceholder } from "@/components/LinkOrPlaceholder";
import { ProjectCard } from "@/components/ProjectCard";
import { Section } from "@/components/Section";
import { projects } from "@/content/projects";
import { resume } from "@/content/resume";
import { site, skillGroups } from "@/content/site";
import { withBasePath } from "@/lib/paths";

export default function Home() {
  const resumeHref = site.resume.href ? withBasePath(site.resume.href) : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <section aria-labelledby="intro-heading" className="border-b border-border py-16 sm:py-24">
        <p className="font-mono text-sm text-accent">
          {site.role} · {site.yearsOfExperience}+ years
        </p>
        <h1 id="intro-heading" className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          {site.name}
        </h1>
        <p className="mt-3 font-medium">{site.credentials}</p>
        <p className="mt-6 max-w-2xl text-lg text-muted sm:text-xl">{site.intro}</p>
        <p className="mt-4 max-w-2xl text-muted">{site.focus}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white hover:bg-accent-strong dark:text-background"
          >
            View projects
          </a>
          {site.github.href && (
            <a
              href={site.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-border bg-surface px-5 py-2.5 font-medium hover:border-accent"
            >
              GitHub<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </section>

      <Section
        id="projects"
        title="Projects"
        intro="Integration projects built on Salesforce. Each case study states what is built and what is still planned."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} featured={index === 0} />
          ))}
        </div>
      </Section>

      <Section id="skills" title="Skills and technology">
        <div className="grid gap-6 sm:grid-cols-2">
          {skillGroups.map((group) => (
            <div key={group.title} className="rounded-xl border border-border bg-surface p-5">
              <h3 className="font-semibold">{group.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill} className="rounded-md bg-surface-muted px-2.5 py-1 text-sm">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="resume" title="Experience" intro={resume.summary}>
        <ol className="divide-y divide-border rounded-xl border border-border bg-surface">
          {resume.experience.map((role) => (
            <li
              key={`${role.company}-${role.start}`}
              className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <p>
                <span className="font-semibold">{role.company}</span>
                <span className="text-muted"> · {role.title}</span>
              </p>
              <p className="shrink-0 text-sm text-muted">
                {role.start} – {role.end}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/resume/"
            className="rounded-lg border border-border bg-surface px-5 py-2.5 font-medium hover:border-accent"
          >
            Full resume
          </Link>
          {resumeHref ? (
            <a
              href={resumeHref}
              download
              className="rounded-lg bg-accent px-5 py-2.5 font-medium text-white hover:bg-accent-strong dark:text-background"
            >
              {site.resume.label}
            </a>
          ) : (
            <LinkOrPlaceholder link={site.resume} pendingText="coming soon" />
          )}
        </div>
      </Section>

      <Section id="contact" title="Contact" intro="I'm open to Senior Salesforce Developer and Salesforce Engineer roles.">
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {[site.email, site.linkedin, site.github, site.trailblazer].map((link) => (
            <li key={link.label}>
              <LinkOrPlaceholder link={link} />
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
