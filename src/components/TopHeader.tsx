import { Search, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart-store";

export function TopHeader() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-md items-center gap-3 px-4 py-3">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Rechercher un produit..."
            className="h-10 w-full rounded-full border border-border bg-surface pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <Link
          to="/panier"
          className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-foreground transition hover:bg-accent"
          aria-label="Panier"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
