import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { useStorefrontCategories } from "@/lib/storefront";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/categories")({
  component: CategoriesLayout,
});

function CategoriesLayout() {
  const matches = useMatches();
  const isRoot = matches[matches.length - 1]?.routeId === "/categories";
  if (!isRoot) return <Outlet />;
  return <CategoriesIndex />;
}

function CategoriesIndex() {
  const categories = useStorefrontCategories();
  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Catégories</h1>
        <p className="text-sm text-muted-foreground">Parcourez nos produits par catégorie</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.id}
              to="/categories/$categoryId"
              params={{ categoryId: c.id }}
              className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-card)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-elevated text-primary transition group-hover:bg-[image:var(--gradient-primary)] group-hover:text-primary-foreground">
                <Icon className="h-6 w-6" strokeWidth={2.25} />
              </div>
              <div className="flex-1">
                <div className="line-clamp-2 text-sm font-semibold text-foreground">{c.name}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{c.count} produits</div>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                Explorer <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
