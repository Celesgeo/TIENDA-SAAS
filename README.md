# TIENDA-SAAS

Plataforma multi-tenant para crear tiendas online (ropa y cosmética): panel de administración, tienda pública, carrito, checkout y **Mercado Pago**. Frontend en **React + Tailwind**, backend en **Node.js + Express + MongoDB**, imágenes con **Cloudinary**.

## Requisitos

- Node.js 18+
- MongoDB (local o [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Cuenta [Cloudinary](https://cloudinary.com/) (subida de imágenes)
- Cuenta [Mercado Pago](https://www.mercadopago.com.ar/developers) (pagos con tarjeta; opcional en desarrollo)

## Configuración

### Backend

```bash
cd backend
cp .env.example .env
# Editar MONGODB_URI, JWT_SECRET, CLOUDINARY_*, MERCADOPAGO_ACCESS_TOKEN, PUBLIC_API_URL, PUBLIC_APP_URL
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env   # opcional: VITE_API_URL para API en otro dominio
npm run dev
```

En desarrollo, Vite proxy `/api` → `http://localhost:5000` (ver `frontend/vite.config.js`).

## URLs importantes

| Ruta | Descripción |
|------|-------------|
| `/` | Landing del SaaS |
| `/login`, `/register` | Autenticación |
| `/dashboard` | Panel del comerciante (productos, pedidos, diseño, publicar) |
| `/shop/:slug` | Tienda pública (solo si la tienda está **publicada**) |

La URL pública queda como `https://tudominio.com/shop/mi-tienda`. En producción podés enrutar subdominios (`*.app.com`) al mismo frontend y resolver el tenant por `Host` o seguir usando el path `/shop/:slug`.

## Arquitectura multi-tenant

- Cada **usuario** tiene una **tienda** (`Store`) con `slug` único.
- **Productos** y **pedidos** referencian `store`; las rutas autenticadas filtran por `storeId` del JWT.
- La API pública solo expone datos de tiendas con `published: true`.

## Pagos

- **Mercado Pago**: checkout redirige a `init_point`; el webhook `/api/webhooks/mercadopago` marca el pedido como pagado y descuenta stock.
- **Efectivo / manual**: se crea el pedido en estado `pending` para gestión en el panel.

## Producción

- Servir el build de `frontend/dist` con tu CDN o estático.
- Variables `PUBLIC_APP_URL` y `PUBLIC_API_URL` deben ser las URLs públicas reales (redirects y webhooks de Mercado Pago).
- Configurar webhook en el panel de Mercado Pago apuntando a tu `PUBLIC_API_URL/api/webhooks/mercadopago`.
