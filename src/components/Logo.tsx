import logoUrl from "@/assets/sc-logo.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={logoUrl}
        alt="SC TECHNOLOGY"
        width={36}
        height={36}
        loading="lazy"
        className="h-9 w-9 rounded-xl bg-white/95 p-1 shadow-[var(--shadow-glow)] object-contain"
      />
      {!compact && (
        <div className="leading-tight">
          <div className="text-base font-bold tracking-tight text-foreground">
            SC <span className="text-primary">TECHNOLOGY</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Guinée
          </div>
        </div>
      )}
    </div>
  );
}
