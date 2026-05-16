import {
  createFileRoute,
  Outlet,
  Link,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Facebook,
} from "lucide-react";
import { Toaster } from "sonner";
import { useAdminAuth } from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/admin/products", label: "Produits", icon: Package },
  { to: "/admin/categories", label: "Catégories", icon: FolderTree },
  { to: "/admin/orders", label: "Commandes", icon: ShoppingBag },
  { to: "/admin/facebook", label: "Facebook", icon: Facebook },
  { to: "/admin/settings", label: "Paramètres", icon: Settings },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isAuthed, email, logout } = useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!isAuthed && !isLogin) navigate({ to: "/admin/login" });
  }, [isAuthed, isLogin, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLogin) return <Outlet />;
  if (!isAuthed) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">TechShop GN</p>
            <p className="text-xs text-slate-500 leading-tight">Administration</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <SidebarLink key={item.to} {...item} active={pathname.startsWith(item.to)} />
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-slate-200">
          <button
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold">TechShop GN Admin</p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV.map((item) => (
                <SidebarLink key={item.to} {...item} active={pathname.startsWith(item.to)} />
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-slate-200">
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/admin/login" });
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3 px-4 md:px-8 h-14">
            <button
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
            <h1 className="text-sm md:text-base font-semibold truncate">
              TechShop GN — Administration
            </h1>
            <div className="ml-auto flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-slate-600">{email}</span>
              <button
                onClick={() => {
                  logout();
                  navigate({ to: "/admin/login" });
                }}
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                <LogOut className="h-3.5 w-3.5" />
                Déconnexion
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 md:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors " +
        (active
          ? "bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900")
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
