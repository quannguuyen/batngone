import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "@phosphor-icons/react";
import { HERO_CONTENT } from "../data/birthdayContent";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { EASE_DECEL } from "../ui/MotionPresets";

const FULL_TITLE = HERO_CONTENT.title;

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const [charCount, setCharCount] = useState(() =>
    reducedMotion ? FULL_TITLE.length : 0,
  );

  useEffect(() => {
    if (reducedMotion || charCount >= FULL_TITLE.length) return undefined;

    const interval = window.setInterval(() => {
      setCharCount((prev) => {
        if (prev + 1 >= FULL_TITLE.length) {
          window.clearInterval(interval);
          return FULL_TITLE.length;
        }
        return prev + 1;
      });
    }, 60);

    return () => window.clearInterval(interval);
  }, [charCount, reducedMotion]);

  const displayedText = reducedMotion
    ? FULL_TITLE
    : FULL_TITLE.slice(0, charCount);

  return (
    <section
      id="hero-top"
      aria-labelledby="hero-heading"
      className="relative z-10 mx-auto flex min-h-[94dvh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_DECEL }}
        className="flex w-full flex-col items-center"
      >
        <h1
          id="hero-heading"
          className="font-display rose-gold-glow mb-10 min-h-[1.25em] whitespace-nowrap text-[clamp(1.95rem,6.3vw,5.25rem)] leading-[1.15] font-bold text-ink"
        >
          <span>{displayedText}</span>
          {displayedText.length < FULL_TITLE.length && (
            <span
              aria-hidden="true"
              className="ml-1.5 inline-block h-[0.82em] w-[3.5px] translate-y-1.5 animate-pulse rounded-full bg-accent"
            />
          )}
        </h1>

        {/* Lời nhắn không khung viền mời Chị Chang lướt xuống với mũi tên hướng xuống bên dưới */}
        <motion.a
          href="#birthday-cake"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: EASE_DECEL }}
          className="inline-flex min-h-[48px] flex-col items-center justify-center gap-2 rounded-full px-5 py-2.5 text-lg font-bold text-ink-muted transition-colors duration-150 hover:text-ink active:scale-[0.98] sm:text-xl md:text-2xl"
        >
          <span>{HERO_CONTENT.scrollCue}</span>
          <motion.span
            aria-hidden="true"
            animate={reducedMotion ? undefined : { y: [-2, 5, -2] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex text-accent"
          >
            <ArrowDown size={26} weight="bold" />
          </motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}
