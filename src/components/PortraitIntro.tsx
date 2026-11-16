import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, Gift } from '@phosphor-icons/react';
import {
  PORTRAIT_FILLS,
  PORTRAIT_STROKES,
  PORTRAIT_VIEWBOX,
} from '../data/portraitPaths';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { triggerWelcomeBurst } from '../utils/confettiEffects';

interface PortraitIntroProps {
  onOpen: () => void;
}

const TOTAL_DRAW_MS = 4800;

interface StrokeSchedule {
  startMs: number;
  endMs: number;
}

// Tính trước lịch vẽ tuần tự từng nét theo căn bậc hai độ dài nét, tổng ~4.8 giây
const STROKE_SCHEDULES: StrokeSchedule[] = (() => {
  const weights = PORTRAIT_STROKES.map((s) => Math.max(24, Math.min(280, Math.sqrt(s.len) * 14)));
  const totalWeight = weights.reduce((acc, w) => acc + w, 0) || 1;
  const scale = TOTAL_DRAW_MS / totalWeight;
  let cursor = 0;
  return weights.map((w) => {
    const startMs = cursor;
    cursor += w * scale;
    return { startMs, endMs: cursor };
  });
})();

interface FloatingFrog {
  id: string;
  xPercent: number;
  yPercent: number;
  sizePx: number;
  opacity: number;
  initialRotate: number;
  duration: number;
  appearDelay: number;
  direction: 1 | -1;
  desktopOnly: boolean;
}

function isInsidePortraitOrCta(x: number, y: number, padPct: number): boolean {
  // Vùng đầu & mái tóc thuôn từ đỉnh đầu (x: 41..59 ở y=10%) mở dần xuống vai (x: 31..69 ở y=69%)
  const t = Math.max(0, Math.min(1, (y - 10) / 59));
  const halfPortraitWidth = 10 + t * 10 + padPct;
  const inPortrait = y > 9 - padPct && y < 70 + padPct && Math.abs(x - 50) < halfPortraitWidth;
  // Vùng hộp quà & dòng chữ bên dưới ở chính giữa
  const inCta = y >= 69 && y <= 96 && Math.abs(x - 50) < 10.5 + padPct;
  return inPortrait || inCta;
}

function createScatteredFrogs(): FloatingFrog[] {
  let state = 20102026;
  const nextRand = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  const frogs: FloatingFrog[] = [];

  const tryPlace = (count: number, minSize: number, maxSize: number, maxAttempts: number) => {
    let placed = 0;
    let attempts = 0;
    while (placed < count && attempts < maxAttempts) {
      attempts += 1;
      const sizePx = Math.round(minSize + nextRand() * (maxSize - minSize));
      const radiusPct = (sizePx / 1280) * 55;
      const x = 2.5 + nextRand() * 95;
      const y = 3.5 + nextRand() * 93;

      if (isInsidePortraitOrCta(x, y, radiusPct + 1.2)) continue;

      const collides = frogs.some((other) => {
        const otherRadiusPct = (other.sizePx / 1280) * 55;
        const minDist = radiusPct + otherRadiusPct + 2.4;
        return Math.hypot(other.xPercent - x, (other.yPercent - y) * 0.72) < minDist;
      });
      if (collides) continue;

      placed += 1;
      frogs.push({
        id: `frog-${frogs.length + 1}`,
        xPercent: Number(x.toFixed(1)),
        yPercent: Number(y.toFixed(1)),
        sizePx,
        opacity: Number((0.14 + nextRand() * 0.14).toFixed(2)),
        initialRotate: Math.round(nextRand() * 360),
        duration: Number((9 + nextRand() * 14).toFixed(1)),
        appearDelay: Number((nextRand() * 0.45).toFixed(2)),
        direction: nextRand() >= 0.5 ? 1 : -1,
        desktopOnly: x > 15 && x < 85 && y > 16 && y < 80,
      });
    }
  };

  // Lớp 1: ếch cỡ lớn & vừa tạo nhịp điệu; Lớp 2: ếch nhỏ lấp đầy mọi khoảng trống còn lại
  tryPlace(22, 48, 76, 900);
  tryPlace(38, 22, 42, 1600);

  return frogs;
}

