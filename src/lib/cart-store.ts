import { create } from "zustand";
import type { Product } from "./data";

interface CartItem {
  product: Product;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (p: Product) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (p) =>
    set((s) => {
      const existing = s.items.find((i) => i.product.id === p.id);
      if (existing) {
        return {
          items: s.items.map((i) =>
            i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { items: [...s.items, { product: p, qty: 1 }] };
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
  setQty: (id, qty) =>
    set((s) => ({
      items: qty <= 0
        ? s.items.filter((i) => i.product.id !== id)
        : s.items.map((i) => (i.product.id === id ? { ...i, qty } : i)),
    })),
  clear: () => set({ items: [] }),
  count: () => get().items.reduce((acc, i) => acc + i.qty, 0),
  total: () => get().items.reduce((acc, i) => acc + i.qty * i.product.price, 0),
}));
