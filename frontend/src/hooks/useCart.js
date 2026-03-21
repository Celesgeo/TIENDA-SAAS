import { useCallback, useEffect, useMemo, useState } from 'react';

function key(slug) {
  return `cart:${slug}`;
}

export function useCart(slug) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!slug) return;
    try {
      const raw = localStorage.getItem(key(slug));
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, [slug]);

  const persist = useCallback(
    (next) => {
      if (!slug) return;
      localStorage.setItem(key(slug), JSON.stringify(next));
      setItems(next);
    },
    [slug]
  );

  const addItem = useCallback(
    (product, qty = 1) => {
      setItems((prev) => {
        const i = prev.findIndex((p) => p._id === product._id);
        let next;
        if (i >= 0) {
          next = [...prev];
          next[i] = {
            ...next[i],
            quantity: Math.min(
              next[i].quantity + qty,
              product.stock ?? 999
            ),
          };
        } else {
          next = [
            ...prev,
            {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || '',
              quantity: Math.min(qty, product.stock ?? 999),
              stock: product.stock,
            },
          ];
        }
        if (slug) localStorage.setItem(key(slug), JSON.stringify(next));
        return next;
      });
    },
    [slug]
  );

  const updateQty = useCallback(
    (productId, quantity) => {
      setItems((prev) => {
        const next = prev
          .map((p) =>
            p._id === productId
              ? { ...p, quantity: Math.max(1, Math.min(quantity, p.stock ?? 999)) }
              : p
          )
          .filter((p) => p.quantity > 0);
        if (slug) localStorage.setItem(key(slug), JSON.stringify(next));
        return next;
      });
    },
    [slug]
  );

  const removeItem = useCallback(
    (productId) => {
      setItems((prev) => {
        const next = prev.filter((p) => p._id !== productId);
        if (slug) localStorage.setItem(key(slug), JSON.stringify(next));
        return next;
      });
    },
    [slug]
  );

  const clear = useCallback(() => {
    if (slug) localStorage.removeItem(key(slug));
    setItems([]);
  }, [slug]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return useMemo(
    () => ({ items, addItem, updateQty, removeItem, clear, total, persist }),
    [items, addItem, updateQty, removeItem, clear, total, persist]
  );
}
