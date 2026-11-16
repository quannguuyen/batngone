/** Preset chuyển động 60fps thuần GPU (transform + opacity) thống nhất cho toàn dự án. */
export const EASE_DECEL = [0.22, 1, 0.36, 1] as const;

export const REVEAL_VIEWPORT = {
  once: true,
  amount: 0.18,
} as const;

export function fadeUpMotion(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: REVEAL_VIEWPORT,
    transition: { duration: 0.55, delay, ease: EASE_DECEL },
  };
}
