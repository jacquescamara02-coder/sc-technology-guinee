import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Search, Trash2, CheckCircle2, XCircle, Pencil, Facebook } from "lucide-react";
import { useAdminData } from "@/lib/admin-store";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

const PAGE_SIZE = 50;

function ProductsPage() {
  const { products, categories, bulkUpdate, bulkDelete } = useAdminData();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (status === "active" && !p.active) return false;
      if (status === "inactive" && p.active) return false;
      if (q && !(p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)))
        return false;
      return true;
    });
  }, [products, query, cat, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const toggleAll = () => {
    const ids = new Set(selected);
    const allSelected = pageItems.every((p) => ids.has(p.id));
    if (allSelected) pageItems.forEach((p) => ids.delete(p.id));
    else pageItems.forEach((p) => ids.add(p.id));
    setSelected(ids);
  };
  const toggleOne = (id: string) => {
    const ids = new Set(selected);
    if (ids.has(id)) ids.delete(id);
    else ids.add(id);
    setSelected(ids);
  };

  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;
  const subName = (catId: string, subId: string) =>
    categories.find((c) => c.id === catId)?.subcategories.find((s) => s.id === subId)?.name ?? subId;

  const selectedIds = Array.from(selected);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Produits</h2>
          <p className="text-sm text-slate-500 mt-0.5">{filtered.length} produits</p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
        >
          <Plus className="h-4 w-4" /> Ajouter un produit
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Rechercher (nom, marque, SKU)…"
            className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            setPage(0);
          }}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="all">Toutes catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as "all" | "active" | "inactive");
            setPage(0);
          }}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="all">Tous statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
      </div>

      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center gap-3 text-sm">
          <span className="font-medium text-blue-900">{selectedIds.length} sélectionné(s)</span>
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => {
                bulkUpdate(selectedIds, { active: true });
                setSelected(new Set());
              }}
              className="inline-flex items-center gap-1 text-emerald-700 hover:bg-emerald-100 px-2.5 py-1 rounded-md"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Activer
            </button>
            <button
              onClick={() => {
                bulkUpdate(selectedIds, { active: false });
                setSelected(new Set());
              }}
              className="inline-flex items-center gap-1 text-slate-700 hover:bg-slate-100 px-2.5 py-1 rounded-md"
            >
              <XCircle className="h-3.5 w-3.5" /> Désactiver
            </button>
            <button
              onClick={() => {
                if (confirm(`Supprimer ${selectedIds.length} produit(s) ?`)) {
                  bulkDelete(selectedIds);
                  setSelected(new Set());
                }
              }}
              className="inline-flex items-center gap-1 text-red-700 hover:bg-red-100 px-2.5 py-1 rounded-md"
            >
              <Trash2 className="h-3.5 w-3.5" /> Supprimer
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2.5 w-10">
                  <input
                    type="checkbox"
                    checked={pageItems.length > 0 && pageItems.every((p) => selected.has(p.id))}
                    onChange={toggleAll}
                  />
                </th>
                <th className="px-3 py-2.5 text-left font-medium">Produit</th>
                <th className="px-3 py-2.5 text-left font-medium">Catégorie</th>
                <th className="px-3 py-2.5 text-left font-medium">Marque</th>
                <th className="px-3 py-2.5 text-right font-medium">Prix</th>
                <th className="px-3 py-2.5 text-right font-medium">Stock</th>
                <th className="px-3 py-2.5 text-left font-medium">Statut</th>
                <th className="px-3 py-2.5 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleOne(p.id)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-md flex-shrink-0"
                        style={{ background: p.images[0] }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{p.name}</p>
                        <p className="text-xs text-slate-500 font-mono">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    <div>{catName(p.category)}</div>
                    <div className="text-xs text-slate-400">{subName(p.category, p.subcategory)}</div>
                  </td>
                  <td className="px-3 py-2 text-slate-600">{p.brand}</td>
                  <td className="px-3 py-2 text-right font-semibold">{formatGNF(p.price)}</td>
                  <td className="px-3 py-2 text-right">
                    <span
                      className={
                        p.stock === 0
                          ? "text-red-600 font-medium"
                          : p.stock < 5
                            ? "text-orange-600 font-medium"
                            : "text-slate-700"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {p.active ? (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Actif
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      to="/admin/products/$productId/edit"
                      params={{ productId: p.id }}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-12 text-center text-sm text-slate-500">
                    Aucun produit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 text-sm">
            <span className="text-slate-500">
              Page {safePage + 1} sur {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={safePage === 0}
                onClick={() => setPage(safePage - 1)}
                className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                Précédent
              </button>
              <button
                disabled={safePage >= totalPages - 1}
                onClick={() => setPage(safePage + 1)}
                className="px-3 py-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
