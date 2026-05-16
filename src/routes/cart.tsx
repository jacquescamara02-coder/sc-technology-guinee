import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatGNF } from "@/lib/data";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

const TVA_RATE = 0.18;

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const subtotal = items.reduce((a, i) => a + i.qty * i.product.price, 0);
  const tva = Math.round(subtotal * TVA_RATE);
  const total = subtotal + tva;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-3xl bg-[image:var(--gradient-primary)]/15 text-primary">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Votre panier est vide</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          Parcourez nos catégories et ajoutez vos premiers produits pour commencer.
        </p>
        <Link
          to="/"
          className="mt-3 inline-flex rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          Découvrir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 py-4 pb-32">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Mon panier</h1>
        <button
          onClick={() => {
            if (confirm("Vider tout le panier ?")) clear();
          }}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" /> Vider
        </button>
      </div>

      <div className="space-y-2.5">
        {items.map(({ product, qty }) => (
          <SwipeRow key={product.id} onDelete={() => remove(product.id)}>
            <div className="flex gap-3 rounded-2xl border border-border bg-card p-3">
              <Link
                to="/product/$productId"
                params={{ productId: product.id }}
                className="h-20 w-20 shrink-0 rounded-xl"
                style={{ backgroundImage: product.image }}
                aria-label={product.name}
              />
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.brand}</div>
                    <Link
                      to="/product/$productId"
                      params={{ productId: product.id }}
                      className="line-clamp-1 text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">{formatGNF(product.price)} / unité</div>
                  </div>
                  <button
                    onClick={() => remove(product.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full border border-border bg-surface">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"
                      aria-label="Diminuer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-xs font-semibold">{qty}</span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="grid h-7 w-7 place-items-center text-muted-foreground hover:text-foreground"
                      aria-label="Augmenter"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-sm font-bold text-foreground">{formatGNF(product.price * qty)}</div>
                </div>
              </div>
            </div>
          </SwipeRow>
        ))}
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
        <Row label="Sous-total" value={formatGNF(subtotal)} />
        <Row label="Livraison" value={<span className="text-muted-foreground">À calculer</span>} />
        <Row label="TVA (18%)" value={formatGNF(tva)} />
        <div className="my-2 border-t border-border" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">TOTAL</span>
          <span className="text-2xl font-bold text-primary">{formatGNF(total)}</span>
        </div>
      </div>

      <Link
        to="/checkout"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-primary)] text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition active:scale-[0.98]"
      >
        Passer la commande <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function SwipeRow({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  const [offset, setOffset] = useState(0);
  const startX = useRef<number | null>(null);
  const currentX = useRef(0);

  const onStart = (x: number) => {
    startX.current = x;
    currentX.current = offset;
  };
  const onMove = (x: number) => {
    if (startX.current === null) return;
    const delta = x - startX.current;
    const next = Math.min(0, Math.max(-120, currentX.current + delta));
    setOffset(next);
  };
  const onEnd = () => {
    startX.current = null;
    if (offset < -80) {
      onDelete();
    } else if (offset < -40) {
      setOffset(-80);
    } else {
      setOffset(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-y-0 right-0 flex w-24 items-center justify-center bg-destructive text-destructive-foreground">
        <button onClick={onDelete} className="flex flex-col items-center gap-1 text-xs font-semibold" aria-label="Supprimer">
          <Trash2 className="h-5 w-5" />
          Supprimer
        </button>
      </div>
      <div
        style={{ transform: `translateX(${offset}px)` }}
        className="transition-transform duration-150"
        onTouchStart={(e) => onStart(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => e.buttons === 1 && onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={() => startX.current !== null && onEnd()}
      >
        {children}
      </div>
    </div>
  );
}
