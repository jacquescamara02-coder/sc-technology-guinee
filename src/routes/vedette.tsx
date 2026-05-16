import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useFeaturedProducts } from "@/lib/storefront";

export const Route = createFileRoute("/vedette")({
  component: VedettePage,
});

function VedettePage() {
  const featured = useFeaturedProducts();
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-3">
        <Link to="/" className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-foreground hover:border-primary/40">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Produits en vedette</h1>
      </div>
      {featured.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Aucun produit en vedette pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
