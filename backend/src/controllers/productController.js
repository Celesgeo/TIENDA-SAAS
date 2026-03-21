import { Product } from '../models/Product.js';

export async function listProducts(req, res) {
  const { category, q } = req.query;
  const filter = { store: req.storeId };
  if (category) filter.category = category;
  if (q) {
    filter.name = { $regex: q, $options: 'i' };
  }
  const products = await Product.find(filter).sort({ createdAt: -1 });
  return res.json(products);
}

export async function createProduct(req, res) {
  const { name, description, price, images, category, stock, active } = req.body;
  if (!name || price == null || !category) {
    return res.status(400).json({ error: 'name, price, and category are required' });
  }
  const product = await Product.create({
    store: req.storeId,
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
  const product = await Product.findOne({ _id: req.params.id, store: req.storeId });
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

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, store: req.storeId },
    { $set: updates },
    { new: true }
  );
  if (!product) return res.status(404).json({ error: 'Product not found' });
  return res.json(product);
}

export async function deleteProduct(req, res) {
  const result = await Product.deleteOne({ _id: req.params.id, store: req.storeId });
  if (!result.deletedCount) return res.status(404).json({ error: 'Product not found' });
  return res.status(204).send();
}
