import type { ReactNode } from 'react';

interface BadgePillProps {
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  uppercase?: boolean;
}

/** Pill badge chuẩn evondevKit tích hợp hiệu ứng kính mờ và canh chỉnh icon SVG đồng nhất. */
export function BadgePill({
  children,
  leadingIcon,
  trailingIcon,
  className = '',
  uppercase = true,
}: BadgePillProps) {
  return (
    <div
      className={`ev-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider text-ink ${
        uppercase ? 'uppercase' : ''
      } ${className}`}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </div>
  );
}
