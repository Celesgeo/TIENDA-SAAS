import { Store } from '../models/Store.js';

export async function loadStore(req, res, next) {
  try {
    const store = await Store.findById(req.storeId).lean();
    if (!store || store.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Store access denied' });
    }
    req.store = store;
    next();
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load store' });
  }
}
