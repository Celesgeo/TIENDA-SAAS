import { Link, useOutletContext, useParams } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useShop } from '../../context/ShopContext.jsx';
import { Button } from '../../components/ui/Button.jsx';

export function CartPage() {
  const { slug } = useParams();
  const { theme } = useOutletContext();
  const { items, updateQty, removeItem, total } = useShop();
  const dark = theme.effectiveDark;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className={dark ? 'text-slate-400' : 'text-slate-600'}>Tu carrito está vacío.</p>
        <Link to={`/shop/${slug}`} className="mt-4 inline-block font-semibold text-indigo-600">
          Seguir comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Carrito</h1>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item._id}
            className={`flex gap-4 rounded-2xl border p-4 ${
              dark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-white'
            }`}
          >
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              {item.image ? (
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-500">${item.price.toLocaleString('es-AR')} c/u</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-lg border border-slate-200">
                  <button
                    type="button"
                    className="px-3 py-1"
                    onClick={() => updateQty(item._id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    type="button"
                    className="px-3 py-1"
                    onClick={() => updateQty(item._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-rose-500 hover:text-rose-600"
                  onClick={() => removeItem(item._id)}
                  aria-label="Eliminar"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="text-right font-semibold">
              ${(item.price * item.quantity).toLocaleString('es-AR')}
            </div>
          </li>
        ))}
      </ul>
      <div
        className={`flex items-center justify-between rounded-2xl border p-6 ${
          dark ? 'border-slate-800' : 'border-slate-100 bg-white'
        }`}
      >
        <span className="text-lg font-semibold">Total</span>
        <span className="text-2xl font-bold" style={{ color: 'var(--shop-primary)' }}>
          ${total.toLocaleString('es-AR')}
        </span>
      </div>
      <Link to={`/shop/${slug}/checkout`} className="block">
        <Button className="w-full !py-4 text-base" style={{ background: 'var(--shop-primary)' }}>
          Ir al checkout
        </Button>
      </Link>
    </div>
  );
}
