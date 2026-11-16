import { useState, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import {
  Crown,
  FlowerLotus,
  Heart,
  Heartbeat,
  Sparkle,
  SunHorizon,
  Trophy,
} from '@phosphor-icons/react';
import { POLAROID_WISHES, type PolaroidWishItem } from '../data/birthdayContent';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { BadgePill } from '../ui/BadgePill';
import { fadeUpMotion } from '../ui/MotionPresets';
import { triggerHeartBurst } from '../utils/confettiEffects';

function ThemeIcon({ kind }: { kind: PolaroidWishItem['icon'] }) {
  switch (kind) {
    case 'health':
      return <Heartbeat size={36} weight="duotone" className="text-accent" aria-hidden="true" />;
    case 'happiness':
      return <SunHorizon size={36} weight="duotone" className="text-accent" aria-hidden="true" />;
    case 'success':
      return <Trophy size={36} weight="duotone" className="text-accent" aria-hidden="true" />;
    case 'beauty':
      return <FlowerLotus size={36} weight="duotone" className="text-accent" aria-hidden="true" />;
  }
}

interface PolaroidCardProps {
  item: PolaroidWishItem;
  index: number;
  likes: number;
  reducedMotion: boolean;
  onHeartClick: (id: string, event: MouseEvent<HTMLButtonElement>) => void;
}

function PolaroidCard({ item, index, likes, reducedMotion, onHeartClick }: PolaroidCardProps) {
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 260, damping: 20 });
  const rotateY = useSpring(rawRotateY, { stiffness: 260, damping: 20 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (event: MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const normX = (event.clientX - rect.left) / rect.width - 0.5;
    const normY = (event.clientY - rect.top) / rect.height - 0.5;
    rawRotateY.set(normX * 9);
    rawRotateX.set(-normY * 9);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    rawRotateX.set(0);
    rawRotateY.set(0);
  };

  return (
    <motion.article
      {...fadeUpMotion(index * 0.08)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
      style={
        reducedMotion
          ? undefined
          : {
              transformPerspective: 900,
              rotateX,
              rotateY,
              rotateZ: isHovered ? 0 : item.tiltDeg,
            }
      }
      className={`ev-card-elevated group relative flex flex-col justify-between rounded-3xl p-4 pt-5 pb-5 transition-transform duration-150 hover:-translate-y-1.5 ${item.masonryOffsetClass}`}
    >
      {/* Băng dán pastel trang trí phía trên thẻ Polaroid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-1 rounded-sm border border-rose-gold/20 bg-blush/80 shadow-xs backdrop-blur-xs"
      />

      <div className="min-w-0">
        <div className="relative mb-4 flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-2xl border border-rose-gold/25 bg-gradient-to-br from-pastel via-pastel to-blush p-4 text-center">
          <Sparkle
            size={16}
            weight="fill"
            aria-hidden="true"
            className="absolute top-3 right-3 text-accent/70"
          />
          <div className="mb-2.5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white bg-white/90 shadow-sm">
            <ThemeIcon kind={item.icon} />
          </div>
          <span className="font-display text-2xl font-bold text-ink">{item.theme}</span>
        </div>

        <h3 className="mb-1.5 text-base font-bold text-ink">{item.caption}</h3>
        <p className="mb-5 text-sm leading-relaxed font-medium text-ink-muted">{item.message}</p>
      </div>

      <div className="flex items-center justify-between border-t border-rose-gold/20 pt-3.5">
        <span className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
          Gửi yêu thương
        </span>
        <motion.button
          type="button"
          onClick={(e) => onHeartClick(item.id, e)}
          whileTap={{ scale: 0.88 }}
          transition={{ duration: 0.1 }}
          aria-label={`Thả tim cho lời chúc ${item.theme}, hiện có ${likes} lượt tim`}
          className="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center gap-1.5 rounded-full border border-accent/35 bg-pastel px-4 py-2 text-sm font-bold text-accent-dark transition-colors duration-150 hover:bg-blush"
        >
          <Heart size={18} weight="fill" className="text-accent" aria-hidden="true" />
          <span>{likes}</span>
        </motion.button>
      </div>
    </motion.article>
  );
}

export default function MemoryGallery() {
  const reducedMotion = usePrefersReducedMotion();
  const [likesMap, setLikesMap] = useState<Record<string, number>>(() =>
    Object.fromEntries(POLAROID_WISHES.map((item) => [item.id, item.initialLikes]))
  );

  const handleHeartClick = (id: string, event: MouseEvent<HTMLButtonElement>) => {
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
    triggerHeartBurst(event.clientX, event.clientY);
  };

  return (
    <section
      id="memory-gallery"
      aria-labelledby="gallery-heading"
      className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-4 pt-12 pb-20 sm:px-6 sm:pt-16 sm:pb-24 lg:px-8"
    >
      <div className="mb-12 text-center">
        <BadgePill
          className="mb-3"
          leadingIcon={<Crown size={16} weight="duotone" className="text-accent" aria-hidden="true" />}
        >
          Khoảnh khắc &amp; Lời chúc
        </BadgePill>
        <h2
          id="gallery-heading"
          className="font-display rose-gold-glow text-4xl font-bold text-ink sm:text-5xl"
        >
          Bốn Mùa Yêu Thương Gửi Chị
        </h2>
        <p className="mx-auto mt-2.5 max-w-[48ch] text-sm font-medium text-ink-muted sm:text-base">
          Di chuột nhẹ trên từng tấm Polaroid để nghiêng ảnh và chạm thả tim gửi thêm thật nhiều yêu thương nhé.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
        {POLAROID_WISHES.map((item, idx) => (
          <PolaroidCard
            key={item.id}
            item={item}
            index={idx}
            likes={likesMap[item.id] ?? 0}
            reducedMotion={reducedMotion}
            onHeartClick={handleHeartClick}
          />
        ))}
      </div>
    </section>
  );
}
