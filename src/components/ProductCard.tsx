import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/data";
import { formatGNF } from "@/lib/data";
import { useCart } from "@/lib/cart-store";

export function ProductCard({ product, className = "" }: { product: Product; className?: string }) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const inStock = product.stock > 0;

  const handleAdd = () => {
    if (!inStock) return;
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition hover:border-primary/40 hover:-translate-y-0.5 ${className}`}
    >
      <Link
        to="/product/$productId"
        params={{ productId: product.id }}
        className="relative block aspect-square overflow-hidden"
        style={{ backgroundImage: product.image }}
        aria-label={`Voir ${product.name}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        {product.badge && (
          <span
            className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              product.badge === "Promo"
                ? "bg-destructive text-destructive-foreground"
                : product.badge === "Nouveau"
                ? "bg-success text-success-foreground"
                : "bg-warning text-warning-foreground"
            }`}
          >
            {product.badge}
          </span>
        )}
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur ${
            inStock ? "bg-background/70 text-success" : "bg-background/70 text-destructive"
          }`}
        >
          {inStock ? `En stock` : "Rupture"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.brand}</div>
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">{product.name}</h3>
        <div className="mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-foreground">{formatGNF(product.price)}</span>
          </div>
          {product.oldPrice && (
            <div className="text-[11px] text-muted-foreground line-through">{formatGNF(product.oldPrice)}</div>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!inStock}
          className="mt-1 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[image:var(--gradient-primary)] text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" /> Ajouté
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" /> Ajouter
            </>
          )}
        </button>
      </div>
    </article>
  );
}
