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
      className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-[-0.02em] text-[var(--color-text)] leading-[1.1] max-w-2xl"
      aria-label="Unsubscribe. Easier."
    >
      <span>Unsubscribe. </span>
      <span className="inline-block relative overflow-hidden align-baseline text-left min-w-[3.2ch]">
        <span
          className={`inline-block transition-all duration-300 ease-out text-[var(--color-text)] ${
            isAnimating
              ? 'opacity-0 -translate-y-3 scale-95'
              : 'opacity-100 translate-y-0 scale-100'
          }`}
        >
          {WORDS[index]}
        </span>
      </span>
    </h1>
  );
}
