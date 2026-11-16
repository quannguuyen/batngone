import { EnvelopeSimple, Heart } from "@phosphor-icons/react";
import { LOVE_LETTER_CONTENT } from "../data/birthdayContent";
import { GlassSurface } from "../ui/GlassSurface";

export default function LoveLetterCard() {
  return (
    <section
      id="love-letter"
      aria-labelledby="letter-heading"
      className="relative z-10 mx-auto max-w-5xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
    >
      <GlassSurface
        variant="elevated"
        hairline
        doubleFrame
        innerClassName="p-6 sm:p-10 md:p-12"
      >
        <article className="relative">
          {/* Vệt sáng rose-gold góc trên bên phải */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-45 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(250, 218, 221, 0.9) 0%, transparent 72%)",
            }}
          />

          <header className="relative mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-rose-gold/20 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-gold/25 bg-gradient-to-br from-pastel to-blush text-accent shadow-sm">
                <EnvelopeSimple size={24} weight="duotone" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2
                  id="letter-heading"
                  className="font-display text-3xl font-bold text-ink sm:text-4xl"
                >
                  {LOVE_LETTER_CONTENT.heading}
                </h2>
                <p className="mt-1 text-sm font-medium text-ink-muted">
                  {LOVE_LETTER_CONTENT.meta}
                </p>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-gradient-to-br from-blush-deep via-rose-gold to-accent-dark shadow-md"
            >
              <Heart size={20} weight="fill" className="text-white" />
            </div>
          </header>

          <div className="relative mx-auto max-w-[65ch] space-y-5 text-base leading-relaxed font-medium break-words text-ink sm:text-[17px] sm:leading-loose">
            {LOVE_LETTER_CONTENT.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </article>
      </GlassSurface>
    </section>
  );
}
