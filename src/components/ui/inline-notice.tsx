import React from 'react';
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export type NoticeVariant = 'information' | 'success' | 'warning' | 'critical';

export interface InlineNoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: NoticeVariant;
  title?: string;
  children: React.ReactNode;
}

export function InlineNotice({
  variant = 'information',
  title,
  className = '',
  children,
  ...props
}: InlineNoticeProps) {
  const config = {
    information: {
      icon: Info,
      role: 'region',
      bg: 'bg-[var(--color-information-surface)]',
      border: 'border-[var(--color-information-border)]',
      text: 'text-[var(--color-information)]',
      iconColor: 'text-[var(--color-information)]',
    },
    success: {
      icon: CheckCircle2,
      role: 'status',
      bg: 'bg-[var(--color-positive-surface)]',
      border: 'border-[var(--color-positive-border)]',
      text: 'text-[var(--color-positive)]',
      iconColor: 'text-[var(--color-positive)]',
    },
    warning: {
      icon: AlertTriangle,
      role: 'region',
      bg: 'bg-[var(--color-warning-surface)]',
      border: 'border-[var(--color-warning-border)]',
      text: 'text-[var(--color-warning)]',
      iconColor: 'text-[var(--color-warning)]',
    },
    critical: {
      icon: AlertCircle,
      role: 'alert',
      bg: 'bg-[var(--color-critical-surface)]',
      border: 'border-[var(--color-critical-border)]',
      text: 'text-[var(--color-critical)]',
      iconColor: 'text-[var(--color-critical)]',
    },
  };

  const current = config[variant];
  const IconComponent = current.icon;

  return (
    <div
      role={current.role}
      className={`p-4 rounded-[var(--radius-md)] border flex items-start gap-3 text-xs sm:text-sm ${current.bg} ${current.border} ${className}`.trim()}
      {...props}
    >
      <IconComponent
        className={`w-4 h-4 mt-0.5 shrink-0 ${current.iconColor}`}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1 text-[var(--color-text)] flex-1">
        {title && (
          <span className={`font-semibold ${current.text}`}>
            {title}
          </span>
        )}
        <div className="leading-relaxed text-[var(--color-text-muted)]">
          {children}
        </div>
      </div>
    </div>
  );
}
