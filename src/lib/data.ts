import {
  Laptop,
  Monitor,
  Printer,
  Cable,
  Headphones,
  HardDrive,
  Cpu,
  Smartphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  count: number;
  subcategories: SubCategory[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  category: string;
  subcategory: string;
  stock: number;
  specs: string;
  popularity: number; // 0..100
  createdAt: number; // epoch ms, lower = older
  badge?: "Nouveau" | "Promo" | "Top";
  image: string;
}

export const cities = ["Conakry", "Labé", "Kankan", "N'Zérékoré", "Kindia", "Faranah"] as const;

// Solid gradient backgrounds as image placeholders
const img = (hue: number) =>
  `linear-gradient(135deg, oklch(0.42 0.18 ${hue}), oklch(0.28 0.10 ${hue + 30}))`;

interface CatDef {
  id: string;
  name: string;
  icon: LucideIcon;
  hue: number;
  subcategories: SubCategory[];
  brands: string[];
  // [minPrice, maxPrice] in GNF
  priceRange: [number, number];
  // Template name builder per subcategory
  nameTemplates: Record<string, string[]>;
  specsTemplates: Record<string, string[]>;
}

const catDefs: CatDef[] = [
  {
    id: "laptops",
    name: "Laptops",
    icon: Laptop,
    hue: 260,
    brands: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI"],
    priceRange: [6_000_000, 25_000_000],
    subcategories: [
      { id: "gaming", name: "Gaming" },
      { id: "bureautique", name: "Bureautique" },
      { id: "ultrabooks", name: "Ultrabooks" },
      { id: "reconditionnes", name: "Reconditionnés" },
    ],
    nameTemplates: {
      gaming: ["ROG Strix G16", "Predator Helios 300", "Legion Pro 7", "TUF Gaming A15", "Nitro 5", "Katana GF66"],
      bureautique: ["Inspiron 15", "ProBook 450", "ThinkPad E15", "VivoBook 15", "IdeaPad 3", "Aspire 5"],
      ultrabooks: ["MacBook Air M3", "XPS 13 Plus", "ZenBook 14 OLED", "Yoga Slim 7", "Spectre x360", "Galaxy Book4"],
      reconditionnes: ["EliteBook 840 G8", "ThinkPad T14 R", "MacBook Pro 2020", "Latitude 7420 R", "ProBook 640 R", "ZBook 15 R"],
    },
    specsTemplates: {
      gaming: ["RTX 4060 • 16Go • 1To SSD", "RTX 4070 • 32Go • 1To NVMe", "RTX 4050 • 16Go • 512Go SSD"],
      bureautique: ["i5-1335U • 8Go • 512Go SSD", "Ryzen 5 • 16Go • 512Go SSD", "i3-1215U • 8Go • 256Go SSD"],
      ultrabooks: ["M3 • 16Go • 512Go SSD", "i7-1360P • 16Go • 1To SSD", "Ryzen 7 • 16Go • 1To NVMe"],
      reconditionnes: ["i5 10e Gén • 16Go • 512Go SSD", "Ryzen 5 Pro • 8Go • 256Go", "M1 • 8Go • 256Go SSD"],
    },
  },
  {
    id: "desktops",
    name: "Ordinateurs de bureau",
    icon: HardDrive,
    hue: 240,
    brands: ["Dell", "HP", "Lenovo", "Apple", "Asus", "MSI"],
    priceRange: [4_000_000, 30_000_000],
    subcategories: [
      { id: "gaming", name: "Gaming" },
      { id: "bureautique", name: "Bureautique" },
      { id: "all-in-one", name: "All-in-One" },
      { id: "workstations", name: "Workstations" },
    ],
    nameTemplates: {
      gaming: ["MEG Trident X", "ROG Strix G35", "Aurora R16", "OMEN 45L", "Legion Tower 7i"],
      bureautique: ["OptiPlex 3000", "ProDesk 400 G9", "ThinkCentre M70s", "ExpertCenter D5"],
      "all-in-one": ["iMac 24\" M3", "OptiPlex AIO 7410", "IdeaCentre AIO 3", "EliteOne 870 G9"],
      workstations: ["Precision 5860", "Z4 G5", "ThinkStation P3", "ProArt Station"],
    },
    specsTemplates: {
      gaming: ["RTX 4070 • i7 • 32Go • 2To SSD", "RTX 4060 Ti • Ryzen 7 • 16Go", "RTX 4080 • i9 • 32Go • 2To"],
      bureautique: ["i5 • 8Go • 512Go SSD", "Ryzen 5 • 16Go • 512Go SSD", "i3 • 8Go • 256Go SSD"],
      "all-in-one": ["27\" 4K • i7 • 16Go", "24\" FHD • M3 • 16Go • 512Go", "23.8\" FHD • i5 • 8Go"],
      workstations: ["Xeon W • 64Go • RTX A4000", "Ryzen Threadripper • 128Go", "i9 • 64Go • RTX A2000"],
    },
  },
  {
    id: "ecrans",
    name: "Écrans & Moniteurs",
    icon: Monitor,
    hue: 200,
    brands: ["LG", "Samsung", "Dell", "Asus", "BenQ", "AOC", "MSI"],
    priceRange: [1_200_000, 18_000_000],
    subcategories: [
      { id: "gaming", name: "Gaming" },
      { id: "bureautique", name: "Bureautique" },
      { id: "ultra-wide", name: "Ultra-wide" },
      { id: "4k", name: "4K" },
    ],
    nameTemplates: {
      gaming: ["UltraGear 27GP850", "Odyssey G7 32\"", "ROG Swift 27\"", "MAG 274QRF QD", "Nitro XV272U"],
      bureautique: ["UltraSharp U2422H", "ProArt PA248QV", "ThinkVision E24", "S24R350", "27MK600M"],
      "ultra-wide": ["UltraWide 34WP65G", "Odyssey G9 49\"", "ProArt PA34VC", "MPG 341CQR"],
      "4k": ["UltraFine 27UN850", "Odyssey Neo G8 4K", "UltraSharp U2723QE", "ProArt PA279CV"],
    },
    specsTemplates: {
      gaming: ["27\" QHD • 165Hz • 1ms IPS", "32\" QHD • 240Hz • 1ms VA", "27\" FHD • 144Hz • 1ms"],
      bureautique: ["24\" FHD • IPS • 75Hz", "27\" QHD • IPS • 60Hz", "24\" FHD • VA • 75Hz"],
      "ultra-wide": ["34\" UWQHD • 144Hz • IPS", "49\" DQHD • 240Hz • Curved", "34\" UWQHD • 100Hz"],
      "4k": ["27\" 4K UHD • IPS • HDR400", "32\" 4K • 144Hz • Mini-LED", "27\" 4K • USB-C 90W"],
    },
  },
  {
    id: "imprimantes",
    name: "Imprimantes & Scanners",
    icon: Printer,
    hue: 30,
    brands: ["HP", "Canon", "Epson", "Brother", "Xerox"],
    priceRange: [800_000, 12_000_000],
    subcategories: [
      { id: "laser", name: "Laser" },
      { id: "jet-encre", name: "Jet d'encre" },
      { id: "multifonctions", name: "Multifonctions" },
      { id: "scanners", name: "Scanners" },
    ],
    nameTemplates: {
      laser: ["LaserJet Pro M404dn", "i-SENSYS LBP243dw", "HL-L2375DW", "Phaser 3330"],
      "jet-encre": ["DeskJet 2720", "PIXMA TS705a", "EcoTank ET-2820", "OfficeJet Pro 9015e"],
      multifonctions: ["LaserJet MFP M428", "PIXMA TR8650", "EcoTank ET-4850", "MFC-J6940DW"],
      scanners: ["ScanJet Pro 3000 s4", "imageFORMULA DR-C230", "WorkForce DS-770", "ADS-2700W"],
    },
    specsTemplates: {
      laser: ["38 ppm • Recto-verso • Réseau", "30 ppm • WiFi • Duplex", "26 ppm • USB • Mono"],
      "jet-encre": ["8 ppm couleur • WiFi", "Cartouches XL • AirPrint", "Réservoirs d'encre • 4800 dpi"],
      multifonctions: ["Impr/Scan/Copie/Fax • WiFi", "ADF 50 pages • Recto-verso auto", "EcoTank • WiFi Direct"],
      scanners: ["60 ppm • ADF 50 pages", "USB 3.0 • 600 dpi", "WiFi • Recto-verso simultané"],
    },
  },
  {
    id: "composants",
    name: "Composants",
    icon: Cpu,
    hue: 150,
    brands: ["Corsair", "Kingston", "Samsung", "Crucial", "NVIDIA", "AMD", "Intel", "G.Skill", "WD"],
    priceRange: [350_000, 22_000_000],
    subcategories: [
      { id: "ram", name: "RAM" },
      { id: "ssd", name: "SSD" },
      { id: "gpu", name: "GPU" },
      { id: "cpu", name: "CPU" },
    ],
    nameTemplates: {
      ram: ["Vengeance LPX 16Go DDR4", "Fury Beast 32Go DDR5", "Trident Z5 RGB 32Go", "Ballistix 16Go DDR4"],
      ssd: ["980 PRO 1To NVMe", "MX500 1To SATA", "KC3000 2To NVMe", "SN850X 2To Gen4", "MP600 Pro 1To"],
      gpu: ["GeForce RTX 4070", "Radeon RX 7800 XT", "GeForce RTX 4060 Ti", "Radeon RX 7900 XTX", "RTX 4080 Super"],
      cpu: ["Core i7-14700K", "Ryzen 7 7800X3D", "Core i5-13600K", "Ryzen 9 7950X", "Core i9-14900K"],
    },
    specsTemplates: {
      ram: ["3200 MHz • CL16 • DIMM", "5600 MHz • CL36 • DDR5", "6000 MHz • RGB • XMP 3.0"],
      ssd: ["PCIe 4.0 • 7000 Mo/s", "SATA III • 560 Mo/s", "PCIe 5.0 • 12000 Mo/s"],
      gpu: ["12Go GDDR6X • PCIe 4.0", "16Go GDDR6 • RDNA 3", "24Go GDDR6X • DLSS 3"],
      cpu: ["20 cœurs • 5.6 GHz • LGA1700", "8 cœurs • 5.0 GHz • AM5", "14 cœurs • 5.1 GHz"],
    },
  },
  {
    id: "reseaux",
    name: "Réseaux & WiFi",
    icon: Cable,
    hue: 180,
    brands: ["TP-Link", "Cisco", "Netgear", "Asus", "Ubiquiti", "D-Link", "Mikrotik"],
    priceRange: [150_000, 9_000_000],
    subcategories: [
      { id: "routeurs", name: "Routeurs" },
      { id: "switches", name: "Switches" },
      { id: "wifi-mesh", name: "WiFi Mesh" },
      { id: "cables", name: "Câbles" },
    ],
    nameTemplates: {
      routeurs: ["Archer AX73", "Nighthawk RAX50", "RT-AX88U Pro", "hAP ax3", "DIR-X5460"],
      switches: ["TL-SG108", "GS308E", "CBS250-24T", "EdgeSwitch 24", "DGS-1210-28"],
      "wifi-mesh": ["Deco X60", "Orbi RBK753", "ZenWiFi XT9", "UniFi U6 Mesh", "Eero Pro 6E"],
      cables: ["Cat6 UTP 305m", "Cat6a SFTP 5m", "Fibre OM4 10m", "Cat7 SSTP 2m", "Patch Cat6 1m x10"],
    },
    specsTemplates: {
      routeurs: ["WiFi 6 AX5400 • 4 antennes", "WiFi 6 AX3000 • OFDMA", "WiFi 7 BE19000 • 6 GHz"],
      switches: ["8 ports Gigabit", "24 ports PoE+ • L2 managé", "Smart switch 24 ports"],
      "wifi-mesh": ["Couverture 500m² • Pack 3", "WiFi 6E tri-bande • Pack 2", "AX6000 • 3 stations"],
      cables: ["Pur cuivre • Blindé", "RJ45 • 10 Gbps", "Multimode • LC/LC"],
    },
  },
  {
    id: "accessoires",
    name: "Accessoires",
    icon: Headphones,
    hue: 300,
    brands: ["Logitech", "Razer", "Sony", "Bose", "Microsoft", "Corsair", "SteelSeries", "JBL"],
    priceRange: [80_000, 4_500_000],
    subcategories: [
      { id: "souris", name: "Souris" },
      { id: "claviers", name: "Claviers" },
      { id: "casques", name: "Casques" },
      { id: "webcams", name: "Webcams" },
    ],
    nameTemplates: {
      souris: ["MX Master 3S", "G502 Hero", "DeathAdder V3", "Pro X Superlight", "Basilisk V3"],
      claviers: ["MX Keys S", "G915 TKL", "BlackWidow V4", "K70 RGB MK.2", "Apex Pro TKL"],
      casques: ["WH-1000XM5", "QuietComfort 45", "Astro A50", "HyperX Cloud III", "Arctis Nova Pro"],
      webcams: ["Brio 4K", "C920 HD Pro", "StreamCam", "Kiyo Pro", "LifeCam Studio"],
    },
    specsTemplates: {
      souris: ["8000 dpi • USB-C • Sans fil", "25K dpi • Optique • RGB", "Ultra-léger 63g • 95h"],
      claviers: ["Switches tactiles • Rétro-éclairé", "Sans fil Lightspeed • Low-profile", "Optique-méca • Magnétique"],
      casques: ["ANC • 30h • Multipoint", "Sans fil 2.4G • Surround 7.1", "Hi-Res • Bluetooth 5.3"],
      webcams: ["4K HDR • Auto-focus", "Full HD 1080p • Stéréo", "1080p 60fps • USB-C"],
    },
  },
  {
    id: "telephones",
    name: "Téléphones & Tablettes",
    icon: Smartphone,
    hue: 320,
    brands: ["Apple", "Samsung", "Xiaomi", "Google", "Huawei", "OnePlus", "Tecno", "Infinix"],
    priceRange: [1_000_000, 22_000_000],
    subcategories: [
      { id: "smartphones", name: "Smartphones" },
      { id: "tablettes", name: "Tablettes" },
      { id: "smartwatches", name: "Smartwatches" },
      { id: "accessoires", name: "Accessoires" },
    ],
    nameTemplates: {
      smartphones: ["iPhone 15 Pro", "Galaxy S24 Ultra", "Pixel 8 Pro", "Xiaomi 14", "OnePlus 12", "Camon 30 Pro"],
      tablettes: ["iPad Air M2", "Galaxy Tab S9", "Pixel Tablet", "Xiaomi Pad 6", "MatePad 11.5"],
      smartwatches: ["Apple Watch Series 9", "Galaxy Watch6 Classic", "Pixel Watch 2", "Watch GT 4", "OnePlus Watch 2"],
      accessoires: ["AirPods Pro 2", "Galaxy Buds3 Pro", "Chargeur USB-C 65W", "Coque MagSafe", "Câble USB-C 1m"],
    },
    specsTemplates: {
      smartphones: ["6.1\" OLED • 256Go • 5G", "6.8\" AMOLED • 512Go • 200MP", "6.7\" • 12Go RAM • 1To"],
      tablettes: ["11\" • 128Go • WiFi", "12.4\" AMOLED • 256Go • 5G", "11\" 144Hz • 8Go RAM"],
      smartwatches: ["45mm • GPS+Cellular • Alu", "47mm • Acier • LTE", "41mm • AMOLED • Bluetooth"],
      accessoires: ["ANC • USB-C • MagSafe", "Charge sans fil 15W", "100W PD • GaN"],
    },
  },
];

// --- Generate products ---
function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function priceFor(range: [number, number], seed: number): number {
  const [min, max] = range;
  const step = 50_000;
  const raw = min + ((seed * 137) % (max - min));
  return Math.round(raw / step) * step;
}

const productsAll: Product[] = [];
const now = Date.now();

for (const c of catDefs) {
  for (const sub of c.subcategories) {
    const names = c.nameTemplates[sub.id] ?? [sub.name];
    const specs = c.specsTemplates[sub.id] ?? ["Produit de qualité"];
    for (let i = 0; i < 22; i++) {
      const brand = pick(c.brands, i);
      const name = pick(names, i);
      const spec = pick(specs, i);
      const price = priceFor(c.priceRange, i + sub.id.length * 7);
      const variant = i < names.length ? "" : ` v${Math.floor(i / names.length) + 1}`;
      const stock = (i * 7) % 9 === 0 ? 0 : ((i * 5) % 30) + 1;
      const badgeIdx = (i + sub.id.length) % 11;
      const badge =
        badgeIdx === 0 ? ("Promo" as const) :
        badgeIdx === 1 ? ("Nouveau" as const) :
        badgeIdx === 2 ? ("Top" as const) :
        undefined;
      const oldPrice = badge === "Promo" ? Math.round((price * 1.2) / 50_000) * 50_000 : undefined;
      productsAll.push({
        id: `${c.id}-${sub.id}-${i + 1}`,
        name: `${brand} ${name}${variant}`,
        brand,
        price,
        oldPrice,
        category: c.id,
        subcategory: sub.id,
        stock,
        specs: spec,
        popularity: (i * 13 + sub.id.length * 9) % 100,
        createdAt: now - i * 86_400_000 - c.hue * 1000,
        badge,
        image: img(c.hue + ((i * 11) % 40) - 20),
      });
    }
  }
}

export const products: Product[] = productsAll;

export const categories: Category[] = catDefs.map((c) => ({
  id: c.id,
  name: c.name,
  icon: c.icon,
  count: productsAll.filter((p) => p.category === c.id).length,
  subcategories: c.subcategories,
}));

export const getCategory = (id: string) => categories.find((c) => c.id === id);
export const getSubcategory = (catId: string, subId: string) =>
  getCategory(catId)?.subcategories.find((s) => s.id === subId);

export const productsBySub = (catId: string, subId: string) =>
  productsAll.filter((p) => p.category === catId && p.subcategory === subId);

export const productsByCat = (catId: string) =>
  productsAll.filter((p) => p.category === catId);

export const featuredAll = [...productsAll].sort((a, b) => b.popularity - a.popularity);
export const featured = featuredAll.slice(0, 6);

export const newArrivalsAll = [...productsAll].sort((a, b) => b.createdAt - a.createdAt);
export const newArrivals = newArrivalsAll.slice(0, 6);

export const formatGNF = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " GNF";

export const getProduct = (id: string) => productsAll.find((p) => p.id === id);

export const relatedProducts = (p: Product, limit = 8) =>
  productsAll
    .filter(
      (x) =>
        x.id !== p.id &&
        x.category === p.category &&
        (x.subcategory === p.subcategory || x.brand === p.brand),
    )
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);

