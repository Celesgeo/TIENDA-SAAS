import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Store } from '../models/Store.js';
import { signToken } from '../utils/jwt.js';
import { uniqueSlug } from '../utils/slug.js';

export async function register(req, res) {
  const { email, password, name, storeName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    email,
    passwordHash,
    name: name || '',
  });

  const baseName = storeName || `${name || 'Mi'} tienda`;
  const slug = await uniqueSlug(baseName, async (s) => {
    const found = await Store.findOne({ slug: s });
    return !!found;
  });

  const store = await Store.create({
    owner: user._id,
    name: baseName,
    slug,
  });

  const token = signToken({ sub: user._id.toString(), storeId: store._id.toString() });
  return res.status(201).json({
    token,
    user: { ...user.toJSON(), storeId: store._id.toString() },
    store,
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const store = await Store.findOne({ owner: user._id });
  if (!store) {
    return res.status(500).json({ error: 'User has no store' });
  }
  const token = signToken({ sub: user._id.toString(), storeId: store._id.toString() });
  return res.json({
    token,
    user: { ...user.toJSON(), storeId: store._id.toString() },
    store,
  });
}

export async function me(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const store = await Store.findById(req.storeId);
  return res.json({ user: { ...user.toJSON(), storeId: store._id.toString() }, store });
}
