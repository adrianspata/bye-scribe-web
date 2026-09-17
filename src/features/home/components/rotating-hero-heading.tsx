'use client';

import React, { useState, useEffect } from 'react';

const WORDS = [
  'Easier.',
  'Faster.',
  'Safer.',
  'Better.',
  'Smarter.',
];

const LONGEST_WORD = 'Smarter.';

export function RotatingHeroHeading() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WORDS.length);
        setIsAnimating(false);
      }, 300);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1
      className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] text-[var(--color-text)] leading-[1.1] max-w-2xl inline-flex items-baseline justify-center"
      aria-label="Unsubscribe. Easier."
    >
      <span className="whitespace-nowrap">Unsubscribe.&nbsp;</span>
      <span className="inline-grid grid-cols-1 grid-rows-1 text-left shrink-0 overflow-hidden align-top h-[1.15em]">
        {/* Natural invisible sizer: locks width to longest word so "Unsubscribe." never moves and no word is clipped */}
        <span
          className="invisible row-start-1 col-start-1 select-none pointer-events-none whitespace-nowrap"
          aria-hidden="true"
        >
          {LONGEST_WORD}
        </span>
        {/* Animated active word in the same grid cell */}
        <span
          className={`row-start-1 col-start-1 whitespace-nowrap transition-all duration-300 ease-out text-[var(--color-text)] ${isAnimating
            ? 'opacity-0 -translate-y-3'
            : 'opacity-100 translate-y-0'
            }`}
        >
          {WORDS[index]}
        </span>
      </span>
    </h1>
  );
}
