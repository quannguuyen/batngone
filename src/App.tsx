import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useBirthdayAudio } from "./utils/birthdayAudio";
import FireworksCanvas from "./components/FireworksCanvas";
import PortraitIntro from "./components/PortraitIntro";
import AudioToggle from "./components/AudioToggle";
import HeroSection from "./components/HeroSection";
import InteractiveCake from "./components/InteractiveCake";
import GiftRevealSection from "./components/GiftRevealSection";
import LoveLetterCard from "./components/LoveLetterCard";
import { EASE_DECEL } from "./ui/MotionPresets";

export function App() {
  const [stage, setStage] = useState<"welcome" | "main">("welcome");
  const [fireworkBurstCount, setFireworkBurstCount] = useState(0);
  const [isCakeDarkRoom, setIsCakeDarkRoom] = useState(false);
  const [hasRevealedGift, setHasRevealedGift] = useState(false);
  const scrollTimerRef = useRef<number | null>(null);
  const { isPlaying, start, toggle } = useBirthdayAudio();

  const clearScrollTimer = useCallback(() => {
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearScrollTimer();
  }, [clearScrollTimer]);

  const handleOpenGift = () => {
    setStage("main");
    void start();
  };

  const handleWishComplete = () => {
    setFireworkBurstCount((prev) => prev + 1);
    setHasRevealedGift(true);
    clearScrollTimer();

    // Chờ ánh sáng phòng bật lại và pháo hoa bùng nổ rồi mới cuộn mượt xuống phần món quà
    scrollTimerRef.current = window.setTimeout(() => {
      const target = document.getElementById("birthday-gift");
      if (!target) return;
      const prefersReduced =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "center",
      });
    }, 700);
  };

  const handleRelightCandles = useCallback(() => {
    clearScrollTimer();
    setHasRevealedGift(false);
  }, [clearScrollTimer]);

  const handleDarkRoomChange = useCallback((isDark: boolean) => {
    setIsCakeDarkRoom(isDark);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-dvh w-full overflow-x-hidden">
        {/* Lớp nền tối khi Chị Chang lướt tới phần bánh kem đang thắp nến */}
        {stage === "main" && (
          <div
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 z-[4] transition-opacity duration-700 ease-out ${
              isCakeDarkRoom ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background:
                "radial-gradient(circle at 50% 45%, rgba(20, 10, 18, 0.94) 0%, #070308 62%, #000000 100%)",
            }}
          />
        )}

        <FireworksCanvas burstTrigger={fireworkBurstCount} />

        <AnimatePresence mode="wait">
          {stage === "welcome" ? (
            <PortraitIntro key="welcome" onOpen={handleOpenGift} />
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, ease: EASE_DECEL }}
              className="relative"
            >
              <AudioToggle isPlaying={isPlaying} onToggle={toggle} />

              <main
                className={`relative z-10 ${hasRevealedGift ? "pb-14" : ""}`}
              >
                <HeroSection />
                <InteractiveCake
                  onWishComplete={handleWishComplete}
                  onRelightCandles={handleRelightCandles}
                  onDarkRoomChange={handleDarkRoomChange}
                />
                <AnimatePresence>
                  {hasRevealedGift && (
                    <div key="post-wish-content">
                      <GiftRevealSection />
                      <LoveLetterCard />
                    </div>
                  )}
                </AnimatePresence>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

export default App;
