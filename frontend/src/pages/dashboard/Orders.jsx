import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../api/client.js';
import { Card } from '../../components/ui/Card.jsx';

const statuses = [
  { id: 'pending', label: 'Pendiente' },
  { id: 'paid', label: 'Pagado' },
  { id: 'shipped', label: 'Enviado' },
  { id: 'cancelled', label: 'Cancelado' },
];

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await api('/api/orders');
      setOrders(data);
    } catch {
      toast.error('No se pudieron cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    try {
      await api(`/api/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      toast.success('Estado actualizado');
      load();
    } catch {
      toast.error('Error al actualizar');
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
        <p className="text-slate-600">Gestiona el estado de cada venta.</p>
      </div>

      {loading ? (
        <p className="text-slate-500">Cargando…</p>
      ) : orders.length === 0 ? (
        <Card>
          <p className="text-slate-600">Aún no hay pedidos.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Card key={o._id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{o.customerName}</p>
                  <p className="text-xs text-slate-500">{o.email}</p>
                  <p className="mt-2 text-sm text-slate-600">{o.address}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(o.createdAt).toLocaleString('es-AR')} · Pago: {o.paymentMethod}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">
                    ${o.total.toLocaleString('es-AR')}
                  </p>
                  <select
                    className="mt-2 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                    value={o.status}
                    onChange={(e) => setStatus(o._id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                {o.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between text-slate-700">
                    <span>
                      {it.name} × {it.quantity}
                    </span>
                    <span>${(it.price * it.quantity).toLocaleString('es-AR')}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
