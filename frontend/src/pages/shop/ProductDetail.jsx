import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { publicApi } from '../../api/client.js';
import { useShop } from '../../context/ShopContext.jsx';
import { Button } from '../../components/ui/Button.jsx';

export function ProductDetail() {
  const { slug, id } = useParams();
  const { theme } = useOutletContext();
  const { addItem } = useShop();
  const nav = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await publicApi(`/api/public/stores/${slug}/products/${id}`);
        if (!cancelled) setProduct(data);
      } catch {
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug, id]);

  const dark = theme.effectiveDark;

  if (loading) {
    return <p className={dark ? 'text-slate-400' : 'text-slate-500'}>Cargando…</p>;
  }
  if (!product) {
    return <p className="text-slate-500">Producto no encontrado.</p>;
  }

  function handleAdd() {
    addItem(product, qty);
    toast.success('Agregado al carrito');
  }

  return (
    <div className="animate-slide-up">
      <button
        type="button"
        onClick={() => nav(-1)}
        className={`mb-6 inline-flex items-center gap-2 text-sm font-medium ${
          dark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div
            className={`aspect-square overflow-hidden rounded-2xl border ${
              dark ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
            }`}
          >
            {product.images?.[0] ? (
              <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400">Sin imagen</div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.slice(1).map((u) => (
                <img key={u} src={u} alt="" className="h-20 w-20 rounded-lg object-cover" />
              ))}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">{product.category}</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="mt-4 text-3xl font-bold" style={{ color: 'var(--shop-primary)' }}>
            ${product.price.toLocaleString('es-AR')}
          </p>
          <p className={`mt-6 leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
            {product.description || 'Sin descripción.'}
          </p>
          <p className="mt-4 text-sm text-slate-500">Stock: {product.stock}</p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-xl border border-slate-200">
              <button
                type="button"
                className="px-4 py-2 text-lg"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="min-w-[2rem] text-center font-semibold">{qty}</span>
              <button
                type="button"
                className="px-4 py-2 text-lg"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                +
              </button>
            </div>
            <Button
              className="!px-8 !py-3"
              onClick={handleAdd}
              style={{ background: 'var(--shop-primary)' }}
            >
              Agregar al carrito
            </Button>
            <Link to={`/shop/${slug}/cart`}>
              <Button variant="secondary">Ver carrito</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
