import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

/* ================= TYPES ================= */

export type CartItem = {
  id: string; name: string; weight: string; price: number; img: any; icon: string; qty: number;
};

export type FavItem = {
  id: string; name: string; weight: string; price: number; icon: string;
};

export type Order = {
  id: string; date: string; items: CartItem[]; total: number; discount: number; status: "success" | "failed";
};

export type FilterState = { cats: string[]; brands: string[] };

export type Notif = {
  id: string; icon: string; title: string; body: string; time: string; read: boolean;
};

export type Review = {
  id: string; productId: string; author: string; stars: number; comment: string; date: string;
};

export type Role = "admin" | "user";

export type PromoCode = {
  code: string;
  percent: number;
  label: string;
  minOrder: number;
};

/* ================= CONSTANTS ================= */

const KEYS = {
  items: "cart_items",
  favs: "cart_favs",
  orders: "cart_orders",
  notifs: "notifs",
  reviews: "reviews",
};

export const PROMOS: PromoCode[] = [
  { code: 'FRESH10',   percent: 10, label: '10% off all items',         minOrder: 0  },
  { code: 'VEGGIE20',  percent: 20, label: '20% off orders $20+',       minOrder: 20 },
  { code: 'NEWUSER30', percent: 30, label: '30% off your first order',   minOrder: 0  },
  { code: 'BIGBUY15',  percent: 15, label: '15% off orders $50+',        minOrder: 50 },
];

/* ================= CONTEXT TYPE ================= */

type CartContextType = {
  items: CartItem[];
  total: number;
  count: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;

  favs: FavItem[];
  toggleFav: (item: FavItem) => void;
  isFav: (id: string) => boolean;

  orders: Order[];
  createOrder: (status: "success" | "failed") => void;

  promos: PromoCode[];
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  discount: number;
  finalTotal: number;

  notifs: Notif[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;

  filter: FilterState;
  setFilter: (f: FilterState) => void;

  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "date">) => void;
  getReviews: (productId: string) => Review[];

  role: Role;
  setRole: (r: Role) => void;
};

const CartContext = createContext<CartContextType | null>(null);

/* ================= PROVIDER ================= */

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<FavItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<FilterState>({ cats: [], brands: [] });
  const [role, setRole] = useState<Role>("user");
  const [loaded, setLoaded] = useState(false);

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    (async () => {
      try {
        const [i, f, o, n, r] = await Promise.all([
          AsyncStorage.getItem(KEYS.items),
          AsyncStorage.getItem(KEYS.favs),
          AsyncStorage.getItem(KEYS.orders),
          AsyncStorage.getItem(KEYS.notifs),
          AsyncStorage.getItem(KEYS.reviews),
        ]);
        if (i) setItems(JSON.parse(i));
        if (f) setFavs(JSON.parse(f));
        if (o) setOrders(JSON.parse(o));
        if (n) setNotifs(JSON.parse(n));
        if (r) setReviews(JSON.parse(r));
      } catch (e) {
        console.warn("Load error:", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  /* ===== SAVE DATA ===== */
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.multiSet([
      [KEYS.items, JSON.stringify(items)],
      [KEYS.favs, JSON.stringify(favs)],
      [KEYS.orders, JSON.stringify(orders)],
      [KEYS.notifs, JSON.stringify(notifs)],
      [KEYS.reviews, JSON.stringify(reviews)],
    ]);
  }, [items, favs, orders, notifs, reviews, loaded]);

  /* ===== CALC ===== */
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const unreadCount = notifs.filter(n => !n.read).length;
  const discount = appliedPromo ? Math.min(total * appliedPromo.percent / 100, total) : 0;
  const finalTotal = total - discount;

  /* ===== CART ===== */
  const addItem = (item: Omit<CartItem, "qty">, qty = 1) => {
    setItems(prev => {
      const exist = prev.find(i => i.id === item.id);
      return exist
        ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { ...item, qty }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setItems([]);

  /* ===== ORDER ===== */
  const createOrder = (status: "success" | "failed") => {
    if (!items.length) return;
    const order: Order = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      items,
      discount,
      total: finalTotal, // lấy giá sau discount
      status,
    };
    setOrders(prev => [order, ...prev]);
    if (status === "success") {
      setItems([]);
      setAppliedPromo(null); // clear promo sau khi order
    }
  };

  /* ===== FAV ===== */
  const toggleFav = (item: FavItem) => {
    setFavs(prev =>
      prev.some(f => f.id === item.id)
        ? prev.filter(f => f.id !== item.id)
        : [...prev, item]
    );
  };

  const isFav = (id: string) => favs.some(f => f.id === id);

  /* ===== PROMO ===== */
  const applyPromo = (code: string): boolean => {
    const promo = PROMOS.find(p => p.code === code.toUpperCase());
    if (!promo) return false;
    if (total < promo.minOrder) return false;
    setAppliedPromo(promo);
    return true;
  };

  const removePromo = () => setAppliedPromo(null);

  /* ===== NOTIF ===== */
  const markRead = (id: string) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));

  const markAllRead = () =>
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));

  /* ===== REVIEW ===== */
  const addReview = (r: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...r,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("vi-VN"),
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const getReviews = (productId: string) =>
    reviews.filter(r => r.productId === productId);

  return (
    <CartContext.Provider
      value={{
        items, total, count,
        addItem, updateQty, removeItem, clearCart,
        favs, toggleFav, isFav,
        orders, createOrder,
        promos: PROMOS, appliedPromo, applyPromo, removePromo, discount, finalTotal,
        notifs, unreadCount, markRead, markAllRead,
        filter, setFilter,
        reviews, addReview, getReviews,
        role, setRole,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
