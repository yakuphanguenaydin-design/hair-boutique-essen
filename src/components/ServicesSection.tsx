import { useRef, useEffect } from "react";
import serviceColorImg from "@/assets/service-color.jpg";
import galleryImg2 from "@/assets/gallery-2.jpg";
import galleryImg3 from "@/assets/gallery-3.jpg";
import salonInterior from "@/assets/salon-interior.jpg";

const services = [
  {
    number: "01",
    title: "Premium Haarfarbe",
    subtitle: "Blond · Bronde · Brunette",
    description:
      "Maßgeschneiderte Farbkompositionen, die Ihr natürliches Erscheinungsbild strahlen lassen. Von warm-goldenen Blondtönen bis zu tiefen Brunette-Nuancen.",
    image: serviceColorImg,
  },
  {
    number: "02",
    title: "Highlights & Glossing",
    subtitle: "Balayage · Foliage · Gloss",
    description:
      "Feine Strähnen und Gloss-Behandlungen für einen strahlenden, tiefendimensionalen Farbausdruck mit natürlichem Lichtspiel.",
    image: galleryImg3,
  },
  {
    number: "03",
    title: "Hair Extensions",
    subtitle: "Tape-in · Keratin · Clip-in",
    description:
      "Hochwertige Echthaarverlängerungen, die sich nahtlos in Ihr eigenes Haar integrieren — für mehr Länge, Volumen und Kraft.",
    image: galleryImg2,
  },
  {
    number: "04",
    title: "Schnitt & Styling",
    subtitle: "Precision Cut · Styling",
    description:
      "Präzise Schnitte und professionelles Styling, die Ihre Persönlichkeit unterstreichen — vom klassischen Lob bis zum modernen Layered Cut.",
    image: salonInterior,
  },
];

export default function ServicesSection() {
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
    <section id="leistungen" ref={sectionRef} className="py-28 lg:py-36 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-20 max-w-xl">
          <div className="reveal flex items-center gap-4 mb-6">
            <span className="line-gold" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-warm-grey">
              Unsere Leistungen
            </span>
          </div>
          <h2 className="reveal reveal-delay-1 font-display text-display-lg text-foreground leading-tight">
            Haarpflege auf<br />
            <em className="not-italic text-gold">höchstem Niveau</em>
          </h2>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-divider border border-divider">
          {services.map((service, i) => (
            <div
              key={service.number}
              className={`reveal reveal-delay-${i + 1} group bg-cream hover:bg-champagne transition-colors duration-500 p-8 lg:p-12`}
            >
              {/* Image */}
              <div className="overflow-hidden mb-8 aspect-[4/3]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
              </div>

              {/* Number + subtitle */}
              <div className="flex items-baseline justify-between mb-4">
                <span className="font-display text-4xl text-divider font-light">{service.number}</span>
                <span className="font-body text-xs tracking-[0.15em] uppercase text-warm-grey">
                  {service.subtitle}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-2xl lg:text-3xl text-foreground mb-4 leading-tight">
                {service.title}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-warm-grey leading-relaxed">
                {service.description}
              </p>

              {/* Hover link */}
              <div className="mt-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="line-gold" />
                <a href="#buchen" className="font-body text-xs tracking-[0.2em] uppercase text-foreground hover:text-gold transition-colors">
                  Termin anfragen
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
