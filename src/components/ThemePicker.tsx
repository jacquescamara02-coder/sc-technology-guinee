import { Check, Palette } from "lucide-react";
import { themePresets, useTheme } from "@/lib/theme-store";

export function ThemePicker() {
  const themeId = useTheme((s) => s.themeId);
  const setTheme = useTheme((s) => s.setTheme);

  return (
    <section>
      <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Apparence
      </h2>
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface-elevated text-primary">
            <Palette className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">Couleur du site</div>
            <div className="text-[11px] text-muted-foreground">
              Choisissez votre palette préférée
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8">
          {themePresets.map((p) => {
            const active = p.id === themeId;
            return (
              <button
                key={p.id}
                onClick={() => setTheme(p.id)}
                title={p.name}
                className={`group relative flex aspect-square items-center justify-center rounded-xl border-2 transition ${
                  active
                    ? "border-foreground scale-105"
                    : "border-transparent hover:border-border"
                }`}
                style={{ backgroundColor: p.swatch }}
                aria-label={`Palette ${p.name}`}
              >
                {active && (
                  <Check className="h-5 w-5 text-white drop-shadow" strokeWidth={3} />
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-3 text-center text-[11px] text-muted-foreground">
          Palette active :{" "}
          <span className="font-semibold text-foreground">
            {themePresets.find((p) => p.id === themeId)?.name}
          </span>
        </div>
      </div>
    </section>
  );
}
