import { Phone, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mx-auto mt-6 max-w-screen-md border-t border-border/60 px-4 py-6 text-center text-xs text-muted-foreground">
      <div className="font-semibold text-foreground">SC TECHNOLOGY</div>
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
      <div className="mt-3 text-[11px]">© {new Date().getFullYear()} SC TECHNOLOGY • Guinée</div>
    </footer>
  );
}
