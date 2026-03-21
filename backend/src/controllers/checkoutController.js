import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import mongoose from 'mongoose';
import { Store } from '../models/Store.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

function getMpClient() {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) return null;
  return new MercadoPagoConfig({ accessToken: token });
}

export async function createCheckout(req, res) {
  const { slug } = req.params;
  const {
    items,
    customerName,
    email,
    address,
    paymentMethod = 'mercadopago',
  } = req.body;

  if (!items?.length || !customerName || !email || !address) {
    return res.status(400).json({ error: 'items, customerName, email, and address are required' });
  }

  const store = await Store.findOne({ slug });
  if (!store) return res.status(404).json({ error: 'Store not found' });
  if (!store.published) return res.status(403).json({ error: 'Store is not published' });

  const lineItems = [];
  let total = 0;

  for (const line of items) {
    const { productId, quantity } = line;
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ error: 'Each item needs productId and quantity' });
    }
    const product = await Product.findOne({
      _id: productId,
      store: store._id,
      active: true,
    });
    if (!product) {
      return res.status(400).json({ error: `Product ${productId} not available` });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
    }
    const sub = product.price * quantity;
    total += sub;
    lineItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images?.[0] || '',
    });
  }

  const order = await Order.create({
    store: store._id,
    customerName,
    email,
    address,
    items: lineItems,
    total,
    status: paymentMethod === 'mercadopago' ? 'pending' : 'pending',
    paymentMethod:
      paymentMethod === 'cash' ? 'cash' : paymentMethod === 'manual' ? 'manual' : 'mercadopago',
  });

  if (paymentMethod === 'cash' || paymentMethod === 'manual') {
    return res.json({
      orderId: order._id,
      redirect: null,
      message: 'Order created. Pay according to instructions from the store.',
    });
  }

  const mp = getMpClient();
  if (!mp) {
    await Order.deleteOne({ _id: order._id });
    return res.status(503).json({
      error: 'Mercado Pago is not configured on the server',
    });
  }

  const publicApp = process.env.PUBLIC_APP_URL || 'http://localhost:5173';
  const publicApi = process.env.PUBLIC_API_URL || 'http://localhost:5000';

  const preference = new Preference(mp);
  const body = {
    items: lineItems.map((li) => ({
      id: li.product.toString(),
      title: li.name,
      quantity: li.quantity,
      unit_price: li.price,
      currency_id: process.env.MERCADOPAGO_CURRENCY_ID || 'ARS',
    })),
    external_reference: order._id.toString(),
    back_urls: {
      success: `${publicApp}/shop/${slug}/checkout/return?status=success`,
      failure: `${publicApp}/shop/${slug}/checkout/return?status=failure`,
      pending: `${publicApp}/shop/${slug}/checkout/return?status=pending`,
    },
    auto_return: 'approved',
    notification_url: `${publicApi}/api/webhooks/mercadopago`,
    metadata: {
      order_id: order._id.toString(),
      store_slug: slug,
    },
  };

  try {
    const result = await preference.create({ body });
    await Order.findByIdAndUpdate(order._id, {
      $set: { mercadoPagoPreferenceId: result.id },
    });
    return res.json({
      orderId: order._id,
      initPoint: result.init_point,
      preferenceId: result.id,
    });
  } catch (e) {
    console.error(e);
    await Order.deleteOne({ _id: order._id });
    return res.status(502).json({ error: 'Payment provider error', detail: e.message });
  }
}

export async function mercadoPagoWebhook(req, res) {
  res.status(200).send('OK');

  try {
    let id =
      req.query.id ||
      req.query['data.id'] ||
      req.body?.data?.id ||
      req.body?.id;
    if (id != null && typeof id === 'object' && id?.toString) id = String(id);
    if (id == null || id === '') return;

    const mp = getMpClient();
    if (!mp) return;
    const paymentApi = new Payment(mp);
    const pay = await paymentApi.get({ id: String(id) });
    const ref = pay.external_reference;
    if (!ref || !mongoose.Types.ObjectId.isValid(ref)) return;
    const order = await Order.findById(ref);
    if (!order) return;
    if (pay.status === 'approved' && order.status === 'pending') {
      await Order.findByIdAndUpdate(order._id, {
        $set: {
          status: 'paid',
          mercadoPagoPaymentId: String(pay.id),
        },
      });
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }
    }
  } catch (e) {
    console.error('MP webhook error', e);
  }
}

