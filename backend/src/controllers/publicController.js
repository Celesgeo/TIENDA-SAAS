import {
  storeFindBySlug,
  productPublicList,
  productFindActiveByIdAndStore,
} from '../db/repositories.js';

export async function getPublicStore(req, res) {
  const { slug } = req.params;
  const store = await storeFindBySlug(slug);
  if (!store) return res.status(404).json({ error: 'Store not found' });
  if (!store.published) {
    return res.status(403).json({ error: 'Store is not published' });
  }
  return res.json(store);
}

export async function listPublicProducts(req, res) {
  const { slug } = req.params;
  const { category, q } = req.query;
  const store = await storeFindBySlug(slug);
  if (!store) return res.status(404).json({ error: 'Store not found' });
  if (!store.published) return res.status(403).json({ error: 'Store is not published' });

  const products = await productPublicList(store._id, { category, q });
  return res.json(products);
}

export async function getPublicProduct(req, res) {
  const { slug, id } = req.params;
  const store = await storeFindBySlug(slug);
  if (!store) return res.status(404).json({ error: 'Store not found' });
  if (!store.published) return res.status(403).json({ error: 'Store is not published' });

  const product = await productFindActiveByIdAndStore(id, store._id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
}
