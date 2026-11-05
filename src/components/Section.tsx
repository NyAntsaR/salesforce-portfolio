import type { ReactNode } from "react";

interface Props {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
  /** Heading level: 2 on the home page, 2 or 3 inside a case study. */
  level?: 2 | 3;
}

export function Section({ id, title, intro, children, level = 2 }: Props) {
  const Heading = level === 2 ? "h2" : "h3";
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="py-12 sm:py-16">
      <Heading id={`${id}-heading`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </Heading>
      {intro && <div className="mt-3 max-w-3xl text-muted">{intro}</div>}
      <div className="mt-8">{children}</div>
    </section>
  );
}
