import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Package, ShoppingBag, TrendingUp, AlertTriangle } from "lucide-react";
import { useAdminData } from "@/lib/admin-store";
import { useOrders, STATUS_LABEL, type OrderStatus } from "@/lib/orders-store";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

const STATUS_OPTS: OrderStatus[] = [
  "received",
  "preparing",
  "shipped",
  "delivering",
  "delivered",
  "cancelled",
];

function DashboardPage() {
  const { products } = useAdminData();
  const { orders, addOrder } = useOrders();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const todayOrders = orders.filter((o) => o.createdAt >= todayMs).length;
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).getTime();
    const monthRevenue = orders
      .filter((o) => o.createdAt >= monthStart && o.status !== "cancelled")
      .reduce((acc, o) => acc + o.total, 0);
    const outOfStock = products.filter((p) => p.stock === 0).length;
    return { totalProducts, todayOrders, monthRevenue, outOfStock };
  }, [products, orders]);

  const lowStock = useMemo(
    () => products.filter((p) => p.stock > 0 && p.stock < 5).slice(0, 8),
    [products],
  );

  const recentOrders = orders.slice(0, 8);

  const updateStatus = (orderId: string, status: OrderStatus) => {
    // Use addOrder trick — instead let's mutate via store directly
    const o = useOrders.getState().orders.find((x) => x.id === orderId);
    if (!o) return;
    useOrders.setState({
      orders: useOrders.getState().orders.map((x) =>
        x.id === orderId ? { ...x, status } : x,
      ),
    });
    void addOrder; // keep import
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tableau de bord</h2>
        <p className="text-sm text-slate-500 mt-0.5">Vue d'ensemble de votre boutique</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Produits"
          value={stats.totalProducts.toString()}
          icon={Package}
          color="blue"
        />
        <StatCard
          label="Commandes aujourd'hui"
          value={stats.todayOrders.toString()}
          icon={ShoppingBag}
          color="green"
        />
        <StatCard
          label="CA du mois"
          value={formatGNF(stats.monthRevenue)}
          icon={TrendingUp}
          color="violet"
        />
        <StatCard
          label="Rupture de stock"
          value={stats.outOfStock.toString()}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-semibold">Commandes récentes</h3>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">
              Voir tout
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">Aucune commande pour le moment.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium">N° commande</th>
                    <th className="text-left px-4 py-2.5 font-medium">Client</th>
                    <th className="text-left px-4 py-2.5 font-medium">Total</th>
                    <th className="text-left px-4 py-2.5 font-medium">Paiement</th>
                    <th className="text-left px-4 py-2.5 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-mono text-xs">{o.id}</td>
                      <td className="px-4 py-3">{o.delivery.fullName}</td>
                      <td className="px-4 py-3 font-semibold">{formatGNF(o.total)}</td>
                      <td className="px-4 py-3 text-slate-600">{o.payment.label}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value as OrderStatus)}
                          className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {STATUS_OPTS.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl">
          <div className="px-5 py-4 border-b border-slate-200">
            <h3 className="font-semibold">Stock faible</h3>
            <p className="text-xs text-slate-500 mt-0.5">Produits avec moins de 5 unités</p>
          </div>
          {lowStock.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">Aucune alerte 🎉</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {lowStock.map((p) => (
                <li key={p.id} className="px-5 py-3 flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-lg flex-shrink-0"
                    style={{ background: p.images[0] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.brand}</p>
                  </div>
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                    {p.stock} en stock
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "blue" | "green" | "violet" | "red";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-xl lg:text-2xl font-bold text-slate-900 mt-1 truncate">{value}</p>
        </div>
        <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
