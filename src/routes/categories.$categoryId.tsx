import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { categories, getCategory, productsBySub } from "@/lib/data";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/categories/$categoryId")({
  loader: ({ params }) => {
    const cat = getCategory(params.categoryId);
    if (!cat) throw notFound();
    return { categoryId: cat.id };
  },
  component: SubCategoriesPage,
  notFoundComponent: () => (
    <div className="px-4 py-10 text-center text-sm text-muted-foreground">Catégorie introuvable.</div>
  ),
});

function SubCategoriesPage() {
  const { categoryId } = Route.useLoaderData();
  const cat = categories.find((category) => category.id === categoryId);
  if (!cat) return null;
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
          <p className="text-xs text-muted-foreground">{cat.count} produits dans {cat.subcategories.length} sous-catégories</p>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {cat.subcategories.map((sub: { id: string; name: string }) => {
          const count = productsBySub(cat.id, sub.id).length;
          return (
            <Link
              key={sub.id}
              to="/categories/$categoryId/$subCategoryId"
              params={{ categoryId: cat.id, subCategoryId: sub.id }}
              className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="text-sm font-semibold text-foreground">{sub.name}</div>
              <div className="text-[11px] text-muted-foreground">{count} produits</div>
              <div className="mt-auto inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                Voir <ChevronRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
