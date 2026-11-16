import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { fadeUpMotion } from './MotionPresets';

interface GlassSurfaceProps {
  children: ReactNode;
  variant?: 'card' | 'elevated';
  hairline?: boolean;
  doubleFrame?: boolean;
  reveal?: boolean;
  revealDelay?: number;
  radiusClass?: string;
  className?: string;
  innerClassName?: string;
}

/** Khối kính mờ đổ bóng đa tầng chuẩn evondevKit, hỗ trợ viền rose-gold và lồng khung đồng tâm. */
export function GlassSurface({
  children,
  variant = 'elevated',
  hairline = true,
  doubleFrame = false,
  reveal = true,
  revealDelay = 0,
  radiusClass = 'rounded-3xl',
  className = '',
  innerClassName = '',
}: GlassSurfaceProps) {
  const surfaceClass = variant === 'elevated' ? 'ev-card-elevated' : 'ev-card';
  const motionProps = reveal ? fadeUpMotion(revealDelay) : {};

  return (
    <motion.div
      {...motionProps}
      className={`${surfaceClass} relative overflow-hidden ${radiusClass} ${
        doubleFrame ? 'p-2 sm:p-3' : ''
      } ${className}`}
    >
      {hairline && (
        <div
          aria-hidden="true"
          className="ev-hairline pointer-events-none absolute inset-x-10 top-0 h-[2px] opacity-75"
        />
      )}

      {doubleFrame ? (
        <div
          className={`relative overflow-hidden rounded-2xl border border-rose-gold/25 bg-white/75 backdrop-blur-md ${innerClassName}`}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}
