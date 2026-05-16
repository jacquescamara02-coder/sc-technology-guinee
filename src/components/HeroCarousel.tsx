import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

interface Slide {
  title: string;
  subtitle: string;
  cta: string;
  hue: number;
}

const slides: Slide[] = [
  { title: "Soldes Tech -30%", subtitle: "Sur tous les laptops MacBook & Dell", cta: "Voir l'offre", hue: 260 },
  { title: "Nouveautés 2026", subtitle: "Découvrez les derniers écrans LG & Samsung", cta: "Explorer", hue: 220 },
  { title: "Livraison gratuite", subtitle: "À Conakry pour toute commande +5M GNF", cta: "En savoir plus", hue: 200 },
];

export function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${i * 100}%)` }}
      >
        {slides.map((s, idx) => (
          <div key={idx} className="relative min-w-full">
            <div
              className="flex h-44 flex-col justify-between p-5"
              style={{
                backgroundImage: `linear-gradient(135deg, oklch(0.28 0.10 ${s.hue}), oklch(0.50 0.22 ${s.hue + 10}))`,
              }}
            >
              <div className="inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                Offre limitée
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold leading-tight text-white">{s.title}</h2>
                <p className="text-sm text-white/80">{s.subtitle}</p>
                <button className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-foreground transition active:scale-95">
                  {s.cta} <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
