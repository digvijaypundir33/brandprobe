'use client';

import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { ShowcaseEntry } from '@/types/report';
import AnalysisCard from './AnalysisCard';

export default function AnalyzedWebsitesCarousel() {
  const [entries, setEntries] = useState<ShowcaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();

  // Fetch all analyzed sites
  useEffect(() => {
    fetch('/api/showcase/extremes')
      .then(res => res.json())
      .then(data => {
        console.log('[CAROUSEL] API response:', data);
        if (data.success && data.entries && data.entries.length > 0) {
          console.log('[CAROUSEL] Setting entries:', data.entries.length);
          // Duplicate for seamless loop
          setEntries([...data.entries, ...data.entries]);
        } else {
          console.log('[CAROUSEL] No entries found');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('[CAROUSEL] Failed to fetch carousel entries:', error);
        setLoading(false);
      });
  }, []);

  console.log('[CAROUSEL] Render state:', { loading, entriesCount: entries.length });

  // Calculate animation distance based on number of unique entries
  // Each card is 320px (w-80) + 24px gap (gap-6)
  const uniqueCount = entries.length / 2;
  const cardWidth = 320 + 24; // w-80 = 320px, gap-6 = 24px
  const animationDistance = -(uniqueCount * cardWidth);

  // Start animation when entries are loaded
  useEffect(() => {
    if (entries.length > 0) {
      controls.start({
        x: [0, animationDistance],
        transition: {
          duration: 40,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }
      });
    }
  }, [entries, animationDistance, controls]);

  const handleMouseEnter = () => {
    controls.stop();
  };

  const handleMouseLeave = () => {
    controls.start({
      x: [null, animationDistance],
      transition: {
        duration: 40,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }
    });
  };

  // Don't render if no entries
  if (loading || entries.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-6">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Recently Analyzed Websites
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Real scans from our community showing the range of scores
        </p>
      </div>

      {/* Infinite scroll container */}
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          className="flex gap-6"
          animate={controls}
          initial={{ x: 0 }}
        >
          {entries.map((entry, index) => (
            <AnalysisCard key={`${entry.reportId}-${index}`} entry={entry} />
          ))}
        </motion.div>

        {/* Gradient fades on edges */}
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-blue-50 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
