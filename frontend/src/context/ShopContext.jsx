import { createContext, useContext, useMemo } from 'react';
import { useCart } from '../hooks/useCart.js';

const ShopContext = createContext(null);

export function ShopProvider({ slug, children }) {
  const cart = useCart(slug);
  const value = useMemo(() => ({ ...cart, slug }), [cart, slug]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop outside ShopProvider');
  return ctx;
}
