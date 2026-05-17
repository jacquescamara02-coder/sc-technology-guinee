import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/panier")({
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const total = items.reduce((a, i) => a + i.qty * i.product.price, 0);
  const shipping = total > 5_000_000 || total === 0 ? 0 : 150_000;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-surface text-primary">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Votre panier est vide</h1>
        <p className="text-sm text-muted-foreground">Ajoutez des produits pour commencer.</p>
        <Link
          to="/"
          className="mt-3 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Découvrir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 py-4 pb-32">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Mon panier</h1>

      <div className="space-y-2.5">
        {items.map(({ product, qty }) => (
          <div key={product.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="h-20 w-20 shrink-0 rounded-xl" style={{ backgroundImage: product.image }} />
            <div className="flex flex-1 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.brand}</div>
                  <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{product.name}</h3>
                </div>
                <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-full border border-border bg-surface">
                  <button onClick={() => setQty(product.id, qty - 1)} className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-semibold">{qty}</span>
                  <button onClick={() => setQty(product.id, qty + 1)} className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="text-sm font-bold text-foreground">{formatGNF(product.price * qty)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
        <Row label="Sous-total" value={formatGNF(total)} />
        <Row label="Livraison" value={shipping === 0 ? "Gratuite" : formatGNF(shipping)} />
        <div className="my-1 border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Total</span>
          <span className="text-lg font-bold text-primary">{formatGNF(total + shipping)}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="flex h-12 w-full items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98]"
      >
        Passer la commande
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