// Generate 4 image variants (gradients) per product for the gallery
export const productImages = (p: Product): string[] => {
  const def = catDefs.find((c) => c.id === p.category);
  const baseHue = def?.hue ?? 220;
  const seed = p.id.length;
  return [0, 25, -20, 60].map((off, i) =>
    img(baseHue + off + ((seed + i * 13) % 30) - 15),
  );
};

export interface SpecRow {
  label: string;
  value: string;
}

export const productSpecs = (p: Product): SpecRow[] => {
  const parts = p.specs.split("•").map((s) => s.trim()).filter(Boolean);
  const rows: SpecRow[] = [
    { label: "Marque", value: p.brand },
    { label: "Référence", value: p.id.toUpperCase() },
  ];
  // Heuristic mapping based on category
  const labelsByCat: Record<string, string[]> = {
    laptops: ["Processeur / GPU", "Mémoire RAM", "Stockage"],
    desktops: ["Configuration", "Mémoire RAM", "Stockage"],
    ecrans: ["Taille / Résolution", "Taux de rafraîchissement", "Dalle"],
    imprimantes: ["Vitesse", "Connectivité", "Fonctions"],
    composants: ["Caractéristique 1", "Caractéristique 2", "Caractéristique 3"],
    reseaux: ["Standard", "Ports / Antennes", "Couverture"],
    accessoires: ["Caractéristique 1", "Caractéristique 2", "Caractéristique 3"],
    telephones: ["Écran", "Mémoire", "Connectivité"],
  };
  const labels = labelsByCat[p.category] ?? ["Spécification 1", "Spécification 2", "Spécification 3"];
  parts.forEach((val, i) => rows.push({ label: labels[i] ?? `Détail ${i + 1}`, value: val }));
  
  rows.push({ label: "Disponibilité", value: p.stock > 0 ? `${p.stock} en stock` : "Rupture de stock" });
  return rows;
};

