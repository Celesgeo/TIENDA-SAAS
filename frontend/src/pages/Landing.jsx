import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Palette, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Button } from '../components/ui/Button.jsx';

export function Landing() {
  const { user, loading } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/40">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-soft">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Tienda SaaS
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!loading && user ? (
            <Link to="/dashboard">
              <Button>Ir al panel</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Iniciar sesión</Button>
              </Link>
              <Link to="/register">
                <Button>Crear cuenta</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" />
            Ropa y cosmética
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Tu marca merece una tienda tan limpia como{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Stripe
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 sm:text-xl">
            Multi-tenant, carrito, checkout con Mercado Pago y panel para gestionar pedidos.
            Publica en segundos con tu propia URL.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button className="!px-8 !py-3 text-base">
                Empezar gratis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" className="!px-8 !py-3 text-base">
                Ya tengo cuenta
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: 'Multi-tenant',
              text: 'Cada cliente tiene su tienda y datos aislados en MongoDB.',
            },
            {
              icon: Palette,
              title: 'Temas',
              text: 'Colores, fuentes y modo claro/oscuro desde el panel.',
            },
            {
              icon: Layers,
              title: 'Listo para vender',
              text: 'Productos con imágenes en Cloudinary y pagos con tarjeta.',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-slate-100 bg-white/80 p-6 shadow-soft backdrop-blur"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
