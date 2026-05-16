import { useEffect } from "react";
import { useTheme, applyTheme } from "@/lib/theme-store";

export function ThemeApplier() {
  const themeId = useTheme((s) => s.themeId);
  useEffect(() => {
    applyTheme(themeId);
  }, [themeId]);
  return null;
}
