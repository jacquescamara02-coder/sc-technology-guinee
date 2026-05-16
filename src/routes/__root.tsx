import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { TopHeader } from "@/components/TopHeader";
import { BottomNav } from "@/components/BottomNav";
import { SplashScreen } from "@/components/SplashScreen";
import { Footer } from "@/components/Footer";
import { ThemeApplier } from "@/components/ThemeApplier";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page introuvable.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#0066FF" },
      { title: "SC TECHNOLOGY - Matériel Informatique en Guinée" },
      { name: "description", content: "SC TECHNOLOGY — Vente de matériel informatique en Guinée. Laptops, écrans, imprimantes, accessoires. Livraison à Conakry et toute la Guinée." },
      { property: "og:title", content: "SC TECHNOLOGY - Matériel Informatique en Guinée" },
      { property: "og:description", content: "SC TECHNOLOGY — Vente de matériel informatique en Guinée. Laptops, écrans, imprimantes, accessoires. Livraison à Conakry et toute la Guinée." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "SC TECHNOLOGY - Matériel Informatique en Guinée" },
      { name: "twitter:description", content: "SC TECHNOLOGY — Vente de matériel informatique en Guinée. Laptops, écrans, imprimantes, accessoires. Livraison à Conakry et toute la Guinée." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/aVNQw5YQgNX2zQyX67wt8r84Rbm2/social-images/social-1778937361471-WhatsApp_Image_2026-05-16_at_16.38.34.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/aVNQw5YQgNX2zQyX67wt8r84Rbm2/social-images/social-1778937361471-WhatsApp_Image_2026-05-16_at_16.38.34.webp" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    if (isAdmin) {
      html.classList.remove("dark");
      html.style.backgroundColor = "#f8fafc";
    } else {
      html.classList.add("dark");
      html.style.backgroundColor = "";
    }
  }, [isAdmin]);

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-slate-50 text-slate-900">
          <Outlet />
        </div>
      </QueryClientProvider>
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <SplashScreen />
      <div className="min-h-screen bg-background pb-20">
        <TopHeader />
        <main className="mx-auto max-w-screen-md animate-[fade-in_0.3s_ease-out]">
          <Outlet />
        </main>
        <Footer />
        <BottomNav />
      </div>
    </QueryClientProvider>
  );
}
