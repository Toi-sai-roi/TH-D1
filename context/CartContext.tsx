import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  weight: string;
  price: number;
  img: any;
  icon: string;
  qty: number;
};

export type FavItem = {
  id: string;
  name: string;
  weight: string;
  price: number;
  icon: string;
};

export type Order = {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
};

export type FilterState = {
  cats: string[];
  brands: string[];
};

export type Notif = {
  id: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type Review = {
  id: string;
  productId: string;
  author: string;
  stars: number;
  comment: string;
  date: string;
};

export type Role = "admin" | "user";
const FAKE_NOTIFS: Notif[] = [
  {
    id: "1",
    icon: "🛵",
    title: "Order on the way!",
    body: "Your order #a1b2c is out for delivery.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    icon: "✅",
    title: "Order delivered",
    body: "Order #9f3e1 has been delivered. Enjoy!",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "3",
    icon: "🎉",
    title: "New promo available",
    body: "Get 20% off on all fruits this weekend!",
    time: "3 hr ago",
    read: false,
  },
  {
    id: "4",
    icon: "💳",
    title: "Payment confirmed",
    body: "Payment of $24.50 was successful.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    icon: "🔔",
    title: "Flash sale starts now",
    body: "Beverages up to 30% off — today only!",
    time: "Yesterday",
    read: true,
  },
  {
    id: "6",
    icon: "📦",
    title: "Order processing",
    body: "Your order #7c4d2 is being prepared.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "7",
    icon: "❤️",
    title: "Item back in stock",
    body: "Natural Red Apple is available again!",
    time: "3 days ago",
    read: true,
  },
];

const FAKE_REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "1",
    author: "Minh",
    stars: 5,
    comment: "Tươi ngon, giao nhanh!",
    date: "01/04/2025",
  },
  {
    id: "r2",
    productId: "1",
    author: "Lan",
    stars: 4,
    comment: "Chất lượng ổn, sẽ mua lại.",
    date: "28/03/2025",
  },
  {
    id: "r3",
    productId: "2",
    author: "Hùng",
    stars: 3,
    comment: "Bình thường thôi.",
    date: "25/03/2025",
  },
];

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  favs: FavItem[];
  toggleFav: (item: FavItem) => void;
  isFav: (id: string) => boolean;
  orders: Order[];
  placeOrder: () => void;
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

const KEYS = {
  items: "cart_items",
  favs: "cart_favs",
  orders: "cart_orders",
  notifs: "notifs",
  reviews: "reviews",
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<FavItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifs, setNotifs] = useState<Notif[]>(FAKE_NOTIFS);
  const [filter, setFilter] = useState<FilterState>({ cats: [], brands: [] });
  const [reviews, setReviews] = useState<Review[]>(FAKE_REVIEWS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [role, setRole] = useState<Role>("user");

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
        console.warn("AsyncStorage load error:", e);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoaded) AsyncStorage.setItem(KEYS.items, JSON.stringify(items));
  }, [items, isLoaded]);
  useEffect(() => {
    if (isLoaded) AsyncStorage.setItem(KEYS.favs, JSON.stringify(favs));
  }, [favs, isLoaded]);
  useEffect(() => {
    if (isLoaded) AsyncStorage.setItem(KEYS.orders, JSON.stringify(orders));
  }, [orders, isLoaded]);
  useEffect(() => {
    if (isLoaded) AsyncStorage.setItem(KEYS.notifs, JSON.stringify(notifs));
  }, [notifs, isLoaded]);
  useEffect(() => {
    if (isLoaded) AsyncStorage.setItem(KEYS.reviews, JSON.stringify(reviews));
  }, [reviews, isLoaded]);

  const addItem = (item: Omit<CartItem, "qty">, qty: number = 1) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists)
        return prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + qty } : i,
        );
      return [...prev, { ...item, qty }];
    });
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const clearCart = () => setItems([]);

  const placeOrder = () => {
    if (items.length === 0) return;
    const order: Order = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("vi-VN"),
      items: [...items],
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    };
    setOrders((prev) => [order, ...prev]);
    clearCart();
  };

  const toggleFav = (item: FavItem) => {
    setFavs((prev) =>
      prev.find((f) => f.id === item.id)
        ? prev.filter((f) => f.id !== item.id)
        : [...prev, item],
    );
  };

  const isFav = (id: string) => favs.some((f) => f.id === id);

  const markRead = (id: string) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const addReview = (r: Omit<Review, "id" | "date">) => {
    const newReview: Review = {
      ...r,
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("vi-VN"),
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const getReviews = (productId: string) =>
    reviews.filter((r) => r.productId === productId);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        total,
        count,
        favs,
        toggleFav,
        isFav,
        orders,
        placeOrder,
        notifs,
        unreadCount,
        markRead,
        markAllRead,
        filter,
        setFilter,
        reviews,
        addReview,
        getReviews,
        role,
        setRole,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
