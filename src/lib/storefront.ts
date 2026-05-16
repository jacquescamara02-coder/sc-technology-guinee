import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { useAdminData, type AdminProduct, type AdminCategory } from "@/lib/admin-store";
import { getIcon } from "@/lib/icon-map";
import type { Product, Category, SubCategory } from "@/lib/data";

// ============================================================
// Convert AdminProduct -> public Product
// ============================================================
function hueFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 360;
}

function gradientFor(seed: string): string {
  const hue = hueFromString(seed);
  return `linear-gradient(135deg, oklch(0.42 0.18 ${hue}), oklch(0.28 0.10 ${hue + 30}))`;
}

export function adaptProduct(p: AdminProduct): Product {
  const firstImg = p.images[0];
  const image =
    firstImg && (firstImg.startsWith("data:") || firstImg.startsWith("http"))
      ? `url(${firstImg})`
      : firstImg && firstImg.startsWith("linear-gradient")
        ? firstImg
        : gradientFor(p.id);
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    oldPrice: p.oldPrice,
    category: p.category,
    subcategory: p.subcategory,
    stock: p.stock,
    specs: p.specs.map((s) => s.value).filter(Boolean).join(" • ") || p.description.slice(0, 60),
    popularity: p.popularity ?? 50,
    createdAt: p.createdAt ?? Date.now(),
    badge: p.badge,
    image,
  };
}

export function adaptCategory(
  c: AdminCategory,
  productCount: number,
): Category & { iconKey?: string } {
  const Icon: LucideIcon = getIcon(c.iconKey ?? c.id);
  return {
    id: c.id,
    name: c.name,
    icon: Icon,
    count: productCount,
    subcategories: c.subcategories as SubCategory[],
    iconKey: c.iconKey,
  };
}

// ============================================================
// Hooks
// ============================================================
export function useStorefrontProducts(): Product[] {
  const products = useAdminData((s) => s.products);
  return useMemo(
    () => products.filter((p) => p.active).map(adaptProduct),
    [products],
  );
}

export function useAllAdminProducts(): AdminProduct[] {
  return useAdminData((s) => s.products);
}

export function useStorefrontCategories(): (Category & { iconKey?: string })[] {
  const categories = useAdminData((s) => s.categories);
  const products = useAdminData((s) => s.products);
  return useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      if (!p.active) continue;
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return categories.map((c) => adaptCategory(c, counts.get(c.id) ?? 0));
  }, [categories, products]);
}

export function useStorefrontCategory(id: string) {
  const cats = useStorefrontCategories();
  return cats.find((c) => c.id === id);
}

export function useStorefrontSubcategory(catId: string, subId: string) {
  const cat = useStorefrontCategory(catId);
  return cat?.subcategories.find((s) => s.id === subId);
}

export function useProductsBySub(catId: string, subId: string): Product[] {
  const products = useStorefrontProducts();
  return useMemo(
    () => products.filter((p) => p.category === catId && p.subcategory === subId),
    [products, catId, subId],
  );
}

export function useStorefrontProduct(id: string): Product | undefined {
  const products = useStorefrontProducts();
  return useMemo(() => products.find((p) => p.id === id), [products, id]);
}

export function useFeaturedProducts(): Product[] {
  const products = useStorefrontProducts();
  const raw = useAdminData((s) => s.products);
  return useMemo(() => {
    const manualIds = new Set(raw.filter((p) => p.featured).map((p) => p.id));
    const manual = products.filter((p) => manualIds.has(p.id));
    if (manual.length > 0) return manual;
    return [...products].sort((a, b) => b.popularity - a.popularity);
  }, [products, raw]);
}

export function useNewArrivalProducts(): Product[] {
  const products = useStorefrontProducts();
  const raw = useAdminData((s) => s.products);
  return useMemo(() => {
    const manualIds = new Set(raw.filter((p) => p.isNew).map((p) => p.id));
    const manual = products.filter((p) => manualIds.has(p.id));
    if (manual.length > 0) return manual;
    return [...products].sort((a, b) => b.createdAt - a.createdAt);
  }, [products, raw]);
}

export function useRelatedProducts(p: Product, limit = 8): Product[] {
  const products = useStorefrontProducts();
  return useMemo(() => {
    return products
      .filter(
        (x) =>
          x.id !== p.id &&
          x.category === p.category &&
          (x.subcategory === p.subcategory || x.brand === p.brand),
      )
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  }, [products, p.id, p.category, p.subcategory, p.brand, limit]);
}
