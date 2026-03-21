import { Order } from '../models/Order.js';

export async function listOrders(req, res) {
  const { status } = req.query;
  const filter = { store: req.storeId };
  if (status) filter.status = status;
  const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(200);
  return res.json(orders);
}

export async function getOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, store: req.storeId });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const allowed = ['pending', 'paid', 'shipped', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const order = await Order.findOneAndUpdate(
    { _id: req.params.id, store: req.storeId },
    { $set: { status } },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
}
