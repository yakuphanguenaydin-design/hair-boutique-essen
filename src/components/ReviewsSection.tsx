import { useRef, useEffect } from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Lena M.",
    handle: "@lena.haar",
    rating: 5,
    date: "März 2025",
    text: "Absolut begeistert! Meine Balayage sieht aus wie aus einem Magazin — so natürlich und strahlend. Das Team hat sich so viel Zeit für die Beratung genommen. Komme definitiv wieder! ✨",
    service: "Balayage & Glossing",
  },
  {
    name: "Sophia K.",
    handle: "@sophiakurz",
    rating: 5,
    date: "Februar 2025",
    text: "Die Extensions sind unglaublich! Man sieht und fühlt kaum einen Übergang. Endlich habe ich das Haar, von dem ich immer geträumt habe. Hair Boutique ist einfach das Beste in Essen 💛",
    service: "Hair Extensions",
  },
  {
    name: "Julia W.",
    handle: "@julia_wunderhaar",
    rating: 5,
    date: "Januar 2025",
    text: "Ich war noch nie so glücklich mit meiner Haarfarbe. Der Übergang von meinem alten Blond zu einem warmen Bronde ist perfekt gelungen — so, als wäre es meine natürliche Farbe 🤍",
    service: "Bronde Color Transformation",
  },
  {
    name: "Marie T.",
    handle: "@marie.style",
    rating: 5,
    date: "Dezember 2024",
    text: "Wunderschöner Salon, wahnsinnig liebes Team und ein Ergebnis, das ich nirgendwo sonst bekommen hätte. Mein Haar sieht aus wie noch nie. Absolute Empfehlung für alle, die sich etwas Besonderes gönnen möchten! 🌿",
    service: "Precision Cut & Color",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="fill-gold text-gold" />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLElement>(null);

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
    <section id="bewertungen" ref={sectionRef} className="py-28 lg:py-36 bg-champagne">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-16 text-center max-w-xl mx-auto">
          <div className="reveal flex items-center justify-center gap-4 mb-6">
            <span className="line-gold" />
            <span className="font-body text-xs tracking-[0.25em] uppercase text-warm-grey">
              Kundenstimmen
            </span>
            <span className="line-gold" />
          </div>
          <h2 className="reveal reveal-delay-1 font-display text-display-lg text-foreground leading-tight">
            Was unsere Kundinnen<br />
            <em className="not-italic text-gold">sagen</em>
          </h2>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, i) => (
            <div
              key={review.name}
              className={`reveal reveal-delay-${i + 1} bg-cream border border-divider p-8 lg:p-10`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-champagne border border-divider flex items-center justify-center">
                      <span className="font-display text-sm text-gold">{review.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{review.name}</p>
                      <p className="font-body text-xs text-warm-grey">{review.handle}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <StarRating count={review.rating} />
                  <span className="font-body text-xs text-warm-grey mt-1 block">{review.date}</span>
                </div>
              </div>

              {/* Review text */}
              <p className="font-body text-sm text-warm-grey leading-relaxed mb-6 italic">
                „{review.text}"
              </p>

              {/* Service tag */}
              <div className="flex items-center gap-2">
                <span className="line-gold flex-shrink-0" />
                <span className="font-body text-xs tracking-[0.12em] uppercase text-gold">
                  {review.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
