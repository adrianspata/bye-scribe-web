import React from 'react';

export interface InPageSection {
  id: string;
  label: string;
}

export interface ServiceInPageNavProps {
  sections: InPageSection[];
}

export function ServiceInPageNav({ sections }: ServiceInPageNavProps) {
  // Requirement: Only render if at least 3 rendered sections actually exist
  if (sections.length < 3) {
    return null;
  }

  return (
    <nav
      aria-label="Guide contents"
      className="hidden lg:flex flex-col gap-3 sticky top-24 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-subtle self-start"
    >
      <span className="text-xs font-semibold text-[var(--color-text-subtle)]">
        Guide contents
      </span>
      <ul className="flex flex-col gap-1.5 list-none p-0 m-0 text-xs">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors py-1 block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-focus)] rounded-[var(--radius-sm)]"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
