import { site } from "@/content/site";
import { LinkOrPlaceholder } from "./LinkOrPlaceholder";

export function SiteFooter() {
  return (
    <footer className="print:hidden mt-auto border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}. Built with Next.js and Tailwind CSS.
        </p>
        <ul className="flex gap-5">
          <li>
            <LinkOrPlaceholder link={site.github} pendingText="soon" />
          </li>
          <li>
            <LinkOrPlaceholder link={site.linkedin} pendingText="soon" />
          </li>
        </ul>
      </div>
    </footer>
  );
}
