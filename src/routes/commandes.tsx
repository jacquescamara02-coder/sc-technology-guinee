import { createFileRoute } from "@tanstack/react-router";
import { Package, CheckCircle2, Truck, Clock } from "lucide-react";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/commandes")({
  component: OrdersPage,
});

const orders = [
  { id: "TSC-10284", date: "12 mai 2026", status: "delivered" as const, total: 18500000, items: 2 },
  { id: "TSC-10231", date: "28 avril 2026", status: "shipped" as const, total: 4200000, items: 1 },
  { id: "TSC-10198", date: "15 avril 2026", status: "pending" as const, total: 980000, items: 3 },
];

const statusConfig = {
  delivered: { label: "Livrée", icon: CheckCircle2, color: "text-success bg-success/10" },
  shipped: { label: "Expédiée", icon: Truck, color: "text-primary bg-primary/10" },
  pending: { label: "En préparation", icon: Clock, color: "text-warning bg-warning/10" },
};

function OrdersPage() {
  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mes commandes</h1>
        <p className="text-sm text-muted-foreground">Historique de vos achats</p>
      </div>

      <div className="space-y-2.5">
        {orders.map((o) => {
          const cfg = statusConfig[o.status];
          const Icon = cfg.icon;
          return (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">{o.id}</span>
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{o.date} • {o.items} article{o.items > 1 ? "s" : ""}</div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${cfg.color}`}>
                  <Icon className="h-3 w-3" /> {cfg.label}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">Total</span>
                <span className="text-base font-bold text-foreground">{formatGNF(o.total)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
