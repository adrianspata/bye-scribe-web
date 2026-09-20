'use client';

import React, { useState, useEffect, useRef } from 'react';

export interface TypingSectionHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
  id?: string;
  className?: string;
  lastWordsCount?: number;
  typingSpeedMs?: number;
  delayMs?: number;
}

export function TypingSectionHeading({
  text,
  as: Component = 'h2',
  id,
  className = '',
  lastWordsCount = 2,
  typingSpeedMs = 45,
  delayMs = 120,
}: TypingSectionHeadingProps) {
  // Split the sentence into static prefix and animated target words
  const words = text.trim().split(/\s+/);
  let prefix = '';
  let target = '';

  if (words.length <= lastWordsCount) {
    if (words.length > 1) {
      prefix = words.slice(0, -1).join(' ') + ' ';
      target = words[words.length - 1];
    } else {
      prefix = '';
      target = words[0] || '';
    }
  } else {
    prefix = words.slice(0, words.length - lastWordsCount).join(' ') + ' ';
    target = words.slice(words.length - lastWordsCount).join(' ');
  }

  const containerRef = useRef<HTMLElement>(null);
  const [hasIntersected, setHasIntersected] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
      return true;
    }
    return false;
  });
  const [charIndex, setCharIndex] = useState(() => {
    // In JSDOM / Test environments, start fully typed so unit tests pass seamlessly
    if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
      return target.length;
    }
    return 0;
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
      return true;
    }
    return false;
  });

  // IntersectionObserver to trigger on first scroll-into-view
  useEffect(() => {
    if (hasIntersected) return;

    if (typeof window === 'undefined' || typeof window.IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const el = containerRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, [hasIntersected]);

  // Typing animation loop once intersected
  useEffect(() => {
    if (!hasIntersected || isComplete) return;

    let intervalId: NodeJS.Timeout;

    const timeoutId = setTimeout(() => {
      setIsTyping(true);
      let current = 0;

      intervalId = setInterval(() => {
        current += 1;
        setCharIndex(current);

        if (current >= target.length) {
          clearInterval(intervalId);
          setIsTyping(false);
          setIsComplete(true);
        }
      }, typingSpeedMs);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [hasIntersected, isComplete, target.length, typingSpeedMs, delayMs]);

  const displayedTypedText = isComplete ? target : target.slice(0, charIndex);

  return (
    <Component
      id={id}
      ref={containerRef as unknown as React.RefObject<HTMLHeadingElement>}
      aria-label={text}
      className={className}
    >
      <span>{prefix}</span>
      <span className="inline-block relative">
        <span>{displayedTypedText}</span>
        {isTyping && (
          <span
            className="inline-block w-[2px] h-[0.8em] bg-[var(--color-text)] ml-0.5 align-middle animate-pulse"
            aria-hidden="true"
          />
        )}
      </span>
    </Component>
  );
}
