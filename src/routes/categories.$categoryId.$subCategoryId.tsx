import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  useStorefrontCategory,
  useStorefrontSubcategory,
  useProductsBySub,
} from "@/lib/storefront";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { formatGNF } from "@/lib/data";

type SortKey = "price-asc" | "price-desc" | "new" | "popular";

export const Route = createFileRoute("/categories/$categoryId/$subCategoryId")({
  component: ProductsListPage,
});

const PAGE_SIZE = 8;

function ProductsListPage() {
  const { categoryId, subCategoryId } = Route.useParams();
  const cat = useStorefrontCategory(categoryId);
  const sub = useStorefrontSubcategory(categoryId, subCategoryId);
  const all = useProductsBySub(categoryId, subCategoryId);

  const brands = useMemo(() => Array.from(new Set(all.map((p) => p.brand))).sort(), [all]);
  const priceBounds = useMemo<[number, number]>(() => {
    if (all.length === 0) return [0, 0];
    const prices = all.map((p) => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [all]);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(priceBounds[1]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = all.filter((p) => {
      if (query && !`${p.name} ${p.brand} ${p.specs}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (priceMax > 0 && p.price > priceMax) return false;
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    });
    switch (sort) {
      case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
      case "new": list = [...list].sort((a, b) => b.createdAt - a.createdAt); break;
      case "popular": list = [...list].sort((a, b) => b.popularity - a.popularity); break;
    }
    return list;
  }, [all, query, selectedBrands, priceMax, inStockOnly, sort]);

  if (!cat || !sub) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        Sous-catégorie introuvable.
      </div>
    );
  }

  const shown = filtered.slice(0, visible);
  const activeFilters = (selectedBrands.length ? 1 : 0) + (priceMax < priceBounds[1] ? 1 : 0) + (inStockOnly ? 1 : 0);

  const sortLabel: Record<SortKey, string> = {
    "price-asc": "Prix croissant",
    "price-desc": "Prix décroissant",
    "new": "Nouveautés",
    "popular": "Popularité",
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <Breadcrumbs
        items={[
          { label: "Catégories", to: "/categories" },
          { label: cat.name, to: `/categories/${cat.id}` },
          { label: sub.name },
        ]}
      />

      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{cat.name} • {sub.name}</h1>
        <p className="text-xs text-muted-foreground">{filtered.length} produit{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}</p>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setVisible(PAGE_SIZE); }}
          placeholder="Rechercher dans cette catégorie..."
          className="h-11 w-full rounded-full border border-border bg-surface pl-9 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilterOpen(true)}
          className="relative inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card text-xs font-semibold text-foreground transition active:scale-95"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filtrer
          {activeFilters > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{activeFilters}</span>
          )}
        </button>
        <button
          onClick={() => setSortOpen(true)}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card text-xs font-semibold text-foreground transition active:scale-95"
        >
          <ArrowUpDown className="h-4 w-4" /> {sortLabel[sort]}
        </button>
      </div>

      {shown.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun produit ne correspond à vos critères.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map((p) => (
            <div key={p.id} className="flex flex-col">
              <ProductCard product={p} />
              <p className="mt-1 line-clamp-1 px-1 text-[10px] text-muted-foreground">{p.specs}</p>
            </div>
          ))}
        </div>
      )}

      {visible < filtered.length && (
        <button
          onClick={() => setVisible((v) => v + PAGE_SIZE)}
          className="mx-auto block rounded-full border border-primary/40 bg-card px-6 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 active:scale-95"
        >
          Charger plus ({filtered.length - visible} restants)
        </button>
      )}

      {filterOpen && (
        <BottomSheet onClose={() => setFilterOpen(false)} title="Filtres">
          <div className="space-y-5">
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Marques</h3>
              <div className="flex flex-wrap gap-2">
                {brands.map((b) => {
                  const active = selectedBrands.includes(b);
                  return (
                    <button
                      key={b}
                      onClick={() => setSelectedBrands((cur) => active ? cur.filter((x) => x !== b) : [...cur, b])}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                        active
                          ? "border-primary bg-[image:var(--gradient-primary)] text-primary-foreground"
                          : "border-border bg-surface text-muted-foreground"
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {priceBounds[1] > 0 && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Prix maximum</h3>
                  <span className="text-xs font-semibold text-foreground">{formatGNF(priceMax)}</span>
                </div>
                <input
                  type="range"
                  min={priceBounds[0]}
                  max={priceBounds[1]}
                  step={50_000}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[color:var(--primary)]"
                />
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>{formatGNF(priceBounds[0])}</span>
                  <span>{formatGNF(priceBounds[1])}</span>
                </div>
              </div>
            )}

            <label className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-3">
              <span className="text-sm font-medium text-foreground">En stock uniquement</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-5 w-5 accent-[color:var(--primary)]"
              />
            </label>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => { setSelectedBrands([]); setPriceMax(priceBounds[1]); setInStockOnly(false); }}
                className="flex-1 rounded-full border border-border bg-card py-3 text-sm font-semibold text-foreground"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => { setFilterOpen(false); setVisible(PAGE_SIZE); }}
                className="flex-1 rounded-full bg-[image:var(--gradient-primary)] py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
              >
                Appliquer
              </button>
            </div>
          </div>
        </BottomSheet>
      )}

      {sortOpen && (
        <BottomSheet onClose={() => setSortOpen(false)} title="Trier par">
          <div className="space-y-1.5">
            {(Object.keys(sortLabel) as SortKey[]).map((k) => (
              <button
                key={k}
                onClick={() => { setSort(k); setSortOpen(false); }}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                  sort === k ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-foreground"
                }`}
              >
                {sortLabel[k]}
                {sort === k && <span className="text-xs font-bold">✓</span>}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  );
}

function BottomSheet({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={onClose} />
      <div className="relative w-full max-w-screen-md rounded-t-3xl border-t border-border bg-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl animate-[slide-up_0.3s_ease-out]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-surface text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
