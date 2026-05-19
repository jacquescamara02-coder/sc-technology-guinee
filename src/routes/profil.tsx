import { createFileRoute } from "@tanstack/react-router";
import { User, MapPin, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Shield, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ThemePicker } from "@/components/ThemePicker";

export const Route = createFileRoute("/profil")({
  component: ProfilePage,
});

interface Item { icon: LucideIcon; label: string; hint?: string; }

const groups: { title: string; items: Item[] }[] = [
  { title: "Compte", items: [
    { icon: User, label: "Informations personnelles" },
    { icon: MapPin, label: "Adresses de livraison", hint: "Conakry, Kaloum" },
    { icon: CreditCard, label: "Moyens de paiement" },
  ]},
  { title: "Préférences", items: [
    { icon: Heart, label: "Mes favoris" },
    { icon: Bell, label: "Notifications" },
    { icon: Shield, label: "Sécurité & confidentialité" },
  ]},
  { title: "Aide", items: [
    { icon: HelpCircle, label: "Centre d'aide" },
  ]},
];

function ProfilePage() {
  return (
    <div className="space-y-5 px-4 py-4">
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[image:var(--gradient-primary)] text-2xl font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
            MS
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Mamadou Sylla</h1>
            <p className="text-xs text-muted-foreground">mamadou.sylla@email.com</p>
            <p className="mt-0.5 text-[11px] font-semibold text-primary">Membre Premium</p>
          </div>
        </div>
      </div>

      <ThemePicker />

      {groups.map((g) => (
        <section key={g.title}>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{g.title}</h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {g.items.map((it, idx) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.label}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-accent ${
                    idx > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface-elevated text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{it.label}</div>
                    {it.hint && <div className="text-[11px] text-muted-foreground">{it.hint}</div>}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <button className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 text-sm font-semibold text-destructive transition hover:bg-destructive/15">
        <LogOut className="h-4 w-4" /> Se déconnecter
      </button>

      <p className="pb-4 text-center text-[11px] text-muted-foreground">SC TECHNOLOGIE • v1.0.0</p>
    </div>
  );
}
