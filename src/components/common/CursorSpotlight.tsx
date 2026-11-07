import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const CursorSpotlight: React.FC = () => {
  const { theme } = useTheme();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer (mouse), not touch screens
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    let rafId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
      }

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          setPosition({ x: targetX, y: targetY });
          rafId = null;
        });
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isVisible]);

  if (!isSupported || !position || !isVisible) {
    return null;
  }

  // Soft, restrained ambient blue & orange fusion illumination
  const isDark = theme === 'dark';
  const spotlightColor = isDark
    ? 'radial-gradient(600px circle at %X%px %Y%px, rgba(37, 99, 235, 0.05), rgba(249, 115, 22, 0.035), transparent 75%)'
    : 'radial-gradient(550px circle at %X%px %Y%px, rgba(37, 99, 235, 0.035), rgba(249, 115, 22, 0.025), transparent 75%)';

  const background = spotlightColor
    .replace('%X%', position.x.toString())
    .replace('%Y%', position.y.toString());

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 ease-out"
      style={{
        background,
        opacity: isVisible ? 1 : 0,
      }}
    />
  );
};
