import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { categories, products, formatGNF } from "@/lib/data";
import { Search as SearchIcon, Clock, X, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/search")({
  component: SearchPage,
});

const RECENT_KEY = "techshop_recent_searches";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const saveRecent = (q: string) => {
    const v = q.trim();
    if (!v) return;
    const next = [v, ...recent.filter((r) => r.toLowerCase() !== v.toLowerCase())].slice(0, 8);
    setRecent(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
  };

  const clearRecent = () => {
    setRecent([]);
    try { localStorage.removeItem(RECENT_KEY); } catch {}
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      `${p.name} ${p.brand} ${p.specs}`.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>();
    for (const p of results) {
      const arr = map.get(p.category) ?? [];
      arr.push(p);
      map.set(p.category, arr);
    }
    return Array.from(map.entries()).map(([catId, items]) => ({
      cat: categories.find((c) => c.id === catId)!,
      items,
    }));
  }, [results]);

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Recherche</h1>
        <p className="text-sm text-muted-foreground">Cherchez par nom, marque ou spécifications</p>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); saveRecent(query); }}
        className="relative"
      >
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="MacBook, RTX 4070, casque Sony..."
          className="h-11 w-full rounded-full border border-border bg-surface pl-9 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-card text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {!query && recent.length > 0 && (
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Recherches récentes</h2>
            <button onClick={clearRecent} className="text-[11px] font-semibold text-primary">Effacer</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recent.map((r) => (
              <button
                key={r}
                onClick={() => setQuery(r)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
              >
                <Clock className="h-3 w-3 text-muted-foreground" /> {r}
              </button>
            ))}
          </div>
        </section>
      )}

      {!query && (
        <section>
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Suggestions populaires</h2>
          <div className="flex flex-wrap gap-2">
            {["MacBook", "RTX 4070", "iPhone", "SSD NVMe", "Routeur WiFi 6", "Casque Sony", "Imprimante laser"].map((s) => (
              <button
                key={s}
                onClick={() => { setQuery(s); saveRecent(s); }}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      )}

      {query && (
        <div className="text-xs text-muted-foreground">
          {results.length} résultat{results.length > 1 ? "s" : ""} pour « {query} »
        </div>
      )}

      {query && results.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun produit trouvé. Essayez un autre terme.
        </div>
      )}

      {grouped.map(({ cat, items }) => (
        <section key={cat.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">{cat.name} <span className="text-xs font-normal text-muted-foreground">({items.length})</span></h2>
            <Link
              to="/categories/$categoryId"
              params={{ categoryId: cat.id }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {items.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link
                  to="/categories/$categoryId/$subCategoryId"
                  params={{ categoryId: p.category, subCategoryId: p.subcategory }}
                  onClick={() => saveRecent(query)}
                  className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-surface"
                >
                  <div
                    className="h-12 w-12 shrink-0 rounded-lg"
                    style={{ backgroundImage: p.image }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-1 text-sm font-semibold text-foreground">{p.name}</div>
                    <div className="line-clamp-1 text-[11px] text-muted-foreground">{p.brand} • {p.specs}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs font-bold text-foreground">{formatGNF(p.price)}</div>
                    <div className={`text-[10px] font-semibold ${p.stock > 0 ? "text-success" : "text-destructive"}`}>
                      {p.stock > 0 ? "En stock" : "Rupture"}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
