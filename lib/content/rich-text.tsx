import Link from "next/link";
import { Fragment, type ReactNode } from "react";

const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g;

function isExternalHref(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

/** Renders plain text with `[label](https://url)` or `[label](/path)` markdown links. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const label = match[1];
    const href = match[2];
    const linkClassName =
      "font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2 hover:decoration-neutral-900";

    parts.push(
      isExternalHref(href) ? (
        <Link
          key={`${href}-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName}
        >
          {label}
        </Link>
      ) : (
        <Link key={`${href}-${match.index}`} href={href} className={linkClassName}>
          {label}
        </Link>
      ),
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return (
    <>
      {parts.map((part, index) => (
        <Fragment key={index}>{part}</Fragment>
      ))}
    </>
  );
}
