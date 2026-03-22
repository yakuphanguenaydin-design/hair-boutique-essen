import { useRef, useEffect } from "react";
import { Phone, Instagram } from "lucide-react";
import heroHair from "@/assets/hero-hair.jpg";

export default function BookingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const targets = section.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible")),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="buchen" ref={sectionRef} className="relative py-32 lg:py-44 overflow-hidden bg-cream">
      {/* Background image (right side, decorative) */}
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
        <img
          src={heroHair}
          alt=""
          aria-hidden
          loading="lazy"
          className="w-full h-full object-cover object-top opacity-40"
        />
        <div className="absolute inset-0 bg-cream/60" />
      </div>

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        <div className="max-w-xl">
          <div className="reveal flex items-center gap-4 mb-8">
            <span className="line-gold" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-warm-grey">
              Termin vereinbaren
            </span>
          </div>

          <h2 className="reveal reveal-delay-1 font-display text-display-xl text-foreground mb-8 leading-tight">
            Ihr nächster<br />
            <em className="not-italic text-gold">Haarsalon-Besuch</em><br />
            beginnt hier
          </h2>

          <p className="reveal reveal-delay-2 font-body text-base text-warm-grey leading-relaxed mb-12 max-w-md">
            Kontaktieren Sie uns per Telefon oder Instagram — wir freuen uns darauf, gemeinsam mit Ihnen Ihren Traumlook zu verwirklichen.
          </p>

          {/* CTA Buttons */}
          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="tel:+49201000000"
              className="inline-flex items-center justify-center gap-3 font-body text-xs tracking-[0.2em] uppercase bg-foreground text-primary-foreground px-10 py-4 hover:bg-gold transition-all duration-400 active:scale-[0.97]"
            >
              <Phone size={14} />
              Anrufen
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 font-body text-xs tracking-[0.2em] uppercase border border-foreground text-foreground px-10 py-4 hover:bg-foreground hover:text-primary-foreground transition-all duration-300 active:scale-[0.97]"
            >
              <Instagram size={14} />
              Via Instagram
            </a>
          </div>

          {/* Divider */}
          <div className="reveal reveal-delay-4 w-full h-px bg-divider mb-12" />

          {/* Reassurance points */}
          <div className="reveal reveal-delay-5 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { label: "Kostenlose Beratung", sub: "Vor jedem Termin" },
              { label: "Flexibel & pünktlich", sub: "Nach Ihrer Zeit" },
              { label: "Ergebnisgarantie", sub: "Ihre Zufriedenheit zählt" },
            ].map((p) => (
              <div key={p.label} className="flex items-start gap-3">
                <span className="line-gold mt-1.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{p.label}</p>
                  <p className="font-body text-xs text-warm-grey">{p.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
