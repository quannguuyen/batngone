import { motion } from "framer-motion";

interface CakeIllustrationProps {
  candlesLit: boolean;
  isDarkRoom?: boolean;
  onBlowCandles: () => void;
}

const CANDLES = [
  { id: "c-left", cx: 165, topY: 102, h: 35 },
  { id: "c-center", cx: 180, topY: 100, h: 43 },
  { id: "c-right", cx: 195, topY: 102, h: 37 },
] as const;

const SCATTERED_PEARLS = [
  { x: 142, y: 122, r: 2.0 },
  { x: 205, y: 128, r: 2.2 },
  { x: 112, y: 175, r: 2.2 },
  { x: 145, y: 192, r: 1.9 },
  { x: 238, y: 170, r: 2.3 },
  { x: 85, y: 232, r: 2.4 },
  { x: 120, y: 256, r: 2.0 },
  { x: 185, y: 238, r: 2.5 },
  { x: 222, y: 268, r: 2.1 },
  { x: 266, y: 235, r: 2.3 },
] as const;

const TIER1_PETALS = [74, 96, 118, 140, 162, 184, 206, 228, 250, 272] as const;
const TIER2_PETALS = [104, 126, 148, 170, 192, 214, 236] as const;
const TIER3_PETALS = [132, 152, 172, 192, 212] as const;

