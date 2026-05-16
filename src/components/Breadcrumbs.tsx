import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
  params?: Record<string, string>;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumb" className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto px-1 text-xs">
      <Link to="/" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface text-muted-foreground transition hover:text-foreground">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {items.map((c, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <div key={idx} className="flex shrink-0 items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            {c.to && !isLast ? (
              <Link to={c.to as string} params={c.params as never} className="rounded-full px-2 py-1 font-medium text-muted-foreground transition hover:bg-surface hover:text-foreground">
                {c.label}
              </Link>
            ) : (
              <span className="rounded-full bg-surface px-2 py-1 font-semibold text-foreground">{c.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
