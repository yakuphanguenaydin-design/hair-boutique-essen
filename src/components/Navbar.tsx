import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/hair-boutique-logo.svg";

const links = [
  { label: "Leistungen", href: "#leistungen" },
  { label: "Galerie", href: "#galerie" },
  { label: "Termin", href: "#buchen" },
  { label: "Über uns", href: "#ueber-uns" },
  { label: "Bewertungen", href: "#bewertungen" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/95 backdrop-blur-sm border-b border-divider" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="group">
            <img
              src={logo}
              alt="Hair Boutique"
              className="h-12 w-auto sm:h-14 transition-opacity duration-300 group-hover:opacity-80"
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-body text-xs tracking-[0.18em] uppercase text-warm-grey hover:text-foreground transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <a
            href="#buchen"
            className="hidden lg:inline-flex items-center gap-2 font-body text-xs tracking-[0.18em] uppercase border border-foreground text-foreground px-7 py-3 hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
          >
            Termin buchen
          </a>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-foreground p-1"
            aria-label="Menü"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden bg-cream border-t border-divider overflow-hidden transition-all duration-500 ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-body text-xs tracking-[0.18em] uppercase text-warm-grey hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#buchen"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center font-body text-xs tracking-[0.18em] uppercase border border-foreground text-foreground px-7 py-4 hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
          >
            Termin buchen
          </a>
        </nav>
      </div>
    </header>
  );
}
