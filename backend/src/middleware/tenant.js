import { storeFindById } from '../db/repositories.js';

export async function loadStore(req, res, next) {
  try {
    const store = await storeFindById(req.storeId);
    if (!store || String(store.owner) !== String(req.userId)) {
      return res.status(403).json({ error: 'Store access denied' });
    }
    req.store = store;
    next();
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load store' });
  }
}
