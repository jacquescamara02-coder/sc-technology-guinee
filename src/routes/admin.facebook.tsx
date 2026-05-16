import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Facebook, RefreshCw, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAdminData } from "@/lib/admin-store";
import { simulateFacebookPublish } from "@/lib/facebook";

export const Route = createFileRoute("/admin/facebook")({
  component: FacebookPage,
});

function FacebookPage() {
  const posts = useAdminData((s) => s.facebookPosts);
  const products = useAdminData((s) => s.products);
  const [reposting, setReposting] = useState<string | null>(null);

  const recent = posts.slice(0, 20);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const monthPublished = posts.filter(
      (p) => p.status === "success" && new Date(p.date).getTime() >= monthStart,
    ).length;
    const last = posts[0]?.date;
    return { monthPublished, last };
  }, [posts]);

  const handleRepost = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setReposting(productId);
    await simulateFacebookPublish(product);
    setReposting(null);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Facebook className="h-6 w-6 text-[#1877F2]" /> Publications Facebook
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">Historique des produits publiés</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatCard label="Total publié ce mois" value={stats.monthPublished.toString()} />
        <StatCard
          label="Dernière publication"
          value={stats.last ? new Date(stats.last).toLocaleString("fr-FR") : "—"}
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2.5 w-14"></th>
                <th className="px-3 py-2.5 text-left font-medium">Produit</th>
                <th className="px-3 py-2.5 text-left font-medium">Date</th>
                <th className="px-3 py-2.5 text-left font-medium">Statut</th>
                <th className="px-3 py-2.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => {
                const isImg = p.productImage.startsWith("data:") || p.productImage.startsWith("http");
                return (
                  <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-3 py-2">
                      <div className="h-10 w-10 rounded-md overflow-hidden bg-slate-100">
                        {isImg ? (
                          <img src={p.productImage} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full" style={{ background: p.productImage }} />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium">{p.productName}</td>
                    <td className="px-3 py-2 text-slate-600">
                      {new Date(p.date).toLocaleString("fr-FR")}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          to="/admin/products/$productId/facebook-preview"
                          params={{ productId: p.productId }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Aperçu
                        </Link>
                        <button
                          onClick={() => handleRepost(p.productId)}
                          disabled={reposting === p.productId}
                          className="inline-flex items-center gap-1 text-xs border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded disabled:opacity-50"
                        >
                          {reposting === p.productId ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                          Republier
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-12 text-center text-sm text-slate-500">
                    Aucune publication pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: "success" | "failed" | "pending" }) {
  if (status === "success")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="h-3 w-3" /> Publié
      </span>
    );
  if (status === "failed")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
        <XCircle className="h-3 w-3" /> Échec
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <Clock className="h-3 w-3" /> En attente
    </span>
  );
}
