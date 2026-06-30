import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// ---------- Auth ----------
type AuthState = { phone: string | null };
type AuthCtx = AuthState & {
  login: (phone: string) => void;
  logout: () => void;
};
const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setPhone(localStorage.getItem("oceanix.phone"));
  }, []);
  const login = (p: string) => {
    localStorage.setItem("oceanix.phone", p);
    setPhone(p);
  };
  const logout = () => {
    localStorage.removeItem("oceanix.phone");
    setPhone(null);
  };
  return <AuthContext.Provider value={{ phone, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth outside provider");
  return c;
};

// ---------- Cart ----------
export type CartItem = { id: string; qty: number };
type CartCtx = {
  items: CartItem[];
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
};
const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("oceanix.cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("oceanix.cart", JSON.stringify(items));
  }, [items, hydrated]);

  const add = (id: string) =>
    setItems((arr) => {
      const f = arr.find((i) => i.id === id);
      if (f) return arr.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      return [...arr, { id, qty: 1 }];
    });
  const remove = (id: string) => setItems((arr) => arr.filter((i) => i.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((arr) =>
      qty <= 0 ? arr.filter((i) => i.id !== id) : arr.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, count }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside provider");
  return c;
};

// ---------- Orders ----------
export type Order = {
  id: string;
  createdAt: number;
  items: { id: string; qty: number; name: string; price: number }[];
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  address: string;
  payment: "cod" | "online";
  status: "placed" | "out-for-delivery" | "delivered";
};
const ORDERS_KEY = "oceanix.orders";
export const getOrders = (): Order[] => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
};
export const saveOrder = (o: Order) => {
  const all = getOrders();
  all.unshift(o);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
};
