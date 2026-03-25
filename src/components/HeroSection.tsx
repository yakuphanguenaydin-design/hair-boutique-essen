import heroHair from "@/assets/hero-hair.jpg";
import { importedImagesConfig } from "@/config/importedImages";

export default function HeroSection() {
  const heroSource = importedImagesConfig.enabled && importedImagesConfig.hero
    ? importedImagesConfig.hero
    : heroHair;

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Full-bleed image */}
      <div className="absolute inset-0">
        <img
          src={heroSource}
          alt="Luxuriöse Haarfarbe und Extensions bei Hair Boutique Essen"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
        {/* Subtle dark gradient at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      </div>

      {/* Content — anchored to bottom-left */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 pb-20 lg:pb-28">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-6 animate-fade-up delay-100">
            <span className="line-gold" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-white/70">
              Essen · Premium Haarsalon
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-display-2xl text-white mb-6 animate-fade-up delay-200">
            Luxuriöse Haarfarbe<br />
            <em className="not-italic text-gold">&amp; Extensions</em><br />
            in Essen
          </h1>

          {/* Subheadline */}
          <p className="font-body text-base text-white/75 leading-relaxed max-w-md mb-10 animate-fade-up delay-300">
            Natürliche Schönheit, geschaffen durch präzise Färbetechniken und hochwertige Extensions — individuell auf Sie abgestimmt.
          </p>

          {/* CTA group */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-400">
            <a
              href="#buchen"
              className="inline-flex items-center justify-center font-body text-xs tracking-[0.2em] uppercase bg-white text-foreground px-10 py-4 hover:bg-gold hover:text-white transition-all duration-400 active:scale-[0.97]"
            >
              Termin vereinbaren
            </a>
            <a
              href="#leistungen"
              className="inline-flex items-center justify-center font-body text-xs tracking-[0.2em] uppercase border border-white/50 text-white px-10 py-4 hover:border-white transition-all duration-300 active:scale-[0.97]"
            >
              Unsere Leistungen
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-10 hidden lg:flex flex-col items-center gap-3 animate-fade-in delay-700">
        <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/50 rotate-90 origin-center mb-6">
          Scroll
        </span>
        <div className="w-px h-12 bg-white/30 relative overflow-hidden">
          <div className="absolute top-0 w-full bg-white/70 animate-[shimmer_2s_ease-in-out_infinite]" style={{ height: "40%" }} />
        </div>
      </div>
    </section>
  );
}