export interface Review {
  id: string;
  author: string;
  rating: number; // 1..5
  date: string;
  comment: string;
}

const reviewAuthors = ["Mamadou D.", "Fatoumata B.", "Ibrahima S.", "Aïssatou K.", "Ousmane C.", "Mariama T.", "Sékou B.", "Hadja D."];
const reviewComments = [
  "Excellent produit, livraison rapide à Conakry. Je recommande !",
  "Très bonne qualité, conforme à la description.",
  "Bon rapport qualité-prix. Service client réactif.",
  "Produit reçu en parfait état, emballage soigné.",
  "Performances au rendez-vous, je suis satisfait de mon achat.",
  "Livraison à Labé en 3 jours, parfait.",
  "Conforme à mes attentes, je rachèterai.",
];

export const productReviews = (p: Product): Review[] => {
  const seed = p.id.length + p.popularity;
  const n = 3 + (seed % 4);
  return Array.from({ length: n }, (_, i) => {
    const idx = (seed + i * 7) % reviewAuthors.length;
    const cIdx = (seed + i * 11) % reviewComments.length;
    const rating = 3 + ((seed + i * 3) % 3); // 3..5
    const daysAgo = ((seed + i * 17) % 60) + 1;
    return {
      id: `${p.id}-r-${i}`,
      author: reviewAuthors[idx],
      rating,
      date: `Il y a ${daysAgo} j`,
      comment: reviewComments[cIdx],
    };
  });
};

export const averageRating = (p: Product): { avg: number; count: number } => {
  const r = productReviews(p);
  if (!r.length) return { avg: 0, count: 0 };
  return { avg: r.reduce((a, x) => a + x.rating, 0) / r.length, count: r.length };
};