const FLOATING_FROGS = createScatteredFrogs();

export default function PortraitIntro({ onOpen }: PortraitIntroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [drawComplete, setDrawComplete] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const fillsGroupRef = useRef<SVGGElement | null>(null);
  const finalMaskRectRef = useRef<SVGRectElement | null>(null);
  const penTipRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      for (const el of pathRefs.current) {
        if (el) {
          el.style.strokeDasharray = 'none';
          el.style.strokeDashoffset = '0';
        }
      }
      if (fillsGroupRef.current) fillsGroupRef.current.style.opacity = '1';
      if (finalMaskRectRef.current) finalMaskRectRef.current.style.opacity = '1';
      if (penTipRef.current) penTipRef.current.style.opacity = '0';
      return undefined;
    }

    const lengths = pathRefs.current.map((el) => {
      if (!el) return 0;
      const len = Math.max(1, el.getTotalLength());
      el.style.strokeDasharray = `${len} ${len}`;
      el.style.strokeDashoffset = `${len}`;
      return len;
    });

    if (fillsGroupRef.current) fillsGroupRef.current.style.opacity = '0';
    if (finalMaskRectRef.current) finalMaskRectRef.current.style.opacity = '0';
    if (penTipRef.current) penTipRef.current.style.opacity = '0';

    let rafId: number | undefined;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;

      let activePoint: { x: number; y: number } | null = null;

      for (let i = 0; i < PORTRAIT_STROKES.length; i++) {
        const el = pathRefs.current[i];
        if (!el) continue;
        const len = lengths[i];
        const slot = STROKE_SCHEDULES[i];

        if (elapsed <= slot.startMs) {
          el.style.strokeDashoffset = `${len}`;
        } else if (elapsed >= slot.endMs) {
          el.style.strokeDashoffset = '0';
        } else {
          const t = (elapsed - slot.startMs) / Math.max(1, slot.endMs - slot.startMs);
          // Smooth gentle pen stroke ease
          const eased = 1 - Math.pow(1 - t, 1.5);
          const drawn = len * eased;
          el.style.strokeDashoffset = `${len - drawn}`;

          const pt = el.getPointAtLength(drawn);
          activePoint = { x: pt.x, y: pt.y };
        }
      }

      // Tô phần mắt/môi trong mặt nạ ngay sau khi nét ngũ quan vừa vẽ xong
      if (fillsGroupRef.current) {
        const fillProgress = Math.min(1, Math.max(0, (elapsed - 1100) / 650));
        fillsGroupRef.current.style.opacity = String(fillProgress);
      }

      // Chặng cuối: mở khóa trọn vẹn 100% chi tiết siêu mảnh của ảnh gốc
      if (finalMaskRectRef.current) {
        const finishProgress = Math.min(1, Math.max(0, (elapsed - 4400) / 400));
        finalMaskRectRef.current.style.opacity = String(finishProgress);
      }

      if (penTipRef.current) {
        if (activePoint && elapsed < TOTAL_DRAW_MS) {
          penTipRef.current.setAttribute('transform', `translate(${activePoint.x}, ${activePoint.y})`);
          penTipRef.current.style.opacity = '1';
        } else {
          penTipRef.current.style.opacity = '0';
        }
      }

      if (elapsed < TOTAL_DRAW_MS) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        for (const el of pathRefs.current) {
          if (el) el.style.strokeDashoffset = '0';
        }
        if (fillsGroupRef.current) fillsGroupRef.current.style.opacity = '1';
        if (finalMaskRectRef.current) finalMaskRectRef.current.style.opacity = '1';
        if (penTipRef.current) penTipRef.current.style.opacity = '0';
        setDrawComplete(true);
      }
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId !== undefined) window.cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const handleEnterMain = () => {
    if (isOpening) return;
    setIsOpening(true);
    triggerWelcomeBurst();
    window.setTimeout(() => {
      onOpen();
    }, 520);
  };

  const isRevealed = reducedMotion || drawComplete;
  const isDrawing = !isRevealed;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.03 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-30 flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-5"
      style={{
        background:
          'radial-gradient(circle at 50% 42%, rgba(255, 255, 255, 0.8) 0%, transparent 62%), linear-gradient(155deg, #FFF0F5 0%, #FFE4EE 48%, #FADADD 100%)',
      }}
    >
      {/* Họa tiết hạt giấy pastel dịu nhẹ */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        aria-hidden="true"
        style={{
          backgroundImage: 'radial-gradient(rgba(216, 27, 96, 0.08) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      {/* Các icon ếch to nhỏ chỉ xuất hiện và xoay tròn sau khi vẽ xong chân dung Chị Chang */}
      {isRevealed && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {FLOATING_FROGS.map((frog) => (
            <motion.img
              key={frog.id}
              src={`${import.meta.env.BASE_URL}frog_icon.png`}
              alt=""
              draggable={false}
              style={{
                top: `${frog.yPercent}%`,
                left: `${frog.xPercent}%`,
                width: `${frog.sizePx}px`,
              }}
              initial={
                reducedMotion
                  ? { opacity: frog.opacity, scale: 1, rotate: frog.initialRotate, x: '-50%', y: '-50%' }
                  : { opacity: 0, scale: 0.4, rotate: frog.initialRotate, x: '-50%', y: '-50%' }
              }
              animate={{
                opacity: frog.opacity,
                scale: 1,
                rotate: reducedMotion ? frog.initialRotate : frog.initialRotate + frog.direction * 360,
              }}
              transition={{
                opacity: { duration: 0.55, delay: frog.appearDelay, ease: 'easeOut' },
                scale: { duration: 0.55, delay: frog.appearDelay, ease: 'easeOut' },
                rotate: { duration: frog.duration, repeat: Infinity, ease: 'linear' },
              }}
              className={`pointer-events-none absolute h-auto select-none object-contain ${
                frog.desktopOnly ? 'hidden sm:block' : ''
              }`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center text-center">
        {/* Chân dung SVG tự vẽ từng nét trực tiếp trên màn hình */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0.96, scale: 0.99 }}
          animate={
            !isDrawing && !reducedMotion
              ? { opacity: 1, scale: 1, y: [0, -5, 0] }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={
            !isDrawing && !reducedMotion
              ? { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.5, ease: 'easeOut' }
          }
          className="relative flex aspect-[906/924] h-[min(64dvh,96vw)] max-h-[680px] min-h-[260px] items-center justify-center"
        >
          {/* Vầng sáng hồng dịu phía sau giúp nét mực #D81B60 nổi bật mềm mại */}
          <div
            className="pointer-events-none absolute -inset-6 rounded-full opacity-55 blur-3xl"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 255, 255, 0.88) 0%, rgba(255, 182, 193, 0.32) 52%, transparent 78%)',
            }}
          />

          <svg
            viewBox={`0 0 ${PORTRAIT_VIEWBOX.width} ${PORTRAIT_VIEWBOX.height}`}
            role="img"
            aria-label="Chân dung vẽ nét nghệ thuật của Chị Chang"
            className="relative z-10 h-full w-full overflow-visible drop-shadow-[0_10px_24px_rgba(216,27,96,0.12)]"
          >
            <defs>
              <radialGradient id="penGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="35%" stopColor="#FF80AB" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#D81B60" stopOpacity="0" />
              </radialGradient>

              {/* Mặt nạ vẽ từng nét trên chính bức ảnh gốc 1:1 */}
              <mask
                id="portraitStrokeMask"
                x="0"
                y="0"
                width={PORTRAIT_VIEWBOX.width}
                height={PORTRAIT_VIEWBOX.height}
                maskUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width={PORTRAIT_VIEWBOX.width}
                  height={PORTRAIT_VIEWBOX.height}
                  fill="#000000"
                />

                <g ref={fillsGroupRef} style={{ opacity: reducedMotion ? 1 : 0 }}>
                  {PORTRAIT_FILLS.map((d, idx) => (
                    <path key={`mask-fill-${idx}`} d={d} fill="#FFFFFF" fillRule="nonzero" />
                  ))}
                </g>

                <g fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round">
                  {PORTRAIT_STROKES.map((stroke, idx) => (
                    <path
                      key={stroke.id}
                      ref={(el) => {
                        pathRefs.current[idx] = el;
                      }}
                      d={stroke.d}
                      strokeWidth={stroke.w}
                    />
                  ))}
                </g>

                <rect
                  ref={finalMaskRectRef}
                  x="0"
                  y="0"
                  width={PORTRAIT_VIEWBOX.width}
                  height={PORTRAIT_VIEWBOX.height}
                  fill="#FFFFFF"
                  style={{ opacity: reducedMotion ? 1 : 0 }}
                />
              </mask>
            </defs>

            {/* Ảnh chân dung gốc sắc nét tuyệt đối 100%, được vẽ lộ ra theo đúng từng nét mặt nạ SVG */}
            <image
              href={`${import.meta.env.BASE_URL}chang_art_transparent.png`}
              x="0"
              y="0"
              width={PORTRAIT_VIEWBOX.width}
              height={PORTRAIT_VIEWBOX.height}
              preserveAspectRatio="xMidYMid meet"
              mask={isDrawing ? 'url(#portraitStrokeMask)' : undefined}
            />

            {/* Chấm sáng đầu bút di chuyển theo từng nét đang vẽ */}
            <g ref={penTipRef} style={{ opacity: 0 }} className="pointer-events-none">
              <circle cx="0" cy="0" r="18" fill="url(#penGlowGrad)" />
              <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />
            </g>
          </svg>
        </motion.div>

        {/* Hộp quà mở thiệp hiện lên trọn vẹn sau khi bức vẽ hoàn thiện */}
        <div className="mt-5 flex min-h-[118px] flex-col items-center justify-start">
          <AnimatePresence mode="wait">
            {isRevealed && (
              <motion.div
                key="revealed-cta"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="flex flex-col items-center"
              >
                <motion.button
                  type="button"
                  onClick={handleEnterMain}
                  disabled={isOpening}
                  aria-label="Mở món quà dành tặng Chị Chang"
                  whileHover={reducedMotion ? undefined : { scale: 1.07, rotate: [0, -4, 4, 0] }}
                  whileTap={reducedMotion ? undefined : { scale: 0.94 }}
                  transition={{ duration: 0.25 }}
                  className="ev-btn-primary inline-flex h-16 w-16 cursor-pointer items-center justify-center rounded-2xl border border-white/40 text-white shadow-lg focus-visible:ring-2 focus-visible:ring-[#D81B60] focus-visible:ring-offset-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Gift size={34} weight="duotone" aria-hidden="true" />
                </motion.button>

                <div className="mt-2.5 flex flex-col items-center gap-0.5">
                  <motion.span
                    aria-hidden="true"
                    animate={reducedMotion ? undefined : { y: [3, -3, 3] }}
                    transition={{ duration: 1.25, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-flex text-[#D81B60]"
                  >
                    <ArrowUp size={20} weight="bold" />
                  </motion.span>
                  <p className="text-sm font-semibold text-[#7B3348]">
                    {isOpening ? 'Đang mở thiệp...' : 'chị chang bấm vào đây ik'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
