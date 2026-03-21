import { Store } from '../models/Store.js';
import { uniqueSlug } from '../utils/slug.js';

export async function getMyStore(req, res) {
  const store = await Store.findById(req.storeId);
  return res.json(store);
}

export async function updateMyStore(req, res) {
  const allowed = [
    'name',
    'logoUrl',
    'customDomain',
    'theme',
  ];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }
  if (req.body.slug !== undefined && req.body.slug) {
    const s = req.body.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (s.length < 2) {
      return res.status(400).json({ error: 'Slug must be at least 2 characters' });
    }
    const taken = await Store.findOne({ slug: s, _id: { $ne: req.storeId } });
    if (taken) return res.status(409).json({ error: 'That URL is already taken' });
    updates.slug = s;
  }

  const store = await Store.findByIdAndUpdate(req.storeId, { $set: updates }, { new: true });
  return res.json(store);
}

export async function publishStore(req, res) {
  const store = await Store.findByIdAndUpdate(
    req.storeId,
    { $set: { published: true, publishedAt: new Date() } },
    { new: true }
  );
  return res.json(store);
}

export async function unpublishStore(req, res) {
  const store = await Store.findByIdAndUpdate(
    req.storeId,
    { $set: { published: false } },
    { new: true }
  );
  return res.json(store);
}

export async function suggestSlug(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'name query required' });
  const slug = await uniqueSlug(name, async (s) => {
    const found = await Store.findOne({ slug: s, _id: { $ne: req.storeId } });
    return !!found;
  });
  return res.json({ slug });
}
