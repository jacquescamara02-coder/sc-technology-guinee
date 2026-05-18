/**
 * Apple-like premium ambient background.
 * Three softly animated color blobs + subtle grid mesh + vignette.
 * Pure CSS — GPU-accelerated, no JS animation frame work.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base deep gradient (not pure black) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.24_0.08_265)_0%,oklch(0.16_0.04_260)_45%,oklch(0.12_0.03_260)_100%)]" />

      {/* Animated color blobs */}
      <div className="ambient-blob ambient-blob-1" />
      <div className="ambient-blob ambient-blob-2" />
      <div className="ambient-blob ambient-blob-3" />

      {/* Subtle grid mesh */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Top vignette glow */}
      <div className="absolute -top-32 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.65_0.22_265/0.35),transparent_70%)] blur-2xl" />

      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/70 to-transparent" />
    </div>
  );
}
