import { useCallback, useEffect, useRef, useState } from "react";

const INSTRUMENTAL_SRC = `${import.meta.env.BASE_URL}always14-instrumental.mp3`;
const TARGET_VOLUME = 0.65;

/**
 * Hook phát nhạc đệm (đã tách lời) của ca khúc "Happy Birthday to You (Always 14)"
 * với hiệu ứng tăng âm lượng dịu nhẹ và tự động lặp lại.
 */
export function useBirthdayAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<number | null>(null);

  const clearFadeTimer = useCallback(() => {
    if (fadeTimerRef.current !== null) {
      window.clearInterval(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }
  }, []);

  const ensureAudio = useCallback((): HTMLAudioElement | null => {
    if (typeof window === "undefined") return null;

    if (!audioRef.current) {
      const audio = new Audio(INSTRUMENTAL_SRC);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;

      audio.addEventListener("play", () => setIsPlaying(true));
      audio.addEventListener("pause", () => setIsPlaying(false));
      audio.addEventListener("ended", () => setIsPlaying(false));

      audioRef.current = audio;
    }

    return audioRef.current;
  }, []);

  const fadeInVolume = useCallback(
    (audio: HTMLAudioElement) => {
      clearFadeTimer();
      audio.volume = 0.05;
      const stepMs = 40;
      const stepDelta = TARGET_VOLUME / 20;

      fadeTimerRef.current = window.setInterval(() => {
        if (audio.paused) {
          clearFadeTimer();
          return;
        }
        const nextVol = Math.min(TARGET_VOLUME, audio.volume + stepDelta);
        audio.volume = nextVol;
        if (nextVol >= TARGET_VOLUME) {
          clearFadeTimer();
        }
      }, stepMs);
    },
    [clearFadeTimer],
  );

  const start = useCallback(async () => {
    const audio = ensureAudio();
    if (!audio) return;

    if (!audio.paused) {
      setIsPlaying(true);
      return;
    }

    try {
      await audio.play();
      fadeInVolume(audio);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [ensureAudio, fadeInVolume]);

  const stop = useCallback(() => {
    clearFadeTimer();
    const audio = audioRef.current;
    if (!audio) {
      setIsPlaying(false);
      return;
    }
    audio.pause();
    audio.volume = 0;
    setIsPlaying(false);
  }, [clearFadeTimer]);

  const toggle = useCallback(() => {
    const audio = ensureAudio();
    if (!audio) return;
    if (!audio.paused) {
      stop();
    } else {
      void start();
    }
  }, [ensureAudio, start, stop]);

  useEffect(() => {
    return () => {
      clearFadeTimer();
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        audioRef.current = null;
      }
    };
  }, [clearFadeTimer]);

  return {
    isPlaying,
    start,
    stop,
    toggle,
  };
}
