import { useRef, useEffect } from "react";
import { MapPin, Clock, Instagram, Phone } from "lucide-react";

const hours = [
  { day: "Montag", time: "Geschlossen" },
  { day: "Dienstag", time: "10:00 – 19:00" },
  { day: "Mittwoch", time: "10:00 – 19:00" },
  { day: "Donnerstag", time: "10:00 – 20:00" },
  { day: "Freitag", time: "10:00 – 19:00" },
  { day: "Samstag", time: "09:00 – 17:00" },
  { day: "Sonntag", time: "Geschlossen" },
];

export default function ContactSection() {
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
    <footer id="kontakt" ref={sectionRef} className="bg-charcoal text-primary-foreground">
      {/* Main footer content */}
      <div className="container mx-auto px-6 lg:px-12 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="reveal mb-8">
              <div className="flex flex-col leading-none mb-6">
                <span className="font-display text-2xl tracking-widest uppercase text-primary-foreground/90">
                  Hair
                </span>
                <span className="font-display text-2xl tracking-widest uppercase text-gold">
                  Boutique
                </span>
              </div>
              <p className="font-body text-sm text-primary-foreground/50 leading-relaxed max-w-xs">
                Premium Haarsalon in Essen. Spezialisiert auf natürliche Haarfarben, Highlights und hochwertige Extensions.
              </p>
            </div>

            {/* Social */}
            <div className="reveal reveal-delay-1 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-body text-xs tracking-[0.18em] uppercase text-primary-foreground/60 hover:text-gold transition-colors duration-300"
              >
                <Instagram size={14} />
                Instagram
              </a>
            </div>
          </div>

          {/* Contact + Address */}
          <div className="reveal reveal-delay-2">
            <h3 className="font-display text-xl text-primary-foreground/80 mb-8">Kontakt & Standort</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <MapPin size={14} className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm text-primary-foreground/80">Hair Boutique</p>
                  <p className="font-body text-sm text-primary-foreground/50">Musterstraße 12</p>
                  <p className="font-body text-sm text-primary-foreground/50">45127 Essen, Deutschland</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Phone size={14} className="text-gold flex-shrink-0" />
                <a href="tel:+49201000000" className="font-body text-sm text-primary-foreground/70 hover:text-gold transition-colors">
                  +49 201 000 000
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Instagram size={14} className="text-gold flex-shrink-0" />
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  @hairboutique.essen
                </a>
              </div>
            </div>
          </div>

          {/* Opening hours */}
          <div className="reveal reveal-delay-3">
            <div className="flex items-center gap-3 mb-8">
              <Clock size={14} className="text-gold flex-shrink-0" />
              <h3 className="font-display text-xl text-primary-foreground/80">Öffnungszeiten</h3>
            </div>

            <div className="space-y-3">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between items-baseline">
                  <span className="font-body text-sm text-primary-foreground/50">{h.day}</span>
                  <span
                    className={`font-body text-sm ${
                      h.time === "Geschlossen" ? "text-primary-foreground/30" : "text-primary-foreground/80"
                    }`}
                  >
                    {h.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-primary-foreground/30 tracking-wide">
            © {new Date().getFullYear()} Hair Boutique Essen. Alle Rechte vorbehalten.
          </p>
          <p className="font-body text-xs text-primary-foreground/20 tracking-wide">
            Impressum · Datenschutz
          </p>
        </div>
      </div>
    </footer>
  );
}
