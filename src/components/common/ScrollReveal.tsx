import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in milliseconds for staggered effects
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const currentEl = elementRef.current;
    if (!currentEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                setIsRevealed(true);
              }, delay);
            } else {
              setIsRevealed(true);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentEl);

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${isRevealed ? 'is-revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
