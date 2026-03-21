import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { Landing } from './pages/Landing.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { DashboardLayout } from './pages/dashboard/DashboardLayout.jsx';
import { DashboardHome } from './pages/dashboard/DashboardHome.jsx';
import { Products } from './pages/dashboard/Products.jsx';
import { Orders } from './pages/dashboard/Orders.jsx';
import { StoreSettings } from './pages/dashboard/StoreSettings.jsx';
import { ShopLayout } from './pages/shop/ShopLayout.jsx';
import { ShopHome } from './pages/shop/ShopHome.jsx';
import { ProductDetail } from './pages/shop/ProductDetail.jsx';
import { CartPage } from './pages/shop/CartPage.jsx';
import { Checkout } from './pages/shop/Checkout.jsx';
import { CheckoutReturn } from './pages/shop/CheckoutReturn.jsx';

function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/login"
        element={
          <GuestOnly>
            <Login />
          </GuestOnly>
        }
      />
      <Route
        path="/register"
        element={
          <GuestOnly>
            <Register />
          </GuestOnly>
        }
      />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="store" element={<StoreSettings />} />
      </Route>
      <Route path="/shop/:slug" element={<ShopLayout />}>
        <Route index element={<ShopHome />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="checkout/return" element={<CheckoutReturn />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
