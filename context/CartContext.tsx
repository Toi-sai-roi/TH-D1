import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { dataKeys, DEFAULT_NOTIFS, loadAllOrders } from "../services/StorageService";

/* ================= TYPES ================= */
export type CartItem = {
  id: string; name: string; weight: string; price: number; img: any; icon: string; qty: number;
};
export type FavItem = {
  id: string; name: string; weight: string; price: number; icon: string;
};
export type Order = {
  id: string; date: string; items: CartItem[]; total: number; discount: number; status: "success" | "failed"; address?: Address | null;
};
export type Address = {
  id: string; label: string; detail: string; 
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
  code: string; percent: number; label: string; minOrder: number;
};

/* ================= CONSTANTS ================= */
export const PROMOS: PromoCode[] = [
  { code: 'FRESH10',   percent: 10, label: '10% off all items',        minOrder: 0  },
  { code: 'VEGGIE20',  percent: 20, label: '20% off orders $20+',      minOrder: 20 },
  { code: 'NEWUSER30', percent: 30, label: '30% off your first order',  minOrder: 0  },
  { code: 'BIGBUY15',  percent: 15, label: '15% off orders $50+',      minOrder: 50 },
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

  addresses: Address[];
  addAddress: (a: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  selectedAddress: Address | null;
  selectAddress: (a: Address) => void;

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

  allOrders: Order[];

  filter: FilterState;
  setFilter: (f: FilterState) => void;

  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "date">) => void;
  getReviews: (productId: string) => Review[];

  role: Role;
  setRole: (r: Role) => void;

  loadUserData: (email: string, userRole?: Role) => Promise<void>;
  clearUserData: () => void;
  currentEmail: string | null;
};

const CartContext = createContext<CartContextType | null>(null);

/* ================= PROVIDER ================= */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems]               = useState<CartItem[]>([]);
  const [favs, setFavs]                 = useState<FavItem[]>([]);
  const [orders, setOrders]             = useState<Order[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [notifs, setNotifs]             = useState<Notif[]>([]);
  const [reviews, setReviews]           = useState<Review[]>([]);
  const [filter, setFilter]             = useState<FilterState>({ cats: [], brands: [] });
  const [role, setRole]                 = useState<Role>("user");
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [allOrders, setAllOrders]       = useState<Order[]>([]);
  const [loaded, setLoaded]             = useState(false);
  const [addresses, setAddresses]       = useState<Address[]>([]);
  const [selectedAddress, 
    setSelectedAddress]                 = useState<Address | null>(null);

  // dùng ref để biết đang là role gì mà không trigger re-render
  const roleRef = useRef<Role>("user");
  const emailRef = useRef<string | null>(null);
  /* ===== LOAD DATA THEO EMAIL ===== */
  const loadUserData = async (email: string, userRole?: Role) => {
    try {
      const keys = dataKeys(email);
      const [i, f, o, n, r, a] = await Promise.all([
        AsyncStorage.getItem(keys.items),
        AsyncStorage.getItem(keys.favs),
        AsyncStorage.getItem(keys.orders),
        AsyncStorage.getItem(keys.notifs),
        AsyncStorage.getItem(keys.reviews),
        AsyncStorage.getItem(keys.addresses),
      ]);
      setItems(i ? JSON.parse(i) : []);
      setFavs(f ? JSON.parse(f) : []);
      setOrders(o ? JSON.parse(o) : []);
      const parsedNotifs = n ? JSON.parse(n) : [];
      setNotifs(parsedNotifs.length > 0 ? parsedNotifs : [...DEFAULT_NOTIFS]);      setReviews(r ? JSON.parse(r) : []);
      setCurrentEmail(email);
      emailRef.current = email;
      setAddresses(a ? JSON.parse(a) : []);

      const effectiveRole = userRole ?? roleRef.current;
      roleRef.current = effectiveRole;

      if (effectiveRole === "admin") {
        const all = await loadAllOrders();
        setAllOrders(all);
      }
    } catch {
      console.warn("loadUserData error");
    } finally {
      setLoaded(true);
    }
  };

  /* ===== CLEAR KHI LOGOUT ===== */
  const clearUserData = () => {
    setItems([]);
    setFavs([]);
    setOrders([]);
    setNotifs([]);  
    setReviews([]);
    setAllOrders([]);
    setAppliedPromo(null);
    setCurrentEmail(null);
    roleRef.current = "user";
    emailRef.current = null;
    setLoaded(false);
    setAddresses([]);
    setSelectedAddress(null);
  };

  /* ===== SAVE — tách riêng từng key để tránh đơ ===== */
  useEffect(() => {
  if (!loaded || !emailRef.current) return;
  const keys = dataKeys(emailRef.current);
  AsyncStorage.multiSet([
    [keys.items,   JSON.stringify(items)],
    [keys.favs,    JSON.stringify(favs)],
    [keys.orders,  JSON.stringify(orders)],
    [keys.notifs,  JSON.stringify(notifs)],
    [keys.reviews, JSON.stringify(reviews)],
    [keys.addresses, JSON.stringify(addresses)],
  ]).then(() => {
    if (roleRef.current === "admin") {
      loadAllOrders().then(setAllOrders);
    }
  });
}, [items, favs, orders, notifs, reviews, loaded, currentEmail, addresses]);

  /* ===== CALC ===== */
  const total       = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count       = items.reduce((s, i) => s + i.qty, 0);
  const unreadCount = notifs.filter(n => !n.read).length;
  const discount    = appliedPromo ? Math.min(total * appliedPromo.percent / 100, total) : 0;
  const finalTotal  = total - discount;

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
      prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  };
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const clearCart = () => {
    setItems([]);
    if (emailRef.current) {
      AsyncStorage.setItem(dataKeys(emailRef.current).items, JSON.stringify([]));
    }
  };

  /* ===== ORDER ===== */
  const createOrder = (status: "success" | "failed") => {
    if (!items.length) return;
    const order: Order = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      items,
      discount,
      total: finalTotal,
      status,
      address: selectedAddress ?? null, // ← thêm
    };
    setOrders(prev => [order, ...prev]);
    if (status === "success") {
      setItems([]);
      setAppliedPromo(null);
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

  /* ===== ADDRESS ===== */
  const addAddress = (a: Omit<Address, 'id'>) => {
    const newAddr = { ...a, id: Date.now().toString() };
    setAddresses(prev => [...prev, newAddr]);
    if (!selectedAddress) setSelectedAddress(newAddr);
  };
  const removeAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (selectedAddress?.id === id) setSelectedAddress(null);
  };
  const selectAddress = (a: Address) => setSelectedAddress(a);
  
  /* ===== PROMO ===== */
  const applyPromo = (code: string): boolean => {
    const promo = PROMOS.find(p => p.code === code.toUpperCase());
    if (!promo || total < promo.minOrder) return false;
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
    setReviews(prev => [{
      ...r,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("vi-VN"),
    }, ...prev]);
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
        allOrders,
        filter, setFilter,
        reviews, addReview, getReviews,
        role, setRole,
        loadUserData, clearUserData, currentEmail,
        addresses, addAddress, removeAddress, selectedAddress, selectAddress,
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