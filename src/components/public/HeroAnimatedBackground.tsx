import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const HeroAnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Observe visibility so animation only loops when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const resize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Mouse tracking for subtle parallax
    const mouse = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Floating particles
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * (width || 1200),
      y: Math.random() * (height || 800),
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      opacity: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      isOrange: Math.random() > 0.8,
    }));

    let time = 0;

    const render = () => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.03;
      mouse.y += (mouse.targetY - mouse.y) * 0.03;

      ctx.clearRect(0, 0, width, height);

      const isDark = theme === 'dark';

      // 1. Deep Black-to-Blue Base Gradient
      const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isDark) {
        baseGrad.addColorStop(0, '#000000');
        baseGrad.addColorStop(0.5, '#040B1E');
        baseGrad.addColorStop(1, '#000000');
      } else {
        baseGrad.addColorStop(0, '#FFFFFF');
        baseGrad.addColorStop(0.5, '#F0F5FF');
        baseGrad.addColorStop(1, '#FFFFFF');
      }
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Slowly moving gradient light sources
      // Primary Blue Glow (#155EEF)
      const primaryOrbX = width * 0.5 + Math.sin(time * 0.4) * 80 + (mouse.x - width * 0.5) * 0.06;
      const primaryOrbY = height * 0.38 + Math.cos(time * 0.35) * 50 + (mouse.y - height * 0.4) * 0.06;
      const primaryOrbRadius = Math.min(width, height) * 0.65;

      const blueGlow = ctx.createRadialGradient(
        primaryOrbX,
        primaryOrbY,
        0,
        primaryOrbX,
        primaryOrbY,
        primaryOrbRadius
      );
      if (isDark) {
        blueGlow.addColorStop(0, 'rgba(21, 94, 239, 0.22)');
        blueGlow.addColorStop(0.45, 'rgba(21, 94, 239, 0.08)');
        blueGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        blueGlow.addColorStop(0, 'rgba(21, 94, 239, 0.12)');
        blueGlow.addColorStop(0.45, 'rgba(21, 94, 239, 0.04)');
        blueGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = blueGlow;
      ctx.beginPath();
      ctx.arc(primaryOrbX, primaryOrbY, primaryOrbRadius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Orange Highlight Glow (#FF914D)
      const orangeOrbX = width * 0.72 + Math.cos(time * 0.45) * 60 - (mouse.x - width * 0.5) * 0.04;
      const orangeOrbY = height * 0.3 + Math.sin(time * 0.5) * 40 - (mouse.y - height * 0.4) * 0.04;
      const orangeRadius = Math.min(width, height) * 0.4;

      const orangeGlow = ctx.createRadialGradient(
        orangeOrbX,
        orangeOrbY,
        0,
        orangeOrbX,
        orangeOrbY,
        orangeRadius
      );
      if (isDark) {
        orangeGlow.addColorStop(0, 'rgba(255, 145, 77, 0.12)');
        orangeGlow.addColorStop(0.5, 'rgba(255, 145, 77, 0.03)');
        orangeGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        orangeGlow.addColorStop(0, 'rgba(255, 145, 77, 0.08)');
        orangeGlow.addColorStop(0.5, 'rgba(255, 145, 77, 0.02)');
        orangeGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      }
      ctx.fillStyle = orangeGlow;
      ctx.beginPath();
      ctx.arc(orangeOrbX, orangeOrbY, orangeRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Flowing Abstract Connectivity Light Trails (Bezier curves)
      const trailCount = 3;
      for (let i = 0; i < trailCount; i++) {
        const offset = (i * Math.PI) / 3;
        const progress = time * 0.35 + offset;
        const yStart = height * (0.42 + i * 0.08);

        ctx.beginPath();
        ctx.moveTo(-50, yStart + Math.sin(progress) * 40);

        const cp1x = width * 0.28 + Math.cos(progress * 0.7) * 40;
        const cp1y = yStart - 70 + Math.sin(progress * 0.8) * 50;

        const cp2x = width * 0.68 + Math.sin(progress * 0.6) * 40;
        const cp2y = yStart + 60 + Math.cos(progress * 0.7) * 45;

        const endX = width + 50;
        const endY = yStart - 20 + Math.sin(progress * 0.9) * 40;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

        const trailGrad = ctx.createLinearGradient(0, 0, width, 0);
        if (i === 1) {
          // Subtle orange trail
          trailGrad.addColorStop(0, 'rgba(21, 94, 239, 0)');
          trailGrad.addColorStop(0.4, isDark ? 'rgba(21, 94, 239, 0.12)' : 'rgba(21, 94, 239, 0.08)');
          trailGrad.addColorStop(0.7, isDark ? 'rgba(255, 145, 77, 0.22)' : 'rgba(255, 145, 77, 0.14)');
          trailGrad.addColorStop(1, 'rgba(255, 145, 77, 0)');
        } else {
          // Blue light trail
          trailGrad.addColorStop(0, 'rgba(21, 94, 239, 0)');
          trailGrad.addColorStop(0.5, isDark ? 'rgba(21, 94, 239, 0.2)' : 'rgba(21, 94, 239, 0.12)');
          trailGrad.addColorStop(1, 'rgba(21, 94, 239, 0)');
        }

        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = i === 1 ? 1.5 : 1;
        ctx.stroke();
      }

      // 4. Floating Luminous Dots / Particles
      particles.forEach((p) => {
        p.pulse += 0.02;
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around bounds
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (p.isOrange) {
          ctx.fillStyle = isDark
            ? `rgba(255, 145, 77, ${currentOpacity * 0.8})`
            : `rgba(255, 145, 77, ${currentOpacity * 0.6})`;
        } else {
          ctx.fillStyle = isDark
            ? `rgba(21, 94, 239, ${currentOpacity})`
            : `rgba(21, 94, 239, ${currentOpacity * 0.7})`;
        }
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        time += 0.015;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, [theme, isVisible]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Restrained fine geometric grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #155EEF 1px, transparent 1px), linear-gradient(to bottom, #155EEF 1px, transparent 1px)`,
          backgroundSize: '54px 54px',
        }}
      />

      {/* Radial fade mask to ensure heading and text remain perfectly readable */}
      <div className="absolute inset-0 mask-radial-fade bg-white/10 dark:bg-black/30 pointer-events-none" />
    </div>
  );
};
