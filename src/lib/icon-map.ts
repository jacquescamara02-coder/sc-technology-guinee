import {
  Laptop,
  Monitor,
  Printer,
  Cable,
  Headphones,
  HardDrive,
  Cpu,
  Smartphone,
  Package,
  Camera,
  Gamepad2,
  Keyboard,
  Mouse,
  Tv,
  Watch,
  Speaker,
  Server,
  Tablet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  laptops: Laptop,
  desktops: HardDrive,
  ecrans: Monitor,
  imprimantes: Printer,
  composants: Cpu,
  reseaux: Cable,
  accessoires: Headphones,
  telephones: Smartphone,
  // generic
  laptop: Laptop,
  monitor: Monitor,
  printer: Printer,
  cable: Cable,
  headphones: Headphones,
  storage: HardDrive,
  cpu: Cpu,
  smartphone: Smartphone,
  package: Package,
  camera: Camera,
  gaming: Gamepad2,
  keyboard: Keyboard,
  mouse: Mouse,
  tv: Tv,
  watch: Watch,
  speaker: Speaker,
  server: Server,
  tablet: Tablet,
};

export const iconOptions: { key: string; label: string }[] = [
  { key: "laptop", label: "Laptop" },
  { key: "storage", label: "Tour / Bureau" },
  { key: "monitor", label: "Écran" },
  { key: "printer", label: "Imprimante" },
  { key: "cpu", label: "Composant" },
  { key: "cable", label: "Réseau" },
  { key: "headphones", label: "Casque" },
  { key: "smartphone", label: "Téléphone" },
  { key: "tablet", label: "Tablette" },
  { key: "watch", label: "Montre" },
  { key: "camera", label: "Caméra" },
  { key: "gaming", label: "Gaming" },
  { key: "keyboard", label: "Clavier" },
  { key: "mouse", label: "Souris" },
  { key: "tv", label: "TV" },
  { key: "speaker", label: "Enceinte" },
  { key: "server", label: "Serveur" },
  { key: "package", label: "Autre" },
];

export function getIcon(key?: string): LucideIcon {
  if (!key) return Package;
  return MAP[key] ?? Package;
}
