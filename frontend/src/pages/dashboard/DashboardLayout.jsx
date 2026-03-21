import { NavLink, Outlet, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Button } from '../../components/ui/Button.jsx';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-50 text-indigo-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export function DashboardLayout() {
  const { user, store, loading, logout } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }
  if (!user || !store) return <Navigate to="/login" replace />;

  const publicUrl = `${window.location.origin}/shop/${store.slug}`;

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-4 py-5 lg:flex-col lg:items-stretch">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tu tienda
            </p>
            <p className="mt-1 truncate font-semibold text-slate-900">{store.name}</p>
          </div>
          <a href={publicUrl} target="_blank" rel="noreferrer" className="hidden lg:block">
            <Button variant="secondary" className="w-full !justify-start">
              <ExternalLink className="h-4 w-4" />
              Ver tienda
            </Button>
          </a>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 lg:flex-col lg:px-3 lg:pb-8">
          <NavLink to="/dashboard" end className={linkClass}>
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            Resumen
          </NavLink>
          <NavLink to="/dashboard/products" className={linkClass}>
            <Package className="h-4 w-4 shrink-0" />
            Productos
          </NavLink>
          <NavLink to="/dashboard/orders" className={linkClass}>
            <ShoppingBag className="h-4 w-4 shrink-0" />
            Pedidos
          </NavLink>
          <NavLink to="/dashboard/store" className={linkClass}>
            <Store className="h-4 w-4 shrink-0" />
            Diseño y publicación
          </NavLink>
        </nav>
        <div className="hidden border-t border-slate-100 p-3 lg:block">
          <p className="truncate px-2 text-xs text-slate-500">{user.email}</p>
          <Button
            variant="ghost"
            className="mt-2 w-full !justify-start text-slate-600"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
          <span className="font-semibold text-slate-900">{store.name}</span>
          <a href={publicUrl} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="!py-2">
              Ver tienda
            </Button>
          </a>
        </header>
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
