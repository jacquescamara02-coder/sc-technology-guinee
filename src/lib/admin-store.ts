import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { products as seedProducts, categories as seedCategories } from "./data";

export type ProductBadge = "Promo" | "Nouveau" | "Top";

export interface AdminProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  stock: number;
  sku: string;
  description: string;
  specs: { key: string; value: string }[];
  images: string[]; // data URLs, http URLs, or gradient strings
  active: boolean;
  featured?: boolean;
  isNew?: boolean;
  badge?: ProductBadge;
  popularity?: number;
  createdAt?: number;
  publishFacebook: boolean;
  facebookPostedAt?: string;
  facebookStatus?: "success" | "failed" | "pending";
}

export interface FacebookPost {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  caption: string;
  date: string;
  status: "success" | "failed" | "pending";
}

export interface AdminCategory {
  id: string;
  name: string;
  iconKey?: string; // see icon-map.ts
  subcategories: { id: string; name: string }[];
}

export interface DeliveryFee {
  city: string;
  fee: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  badge?: string; // ex: "Offre limitée"
  link?: string; // optional path like /vedette or /categories/laptops
  image?: string; // data URL or http URL
  hue?: number; // fallback gradient
  active: boolean;
}

export interface AdminSettings {
  storeName: string;
  appTagline: string;
  logo?: string; // data URL or http URL (overrides bundled asset)
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  deliveryFees: DeliveryFee[];
  freeShippingThreshold: number;
  vatRate: number; // 0..1
  facebookPageId: string;
  facebookToken: string;
  facebookAutoPublish: boolean;
  heroAutoplay: boolean;
  heroSlides: HeroSlide[];
}

interface AdminAuth {
  isAuthed: boolean;
  email: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const ADMIN_EMAIL = "admin@techshopgn.com";
const ADMIN_PASSWORD = "Admin2024!";

export const useAdminAuth = create<AdminAuth>()(
  persist(
    (set) => ({
      isAuthed: false,
      email: null,
      login: (email, password) => {
        if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          set({ isAuthed: true, email });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthed: false, email: null }),
    }),
    {
      name: "techshop-admin-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as never),
      ),
    },
  ),
);

interface AdminDataState {
  products: AdminProduct[];
  categories: AdminCategory[];
  settings: AdminSettings;
  facebookPosts: FacebookPost[];
  addProduct: (p: AdminProduct) => void;
  updateProduct: (id: string, patch: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;
  bulkUpdate: (ids: string[], patch: Partial<AdminProduct>) => void;
  bulkDelete: (ids: string[]) => void;
  addCategory: (name: string, iconKey?: string) => void;
  updateCategory: (id: string, patch: Partial<Pick<AdminCategory, "name" | "iconKey">>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (catId: string, name: string) => void;
  updateSubcategory: (catId: string, subId: string, name: string) => void;
  deleteSubcategory: (catId: string, subId: string) => void;
  updateSettings: (patch: Partial<AdminSettings>) => void;
  addHeroSlide: (slide: Omit<HeroSlide, "id">) => void;
  updateHeroSlide: (id: string, patch: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  moveHeroSlide: (id: string, dir: "up" | "down") => void;
  recordFacebookPost: (post: FacebookPost) => void;
  resetAll: () => void;
}

const seededProducts: AdminProduct[] = seedProducts.map((p) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  category: p.category,
  subcategory: p.subcategory,
  price: p.price,
  oldPrice: p.oldPrice,
  stock: p.stock,
  sku: p.id.toUpperCase(),
  description: `${p.name} — ${p.specs}. Produit disponible chez SC TECHNOLOGIE.`,
  specs: p.specs.split("•").map((s, i) => ({ key: `Spécification ${i + 1}`, value: s.trim() })),
  images: [p.image],
  active: true,
  badge: p.badge,
  popularity: p.popularity,
  createdAt: p.createdAt,
  publishFacebook: false,
}));

const seededCategories: AdminCategory[] = seedCategories.map((c) => ({
  id: c.id,
  name: c.name,
  iconKey: c.id, // reuse id as default key
  subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.name })),
}));

