// Carrito de pedido → un solo mensaje de WhatsApp con todos los productos.
// Persistido en localStorage (zustand/persist) para sobrevivir recargas.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">) => void;
  setQuantity: (itemId: string, quantity: number) => void;
  remove: (itemId: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.itemId === item.itemId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.itemId === item.itemId ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      setQuantity: (itemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.itemId !== itemId)
              : state.items.map((i) => (i.itemId === itemId ? { ...i, quantity } : i)),
        })),
      remove: (itemId) =>
        set((state) => ({ items: state.items.filter((i) => i.itemId !== itemId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "pura-esencia-pedido" }
  )
);
