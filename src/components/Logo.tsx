import { Cpu } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
        <Cpu className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
      </div>
      {!compact && (
        <div className="leading-tight">
          <div className="text-base font-bold tracking-tight text-foreground">
            TechShop <span className="text-primary">CI</span>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Guinée
          </div>
        </div>
      )}
    </div>
  );
}
