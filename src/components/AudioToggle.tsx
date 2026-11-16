import { motion } from 'framer-motion';
import { MusicNotes, SpeakerSlash } from '@phosphor-icons/react';

interface AudioToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

const WAVE_BARS = [
  { id: 'bar-1', delay: 0, peak: [0.4, 1, 0.5] },
  { id: 'bar-2', delay: 0.16, peak: [0.85, 0.35, 0.95] },
  { id: 'bar-3', delay: 0.32, peak: [0.5, 0.9, 0.4] },
];

export default function AudioToggle({ isPlaying, onToggle }: AudioToggleProps) {
  return (
    <div
      className="fixed z-40"
      style={{
        bottom: 'max(16px, env(safe-area-inset-bottom))',
        right: 'max(16px, env(safe-area-inset-right))',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Tắt nhạc nền sinh nhật' : 'Bật nhạc nền sinh nhật'}
        className={`ev-pill inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-transform duration-150 hover:scale-[1.04] active:scale-[0.96] sm:px-4 ${
          isPlaying ? 'border-accent/45 text-accent-dark' : 'text-ink hover:border-rose-gold'
        }`}
      >
        {isPlaying ? (
          <>
            <MusicNotes size={20} weight="duotone" className="shrink-0 text-accent" aria-hidden="true" />
            <span className="flex h-3.5 items-end gap-[2.5px]" aria-hidden="true">
              {WAVE_BARS.map((bar) => (
                <motion.span
                  key={bar.id}
                  animate={{ scaleY: bar.peak }}
                  transition={{
                    duration: 0.75,
                    delay: bar.delay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{ originY: 1 }}
                  className="h-full w-[2.5px] rounded-full bg-accent"
                />
              ))}
            </span>
          </>
        ) : (
          <SpeakerSlash size={20} weight="duotone" className="shrink-0 text-ink-muted" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
