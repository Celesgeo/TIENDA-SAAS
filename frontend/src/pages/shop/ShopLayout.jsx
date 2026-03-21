import { useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Sun, Moon } from 'lucide-react';
import { publicApi } from '../../api/client.js';
import { ShopProvider } from '../../context/ShopContext.jsx';
import { ShareBar } from '../../components/ShareBar.jsx';

const fontClass = {
  Inter: 'font-sans',
  'DM Sans': 'font-dm',
  'Playfair Display': 'font-playfair',
  'Space Grotesk': 'font-space',
};

export function ShopLayout() {
  const { slug } = useParams();
  const [store, setStore] = useState(null);
  const [error, setError] = useState(null);
  const [localDark, setLocalDark] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await publicApi(`/api/public/stores/${slug}`);
        if (!cancelled) {
          setStore(data);
          setLocalDark(!!data.theme?.darkMode);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Tienda no disponible');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const theme = store?.theme || {};
  const effectiveDark = localDark ?? !!theme.darkMode;

  const style = useMemo(
    () => ({
      '--shop-primary': theme.primaryColor || '#6366f1',
      '--shop-accent': theme.accentColor || '#0ea5e9',
      '--shop-bg': theme.backgroundColor || '#fafafa',
    }),
    [theme]
  );

  const font = fontClass[theme.fontFamily] || 'font-sans';

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-center text-slate-600">{error}</p>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/shop/${slug}`;

  return (
    <ShopProvider slug={slug}>
      <div
        style={style}
        className={`min-h-screen transition-colors ${font} ${
          effectiveDark ? 'bg-slate-950 text-slate-100' : 'bg-[var(--shop-bg)] text-slate-900'
        }`}
      >
        <header
          className={`sticky top-0 z-40 border-b backdrop-blur-md ${
            effectiveDark
              ? 'border-slate-800 bg-slate-950/80'
              : 'border-slate-200/80 bg-white/80'
          }`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <Link to={`/shop/${slug}`} className="flex items-center gap-3">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt="" className="h-10 w-10 rounded-xl object-cover" />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                  style={{ background: 'var(--shop-primary)' }}
                >
                  {store.name.slice(0, 1)}
                </div>
              )}
              <span className="text-lg font-semibold tracking-tight">{store.name}</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setLocalDark(!effectiveDark)}
                className={`rounded-xl p-2 ${
                  effectiveDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                }`}
                aria-label="Toggle theme"
              >
                {effectiveDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link
                to={`/shop/${slug}/cart`}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-soft"
                style={{ background: 'var(--shop-primary)' }}
              >
                <ShoppingBag className="h-4 w-4" />
                Carrito
              </Link>
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto max-w-6xl px-4 py-8 sm:px-6"
        >
          <Outlet context={{ store, theme: { ...theme, effectiveDark } }} />
        </motion.main>

        <footer
          className={`border-t py-10 ${
            effectiveDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-white/60'
          }`}
        >
          <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
            <ShareBar url={publicUrl} title={store.name} />
            <p className="text-center text-xs text-slate-500">
              Creado con Tienda SaaS · {store.customDomain || slug}
            </p>
          </div>
        </footer>
      </div>
    </ShopProvider>
  );
}
