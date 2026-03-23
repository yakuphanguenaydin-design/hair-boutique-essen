import { useRef, useEffect } from "react";
import heroHair from "@/assets/hero-hair.jpg";
import galleryImg2 from "@/assets/gallery-2.jpg";
import galleryImg3 from "@/assets/gallery-3.jpg";
import galleryImg4 from "@/assets/gallery-4.jpg";
import galleryImg6 from "@/assets/gallery-6.jpg";
import serviceColor from "@/assets/service-color.jpg";
import salonInterior from "@/assets/salon-interior.jpg";
import { importedImagesConfig } from "@/config/importedImages";

const galleryItems = [
  { src: heroHair,       alt: "Golden Balayage Highlight-Ergebnis",             span: "col-span-1 row-span-2" },
  { src: galleryImg3,    alt: "Ash Blonde Haarfarbe Ergebnis",                  span: "col-span-1 row-span-1" },
  { src: galleryImg4,    alt: "Warme Bronde Strähnen Nahaufnahme",              span: "col-span-1 row-span-1" },
  { src: galleryImg2,    alt: "Luxuriöse Extensions — Brunette",                span: "col-span-1 row-span-1" },
  { src: galleryImg6,    alt: "Professionelle Haarfarbe Technik",               span: "col-span-1 row-span-1" },
  { src: serviceColor,   alt: "Highlights & Glossing Behandlung",               span: "col-span-1 row-span-1" },
  { src: salonInterior,  alt: "Hair Boutique Salon Essen Innenraum",            span: "col-span-1 row-span-1" },
];

const importedSpans = [
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const importedGalleryItems = importedImagesConfig.enabled
    ? importedImagesConfig.gallery.map((src, index) => ({
        src,
        alt: `Instagram Import ${index + 1}`,
        span: importedSpans[index % importedSpans.length],
      }))
    : [];

  const visibleGalleryItems = importedGalleryItems.length > 0 ? importedGalleryItems : galleryItems;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="galerie" ref={sectionRef} className="py-28 lg:py-36 bg-champagne">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-lg">
            <div className="reveal flex items-center gap-4 mb-6">
              <span className="line-gold" />
              <span className="font-body text-xs tracking-[0.25em] uppercase text-warm-grey">
                Galerie
              </span>
            </div>
            <h2 className="reveal reveal-delay-1 font-display text-display-lg text-foreground leading-tight">
              Unsere Ergebnisse<br />
              <em className="not-italic text-gold">für sich sprechen</em>
            </h2>
          </div>
          <p className="reveal reveal-delay-2 font-body text-sm text-warm-grey max-w-xs leading-relaxed lg:text-right">
            Jede Transformation ist einzigartig. Entdecken Sie ausgewählte Arbeiten aus unserem Salon.
          </p>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-[240px] lg:auto-rows-[300px]">
          {visibleGalleryItems.map((item, i) => (
            <div
              key={i}
              className={`reveal reveal-delay-${Math.min(i + 1, 6)} overflow-hidden group ${item.span}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>

        {/* Instagram CTA */}
        <div className="reveal reveal-delay-4 mt-12 flex items-center justify-center gap-6">
          <span className="hidden sm:block w-16 h-px bg-divider" />
          <a
            href="https://www.instagram.com/hairboutiique/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs tracking-[0.2em] uppercase text-foreground border-b border-foreground pb-1 hover:text-gold hover:border-gold transition-colors duration-300"
          >
            Mehr auf Instagram ansehen
          </a>
          <span className="hidden sm:block w-16 h-px bg-divider" />
        </div>
      </div>
    </section>
  );
}
