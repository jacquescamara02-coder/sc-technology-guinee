import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Home,
  MapPin,
  MessageCircle,
  XCircle,
} from "lucide-react";
import {
  useOrders,
  STATUS_FLOW,
  STATUS_LABEL,
  estimatedDelivery,
  formatDate,
  type OrderStatus,
} from "@/lib/orders-store";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/orders/$orderId")({
  component: OrderDetailPage,
});

const STEP_ICONS: Record<Exclude<OrderStatus, "cancelled">, typeof CheckCircle2> = {
  received: CheckCircle2,
  preparing: Clock,
  shipped: Package,
  delivering: Truck,
  delivered: Home,
};

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const order = useOrders((s) => s.orders.find((o) => o.id === orderId));

  if (!order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-xl font-bold text-foreground">Commande introuvable</h1>
        <Link
          to="/orders"
          className="mt-3 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Voir mes commandes
        </Link>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(order.status as Exclude<OrderStatus, "cancelled">);
  const isCancelled = order.status === "cancelled";

  const waMessage = encodeURIComponent(
    `Bonjour, j'ai besoin d'aide concernant ma commande ${order.id}.`,
  );

  return (
    <div className="space-y-5 px-4 py-4 pb-24">
      <div className="flex items-center gap-2">
        <Link
          to="/orders"
          className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground"
          aria-label="Retour aux commandes"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-mono text-base font-bold text-foreground">{order.id}</h1>
          <p className="text-xs text-muted-foreground">Passée le {formatDate(order.createdAt)}</p>
        </div>
      </div>

      {/* Timeline */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Suivi de livraison
        </h2>
        {isCancelled ? (
          <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-3 text-destructive">
            <XCircle className="h-5 w-5" />
            <div>
              <div className="text-sm font-bold">Commande annulée</div>
              <div className="text-xs opacity-80">Contactez le support pour plus d'informations.</div>
            </div>
          </div>
        ) : (
          <ol className="relative space-y-5 pl-1">
            {STATUS_FLOW.map((step, idx) => {
              const Icon = STEP_ICONS[step];
              const done = idx < currentIdx;
              const active = idx === currentIdx;
              const isLast = idx === STATUS_FLOW.length - 1;
              return (
                <li key={step} className="relative flex items-start gap-3">
                  {!isLast && (
                    <span
                      className={`absolute left-[18px] top-9 h-[calc(100%+4px)] w-0.5 ${
                        done ? "bg-success" : "bg-border"
                      }`}
                    />
                  )}
                  <div
                    className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 ${
                      active
                        ? "border-primary bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
                        : done
                        ? "border-success bg-success text-success-foreground"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="pt-1">
                    <div
                      className={`text-sm font-semibold ${
                        active
                          ? "text-primary"
                          : done
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {STATUS_LABEL[step]}
                    </div>
                    {active && (
                      <div className="text-[11px] text-muted-foreground">En cours…</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {/* Items */}
      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Articles
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
          <span className="text-sm font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-primary">{formatGNF(order.total)}</span>
        </div>
      </section>

      {/* Address */}
      <section className="space-y-2 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> Adresse de livraison
        </div>
        <div className="text-sm font-semibold text-foreground">{order.delivery.fullName}</div>
        <div className="text-xs text-muted-foreground">
          {order.delivery.address}, {order.delivery.district}
          <br />
          {order.delivery.city} • {order.delivery.phone}
        </div>
        <div className="mt-2 flex items-center gap-2 rounded-xl bg-primary/5 px-3 py-2 text-xs text-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          Livraison estimée :{" "}
          <strong className="text-primary">{estimatedDelivery(order.delivery.city)}</strong>
        </div>
      </section>

      <a
        href={`https://wa.me/224600000000?text=${waMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-sm font-bold text-white shadow-[var(--shadow-glow)] transition active:scale-[0.98]"
      >
        <MessageCircle className="h-4 w-4" /> Contacter le support
      </a>
    </div>
  );
}
