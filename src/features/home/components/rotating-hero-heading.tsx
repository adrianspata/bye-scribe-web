'use client';

import React, { useState, useEffect } from 'react';

const WORDS = [
  'Easier.',
  'Faster.',
  'Safer.',
  'Better.',
  'Smarter.',
  'Simpler.',
];

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
      <span className="inline-block relative overflow-hidden text-left w-[4.6ch] sm:w-[4.8ch] shrink-0 h-[1.15em] align-top">
        <span
          className={`inline-block whitespace-nowrap transition-all duration-300 ease-out text-[var(--color-text)] ${
            isAnimating
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
