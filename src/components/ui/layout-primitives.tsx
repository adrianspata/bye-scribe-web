import React from 'react';

export function PageContainer({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`w-full max-w-[var(--spacing-container-max)] mx-auto px-4 sm:px-6 py-6 sm:py-8 ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function ReadingContainer({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`w-full max-w-[var(--spacing-reading-max)] ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}

export function Section({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={`w-full flex flex-col gap-4 sm:gap-6 ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}

export function Divider({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      className={`w-full border-0 border-t border-[var(--color-border)] my-6 ${className}`.trim()}
      {...props}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
  className = '',
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-8 sm:p-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-center flex flex-col items-center justify-center gap-3 ${className}`.trim()}
    >
      <h3 className="font-normal text-base text-[var(--color-text)]">{title}</h3>
      {description && (
        <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-md leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
