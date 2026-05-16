import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { products as seedProducts, categories as seedCategories } from "./data";

export interface AdminProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  sku: string;
  description: string;
  specs: { key: string; value: string }[];
  images: string[]; // data URLs or gradient strings
  active: boolean;
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
  subcategories: { id: string; name: string }[];
}

export interface DeliveryFee {
  city: string;
  fee: number;
}

export interface AdminSettings {
  storeName: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  deliveryFees: DeliveryFee[];
  facebookPageId: string;
  facebookToken: string;
  facebookAutoPublish: boolean;
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
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (catId: string, name: string) => void;
  updateSubcategory: (catId: string, subId: string, name: string) => void;
  deleteSubcategory: (catId: string, subId: string) => void;
  updateSettings: (patch: Partial<AdminSettings>) => void;
  recordFacebookPost: (post: FacebookPost) => void;
}

const seededProducts: AdminProduct[] = seedProducts.map((p) => ({
  id: p.id,
  name: p.name,
  brand: p.brand,
  category: p.category,
  subcategory: p.subcategory,
  price: p.price,
  stock: p.stock,
  sku: p.id.toUpperCase(),
  description: `${p.name} — ${p.specs}. Produit disponible chez TechShop GN.`,
  specs: p.specs.split("•").map((s, i) => ({ key: `Spécification ${i + 1}`, value: s.trim() })),
  images: [p.image],
  active: true,
  publishFacebook: false,
}));

const seededCategories: AdminCategory[] = seedCategories.map((c) => ({
  id: c.id,
  name: c.name,
  subcategories: c.subcategories.map((s) => ({ id: s.id, name: s.name })),
}));

const defaultSettings: AdminSettings = {
  storeName: "TechShop GN",
  contactEmail: "contact@techshopgn.com",
  contactPhone: "+224 620 00 00 00",
  whatsapp: "+224 620 00 00 00",
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
  facebookPageId: "",
  facebookToken: "",
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

      addProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
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

      addCategory: (name) =>
        set((s) => ({
          categories: [...s.categories, { id: slug(name) || `cat-${Date.now()}`, name, subcategories: [] }],
        })),
      updateCategory: (id, name) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)) })),
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
    }),
    {
      name: "techshop-admin-data",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as never),
      ),
      version: 1,
    },
  ),
);

export function generateProductId(): string {
  return `prod-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
