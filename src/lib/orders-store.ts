import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface DeliveryInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  notes: string;
}

export type PaymentMethod = "orange_money" | "card";

export type OrderStatus =
  | "received"
  | "preparing"
  | "shipped"
  | "delivering"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  image: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: number;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tva: number;
  total: number;
  delivery: DeliveryInfo;
  payment: { method: PaymentMethod; label: string; masked?: string };
}

interface State {
  delivery: DeliveryInfo | null;
  orders: Order[];
  setDelivery: (d: DeliveryInfo) => void;
  addOrder: (o: Order) => void;
  cancelOrder: (id: string) => void;
}

export const useOrders = create<State>()(
  persist(
    (set) => ({
      delivery: null,
      orders: [],
      setDelivery: (d) => set({ delivery: d }),
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      cancelOrder: (id) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, status: "cancelled" } : o,
          ),
        })),
    }),
    {
      name: "techshop-orders",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as never),
      ),
    },
  ),
);

export function generateOrderId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CMD-GN-${num}`;
}

export const STATUS_FLOW: OrderStatus[] = [
  "received",
  "preparing",
  "shipped",
  "delivering",
  "delivered",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  received: "Commande reçue",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivering: "En livraison",
  delivered: "Livrée",
  cancelled: "Annulée",
};

export function estimatedDelivery(city: string): string {
  if (city === "Conakry") return "24 à 48 heures";
  return "3 à 7 jours ouvrables";
}

export function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}
