import confetti from 'canvas-confetti';

const ROSE_COLORS = ['#FFF0F5', '#FFB6C1', '#FF69B4', '#E75480', '#F7C6D9', '#FADADD'];

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getPetalShape() {
  return confetti.shapeFromPath({
    path: 'M12 2C15 6 19 10 17 16C15 21 9 21 7 16C5 10 9 6 12 2Z',
  });
}

function getHeartShape() {
  return confetti.shapeFromPath({
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  });
}

/**
 * Pháo giấy & cánh hoa hồng bay lên khi mở phong bì/hộp quà
 */
export function triggerWelcomeBurst(): void {
  if (prefersReducedMotion()) return;

  const petal = getPetalShape();

  void confetti({
    particleCount: 55,
    spread: 80,
    origin: { x: 0.5, y: 0.58 },
    colors: ROSE_COLORS,
    ticks: 220,
    gravity: 0.65,
    scalar: 1.05,
  });

  window.setTimeout(() => {
    void confetti({
      particleCount: 30,
      angle: 60,
      spread: 65,
      origin: { x: 0.15, y: 0.7 },
      colors: ['#FFB6C1', '#FF69B4', '#E75480'],
      shapes: [petal],
      scalar: 1.35,
      gravity: 0.45,
      ticks: 260,
    });

    void confetti({
      particleCount: 30,
      angle: 120,
      spread: 65,
      origin: { x: 0.85, y: 0.7 },
      colors: ['#FFB6C1', '#FF69B4', '#E75480'],
      shapes: [petal],
      scalar: 1.35,
      gravity: 0.45,
      ticks: 260,
    });
  }, 180);
}

/**
 * Pháo hoa rực rỡ khi Chị Chang thổi tắt nến
 */
export function triggerCandleFireworks(): void {
  if (prefersReducedMotion()) return;

  const burst = (originX: number, originY: number, delay: number) => {
    window.setTimeout(() => {
      void confetti({
        particleCount: 45,
        spread: 95,
        startVelocity: 38,
        origin: { x: originX, y: originY },
        colors: ROSE_COLORS,
        ticks: 200,
      });
    }, delay);
  };

  burst(0.5, 0.42, 0);
  burst(0.25, 0.35, 220);
  burst(0.75, 0.35, 420);
  burst(0.5, 0.28, 680);
}

/**
 * Pháo tim tương tác khi bấm thả tim trên thẻ Polaroid
 */
export function triggerHeartBurst(clientX?: number, clientY?: number): void {
  if (prefersReducedMotion()) return;

  const heart = getHeartShape();
  const x = typeof clientX === 'number' && window.innerWidth > 0
    ? Math.min(0.95, Math.max(0.05, clientX / window.innerWidth))
    : 0.5;
  const y = typeof clientY === 'number' && window.innerHeight > 0
    ? Math.min(0.9, Math.max(0.1, clientY / window.innerHeight))
    : 0.5;

  void confetti({
    particleCount: 18,
    spread: 65,
    startVelocity: 24,
    origin: { x, y },
    colors: ['#FF69B4', '#E75480', '#FFB6C1'],
    shapes: [heart],
    scalar: 1.25,
    gravity: 0.65,
    ticks: 140,
  });
}
