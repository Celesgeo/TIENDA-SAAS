import {
  productListForStore,
  productCreate,
  productFindByIdAndStore,
  productUpdate,
  productDelete,
} from '../db/repositories.js';

export async function listProducts(req, res) {
  const { category, q } = req.query;
  const products = await productListForStore(req.storeId, { category, q });
  return res.json(products);
}

export async function createProduct(req, res) {
  const { name, description, price, images, category, stock, active } = req.body;
  if (!name || price == null || !category) {
    return res.status(400).json({ error: 'name, price, and category are required' });
  }
  const product = await productCreate(req.storeId, {
    name,
    description: description || '',
    price: Number(price),
    images: Array.isArray(images) ? images : [],
    category,
    stock: stock != null ? Number(stock) : 0,
    active: active !== false,
  });
  return res.status(201).json(product);
}

export async function getProduct(req, res) {
  const product = await productFindByIdAndStore(req.params.id, req.storeId);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
}

export async function updateProduct(req, res) {
  const allowed = ['name', 'description', 'price', 'images', 'category', 'stock', 'active'];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (updates.price != null) updates.price = Number(updates.price);
  if (updates.stock != null) updates.stock = Number(updates.stock);

  const product = await productUpdate(req.params.id, req.storeId, updates);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
}

export async function deleteProduct(req, res) {
  const ok = await productDelete(req.params.id, req.storeId);
  if (!ok) return res.status(404).json({ error: 'Product not found' });
  return res.status(204).send();
}
