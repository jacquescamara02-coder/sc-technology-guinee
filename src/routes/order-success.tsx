import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2, Package, MapPin, CreditCard, Smartphone, Clock } from "lucide-react";
import { useOrders, estimatedDelivery } from "@/lib/orders-store";
import { formatGNF } from "@/lib/data";

const searchSchema = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/order-success")({
  validateSearch: searchSchema,
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { id } = Route.useSearch();
  const order = useOrders((s) =>
    id ? s.orders.find((o) => o.id === id) : s.orders[0],
  );

  if (!order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-xl font-bold text-foreground">Commande introuvable</h1>
        <Link
          to="/"
          className="mt-3 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5 px-4 py-6 pb-32 animate-fade-in">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-success/30" />
          <div className="relative grid h-20 w-20 place-items-center rounded-full bg-success text-success-foreground shadow-[var(--shadow-glow)] animate-scale-in">
            <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
          </div>
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Commande confirmée !
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Merci pour votre commande. Un suivi vous sera envoyé.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
          <Package className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono font-bold text-foreground">{order.id}</span>
        </div>
      </div>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Articles commandés
        </h2>
        <ul className="space-y-2.5">
          {order.items.map((it) => (
            <li key={it.id} className="flex items-center gap-3">
              <div
                className="relative h-12 w-12 shrink-0 rounded-lg"
                style={{ backgroundImage: it.image }}
              >
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {it.qty}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="line-clamp-1 text-xs font-semibold text-foreground">
                  {it.name}
                </div>
                <div className="text-[10px] text-muted-foreground">{it.brand}</div>
              </div>
              <div className="text-xs font-bold text-foreground">
                {formatGNF(it.price * it.qty)}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-semibold text-foreground">Total payé</span>
          <span className="text-xl font-bold text-primary">{formatGNF(order.total)}</span>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {order.payment.method === "orange_money" ? (
              <Smartphone className="h-3.5 w-3.5" />
            ) : (
              <CreditCard className="h-3.5 w-3.5" />
            )}
            Paiement
          </div>
          <div className="text-sm font-semibold text-foreground">{order.payment.label}</div>
          {order.payment.masked && (
            <div className="text-xs text-muted-foreground">{order.payment.masked}</div>
          )}
        </div>

        <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Adresse
          </div>
          <div className="text-sm font-semibold text-foreground">{order.delivery.fullName}</div>
          <div className="text-xs text-muted-foreground">
            {order.delivery.address}, {order.delivery.district}
            <br />
            {order.delivery.city} • {order.delivery.phone}
          </div>
        </div>
      </section>

      <div className="flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary/5 p-3 text-sm text-foreground">
        <Clock className="h-4 w-4 text-primary" />
        <span>
          Livraison estimée :{" "}
          <strong className="text-primary">{estimatedDelivery(order.delivery.city)}</strong>
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Link
          to="/orders/$orderId"
          params={{ orderId: order.id }}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Suivre ma commande
        </Link>
        <Link
          to="/"
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-bold text-foreground"
        >
          Continuer les achats
        </Link>
      </div>
    </div>
  );
}
