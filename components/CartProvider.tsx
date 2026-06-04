'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const CART_KEY = 'solitude-ink-cart-v2';

export interface CartItem {
  id:    string;
  title: string;
  qty:   number;
  price: number;
  no:    number;
}

interface CartCtx {
  items:   CartItem[];
  count:   number;
  total:   number;
  add:     (id: string, title: string, price: number, no: number, qty?: number) => void;
  update:  (id: string, qty: number) => void;
  remove:  (id: string) => void;
  clear:   () => void;
}

const Ctx = createContext<CartCtx>({
  items: [], count: 0, total: 0,
  add: () => {}, update: () => {}, remove: () => {}, clear: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('cart:changed', { detail: next }));
  };

  const add = useCallback((id: string, title: string, price: number, no: number, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      const next = existing
        ? prev.map((i) => i.id === id ? { ...i, qty: Math.min(i.qty + qty, 2) } : i)
        : [...prev, { id, title, qty: Math.min(qty, 2), price, no }];
      localStorage.setItem(CART_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const update = useCallback((id: string, qty: number) => {
    if (qty < 1) { remove(id); return; }
    persist(items.map((i) => i.id === id ? { ...i, qty: Math.min(qty, 2) } : i));
  }, [items]);

  const remove = useCallback((id: string) => {
    persist(items.filter((i) => i.id !== id));
  }, [items]);

  const clear = useCallback(() => persist([]), []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, count, total, add, update, remove, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
