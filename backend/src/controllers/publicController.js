import { Store } from '../models/Store.js';
import { Product } from '../models/Product.js';

export async function getPublicStore(req, res) {
  const { slug } = req.params;
  const store = await Store.findOne({ slug }).lean();
  if (!store) return res.status(404).json({ error: 'Store not found' });
  if (!store.published) {
    return res.status(403).json({ error: 'Store is not published' });
  }
  return res.json(store);
}

export async function listPublicProducts(req, res) {
  const { slug } = req.params;
  const { category, q } = req.query;
  const store = await Store.findOne({ slug }).select('_id published');
  if (!store) return res.status(404).json({ error: 'Store not found' });
  if (!store.published) return res.status(403).json({ error: 'Store is not published' });

  const filter = { store: store._id, active: true };
  if (category) filter.category = category;
  if (q) filter.name = { $regex: q, $options: 'i' };

  const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
  return res.json(products);
}

export async function getPublicProduct(req, res) {
  const { slug, id } = req.params;
  const store = await Store.findOne({ slug }).select('_id published');
  if (!store) return res.status(404).json({ error: 'Store not found' });
  if (!store.published) return res.status(403).json({ error: 'Store is not published' });

  const product = await Product.findOne({
    _id: id,
    store: store._id,
    active: true,
  }).lean();
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
}
