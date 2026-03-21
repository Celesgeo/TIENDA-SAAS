import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { api } from '../../api/client.js';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';

export function DashboardHome() {
  const { store } = useAuth();
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [products, orders] = await Promise.all([
          api('/api/products'),
          api('/api/orders'),
        ]);
        if (!cancelled) {
          setStats({ products: products.length, orders: orders.length });
        }
      } catch {
        if (!cancelled) setStats({ products: 0, orders: 0 });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const url = `${window.location.origin}/shop/${store.slug}`;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hola, {store.name}</h1>
        <p className="mt-1 text-slate-600">
          Panel de tu tienda. Publica y comparte tu enlace cuando estés listo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Productos</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.products}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-500 opacity-80" />
          </div>
          <Link to="/dashboard/products" className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600">
            Gestionar
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pedidos</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.orders}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-sky-500 opacity-80" />
          </div>
          <Link to="/dashboard/orders" className="mt-4 inline-flex items-center text-sm font-semibold text-indigo-600">
            Ver pedidos
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Card>
      </div>

      <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white">
        <p className="text-sm font-semibold text-indigo-900">URL pública</p>
        <p className="mt-2 break-all font-mono text-sm text-slate-700">{url}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a href={url} target="_blank" rel="noreferrer">
            <Button>Abrir tienda</Button>
          </a>
          <Link to="/dashboard/store">
            <Button variant="secondary">Publicar y diseño</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
