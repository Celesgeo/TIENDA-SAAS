import bcrypt from 'bcryptjs';
import {
  userFindByEmail,
  userFindById,
  registerUserWithStore,
  storeFindByOwner,
  storeFindById,
} from '../db/repositories.js';
import { signToken } from '../utils/jwt.js';

function userResponse(user) {
  return {
    _id: user._id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function register(req, res) {
  const { email, password, name, storeName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    const { user, store } = await registerUserWithStore({
      email,
      passwordHash,
      name,
      storeName,
    });
    const token = signToken({ sub: user._id, storeId: store._id });
    return res.status(201).json({
      token,
      user: { ...user, storeId: store._id },
      store,
    });
  } catch (e) {
    if (e.code === '23505') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    throw e;
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await userFindByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const store = await storeFindByOwner(user._id);
  if (!store) {
    return res.status(500).json({ error: 'User has no store' });
  }
  const token = signToken({ sub: user._id, storeId: store._id });
  return res.json({
    token,
    user: { ...userResponse(user), storeId: store._id },
    store,
  });
}

export async function me(req, res) {
  const user = await userFindById(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const store = await storeFindById(req.storeId);
  if (!store) return res.status(404).json({ error: 'Store not found' });
  return res.json({
    user: { ...userResponse(user), storeId: store._id },
    store,
  });
}
