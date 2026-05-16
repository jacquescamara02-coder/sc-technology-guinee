import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ThemePreset {
  id: string;
  name: string;
  swatch: string; // hex for swatch UI
  primary: string; // oklch(...) value
  primaryGlow: string;
  themeColor: string; // <meta name="theme-color">
}

export const themePresets: ThemePreset[] = [
  {
    id: "blue",
    name: "Bleu",
    swatch: "#0066FF",
    primary: "oklch(0.58 0.24 260)",
    primaryGlow: "oklch(0.70 0.22 255)",
    themeColor: "#0066FF",
  },
  {
    id: "orange",
    name: "Orange",
    swatch: "#FF6600",
    primary: "oklch(0.70 0.19 50)",
    primaryGlow: "oklch(0.78 0.17 60)",
    themeColor: "#FF6600",
  },
  {
    id: "green",
    name: "Vert",
    swatch: "#10B981",
    primary: "oklch(0.68 0.17 155)",
    primaryGlow: "oklch(0.76 0.15 160)",
    themeColor: "#10B981",
  },
  {
    id: "purple",
    name: "Violet",
    swatch: "#8B5CF6",
    primary: "oklch(0.62 0.22 295)",
    primaryGlow: "oklch(0.72 0.20 300)",
    themeColor: "#8B5CF6",
  },
  {
    id: "red",
    name: "Rouge",
    swatch: "#EF4444",
    primary: "oklch(0.62 0.24 25)",
    primaryGlow: "oklch(0.72 0.22 25)",
    themeColor: "#EF4444",
  },
  {
    id: "pink",
    name: "Rose",
    swatch: "#EC4899",
    primary: "oklch(0.66 0.23 355)",
    primaryGlow: "oklch(0.76 0.20 350)",
    themeColor: "#EC4899",
  },
  {
    id: "cyan",
    name: "Cyan",
    swatch: "#06B6D4",
    primary: "oklch(0.70 0.14 210)",
    primaryGlow: "oklch(0.78 0.12 215)",
    themeColor: "#06B6D4",
  },
  {
    id: "gold",
    name: "Or",
    swatch: "#D4A24C",
    primary: "oklch(0.74 0.14 85)",
    primaryGlow: "oklch(0.82 0.12 90)",
    themeColor: "#D4A24C",
  },
];

interface ThemeState {
  themeId: string;
  setTheme: (id: string) => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: "blue",
      setTheme: (id) => set({ themeId: id }),
    }),
    {
      name: "sc-theme",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as never),
      ),
    },
  ),
);

export function getPreset(id: string): ThemePreset {
  return themePresets.find((p) => p.id === id) ?? themePresets[0];
}
