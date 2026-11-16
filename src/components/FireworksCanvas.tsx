import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

interface HeartFirework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
  particles: Particle[];
}

interface FireworksCanvasProps {
  burstTrigger?: number;
}

const COLORS = ['#FFB6C1', '#FF69B4', '#E75480', '#FFF0F5', '#D81B60', '#FADADD'] as const;
const SPRITE_SIZE = 48;

function createHeartSprite(color: string): HTMLCanvasElement {
  const sprite = document.createElement('canvas');
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;
  const sctx = sprite.getContext('2d');
  if (!sctx) return sprite;

  const half = SPRITE_SIZE / 2;
  const scale = SPRITE_SIZE * 0.72;
  const topY = half - scale * 0.48;

  sctx.fillStyle = color;
  sctx.beginPath();
  sctx.moveTo(half, topY + scale * 0.3);
  sctx.bezierCurveTo(half, topY, half - scale * 0.5, topY, half - scale * 0.5, topY + scale * 0.3);
  sctx.bezierCurveTo(
    half - scale * 0.5,
    topY + scale * 0.7,
    half,
    topY + scale,
    half,
    topY + scale
  );
  sctx.bezierCurveTo(
    half,
    topY + scale,
    half + scale * 0.5,
    topY + scale * 0.7,
    half + scale * 0.5,
    topY + scale * 0.3
  );
  sctx.bezierCurveTo(half + scale * 0.5, topY, half, topY, half, topY + scale * 0.3);
  sctx.fill();

  return sprite;
}

function createHeartParticle(x: number, y: number, color: string): Particle {
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 2.8 + 1.2;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    alpha: 1,
    color,
    size: Math.random() * 2.6 + 1.8,
    decay: Math.random() * 0.018 + 0.01,
  };
}

function createFirework(width: number, height: number): HeartFirework {
  return {
    x: Math.random() * width * 0.8 + width * 0.1,
    y: height,
    targetY: Math.random() * (height * 0.38) + height * 0.12,
    vy: -(Math.random() * 4 + 7.5),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    exploded: false,
    particles: [],
  };
}

function createBackgroundParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: -(Math.random() * 0.4 + 0.15),
    alpha: Math.random() * 0.36 + 0.14,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 2 + 1,
    decay: 0,
  };
}

export default function FireworksCanvas({ burstTrigger = 0 }: FireworksCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const fireworksRef = useRef<HeartFirework[]>([]);
  const backgroundParticlesRef = useRef<Particle[]>([]);
  const viewportRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    // Cache hình trái tim theo từng màu để vẽ nhanh không phải tính lại Bezier mỗi frame
    const heartSprites = new Map<string, HTMLCanvasElement>();
    for (const color of COLORS) {
      heartSprites.set(color, createHeartSprite(color));
    }

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      viewportRef.current = { width, height };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    backgroundParticlesRef.current = Array.from({ length: 24 }, () =>
      createBackgroundParticle(viewportRef.current.width, viewportRef.current.height)
    );

    let lastLaunch = 0;

    const renderFrame = (timestamp: number) => {
      if (document.hidden) {
        animationRef.current = undefined;
        return;
      }

      const { width, height } = viewportRef.current;
      ctx.clearRect(0, 0, width, height);

      for (const p of backgroundParticlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
        if (p.x < -12) p.x = width + 12;
        if (p.x > width + 12) p.x = -12;

        const sprite = heartSprites.get(p.color);
        if (sprite) {
          const drawSize = p.size * 3.8;
          ctx.globalAlpha = p.alpha;
          ctx.drawImage(sprite, p.x - drawSize * 0.5, p.y - drawSize * 0.5, drawSize, drawSize);
        }
      }

      if (timestamp - lastLaunch > 3400 && fireworksRef.current.length < 3) {
        fireworksRef.current.push(createFirework(width, height));
        lastLaunch = timestamp;
      }

      ctx.globalAlpha = 1;

      for (let i = fireworksRef.current.length - 1; i >= 0; i--) {
        const fw = fireworksRef.current[i];

        if (!fw.exploded) {
          fw.y += fw.vy;
          fw.vy += 0.14;

          ctx.fillStyle = fw.color;
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          if (fw.y <= fw.targetY || fw.vy >= 0) {
            fw.exploded = true;
            for (let j = 0; j < 26; j++) {
              fw.particles.push(createHeartParticle(fw.x, fw.y, fw.color));
            }
          }
        } else {
          const sprite = heartSprites.get(fw.color);
          for (let j = fw.particles.length - 1; j >= 0; j--) {
            const p = fw.particles[j];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.04;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
              fw.particles.splice(j, 1);
            } else if (sprite) {
              const drawSize = p.size * 3.6;
              ctx.globalAlpha = p.alpha;
              ctx.drawImage(sprite, p.x - drawSize * 0.5, p.y - drawSize * 0.5, drawSize, drawSize);
            }
          }

          if (fw.particles.length === 0) {
            fireworksRef.current.splice(i, 1);
          }
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(renderFrame);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationRef.current !== undefined) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = undefined;
        }
      } else if (animationRef.current === undefined) {
        animationRef.current = requestAnimationFrame(renderFrame);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    animationRef.current = requestAnimationFrame(renderFrame);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationRef.current !== undefined) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Kích hoạt loạt pháo hoa khi thổi nến
  useEffect(() => {
    if (burstTrigger <= 0) return undefined;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const timerIds: number[] = [];
    for (let i = 0; i < 4; i++) {
      const id = window.setTimeout(() => {
        const { width, height } = viewportRef.current;
        if (width > 0 && height > 0) {
          fireworksRef.current.push(createFirework(width, height));
        }
      }, i * 220);
      timerIds.push(id);
    }

    return () => {
      for (const id of timerIds) {
        window.clearTimeout(id);
      }
    };
  }, [burstTrigger]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[6] h-full w-full"
    />
  );
}
