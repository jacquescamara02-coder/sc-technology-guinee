import { useEffect } from "react";
import { useTheme, getPreset } from "@/lib/theme-store";

export function ThemeApplier() {
  const themeId = useTheme((s) => s.themeId);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const preset = getPreset(themeId);
    const root = document.documentElement;
    root.style.setProperty("--primary", preset.primary);
    root.style.setProperty("--primary-glow", preset.primaryGlow);
    root.style.setProperty("--ring", preset.primary);
    root.style.setProperty(
      "--gradient-primary",
      `linear-gradient(135deg, ${preset.primary}, ${preset.primaryGlow})`,
    );
    root.style.setProperty(
      "--shadow-glow",
      `0 8px 32px -8px color-mix(in oklab, ${preset.primary} 55%, transparent)`,
    );
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", preset.themeColor);
  }, [themeId]);
  return null;
}
