import { verifyToken } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = header.slice(7);
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.sub;
    req.storeId = decoded.storeId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
