import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Printer, X } from "lucide-react";
import {
  useOrders,
  STATUS_LABEL,
  type OrderStatus,
  type Order,
  formatDate,
} from "@/lib/orders-store";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersAdminPage,
});

const STATUS_OPTS: OrderStatus[] = [
  "received",
  "preparing",
  "shipped",
  "delivering",
  "delivered",
  "cancelled",
];

const STATUS_STYLE: Record<OrderStatus, string> = {
  received: "bg-blue-50 text-blue-700 border-blue-200",
  preparing: "bg-amber-50 text-amber-700 border-amber-200",
  shipped: "bg-violet-50 text-violet-700 border-violet-200",
  delivering: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

function OrdersAdminPage() {
  const { orders } = useOrders();
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (q) {
        const hay = `${o.id} ${o.delivery.fullName} ${o.delivery.phone} ${o.delivery.city}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, filter, query]);

  const updateStatus = (id: string, status: OrderStatus) => {
    useOrders.setState({
      orders: useOrders.getState().orders.map((o) => (o.id === id ? { ...o, status } : o)),
    });
    setSelected((cur) => (cur && cur.id === id ? { ...cur, status } : cur));
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Commandes</h2>
        <p className="text-sm text-slate-500 mt-0.5">{filtered.length} commandes</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher (n°, client, ville, téléphone)…"
          className="flex-1 min-w-[200px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | OrderStatus)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="all">Tous statuts</option>
          {STATUS_OPTS.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2.5 text-left font-medium">N°</th>
                <th className="px-3 py-2.5 text-left font-medium">Client</th>
                <th className="px-3 py-2.5 text-left font-medium">Téléphone</th>
                <th className="px-3 py-2.5 text-left font-medium">Ville</th>
                <th className="px-3 py-2.5 text-right font-medium">Articles</th>
                <th className="px-3 py-2.5 text-right font-medium">Total</th>
                <th className="px-3 py-2.5 text-left font-medium">Paiement</th>
                <th className="px-3 py-2.5 text-left font-medium">Date</th>
                <th className="px-3 py-2.5 text-left font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelected(o)}
                >
                  <td className="px-3 py-2.5 font-mono text-xs">{o.id}</td>
                  <td className="px-3 py-2.5">{o.delivery.fullName}</td>
                  <td className="px-3 py-2.5 text-slate-600">{o.delivery.phone}</td>
                  <td className="px-3 py-2.5 text-slate-600">{o.delivery.city}</td>
                  <td className="px-3 py-2.5 text-right">{o.items.reduce((a, i) => a + i.qty, 0)}</td>
                  <td className="px-3 py-2.5 text-right font-semibold">{formatGNF(o.total)}</td>
                  <td className="px-3 py-2.5 text-slate-600">{o.payment.label}</td>
                  <td className="px-3 py-2.5 text-slate-600">{formatDate(o.createdAt)}</td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLE[o.status]}`}
                    >
                      {STATUS_LABEL[o.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-12 text-center text-sm text-slate-500">
                    Aucune commande trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={(s) => updateStatus(selected.id, s)}
        />
      )}
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (s: OrderStatus) => void;
}) {
  const printInvoice = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const itemsHtml = order.items
      .map(
        (i) =>
          `<tr><td>${i.name}</td><td>${i.qty}</td><td style="text-align:right">${formatGNF(i.price)}</td><td style="text-align:right">${formatGNF(i.price * i.qty)}</td></tr>`,
      )
      .join("");
    w.document.write(`<!doctype html><html><head><title>Facture ${order.id}</title>
      <style>body{font-family:system-ui;padding:32px;color:#0f172a}h1{margin:0 0 8px}table{width:100%;border-collapse:collapse;margin-top:16px}th,td{padding:8px;border-bottom:1px solid #e2e8f0;text-align:left}th{background:#f8fafc}.tot{font-weight:700;font-size:18px;margin-top:24px;text-align:right}</style></head><body>
      <h1>TechShop GN</h1><p>Facture <strong>${order.id}</strong> — ${formatDate(order.createdAt)}</p>
      <p><strong>Client:</strong> ${order.delivery.fullName}<br/><strong>Téléphone:</strong> ${order.delivery.phone}<br/><strong>Adresse:</strong> ${order.delivery.address}, ${order.delivery.district}, ${order.delivery.city}</p>
      <table><thead><tr><th>Produit</th><th>Qté</th><th style="text-align:right">PU</th><th style="text-align:right">Total</th></tr></thead><tbody>${itemsHtml}</tbody></table>
      <p class="tot">Sous-total : ${formatGNF(order.subtotal)}<br/>TVA : ${formatGNF(order.tva)}<br/>Total TTC : ${formatGNF(order.total)}</p>
      <p>Paiement : ${order.payment.label}</p>
      <script>window.print()</script></body></html>`);
    w.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-bold">{order.id}</h3>
            <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Client</p>
              <p className="font-semibold mt-1">{order.delivery.fullName}</p>
              <p className="text-sm text-slate-600">{order.delivery.phone}</p>
              <p className="text-sm text-slate-600">{order.delivery.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Livraison</p>
              <p className="text-sm text-slate-700 mt-1">{order.delivery.address}</p>
              <p className="text-sm text-slate-600">
                {order.delivery.district}, {order.delivery.city}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 uppercase mb-2">Articles</p>
            <div className="space-y-2">
              {order.items.map((i) => (
                <div key={i.id} className="flex items-center gap-3 text-sm">
                  <div className="h-10 w-10 rounded-md flex-shrink-0" style={{ background: i.image }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{i.name}</p>
                    <p className="text-xs text-slate-500">{i.brand} · ×{i.qty}</p>
                  </div>
                  <p className="font-semibold">{formatGNF(i.price * i.qty)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 space-y-1 text-sm">
            <Row label="Sous-total" value={formatGNF(order.subtotal)} />
            <Row label="TVA" value={formatGNF(order.tva)} />
            <Row label="Total TTC" value={formatGNF(order.total)} bold />
            <Row label="Paiement" value={order.payment.label} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 uppercase">Statut :</span>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(e.target.value as OrderStatus)}
              className="text-sm border border-slate-300 rounded-md px-3 py-1.5 bg-white"
            >
              {STATUS_OPTS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
            <button
              onClick={printInvoice}
              className="ml-auto inline-flex items-center gap-1.5 text-sm border border-slate-300 hover:bg-slate-50 px-3 py-1.5 rounded-md"
            >
              <Printer className="h-4 w-4" /> Imprimer la facture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={bold ? "font-bold" : "font-medium"}>{value}</span>
    </div>
  );
}
