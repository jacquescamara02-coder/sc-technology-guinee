import { Phone, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mx-auto mt-8 max-w-screen-md px-4 pb-8 pt-6 text-center text-xs text-muted-foreground">
      {/* Download the app */}
      <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/90">
          Bientôt disponible
        </div>
        <div className="mt-1 text-base font-bold text-foreground">SC TECHNOLOGIE</div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Téléchargez l'application mobile officielle
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          <StoreBadge store="google" />
          <StoreBadge store="apple" />
        </div>
      </div>

      <div className="border-t border-border/60 pt-5">
        <div className="font-semibold text-foreground">SC TECHNOLOGIE</div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <a href="tel:+224620212045" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Phone className="h-3.5 w-3.5 text-primary" /> 620-21-20-45
          </a>
          <a href="tel:+224610953838" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Phone className="h-3.5 w-3.5 text-primary" /> 610-95-38-38
          </a>
          <a
            href="https://wa.me/224620212045"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" /> WhatsApp : 620-21-20-45
          </a>
        </div>
        <div className="mt-3 text-[11px]">© {new Date().getFullYear()} SC TECHNOLOGIE • Guinée</div>
      </div>
    </footer>
  );
}

function StoreBadge({ store }: { store: "google" | "apple" }) {
  const isApple = store === "apple";
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      aria-label={isApple ? "Télécharger sur l'App Store" : "Disponible sur Google Play"}
      className="group inline-flex items-center gap-2.5 rounded-xl border border-white/15 bg-black px-3.5 py-2 text-white shadow-lg transition active:scale-95 hover:border-white/30"
    >
      {isApple ? (
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
          <path d="M16.365 1.43c0 1.14-.42 2.22-1.11 3.03-.75.87-1.96 1.55-3.13 1.46-.13-1.12.41-2.27 1.07-3.02.74-.86 2-1.51 3.17-1.47zM20.5 17.27c-.57 1.31-.84 1.89-1.57 3.05-1.02 1.61-2.46 3.62-4.24 3.64-1.58.02-1.99-1.03-4.13-1.02-2.14.01-2.59 1.04-4.17 1.02-1.78-.02-3.14-1.83-4.16-3.44C-.6 16.95-.92 11.6 1.04 8.7c1.39-2.07 3.57-3.28 5.62-3.28 2.09 0 3.4 1.14 5.13 1.14 1.68 0 2.7-1.14 5.12-1.14 1.83 0 3.77 1 5.16 2.72-4.53 2.48-3.79 8.96-1.57 9.13z" />
        </svg>
      ) : (
        <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden>
          <path fill="#34A853" d="M6.5 6.5l21.3 21.3-5.4 5.4L6.5 17.3z" />
          <path fill="#FBBC04" d="M33.4 22.1l-5.6-5.6L6.5 6.5l16.9 16.9z" />
          <path fill="#EA4335" d="M6.5 41.5l21.3-21.3 5.6 5.6L6.5 41.5z" />
          <path fill="#4285F4" d="M40.5 21.2l-7.1-4.1-5.6 5.6 5.4 5.4 7.3-4.2c1.6-.9 1.6-3.8 0-2.7z" />
        </svg>
      )}
      <div className="text-left leading-tight">
        <div className="text-[9px] opacity-80">{isApple ? "Télécharger dans l'" : "Disponible sur"}</div>
        <div className="text-sm font-semibold tracking-tight">{isApple ? "App Store" : "Google Play"}</div>
      </div>
    </a>
  );
}