const defaultHeroSlides: HeroSlide[] = [
  { id: "hero-1", title: "Soldes Tech -30%", subtitle: "Sur tous les laptops MacBook & Dell", cta: "Voir l'offre", badge: "Offre limitée", link: "/vedette", hue: 260, active: true, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80&auto=format&fit=crop" },
  { id: "hero-2", title: "Nouveautés 2026", subtitle: "Découvrez les derniers écrans LG & Samsung", cta: "Explorer", badge: "Nouveau", link: "/nouveautes", hue: 220, active: true, image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&q=80&auto=format&fit=crop" },
  { id: "hero-3", title: "Livraison gratuite", subtitle: "À Conakry pour toute commande +5M GNF", cta: "En savoir plus", badge: "Avantage", link: "/categories", hue: 200, active: true, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=80&auto=format&fit=crop" },
];

const defaultSettings: AdminSettings = {
  storeName: "SC TECHNOLOGIE",
  appTagline: "Matériel informatique en Guinée",
  logo: undefined,
  contactEmail: "contact@sctechnology.gn",
  contactPhone: "+224 620-21-20-45",
  whatsapp: "+224 620-21-20-45",
  address: "Conakry, Guinée",
  facebookUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  deliveryFees: [
    { city: "Conakry", fee: 50_000 },
    { city: "Labé", fee: 150_000 },
    { city: "Kankan", fee: 180_000 },
    { city: "N'Zérékoré", fee: 200_000 },
    { city: "Kindia", fee: 100_000 },
    { city: "Faranah", fee: 170_000 },
    { city: "Mamou", fee: 130_000 },
    { city: "Siguiri", fee: 190_000 },
    { city: "Boké", fee: 140_000 },
    { city: "Coyah", fee: 80_000 },
  ],
  freeShippingThreshold: 5_000_000,
  vatRate: 0.18,
  facebookPageId: "",
  facebookToken: "",
  facebookAutoPublish: false,
  heroAutoplay: true,
  heroSlides: defaultHeroSlides,
};

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const useAdminData = create<AdminDataState>()(
  persist(
    (set) => ({
      products: seededProducts,
      categories: seededCategories,
      settings: defaultSettings,
      facebookPosts: [],

      addProduct: (p) =>
        set((s) => ({
          products: [
            { ...p, createdAt: p.createdAt ?? Date.now(), popularity: p.popularity ?? 50 },
            ...s.products,
          ],
        })),
      updateProduct: (id, patch) =>
        set((s) => ({
          products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      bulkUpdate: (ids, patch) =>
        set((s) => ({
          products: s.products.map((p) => (ids.includes(p.id) ? { ...p, ...patch } : p)),
        })),
      bulkDelete: (ids) =>
        set((s) => ({ products: s.products.filter((p) => !ids.includes(p.id)) })),

      addCategory: (name, iconKey) =>
        set((s) => ({
          categories: [
            ...s.categories,
            { id: slug(name) || `cat-${Date.now()}`, name, iconKey, subcategories: [] },
          ],
        })),
      updateCategory: (id, patch) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),
      addSubcategory: (catId, name) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === catId
              ? {
                  ...c,
                  subcategories: [
                    ...c.subcategories,
                    { id: slug(name) || `sub-${Date.now()}`, name },
                  ],
                }
              : c,
          ),
        })),
      updateSubcategory: (catId, subId, name) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === catId
              ? {
                  ...c,
                  subcategories: c.subcategories.map((sc) =>
                    sc.id === subId ? { ...sc, name } : sc,
                  ),
                }
              : c,
          ),
        })),
      deleteSubcategory: (catId, subId) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id === catId
              ? { ...c, subcategories: c.subcategories.filter((sc) => sc.id !== subId) }
              : c,
          ),
        })),

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),

      addHeroSlide: (slide) =>
        set((s) => ({
          settings: {
            ...s.settings,
            heroSlides: [
              ...s.settings.heroSlides,
              { ...slide, id: `hero-${Date.now().toString(36)}` },
            ],
          },
        })),
      updateHeroSlide: (id, patch) =>
        set((s) => ({
          settings: {
            ...s.settings,
            heroSlides: s.settings.heroSlides.map((h) =>
              h.id === id ? { ...h, ...patch } : h,
            ),
          },
        })),
      deleteHeroSlide: (id) =>
        set((s) => ({
          settings: {
            ...s.settings,
            heroSlides: s.settings.heroSlides.filter((h) => h.id !== id),
          },
        })),
      moveHeroSlide: (id, dir) =>
        set((s) => {
          const arr = [...s.settings.heroSlides];
          const idx = arr.findIndex((h) => h.id === id);
          if (idx < 0) return s;
          const target = dir === "up" ? idx - 1 : idx + 1;
          if (target < 0 || target >= arr.length) return s;
          [arr[idx], arr[target]] = [arr[target], arr[idx]];
          return { settings: { ...s.settings, heroSlides: arr } };
        }),

      recordFacebookPost: (post) =>
        set((s) => {
          const existingIdx = s.facebookPosts.findIndex((p) => p.productId === post.productId);
          let posts = s.facebookPosts;
          if (existingIdx >= 0) {
            posts = posts.map((p, i) => (i === existingIdx ? post : p));
          } else {
            posts = [post, ...posts];
          }
          posts = posts.slice(0, 50);
          return {
            facebookPosts: posts,
            products: s.products.map((p) =>
              p.id === post.productId
                ? { ...p, facebookPostedAt: post.date, facebookStatus: post.status }
                : p,
            ),
          };
        }),

      resetAll: () =>
        set({
          products: seededProducts,
          categories: seededCategories,
          settings: defaultSettings,
          facebookPosts: [],
        }),
    }),
    {
      name: "techshop-admin-data",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as never),
      ),
      version: 3,
      migrate: (persisted: unknown, version: number) => {
        const data = (persisted ?? {}) as Partial<AdminDataState>;
        if (version < 2) {
          data.settings = { ...defaultSettings, ...(data.settings ?? {}) };
        }
        if (version < 3) {
          // Ensure new fields exist
          data.settings = {
            ...defaultSettings,
            ...(data.settings ?? {}),
            heroSlides: data.settings?.heroSlides ?? defaultHeroSlides,
          };
          data.categories = (data.categories ?? seededCategories).map((c) => ({
            iconKey: c.id,
            ...c,
          }));
        }
        return data as AdminDataState;
      },
    },
  ),
);

export function generateProductId(): string {
  return `prod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
