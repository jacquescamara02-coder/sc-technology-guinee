import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, ShoppingCart, Package, User } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCart } from "@/lib/cart-store";

interface Tab {
  to: "/" | "/categories" | "/panier" | "/commandes" | "/profil";
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/categories", label: "Catégories", icon: LayoutGrid },
  { to: "/panier", label: "Panier", icon: ShoppingCart },
  { to: "/commandes", label: "Commandes", icon: Package },
  { to: "/profil", label: "Profil", icon: User },
];

export function BottomNav() {
  const count = useCart((s) => s.items.reduce((a, i) => a + i.qty, 0));
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-screen-md items-stretch justify-around px-2 py-1.5">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <li key={t.to} className="flex-1">
              <Link
                to={t.to}
                activeOptions={{ exact: true }}
                className="group relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-muted-foreground transition data-[status=active]:text-primary"
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={2.25} />
                  {t.to === "/panier" && count > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                      {count}
                    </span>
                  )}
                </span>
                <span className="text-[10px] font-medium">{t.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
