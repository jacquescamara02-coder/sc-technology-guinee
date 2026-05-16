import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import { categories, featured, newArrivals } from "@/lib/data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  return (
    <div className="space-y-7 px-4 py-4">
      <HeroCarousel />

      {/* Catégories populaires */}
      <section>
        <SectionHeader
          title="Catégories populaires"
          action={{ label: "Voir tout", onClick: () => navigate({ to: "/categories" }) }}
        />
        <div className="grid grid-cols-3 gap-2.5">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.id}
                to="/categories/$categoryId"
                params={{ categoryId: c.id }}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 transition hover:border-primary/40 hover:-translate-y-0.5"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-surface-elevated text-primary transition group-hover:bg-[image:var(--gradient-primary)] group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" strokeWidth={2.25} />
                </div>
                <div className="text-center">
                  <div className="line-clamp-1 text-xs font-semibold text-foreground">{c.name}</div>
                  <div className="text-[10px] text-muted-foreground">{c.count} produits</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Produits en vedette */}
      <section>
        <SectionHeader
          title="Produits en vedette"
          action={{ label: "Voir tout", onClick: () => navigate({ to: "/vedette" }) }}
        />
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} className="w-44 shrink-0 snap-start" />
          ))}
        </div>
      </section>

      {/* Nouveautés */}
      <section>
        <SectionHeader
          title="Nouveautés"
          action={{ label: "Voir tout", onClick: () => navigate({ to: "/nouveautes" }) }}
        />
        <div className="grid grid-cols-2 gap-3">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
