import logoUrl from "@/assets/sc-logo.png";

export function Logo({
  compact = false,
  variant = "dark",
}: {
  compact?: boolean;
  variant?: "dark" | "light";
}) {
  // The uploaded logo already contains the "SC TECHNOLOGIE" wordmark,
  // so we display the image alone — no duplicate text next to it.
  const bg =
    variant === "light"
      ? "bg-white"
      : "bg-white/95 shadow-[var(--shadow-glow)]";
  return (
    <div className="flex items-center">
      <img
        src={logoUrl}
        alt="SC TECHNOLOGIE — Matériel informatique en Guinée"
        width={compact ? 40 : 48}
        height={compact ? 40 : 48}
        className={`${compact ? "h-10 w-10" : "h-12 w-12"} rounded-xl ${bg} p-1 object-contain`}
      />
    </div>
  );
}
