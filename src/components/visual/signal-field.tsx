import React from 'react';

export type SignalFieldVariant = 'path' | 'tool' | 'editorial' | 'summa' | 'release' | 'guidance' | 'completion';

export interface SignalFieldProps {
  variant?: SignalFieldVariant;
  ambientMotion?: boolean;
  className?: string;
  children?: React.ReactNode;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export function SignalField({
  variant = 'path',
  ambientMotion = false,
  className = '',
  children,
  'aria-hidden': ariaHidden,
}: SignalFieldProps) {
  // Variant-specific gradient configurations (strictly cobalt, cyan, violet + ElevenLabs-inspired ByeScribe palettes)
  const variantGradients: Record<SignalFieldVariant, string> = {
    path: 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(29,78,216,0.14),transparent_70%),radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(2,132,199,0.10),transparent_60%),radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(124,58,237,0.08),transparent_50%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(56,189,248,0.18),transparent_70%),radial-gradient(ellipse_60%_50%_at_90%_90%,rgba(6,182,212,0.14),transparent_60%),radial-gradient(ellipse_50%_40%_at_10%_80%,rgba(167,139,250,0.10),transparent_50%)]',
    tool: 'bg-[radial-gradient(ellipse_70%_70%_at_100%_0%,rgba(29,78,216,0.08),transparent_60%),radial-gradient(ellipse_60%_60%_at_0%_100%,rgba(2,132,199,0.05),transparent_60%)] dark:bg-[radial-gradient(ellipse_70%_70%_at_100%_0%,rgba(56,189,248,0.12),transparent_60%),radial-gradient(ellipse_60%_60%_at_0%_100%,rgba(6,182,212,0.08),transparent_60%)]',
    editorial: 'bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(29,78,216,0.05),transparent_70%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(124,58,237,0.04),transparent_60%)] dark:bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(56,189,248,0.08),transparent_70%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(167,139,250,0.06),transparent_60%)]',
    summa: 'bg-[radial-gradient(ellipse_70%_60%_at_95%_10%,rgba(2,132,199,0.10),transparent_60%),radial-gradient(ellipse_60%_50%_at_5%_90%,rgba(29,78,216,0.08),transparent_60%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_95%_10%,rgba(6,182,212,0.14),transparent_60%),radial-gradient(ellipse_60%_50%_at_5%_90%,rgba(56,189,248,0.10),transparent_60%)]',
    release: 'gradient-surface-release',
    guidance: 'gradient-surface-guidance',
    completion: 'gradient-surface-completion',
  };

  const isPaletteVariant = variant === 'release' || variant === 'guidance' || variant === 'completion';
  const isRootHidden = ariaHidden !== undefined ? ariaHidden : children ? undefined : true;

  return (
    <div
      aria-hidden={isRootHidden}
      data-testid="signal-field"
      data-variant={variant}
      className={`relative overflow-hidden ${className}`.trim()}
    >
      {/* 1. Base Gradient Layer (Optionally lightly oversized with ambient drift) */}
      <div
        className={`absolute inset-[-4%] pointer-events-none ${variantGradients[variant]} ${
          ambientMotion ? 'animate-ambient-signal' : ''
        }`}
        aria-hidden="true"
      />

      {/* 2. Static Grain Texture Layer (Strictly static, zero continuous recomputation) */}
      <div
        className={`absolute inset-0 pointer-events-none select-none bg-repeat mix-blend-overlay ${
          isPaletteVariant ? 'opacity-25' : 'opacity-[var(--signal-grain-opacity)]'
        }`}
        style={{
          backgroundImage: 'var(--signal-grain-url)',
          backgroundSize: '180px 180px',
        }}
        aria-hidden="true"
      />

      {/* 3. Subtle Vignette / Contrast Overlay for Text Readability */}
      {!isPaletteVariant && (
        <div
          className="absolute inset-0 pointer-events-none bg-[var(--color-surface)]/20 dark:bg-[var(--color-surface)]/10"
          aria-hidden="true"
        />
      )}

      {/* 4. Foreground Content */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
