import React from 'react';

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: React.ReactNode;
}

export function FieldLabel({
  required = false,
  className = '',
  children,
  ...props
}: FieldLabelProps) {
  return (
    <label
      className={`text-sm font-medium text-[var(--color-text)] flex items-center gap-1 ${className}`.trim()}
      {...props}
    >
      <span>{children}</span>
      {required && (
        <span className="text-[var(--color-critical)] font-bold" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export interface FieldHintProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function FieldHint({ className = '', children, ...props }: FieldHintProps) {
  return (
    <span
      className={`text-xs text-[var(--color-text-muted)] leading-normal ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function FieldError({ className = '', children, ...props }: FieldErrorProps) {
  if (!children) return null;

  return (
    <p
      role="alert"
      className={`text-xs text-[var(--color-critical)] font-medium leading-normal flex items-center gap-1 ${className}`.trim()}
      {...props}
    >
      {children}
    </p>
  );
}
