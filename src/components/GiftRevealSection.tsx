import { motion } from "framer-motion";
import { Gift } from "@phosphor-icons/react";
import { CAKE_COPY } from "../data/birthdayContent";
import { GlassSurface } from "../ui/GlassSurface";
import { EASE_DECEL } from "../ui/MotionPresets";

/**
 * Thông điệp món quà sinh nhật được hé lộ và tự động cuộn tới ngay sau khi Chị Chang thổi tắt nến.
 */
export default function GiftRevealSection() {
  return (
    <motion.section
      id="birthday-gift"
      aria-live="polite"
      aria-label="Món quà điều ước dành tặng Chị Chang"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.55, ease: EASE_DECEL }}
      className="relative z-10 mx-auto max-w-3xl scroll-mt-24 px-4 py-10 text-center sm:px-6 sm:py-14 lg:px-8"
    >
      <GlassSurface
        variant="elevated"
        hairline
        doubleFrame
        innerClassName="px-6 py-8 sm:px-10 sm:py-11"
      >
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-gold/30 bg-gradient-to-br from-pastel to-blush text-accent shadow-sm">
            <Gift size={28} weight="duotone" aria-hidden="true" />
          </div>

          <p className="font-display max-w-[42ch] text-2xl leading-relaxed font-bold text-ink sm:text-3xl md:text-4xl">
            {CAKE_COPY.giftRevealMessage}
          </p>
        </div>
      </GlassSurface>
    </motion.section>
  );
}
