import React, { useEffect, useMemo, useState } from 'react';

interface ProjectImageCarouselProps {
  mainImage: string;
  additionalImages?: string[];
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  intervalMs?: number;
}

/**
 * Displays one project image at a time and automatically rotates through
 * the cover image followed by the project's additional gallery images.
 */
export const ProjectImageCarousel: React.FC<ProjectImageCarouselProps> = ({
  mainImage,
  additionalImages,
  alt,
  className = 'w-full h-full object-cover',
  loading = 'lazy',
  intervalMs = 3500,
}) => {
  const images = useMemo(
    () => Array.from(new Set([mainImage, ...(additionalImages || [])].filter((url): url is string => Boolean(url && url.trim())))),
    [mainImage, additionalImages]
  );
  const imageSignature = images.join('\u0000');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [imageSignature]);

  const imageCount = images.length;

  useEffect(() => {
    if (imageCount < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % imageCount);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [imageCount, intervalMs]);

  const activeImage = images[activeIndex] || mainImage;
  if (!activeImage) return null;

  return (
    <img
      key={activeImage}
      src={activeImage}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
    />
  );
};
