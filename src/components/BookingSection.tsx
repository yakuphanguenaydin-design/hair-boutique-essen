import { useRef, useEffect, useState, type FormEvent } from "react";
import { Phone, Instagram } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import heroHair from "@/assets/hero-hair.jpg";

type BookingForm = {
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
  message: string;
};

const initialForm: BookingForm = {
  name: "",
  phone: "",
  service: "",
  date: "",
  time: "",
  message: "",
};

export default function BookingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name || !form.phone || !form.service || !form.date || !form.time) {
      toast({
        variant: "destructive",
        title: "Bitte Pflichtfelder ausfüllen",
        description: "Name, Telefon, Service, Datum und Uhrzeit sind erforderlich.",
      });
      return;
    }

    setIsSubmitting(true);

    const requestsRaw = localStorage.getItem("hair-boutique-booking-requests");
    const requests = requestsRaw ? JSON.parse(requestsRaw) : [];

    requests.push({
      ...form,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    });

    localStorage.setItem("hair-boutique-booking-requests", JSON.stringify(requests));
    setForm(initialForm);

    toast({
      title: "Anfrage gesendet",
      description: "Vielen Dank! Wir melden uns kurzfristig zur Terminbestätigung.",
    });

    setIsSubmitting(false);
  };

  return (
    <section id="buchen" ref={sectionRef} className="relative py-32 lg:py-44 overflow-hidden bg-cream">
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
            Ihr nächster
            <br />
            <em className="not-italic text-gold">Haarsalon-Besuch</em>
            <br />
            beginnt hier
          </h2>

          <p className="reveal reveal-delay-2 font-body text-base text-warm-grey leading-relaxed mb-12 max-w-md">
            Kontaktieren Sie uns per Telefon oder Instagram. Oder senden Sie uns direkt unten Ihre Terminanfrage.
          </p>

          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="tel:+49201000000"
              className="inline-flex items-center justify-center gap-3 font-body text-xs tracking-[0.2em] uppercase bg-foreground text-primary-foreground px-10 py-4 hover:bg-gold transition-all duration-400 active:scale-[0.97]"
            >
              <Phone size={14} />
              Anrufen
            </a>
            <a
              href="https://www.instagram.com/hairboutiique/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 font-body text-xs tracking-[0.2em] uppercase border border-foreground text-foreground px-10 py-4 hover:bg-foreground hover:text-primary-foreground transition-all duration-300 active:scale-[0.97]"
            >
              <Instagram size={14} />
              Via Instagram
            </a>
          </div>

          <form
            onSubmit={handleSubmit}
            className="reveal reveal-delay-4 mb-12 rounded-2xl border border-divider bg-white/85 p-5 sm:p-6 shadow-[0_12px_34px_rgba(42,31,28,0.08)]"
          >
            <p className="font-body text-xs tracking-[0.2em] uppercase text-warm-grey mb-6">
              Online Termin anfragen
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="booking-name" className="font-body text-xs uppercase tracking-[0.14em] text-foreground/85">
                  Name *
                </Label>
                <Input
                  id="booking-name"
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Ihr Name"
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-phone" className="font-body text-xs uppercase tracking-[0.14em] text-foreground/85">
                  Telefon *
                </Label>
                <Input
                  id="booking-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="+49 ..."
                  className="bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-service" className="font-body text-xs uppercase tracking-[0.14em] text-foreground/85">
                  Service *
                </Label>
                <select
                  id="booking-service"
                  value={form.service}
                  onChange={(event) => setForm((prev) => ({ ...prev, service: event.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Bitte auswählen</option>
                  <option value="Premium Hair Coloring">Premium Hair Coloring</option>
                  <option value="Highlights & Glossing">Highlights & Glossing</option>
                  <option value="Hair Extensions">Hair Extensions</option>
                  <option value="Modern Haircut">Modern Haircut</option>
                  <option value="Styling & Transformation">Styling & Transformation</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-date" className="font-body text-xs uppercase tracking-[0.14em] text-foreground/85">
                  Datum *
                </Label>
                <Input
                  id="booking-date"
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="booking-time" className="font-body text-xs uppercase tracking-[0.14em] text-foreground/85">
                  Uhrzeit *
                </Label>
                <Input
                  id="booking-time"
                  type="time"
                  value={form.time}
                  onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
                  className="bg-white"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="booking-message" className="font-body text-xs uppercase tracking-[0.14em] text-foreground/85">
                  Nachricht (optional)
                </Label>
                <Textarea
                  id="booking-message"
                  value={form.message}
                  onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                  placeholder="Wunschlook, Haarlänge, bevorzugte Zeit ..."
                  className="min-h-[110px] bg-white"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center font-body text-xs tracking-[0.2em] uppercase bg-foreground text-primary-foreground px-8 py-4 hover:bg-gold transition-all duration-300 disabled:opacity-60"
              >
                {isSubmitting ? "Wird gesendet..." : "Termin anfragen"}
              </button>
              <p className="font-body text-xs text-warm-grey">
                Wir melden uns zeitnah zur Bestaetigung Ihres Termins.
              </p>
            </div>
          </form>

          <div className="reveal reveal-delay-5 w-full h-px bg-divider mb-12" />

          <div className="reveal reveal-delay-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
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