function ButterflySvg({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${rotate}) scale(${scale})`}
      filter="url(#softDrop)"
    >
      {/* Cánh trên trái & phải */}
      <path
        d="M0,-2 C-8,-16 -24,-18 -22,-3 C-21,5 -10,6 0,2 Z"
        fill="url(#butterflyWingGrad)"
        stroke="#F0DCE1"
        strokeWidth="0.7"
      />
      <path
        d="M0,-2 C8,-16 24,-18 22,-3 C21,5 10,6 0,2 Z"
        fill="url(#butterflyWingGrad)"
        stroke="#F0DCE1"
        strokeWidth="0.7"
      />
      {/* Cánh dưới trái & phải */}
      <path
        d="M0,2 C-10,5 -18,14 -12,18 C-7,21 -2,13 0,6 Z"
        fill="url(#butterflyWingLower)"
        stroke="#F0DCE1"
        strokeWidth="0.7"
      />
      <path
        d="M0,2 C10,5 18,14 12,18 C7,21 2,13 0,6 Z"
        fill="url(#butterflyWingLower)"
        stroke="#F0DCE1"
        strokeWidth="0.7"
      />
      {/* Thân mảnh */}
      <ellipse cx="0" cy="2" rx="1.4" ry="6.5" fill="#EDE0E4" />
    </g>
  );
}

/** Minh họa bánh kem công chúa 3 tầng phong cách pastel vương miện bạc, bướm trắng, nơ voan & ngọc trai. */
export default function CakeIllustration({
  candlesLit,
  isDarkRoom = false,
  onBlowCandles,
}: CakeIllustrationProps) {
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Quầng sáng nến ấm lan tỏa trong phòng tối */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-2 h-64 w-72 rounded-full blur-3xl transition-opacity duration-500 ${
          candlesLit ? (isDarkRoom ? "opacity-100" : "opacity-80") : "opacity-0"
        }`}
        style={{
          background: isDarkRoom
            ? "radial-gradient(circle, rgba(255, 222, 158, 0.52) 0%, rgba(235, 162, 185, 0.24) 55%, transparent 100%)"
            : "radial-gradient(circle, rgba(255, 214, 148, 0.48) 0%, rgba(231, 84, 128, 0.16) 62%, transparent 100%)",
        }}
      />

      <svg
        viewBox="0 0 360 302"
        className="relative z-10 h-auto w-[min(90vw,460px)] max-w-full drop-shadow-[0_20px_38px_rgba(74,21,37,0.22)] sm:w-[470px] md:w-[500px]"
        role="img"
        aria-label="Bánh sinh nhật 3 tầng công chúa tông hồng kem pastel trang trí vương miện bạc, bướm trắng, nơ voan ngọc trai và 3 ngọn nến"
      >
        <defs>
          {/* Chuyển sắc kem bơ hồng phấn lì sang trọng cho 3 tầng bánh */}
          <linearGradient id="blushCakeBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E6BEC6" />
            <stop offset="28%" stopColor="#F5DCE1" />
            <stop offset="65%" stopColor="#FCEEF1" />
            <stop offset="100%" stopColor="#DFB4BE" />
          </linearGradient>

          <linearGradient id="blushCakeTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDF2F4" />
            <stop offset="55%" stopColor="#F6DCE1" />
            <stop offset="100%" stopColor="#ECC8D0" />
          </linearGradient>

          <linearGradient
            id="buttercreamStroke"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#D9AEB8" stopOpacity="0.18" />
          </linearGradient>

          {/* Vương miện bạc ánh kim */}
          <linearGradient
            id="silverMetallic"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#D4DCE6" />
            <stop offset="62%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#94A0B2" />
          </linearGradient>

          {/* Cánh bướm trắng ngà mềm mại */}
          <linearGradient
            id="butterflyWingGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F7EBEE" />
          </linearGradient>
          <linearGradient
            id="butterflyWingLower"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFDFD" />
            <stop offset="100%" stopColor="#F2E2E6" />
          </linearGradient>

          {/* Nơ voan trắng trong mờ */}
          <linearGradient
            id="organzaRibbon"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#F9ECEF" stopOpacity="0.62" />
          </linearGradient>

          {/* Hạt ngọc trai 3D óng ánh */}
          <radialGradient id="pearlOrbGrad" cx="34%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="48%" stopColor="#F7F1F5" />
            <stop offset="82%" stopColor="#E5D5DE" />
            <stop offset="100%" stopColor="#C9B4C0" />
          </radialGradient>

          {/* Nến ngọc trai & ngọn lửa */}
          <linearGradient
            id="pearlCandleGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#E8C6D0" />
            <stop offset="45%" stopColor="#FFFDFD" />
            <stop offset="100%" stopColor="#D9B1BE" />
          </linearGradient>
          <radialGradient id="flameAuraGrad" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#FFF6BF" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#FFB74D" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#FF8A65" stopOpacity="0" />
          </radialGradient>

          <filter id="softDrop" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="2.2"
              floodColor="#6E3A4B"
              floodOpacity="0.18"
            />
          </filter>
        </defs>

        {/* Bóng đổ dịu nhẹ ngay dưới đáy bánh */}
        <ellipse
          cx="180"
          cy="283"
          rx="116"
          ry="12"
          fill="#2A0F1A"
          opacity="0.28"
        />

        {/* ================= TẦNG 1 (ĐÁY LỚN NHẤT) ================= */}
        <path
          d="M64 210 L64 274 Q180 296 296 274 L296 210 Z"
          fill="url(#blushCakeBody)"
          stroke="#DFB6C0"
          strokeWidth="1.1"
        />
        {/* Vân kem bơ bay bổng dọc thành bánh tầng 1 */}
        {TIER1_PETALS.map((px, i) => (
          <path
            key={px}
            d={`M${px} 276 Q${px + 9} 226 ${px + 18} 276 Z`}
            fill="url(#buttercreamStroke)"
            opacity={i % 2 === 0 ? 0.72 : 0.45}
          />
        ))}
        {/* Quả cầu ngọc lớn đặt cạnh chân bánh tầng 1 bên trái */}
        <circle
          cx="73"
          cy="271"
          r="15.5"
          fill="url(#pearlOrbGrad)"
          filter="url(#softDrop)"
        />
        <ellipse
          cx="68"
          cy="265"
          rx="4.5"
          ry="2.8"
          fill="#FFFFFF"
          opacity="0.85"
        />
        <ellipse
          cx="180"
          cy="210"
          rx="116"
          ry="15"
          fill="url(#blushCakeTop)"
          stroke="#E4BDC7"
          strokeWidth="1"
        />

        {/* ================= TẦNG 2 (GIỮA) ================= */}
        <path
          d="M94 152 L94 206 Q180 223 266 206 L266 152 Z"
          fill="url(#blushCakeBody)"
          stroke="#DFB6C0"
          strokeWidth="1.1"
        />
        {/* Vân kem bơ dọc tầng 2 */}
        {TIER2_PETALS.map((px, i) => (
          <path
            key={px}
            d={`M${px} 209 Q${px + 8} 166 ${px + 16} 209 Z`}
            fill="url(#buttercreamStroke)"
            opacity={i % 2 === 0 ? 0.75 : 0.48}
          />
        ))}
        <ellipse
          cx="180"
          cy="152"
          rx="86"
          ry="12"
          fill="url(#blushCakeTop)"
          stroke="#E4BDC7"
          strokeWidth="1"
        />

        {/* Quả cầu ngọc trung đặt ở góc phải vai tầng 2 */}
        <circle
          cx="268"
          cy="197"
          r="11.5"
          fill="url(#pearlOrbGrad)"
          filter="url(#softDrop)"
        />
        <ellipse
          cx="264"
          cy="192"
          rx="3.5"
          ry="2.2"
          fill="#FFFFFF"
          opacity="0.85"
        />

        {/* ================= TẦNG 3 (TRÊN CÙNG) ================= */}
        <path
          d="M122 104 L122 149 Q180 162 238 149 L238 104 Z"
          fill="url(#blushCakeBody)"
          stroke="#DFB6C0"
          strokeWidth="1.1"
        />
        {/* Vân kem bơ dọc tầng 3 */}
        {TIER3_PETALS.map((px) => (
          <path
            key={px}
            d={`M${px} 151 Q${px + 7} 116 ${px + 14} 151 Z`}
            fill="url(#buttercreamStroke)"
            opacity="0.68"
          />
        ))}
        <ellipse
          cx="180"
          cy="104"
          rx="58"
          ry="9.5"
          fill="url(#blushCakeTop)"
          stroke="#E4BDC7"
          strokeWidth="1"
        />

        {/* Quả cầu ngọc đặt cạnh trái tầng trên */}
        <circle
          cx="131"
          cy="100"
          r="7.5"
          fill="url(#pearlOrbGrad)"
          filter="url(#softDrop)"
        />
        <ellipse
          cx="129"
          cy="97"
          rx="2.3"
          ry="1.4"
          fill="#FFFFFF"
          opacity="0.85"
        />

        {/* ================= 3 NGỌN NẾN CẮM TRỰC TIẾP TRÊN MẶT BÁNH ================= */}
        {CANDLES.map((candle, idx) => {
          const wickTop = candle.topY - candle.h;
          return (
            <g key={candle.id}>
              {/* Chân đế kem nhỏ ôm lấy chân nến trên mặt bánh */}
              <ellipse
                cx={candle.cx}
                cy={candle.topY}
                rx="5.4"
                ry="2.2"
                fill="#FFF8FB"
                stroke="#E4BDC7"
                strokeWidth="0.7"
              />
              <rect
                x={candle.cx - 3.6}
                y={wickTop + 4}
                width="7.2"
                height={candle.h - 4}
                rx="3"
                fill="url(#pearlCandleGrad)"
                stroke="#FFFFFF"
                strokeWidth="0.9"
              />
              {/* Đường xoắn ánh kim nhẹ trên thân nến */}
              <path
                d={`M${candle.cx - 3} ${wickTop + 12} L${candle.cx + 3} ${wickTop + 9} M${candle.cx - 3} ${wickTop + 21} L${candle.cx + 3} ${wickTop + 18} M${candle.cx - 3} ${wickTop + 30} L${candle.cx + 3} ${wickTop + 27}`}
                stroke="#D81B60"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.45"
              />
              <line
                x1={candle.cx}
                y1={wickTop + 4}
                x2={candle.cx}
                y2={wickTop - 2}
                stroke="#4A1525"
                strokeWidth="1.4"
                strokeLinecap="round"
              />

              {candlesLit ? (
                <g
                  onClick={onBlowCandles}
                  className="cursor-pointer"
                  role="button"
                  tabIndex={0}
                  aria-label={`Thổi tắt ngọn nến số ${idx + 1}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onBlowCandles();
                    }
                  }}
                >
                  <circle
                    cx={candle.cx}
                    cy={wickTop - 9}
                    r="22"
                    fill="transparent"
                  />
                  <motion.circle
                    cx={candle.cx}
                    cy={wickTop - 10}
                    r="15"
                    fill="url(#flameAuraGrad)"
                    animate={{
                      scale: [0.95, 1.2, 0.96],
                      opacity: [0.68, 1, 0.72],
                    }}
                    transition={{
                      duration: 1.05 + idx * 0.18,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      transformOrigin: `${candle.cx}px ${wickTop - 10}px`,
                    }}
                  />
                  <motion.path
                    d={`M${candle.cx} ${wickTop - 21} C${candle.cx + 6.2} ${wickTop - 11.5}, ${candle.cx + 5.2} ${wickTop - 2}, ${candle.cx} ${wickTop - 1} C${candle.cx - 5.2} ${wickTop - 2}, ${candle.cx - 6.2} ${wickTop - 11.5}, ${candle.cx} ${wickTop - 21} Z`}
                    fill="#FFB347"
                    animate={{
                      scaleY: [1, 1.15, 0.94, 1],
                      scaleX: [1, 0.9, 1.07, 1],
                    }}
                    transition={{
                      duration: 0.85 + idx * 0.14,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      transformOrigin: `${candle.cx}px ${wickTop - 1}px`,
                    }}
                  />
                  <path
                    d={`M${candle.cx} ${wickTop - 14.5} C${candle.cx + 3} ${wickTop - 9}, ${candle.cx + 2.6} ${wickTop - 3}, ${candle.cx} ${wickTop - 2.2} C${candle.cx - 2.6} ${wickTop - 3}, ${candle.cx - 3} ${wickTop - 9}, ${candle.cx} ${wickTop - 14.5} Z`}
                    fill="#FFF9C4"
                  />
                </g>
              ) : (
                <motion.path
                  d={`M${candle.cx} ${wickTop - 3} Q${candle.cx - 5} ${wickTop - 13} ${candle.cx + 3} ${wickTop - 24}`}
                  fill="none"
                  stroke="#7B3348"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={{ opacity: 0.75, y: 2 }}
                  animate={{ opacity: 0, y: -14 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              )}
            </g>
          );
        })}

        {/* ================= VƯƠNG MIỆN BẠC CÔNG CHÚA NGHIÊNG Ở MÉP PHẢI ================= */}
        <g
          transform="translate(226, 105) rotate(22) scale(0.64)"
          filter="url(#softDrop)"
        >
          {/* Vòng đai chân vương miện cong 3D */}
          <path
            d="M-36,0 Q0,8 36,0 Q39,-14 34,-26 Q26,-16 20,-28 Q12,-14 0,-36 Q-12,-14 -20,-28 Q-26,-16 -34,-26 Q-39,-14 -36,0 Z"
            fill="none"
            stroke="url(#silverMetallic)"
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Họa tiết vòm ren bạc bên trong vương miện */}
          <path
            d="M-28,-2 Q-20,-18 -12,-2 M-14,-2 Q0,-26 14,-2 M12,-2 Q20,-18 28,-2"
            fill="none"
            stroke="url(#silverMetallic)"
            strokeWidth="1.6"
          />
          <path
            d="M-33,-12 Q-24,-10 -18,-18 M-16,-14 Q-7,-12 0,-24 Q7,-12 16,-14 M18,-18 Q24,-10 33,-12"
            fill="none"
            stroke="url(#silverMetallic)"
            strokeWidth="1.2"
          />
          {/* Hạt ngọc trai đính đỉnh & chân vương miện */}
          {[-34, -20, 0, 20, 34].map((px, i) => {
            const py = i === 2 ? -37 : i === 1 || i === 3 ? -29 : -27;
            return (
              <circle
                key={`crown-top-${px}`}
                cx={px}
                cy={py}
                r={i === 2 ? 3.1 : 2.3}
                fill="url(#pearlOrbGrad)"
                stroke="#B2BCC9"
                strokeWidth="0.5"
              />
            );
          })}
          {[-28, -18, -9, 0, 9, 18, 28].map((bx) => (
            <circle
              key={`crown-base-${bx}`}
              cx={bx}
              cy={1 + Math.cos((bx / 36) * (Math.PI / 2)) * 3.5}
              r="2.1"
              fill="#FFFFFF"
              stroke="#B8C2CF"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* ================= NƠ VOAN TRẮNG & CHUỖI NGỌC TRAI PHỦ TẦNG GIỮA-ĐÁY ================= */}
        <g transform="translate(154, 174)">
          {/* Chuỗi ngọc trai rủ mềm hai bên */}
          <path
            d="M0,4 Q-22,22 -28,50 M0,4 Q-10,28 -8,56 M0,4 Q16,24 24,52 M0,4 Q26,18 36,42"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeDasharray="0.5 5.2"
            strokeLinecap="round"
          />
          {/* Hai tai nơ voan trắng trong mờ */}
          <path
            d="M0,0 C-14,-14 -34,-12 -32,4 C-30,14 -14,12 0,3 Z"
            fill="url(#organzaRibbon)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
          <path
            d="M0,0 C14,-14 34,-12 32,4 C30,14 14,12 0,3 Z"
            fill="url(#organzaRibbon)"
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
          {/* Hai dải đuôi nơ buông nhẹ */}
          <path
            d="M-2,3 Q-14,22 -10,42 Q-2,38 1,8 Z"
            fill="url(#organzaRibbon)"
            stroke="#FFFFFF"
            strokeWidth="0.9"
          />
          <path
            d="M2,3 Q16,22 24,38 Q12,38 0,8 Z"
            fill="url(#organzaRibbon)"
            stroke="#FFFFFF"
            strokeWidth="0.9"
          />
          {/* Nút thắt giữa đính ngọc trai */}
          <circle
            cx="0"
            cy="2"
            r="4.2"
            fill="url(#pearlOrbGrad)"
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />
        </g>

        {/* ================= QUE CẮM BƯỚM TRẮNG TRÊN ĐỈNH BÁNH ================= */}
        <line
          x1="126"
          y1="102"
          x2="92"
          y2="46"
          stroke="#FFF8FA"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <ButterflySvg x={90} y={42} scale={1.12} rotate={-14} />

        {/* Các chú bướm trắng đậu trên thành bánh tầng 2 và tầng 1 */}
        <ButterflySvg x={252} y={178} scale={0.78} rotate={18} />
        <ButterflySvg x={128} y={248} scale={0.92} rotate={-12} />
        <ButterflySvg x={264} y={242} scale={0.85} rotate={15} />

        {/* Hạt ngọc đường li ti rải khắp 3 tầng kem */}
        {SCATTERED_PEARLS.map((p, idx) => (
          <circle
            key={`sp-${idx}`}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="url(#pearlOrbGrad)"
            stroke="#FFFFFF"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  );
}
