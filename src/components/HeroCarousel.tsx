import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useAdminData } from "@/lib/admin-store";

export function HeroCarousel() {
  const settings = useAdminData((s) => s.settings);
  const navigate = useNavigate();
  const slides = (settings.heroSlides ?? []).filter((s) => s.active);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!settings.heroAutoplay || slides.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [settings.heroAutoplay, slides.length]);

  if (slides.length === 0) return null;
  const safeI = Math.min(i, slides.length - 1);

  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${safeI * 100}%)` }}
      >
        {slides.map((s, idx) => {
          const hue = s.hue ?? 260;
          const isImg = s.image && (s.image.startsWith("data:") || s.image.startsWith("http"));
          return (
            <div key={s.id ?? idx} className="relative min-w-full">
              <div
                className="relative flex h-44 flex-col justify-between p-5 bg-cover bg-center"
                style={
                  isImg
                    ? { backgroundImage: `url(${s.image})` }
                    : {
                        backgroundImage: `linear-gradient(135deg, oklch(0.28 0.10 ${hue}), oklch(0.50 0.22 ${hue + 10}))`,
                      }
                }
              >
                {isImg && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />}
                {s.badge && (
                  <div className="relative inline-flex w-fit items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                    {s.badge}
                  </div>
                )}
                <div className="relative space-y-1">
                  <h2 className="text-2xl font-bold leading-tight text-white drop-shadow">
                    {s.title}
                  </h2>
                  <p className="text-sm text-white/90 drop-shadow">{s.subtitle}</p>
                  <button
                    type="button"
                    onClick={() => {
                      const target = s.link && s.link.trim() ? s.link : "/vedette";
                      if (target.startsWith("http")) window.location.assign(target);
                      else navigate({ to: target });
                    }}
                    className="mt-2 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary transition active:scale-95"
                  >
                    {s.cta || "Découvrir"} <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={`h-1.5 rounded-full transition-all ${
                safeI === idx ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
