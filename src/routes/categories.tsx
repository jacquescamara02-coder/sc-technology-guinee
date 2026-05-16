import { createFileRoute } from "@tanstack/react-router";
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const [active, setActive] = useState<string>("all");
  const list = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Catégories</h1>
        <p className="text-sm text-muted-foreground">Parcourez nos produits par catégorie</p>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        <Chip active={active === "all"} onClick={() => setActive("all")} label="Tout" />
        {categories.map((c) => (
          <Chip
            key={c.id}
            active={active === c.id}
            onClick={() => setActive(c.id)}
            label={c.name}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
        active
          ? "border-primary bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
