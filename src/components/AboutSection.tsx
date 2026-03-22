import { useRef, useEffect } from "react";
import salonInterior from "@/assets/salon-interior.jpg";

const values = [
  {
    title: "Natürliche Schönheit",
    text: "Wir glauben, dass jede Frau ihren eigenen einzigartigen Glanz besitzt. Unsere Aufgabe ist es, diesen zu entfalten — nie zu übertünchen.",
  },
  {
    title: "Präzision & Handwerk",
    text: "Jede Haarfarbe wird individuell gemischt, jede Technik mit höchster Sorgfalt angewendet. Ergebnisse, die noch Wochen später strahlen.",
  },
  {
    title: "Persönliche Beratung",
    text: "Vor jeder Behandlung nehmen wir uns die Zeit, Sie wirklich kennenzulernen — Ihre Wünsche, Ihren Alltag und Ihre Haarstruktur.",
  },
];

export default function AboutSection() {
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
    <section id="ueber-uns" ref={sectionRef} className="py-28 lg:py-36 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image side */}
          <div className="reveal order-2 lg:order-1">
            <div className="relative">
              <img
                src={salonInterior}
                alt="Hair Boutique Salon Essen Innenansicht"
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
              {/* Gold accent frame */}
              <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 border border-gold/30 -z-10" />
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2">
            <div className="reveal flex items-center gap-4 mb-8">
              <span className="line-gold" />
              <span className="font-body text-xs tracking-[0.25em] uppercase text-warm-grey">
                Über Hair Boutique
              </span>
            </div>

            <h2 className="reveal reveal-delay-1 font-display text-display-lg text-foreground mb-8 leading-tight">
              Schönheit durch<br />
              <em className="not-italic text-gold">Präzision & Leidenschaft</em>
            </h2>

            <p className="reveal reveal-delay-2 font-body text-base text-warm-grey leading-relaxed mb-8">
              Hair Boutique ist mehr als ein Friseursalon — es ist ein Ort, an dem natürliche Schönheit im Mittelpunkt steht. In unserem Atelier in Essen verbinden wir moderne Colorationstechniken mit einem tiefen Verständnis für hochwertige Haarpflege.
            </p>

            <p className="reveal reveal-delay-3 font-body text-base text-warm-grey leading-relaxed mb-12">
              Unsere Philosophie: Jedes Haar erzählt eine Geschichte. Wir sind da, um diese Geschichte auf ihre schönste Weise fortzuschreiben — mit Präzision, Geduld und einem unerschütterlichen Gespür für natürliche Eleganz.
            </p>

            {/* Values */}
            <div className="space-y-8">
              {values.map((v, i) => (
                <div key={v.title} className={`reveal reveal-delay-${i + 4} flex gap-6`}>
                  <span className="line-gold mt-2 flex-shrink-0" />
                  <div>
                    <h4 className="font-display text-lg text-foreground mb-1">{v.title}</h4>
                    <p className="font-body text-sm text-warm-grey leading-relaxed">{v.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
