import type { Metadata } from "next";
import { resume } from "@/content/resume";
import { site } from "@/content/site";
import { withBasePath } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Resume",
  description: resume.summary,
  alternates: { canonical: "resume/" },
};

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8 print:mt-5">
      <h2 className="border-b border-border pb-1 text-sm font-semibold uppercase tracking-wider text-accent print:text-black">
        {title}
      </h2>
      <div className="mt-3 print:mt-2">{children}</div>
    </section>
  );
}

export default function ResumePage() {
  const contact = [
    site.email.href && { label: site.email.href.replace(/^mailto:/, ""), href: site.email.href },
    site.linkedin.href && { label: site.linkedin.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, ""), href: site.linkedin.href },
    site.github.href && { label: site.github.href.replace(/^https:\/\//, ""), href: site.github.href },
    site.trailblazer.href && {
      label: site.trailblazer.href.replace(/^https:\/\/(www\.)?/, ""),
      href: site.trailblazer.href,
    },
    { label: site.url.replace(/^https:\/\//, "").replace(/\/$/, ""), href: site.url },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 print:max-w-none print:p-0 print:text-[10.5pt] print:leading-snug">
      {site.resume.href && (
        <p className="mb-6 flex justify-end print:hidden">
          <a
            href={withBasePath(site.resume.href)}
            download
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-strong dark:text-background"
          >
            Download PDF
          </a>
        </p>
      )}

      <article className="rounded-xl border border-border bg-surface p-6 sm:p-10 print:rounded-none print:border-0 print:p-0">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight print:text-[20pt]">{resume.name}</h1>
          <p className="mt-1 font-medium text-accent print:text-black">{resume.headline}</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted print:text-[9.5pt] print:text-black">
            <li>{resume.location}</li>
            {contact.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="hover:text-accent">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <ResumeSection title="Summary">
          <p>{resume.summary}</p>
        </ResumeSection>

        <ResumeSection title="Skills">
          <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-[11rem_1fr] print:grid-cols-[9.5rem_1fr]">
            {resume.skills.map((group) => (
              <div key={group.title} className="contents">
                <dt className="font-semibold">{group.title}</dt>
                <dd className="text-muted print:text-black">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </ResumeSection>

        <ResumeSection title="Experience">
          <ol className="space-y-5 print:space-y-3">
            {resume.experience.map((role) => (
              <li key={`${role.company}-${role.start}`} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-semibold">
                    {role.title}, {role.company}
                    <span className="font-normal text-muted print:text-black"> · {role.location}</span>
                  </h3>
                  <p className="text-sm text-muted print:text-black">
                    {role.start} – {role.end}
                  </p>
                </div>
                <ul className="mt-1.5 list-disc space-y-1 pl-5 print:space-y-0.5">
                  {role.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </ResumeSection>

        <ResumeSection title="Projects">
          {resume.projects.map((project) => (
            <div key={project.name} className="break-inside-avoid">
              <h3 className="font-semibold">
                <a href={project.href} className="hover:text-accent">
                  {project.name}
                </a>
                <span className="font-normal text-muted print:text-black"> · {project.status}</span>
              </h3>
              <ul className="mt-1.5 list-disc space-y-1 pl-5 print:space-y-0.5">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </ResumeSection>

        <ResumeSection title="Certifications">
          <p>
            <span className="font-semibold">{resume.certifications.summary}</span>, including{" "}
            {resume.certifications.names.join(", ")}.
          </p>
        </ResumeSection>

        <ResumeSection title="Education & training">
          <ul className="space-y-1">
            {resume.education.map((entry) => (
              <li key={entry.name}>
                <span className="font-semibold">{entry.name}</span>
                <span className="text-muted print:text-black">
                  {" "}
                  · {entry.school}, {entry.location}
                </span>
              </li>
            ))}
          </ul>
        </ResumeSection>
      </article>
    </div>
  );
}
