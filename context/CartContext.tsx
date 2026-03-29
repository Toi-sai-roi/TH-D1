import { createContext, useContext, useState, ReactNode } from 'react';

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

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
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
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<FavItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addItem = (item: Omit<CartItem, 'qty'>, qty: number = 1) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...item, qty }];
    });
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev
      .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
      .filter(i => i.qty > 0)
    );
  };

  const clearCart = () => setItems([]);

  const placeOrder = () => {
    if (items.length === 0) return;
    const order: Order = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('vi-VN'),
      items: [...items],
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    };
    setOrders(prev => [order, ...prev]);
    clearCart();
  };

  const toggleFav = (item: FavItem) => {
    setFavs(prev => prev.find(f => f.id === item.id)
      ? prev.filter(f => f.id !== item.id)
      : [...prev, item]
    );
  };

  const isFav = (id: string) => favs.some(f => f.id === id);

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, favs, toggleFav, isFav, orders, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}