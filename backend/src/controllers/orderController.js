import {
  orderListForStore,
  orderFindByIdAndStore,
  orderUpdateStatus,
} from '../db/repositories.js';

export async function listOrders(req, res) {
  const { status } = req.query;
  const orders = await orderListForStore(req.storeId, status);
  return res.json(orders);
}

export async function getOrder(req, res) {
  const order = await orderFindByIdAndStore(req.params.id, req.storeId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
}

export async function updateOrderStatus(req, res) {
  const { status } = req.body;
  const allowed = ['pending', 'paid', 'shipped', 'cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  const order = await orderUpdateStatus(req.params.id, req.storeId, status);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  return res.json(order);
}
