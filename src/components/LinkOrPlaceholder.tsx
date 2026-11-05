import type { MaybeLink } from "@/content/types";

interface Props {
  link: MaybeLink;
  className?: string;
  /** Text shown after the label when there is no href yet. */
  pendingText?: string;
}

/**
 * Renders an external link, or a clearly marked placeholder when the URL hasn't been supplied.
 * Placeholders are plain text, so visitors never land on a broken or made-up URL.
 */
export function LinkOrPlaceholder({ link, className = "", pendingText = "link coming soon" }: Props) {
  if (!link.href) {
    return (
      <span className={`text-muted ${className}`}>
        {link.label} <span className="text-xs">({pendingText})</span>
      </span>
    );
  }

  const isExternal = /^https?:\/\//.test(link.href);
  return (
    <a
      href={link.href}
      className={`font-medium text-accent underline-offset-4 hover:text-accent-strong hover:underline ${className}`}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.label}
      {isExternal && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
