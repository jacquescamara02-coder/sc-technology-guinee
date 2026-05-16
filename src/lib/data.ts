import { Laptop, Monitor, Printer, Cable, Headphones, HardDrive } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  category: string;
  stock: number;
  badge?: "Nouveau" | "Promo" | "Top";
  image: string;
}

export const categories: Category[] = [
  { id: "laptops", name: "Laptops", icon: Laptop, count: 42 },
  { id: "desktops", name: "Ordinateurs de bureau", icon: HardDrive, count: 18 },
  { id: "ecrans", name: "Écrans", icon: Monitor, count: 26 },
  { id: "imprimantes", name: "Imprimantes", icon: Printer, count: 14 },
  { id: "accessoires", name: "Accessoires", icon: Headphones, count: 87 },
  { id: "reseaux", name: "Réseaux", icon: Cable, count: 31 },
];

// Solid color gradient backgrounds as image placeholders
const img = (hue: number) =>
  `linear-gradient(135deg, oklch(0.42 0.18 ${hue}), oklch(0.28 0.10 ${hue + 30}))`;

export const products: Product[] = [
  { id: "p1", name: "MacBook Pro 14\" M3", brand: "Apple", price: 18500000, oldPrice: 21000000, category: "laptops", stock: 8, badge: "Promo", image: img(260) },
  { id: "p2", name: "Dell XPS 15 OLED", brand: "Dell", price: 15200000, category: "laptops", stock: 5, badge: "Top", image: img(220) },
  { id: "p3", name: "HP EliteBook 840 G10", brand: "HP", price: 12800000, category: "laptops", stock: 12, image: img(200) },
  { id: "p4", name: "Écran LG UltraGear 27\"", brand: "LG", price: 4200000, category: "ecrans", stock: 14, badge: "Nouveau", image: img(180) },
  { id: "p5", name: "Imprimante HP LaserJet Pro", brand: "HP", price: 3500000, category: "imprimantes", stock: 9, image: img(30) },
  { id: "p6", name: "Casque Sony WH-1000XM5", brand: "Sony", price: 2900000, category: "accessoires", stock: 22, badge: "Top", image: img(300) },
  { id: "p7", name: "Routeur TP-Link AX6000", brand: "TP-Link", price: 1850000, category: "reseaux", stock: 17, badge: "Nouveau", image: img(150) },
  { id: "p8", name: "Clavier Logitech MX Keys", brand: "Logitech", price: 980000, category: "accessoires", stock: 30, image: img(280) },
  { id: "p9", name: "iMac 24\" M3", brand: "Apple", price: 16900000, category: "desktops", stock: 4, badge: "Nouveau", image: img(240) },
  { id: "p10", name: "Souris MX Master 3S", brand: "Logitech", price: 720000, category: "accessoires", stock: 45, image: img(320) },
];

export const featured = products.slice(0, 6);
export const newArrivals = [products[3], products[6], products[8], products[5], products[9], products[1]];

export const formatGNF = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " GNF";
