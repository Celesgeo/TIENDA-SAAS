import { useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { publicApi } from '../../api/client.js';
import { useShop } from '../../context/ShopContext.jsx';
import { Button } from '../../components/ui/Button.jsx';

export function ShopHome() {
  const { slug } = useParams();
  const { store, theme } = useOutletContext();
  const { addItem } = useShop();
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await publicApi(`/api/public/stores/${slug}/products`);
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const filtered =
    filter === 'all' ? products : products.filter((p) => p.category === filter);

  const layout = theme.layout || 'grid';
  const dark = theme.effectiveDark;

  const gridClass =
    layout === 'minimal'
      ? 'grid gap-8 sm:grid-cols-2'
      : layout === 'magazine'
        ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{store.name}</h1>
        <p className={`mt-3 text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
          Descubrí nuestra selección
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['all', 'clothing', 'cosmetics'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? 'text-white shadow-soft'
                  : dark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50'
              }`}
              style={filter === f ? { background: 'var(--shop-primary)' } : undefined}
            >
              {f === 'all' ? 'Todo' : f === 'clothing' ? 'Ropa' : 'Cosmética'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className={`text-center ${dark ? 'text-slate-500' : 'text-slate-500'}`}>Cargando…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-500">No hay productos por ahora.</p>
      ) : (
        <div className={gridClass}>
          {filtered.map((p, i) => (
            <motion.article
              key={p._id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`group overflow-hidden rounded-2xl border shadow-soft ${
                dark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-white'
              } ${layout === 'magazine' && i === 0 ? 'sm:col-span-2 sm:row-span-1 lg:col-span-2' : ''}`}
            >
              <Link to={`/shop/${slug}/product/${p._id}`} className="block">
                <div
                  className={`relative overflow-hidden bg-slate-100 ${
                    layout === 'minimal' ? 'aspect-[3/4]' : 'aspect-square'
                  }`}
                >
                  {p.images?.[0] ? (
                    <img
                      src={p.images[0]}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">Sin foto</div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">{p.category}</p>
                <Link to={`/shop/${slug}/product/${p._id}`}>
                  <h2 className="mt-1 text-lg font-semibold">{p.name}</h2>
                </Link>
                <p className="mt-2 text-xl font-bold" style={{ color: 'var(--shop-primary)' }}>
                  ${p.price.toLocaleString('es-AR')}
                </p>
                <Button
                  className="mt-4 w-full"
                  type="button"
                  onClick={() => addItem(p, 1)}
                  style={{ background: 'var(--shop-primary)' }}
                >
                  Agregar al carrito
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}
