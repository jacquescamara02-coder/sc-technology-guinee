import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Package, ChevronRight, Inbox } from "lucide-react";
import {
  useOrders,
  STATUS_LABEL,
  formatDate,
  type OrderStatus,
} from "@/lib/orders-store";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/orders")({
  component: OrdersListPage,
});

type Filter = "all" | "active" | "delivered" | "cancelled";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "active", label: "En cours" },
  { id: "delivered", label: "Livrées" },
  { id: "cancelled", label: "Annulées" },
];

function matchFilter(s: OrderStatus, f: Filter) {
  if (f === "all") return true;
  if (f === "delivered") return s === "delivered";
  if (f === "cancelled") return s === "cancelled";
  return s !== "delivered" && s !== "cancelled";
}

const STATUS_COLOR: Record<OrderStatus, string> = {
  received: "bg-primary/10 text-primary",
  preparing: "bg-warning/10 text-warning",
  shipped: "bg-primary/10 text-primary",
  delivering: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

function OrdersListPage() {
  const orders = useOrders((s) => s.orders);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () => orders.filter((o) => matchFilter(o.status, filter)),
    [orders, filter],
  );

  return (
    <div className="space-y-4 px-4 py-4 pb-24">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mes commandes</h1>
        <p className="text-sm text-muted-foreground">Historique et suivi de vos achats</p>
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === f.id
                ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-surface text-muted-foreground">
            <Inbox className="h-8 w-8" />
          </div>
          <h2 className="text-base font-bold text-foreground">Aucune commande</h2>
          <p className="max-w-xs text-xs text-muted-foreground">
            Vous n'avez pas encore de commande dans cette catégorie. Découvrez nos produits.
          </p>
          <Link
            to="/"
            className="mt-2 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-5 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
          >
            Explorer la boutique
          </Link>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {filtered.map((o) => {
            const count = o.items.reduce((a, i) => a + i.qty, 0);
            return (
              <li key={o.id}>
                <Link
                  to="/orders/$orderId"
                  params={{ orderId: o.id }}
                  className="block rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm font-semibold text-foreground">
                          {o.id}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(o.createdAt)} • {count} article{count > 1 ? "s" : ""}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_COLOR[o.status]}`}
                    >
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted-foreground">Total</span>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-foreground">
                        {formatGNF(o.total)}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
