import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { publicApi } from '../../api/client.js';
import { useShop } from '../../context/ShopContext.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Card } from '../../components/ui/Card.jsx';

export function Checkout() {
  const { slug } = useParams();
  const { theme } = useOutletContext();
  const { items, total, clear } = useShop();
  const nav = useNavigate();
  const dark = theme.effectiveDark;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!items.length) {
      toast.error('El carrito está vacío');
      return;
    }
    setBusy(true);
    try {
      const payload = {
        customerName: name,
        email,
        address,
        paymentMethod,
        items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
      };
      const data = await publicApi(`/api/public/stores/${slug}/checkout`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (data.initPoint) {
        clear();
        window.location.href = data.initPoint;
        return;
      }
      clear();
      toast.success('Pedido registrado');
      nav(`/shop/${slug}/checkout/return?status=success`);
    } catch (err) {
      toast.error(err.message || 'Error en el pago');
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <div className="py-12 text-center">
        <p className={dark ? 'text-slate-400' : 'text-slate-600'}>No hay productos para pagar.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto grid max-w-4xl grid-cols-1 gap-10 lg:grid-cols-5"
    >
      <div className={`space-y-4 lg:col-span-3 ${dark ? 'text-slate-100' : ''}`}>
        <h1 className="text-2xl font-bold">Checkout</h1>
        <Input label="Nombre completo" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">Dirección de envío</span>
          <textarea
            required
            className="min-h-[100px] w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <div>
          <p className="text-sm font-medium text-slate-700">Método de pago</p>
          <div className="mt-2 space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === 'mercadopago'}
                onChange={() => setPaymentMethod('mercadopago')}
              />
              <span>Tarjeta — Mercado Pago</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
              />
              <span>Efectivo / acordar con la tienda</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pay"
                checked={paymentMethod === 'manual'}
                onChange={() => setPaymentMethod('manual')}
              />
              <span>Transferencia manual</span>
            </label>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full !py-3 lg:hidden"
          disabled={busy}
          style={{ background: 'var(--shop-primary)' }}
        >
          {busy ? 'Procesando…' : 'Pagar'}
        </Button>
      </div>

      <Card
        dark={dark}
        className={`h-fit space-y-4 lg:col-span-2 ${dark ? '!border-slate-800' : ''}`}
      >
        <h2 className="text-lg font-semibold">Resumen</h2>
        <ul className="space-y-3 text-sm">
          {items.map((i) => (
            <li key={i._id} className="flex justify-between gap-2">
              <span>
                {i.name} × {i.quantity}
              </span>
              <span>${(i.price * i.quantity).toLocaleString('es-AR')}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold dark:border-slate-700">
          <span>Total</span>
          <span style={{ color: 'var(--shop-primary)' }}>${total.toLocaleString('es-AR')}</span>
        </div>
        <Button
          type="submit"
          className="hidden w-full !py-3 lg:inline-flex"
          disabled={busy}
          style={{ background: 'var(--shop-primary)' }}
        >
          {busy ? 'Procesando…' : 'Pagar'}
        </Button>
      </Card>
    </form>
  );
}
