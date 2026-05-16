import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import {
  useStorefrontCategory,
  useStorefrontProducts,
} from "@/lib/storefront";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/categories/$categoryId")({
  component: SubCategoriesPage,
});

function SubCategoriesPage() {
  const { categoryId } = Route.useParams();
  const location = useLocation();
  const cat = useStorefrontCategory(categoryId);
  const allProducts = useStorefrontProducts();

  if (!cat) {
    return (
      <div className="px-4 py-10 text-center text-sm text-muted-foreground">
        Catégorie introuvable.
      </div>
    );
  }
  if (location.pathname !== `/categories/${categoryId}`) return <Outlet />;

  const Icon = cat.icon;
  return (
    <div className="space-y-4 px-4 py-4">
      <Breadcrumbs
        items={[
          { label: "Catégories", to: "/categories" },
          { label: cat.name },
        ]}
      />

      <header className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <Icon className="h-6 w-6" strokeWidth={2.25} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">{cat.name}</h1>
          <p className="text-xs text-muted-foreground">
            {cat.count} produits dans {cat.subcategories.length} sous-catégories
          </p>
        </div>
      </header>

      {cat.subcategories.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucune sous-catégorie pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {cat.subcategories.map((sub) => {
            const count = allProducts.filter(
              (p) => p.category === cat.id && p.subcategory === sub.id,
            ).length;
            return (
              <a
                key={sub.id}
                href={`/categories/${cat.id}/${sub.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  window.location.assign(
                    new URL(`/categories/${cat.id}/${sub.id}`, window.location.origin).toString(),
                  );
                }}
                className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 active:scale-[0.99]"
              >
                <div className="text-sm font-semibold text-foreground">{sub.name}</div>
                <div className="text-[11px] text-muted-foreground">{count} produits</div>
                <div className="mt-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                  Voir <ChevronRight className="h-3 w-3" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
