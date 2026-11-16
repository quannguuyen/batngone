import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Wind } from "@phosphor-icons/react";
import { CAKE_COPY } from "../data/birthdayContent";
import { triggerCandleFireworks } from "../utils/confettiEffects";
import { fadeUpMotion } from "../ui/MotionPresets";
import CakeIllustration from "./CakeIllustration";

interface InteractiveCakeProps {
  onWishComplete?: () => void;
  onRelightCandles?: () => void;
  onDarkRoomChange?: (isDark: boolean) => void;
}

export default function InteractiveCake({
  onWishComplete,
  onRelightCandles,
  onDarkRoomChange,
}: InteractiveCakeProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isCakeInView, setIsCakeInView] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCakeInView(entry.isIntersecting);
      },
      {
        threshold: 0.3,
        rootMargin: "-8% 0px -8% 0px",
      },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isDarkRoom = isCakeInView && candlesLit;

  useEffect(() => {
    onDarkRoomChange?.(isDarkRoom);
  }, [isDarkRoom, onDarkRoomChange]);

  useEffect(() => {
    return () => {
      onDarkRoomChange?.(false);
    };
  }, [onDarkRoomChange]);

  const handleBlowCandles = () => {
    if (!candlesLit) return;
    setCandlesLit(false);
    triggerCandleFireworks();
    onWishComplete?.();
  };

  const handleRelight = () => {
    setCandlesLit(true);
    onRelightCandles?.();
  };

  return (
    <section
      ref={sectionRef}
      id="birthday-cake"
      aria-label="Bánh sinh nhật điều ước"
      className="relative z-10 mx-auto flex min-h-dvh max-w-4xl scroll-mt-10 flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8"
    >
      <motion.div {...fadeUpMotion()} className="flex flex-col items-center">
        <p
          className={`mb-5 max-w-prose text-base font-medium leading-relaxed tracking-wide transition-colors duration-500 sm:text-lg ${
            isDarkRoom
              ? "text-pastel drop-shadow-[0_2px_10px_rgba(255,214,158,0.28)]"
              : "text-ink"
          }`}
        >
          {CAKE_COPY.wishPrompt}
        </p>

        <CakeIllustration
          candlesLit={candlesLit}
          isDarkRoom={isDarkRoom}
          onBlowCandles={handleBlowCandles}
        />

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          {candlesLit ? (
            <motion.button
              type="button"
              onClick={handleBlowCandles}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="ev-btn-primary inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-8 py-3 text-base font-semibold transition-transform duration-150"
            >
              <Wind size={20} weight="bold" aria-hidden="true" />
              <span>{CAKE_COPY.blowCta}</span>
            </motion.button>
          ) : (
            <motion.button
              type="button"
              onClick={handleRelight}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.12 }}
              className="ev-pill inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 py-3 text-base font-semibold text-ink transition-transform duration-150 hover:border-accent/55"
            >
              <Flame
                size={20}
                weight="duotone"
                className="text-accent"
                aria-hidden="true"
              />
              <span>{CAKE_COPY.relightCta}</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </section>
  );
}
