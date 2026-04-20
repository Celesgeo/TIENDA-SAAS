import { getPool } from '../config/db.js';
import { uniqueSlug } from '../utils/slug.js';

const defaultTheme = {
  primaryColor: '#6366f1',
  accentColor: '#0ea5e9',
  backgroundColor: '#fafafa',
  fontFamily: 'Inter',
  layout: 'grid',
  darkMode: false,
};

function mapUserPublic(row) {
  if (!row) return null;
  return {
    _id: row.id,
    email: row.email,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapUserWithSecret(row) {
  if (!row) return null;
  return {
    _id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapStore(row) {
  if (!row) return null;
  const rawTheme = row.theme && typeof row.theme === 'object' ? row.theme : {};
  const theme = { ...defaultTheme, ...rawTheme };
  return {
    _id: row.id,
    owner: row.owner_id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url ?? '',
    customDomain: row.custom_domain ?? '',
    theme,
    published: row.published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProduct(row) {
  if (!row) return null;
  return {
    _id: row.id,
    store: row.store_id,
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price),
    images: Array.isArray(row.images) ? row.images : [],
    category: row.category,
    stock: row.stock,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOrder(row) {
  if (!row) return null;
  const items = Array.isArray(row.items) ? row.items : [];
  return {
    _id: row.id,
    store: row.store_id,
    customerName: row.customer_name,
    email: row.email,
    address: row.address,
    items,
    total: Number(row.total),
    status: row.status,
    paymentMethod: row.payment_method,
    mercadoPagoPreferenceId: row.mercadopago_preference_id ?? '',
    mercadoPagoPaymentId: row.mercadopago_payment_id ?? '',
    notes: row.notes ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function isUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
}

export async function userFindByEmail(email) {
  const { rows } = await getPool().query('SELECT * FROM users WHERE email = $1', [
    email.toLowerCase(),
  ]);
  return mapUserWithSecret(rows[0]);
}

export async function userFindById(id) {
  const { rows } = await getPool().query('SELECT * FROM users WHERE id = $1', [id]);
  return mapUserWithSecret(rows[0]);
}

export async function registerUserWithStore({ email, passwordHash, name, storeName }) {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: userRows } = await client.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [email.toLowerCase().trim(), passwordHash, (name || '').trim()]
    );
    const u = userRows[0];
    const baseName = (storeName || `${name || 'Mi'} tienda`).trim() || 'Mi tienda';
    const slug = await uniqueSlug(baseName, async (s) => {
      const r = await client.query('SELECT 1 FROM stores WHERE slug = $1', [s]);
      return r.rows.length > 0;
    });
    const { rows: storeRows } = await client.query(
      `INSERT INTO stores (owner_id, name, slug) VALUES ($1, $2, $3) RETURNING *`,
      [u.id, baseName, slug]
    );
    await client.query('COMMIT');
    return { user: mapUserPublic(u), store: mapStore(storeRows[0]) };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function storeFindById(id) {
  const { rows } = await getPool().query('SELECT * FROM stores WHERE id = $1', [id]);
  return mapStore(rows[0]);
}

export async function storeFindByOwner(userId) {
  const { rows } = await getPool().query('SELECT * FROM stores WHERE owner_id = $1', [
    userId,
  ]);
  return mapStore(rows[0]);
}

export async function storeFindBySlug(slug) {
  const { rows } = await getPool().query('SELECT * FROM stores WHERE slug = $1', [slug]);
  return mapStore(rows[0]);
}

export async function storeSlugTakenByOther(slug, excludeStoreId) {
  const { rows } = await getPool().query(
    'SELECT id FROM stores WHERE slug = $1 AND id <> $2::uuid',
    [slug, excludeStoreId]
  );
  return rows.length > 0;
}

export async function storeSlugExists(slug) {
  const { rows } = await getPool().query('SELECT 1 FROM stores WHERE slug = $1', [slug]);
  return rows.length > 0;
}

export async function storeUpdate(storeId, patch) {
  const sets = [];
  const vals = [];
  let i = 1;
  if (patch.name !== undefined) {
    sets.push(`name = $${i++}`);
    vals.push(patch.name);
  }
  if (patch.slug !== undefined) {
    sets.push(`slug = $${i++}`);
    vals.push(patch.slug);
  }
  if (patch.logoUrl !== undefined) {
    sets.push(`logo_url = $${i++}`);
    vals.push(patch.logoUrl);
  }
  if (patch.customDomain !== undefined) {
    sets.push(`custom_domain = $${i++}`);
    vals.push(patch.customDomain);
  }
  if (patch.theme !== undefined) {
    sets.push(`theme = $${i++}::jsonb`);
    vals.push(JSON.stringify(patch.theme));
  }
  if (sets.length === 0) {
    return storeFindById(storeId);
  }
  sets.push(`updated_at = now()`);
  vals.push(storeId);
  const { rows } = await getPool().query(
    `UPDATE stores SET ${sets.join(', ')} WHERE id = $${i}::uuid RETURNING *`,
    vals
  );
  return mapStore(rows[0]);
}

export async function storePublish(storeId) {
  const { rows } = await getPool().query(
    `UPDATE stores
     SET published = true, published_at = now(), updated_at = now()
     WHERE id = $1::uuid
     RETURNING *`,
    [storeId]
  );
  return mapStore(rows[0]);
}

export async function storeUnpublish(storeId) {
  const { rows } = await getPool().query(
    `UPDATE stores SET published = false, updated_at = now() WHERE id = $1::uuid RETURNING *`,
    [storeId]
  );
  return mapStore(rows[0]);
}

export async function productListForStore(storeId, { category, q }) {
  const params = [storeId];
  let sql =
    'SELECT * FROM products WHERE store_id = $1::uuid';
  if (category) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }
  if (q) {
    params.push(`%${q}%`);
    sql += ` AND name ILIKE $${params.length}`;
  }
  sql += ' ORDER BY created_at DESC';
  const { rows } = await getPool().query(sql, params);
  return rows.map(mapProduct);
}

export async function productPublicList(storeId, { category, q }) {
  const params = [storeId];
  let sql =
    'SELECT * FROM products WHERE store_id = $1::uuid AND active = true';
  if (category) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }
  if (q) {
    params.push(`%${q}%`);
    sql += ` AND name ILIKE $${params.length}`;
  }
  sql += ' ORDER BY created_at DESC';
  const { rows } = await getPool().query(sql, params);
  return rows.map(mapProduct);
}

export async function productCreate(storeId, body) {
  const { rows } = await getPool().query(
    `INSERT INTO products (store_id, name, description, price, images, category, stock, active)
     VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      storeId,
      body.name,
      body.description || '',
      body.price,
      body.images || [],
      body.category,
      body.stock ?? 0,
      body.active !== false,
    ]
  );
  return mapProduct(rows[0]);
}

export async function productFindByIdAndStore(id, storeId) {
  const { rows } = await getPool().query(
    'SELECT * FROM products WHERE id = $1::uuid AND store_id = $2::uuid',
    [id, storeId]
  );
  return mapProduct(rows[0]);
}

export async function productFindActiveByIdAndStore(id, storeId) {
  const { rows } = await getPool().query(
    'SELECT * FROM products WHERE id = $1::uuid AND store_id = $2::uuid AND active = true',
    [id, storeId]
  );
  return mapProduct(rows[0]);
}

export async function productUpdate(id, storeId, updates) {
  const allowed = ['name', 'description', 'price', 'images', 'category', 'stock', 'active'];
  const sets = [];
  const vals = [];
  let i = 1;
  for (const key of allowed) {
    if (updates[key] === undefined) continue;
    sets.push(`${key} = $${i++}`);
    vals.push(updates[key]);
  }
  if (sets.length === 0) return productFindByIdAndStore(id, storeId);
  sets.push('updated_at = now()');
  const idPh = i;
  const storePh = i + 1;
  vals.push(id, storeId);
  const { rows } = await getPool().query(
    `UPDATE products SET ${sets.join(', ')}
     WHERE id = $${idPh}::uuid AND store_id = $${storePh}::uuid
     RETURNING *`,
    vals
  );
  return mapProduct(rows[0]);
}

export async function productDelete(id, storeId) {
  const { rowCount } = await getPool().query(
    'DELETE FROM products WHERE id = $1::uuid AND store_id = $2::uuid',
    [id, storeId]
  );
  return rowCount > 0;
}

export async function productDecrementStock(productId, quantity) {
  const { rowCount } = await getPool().query(
    `UPDATE products SET stock = stock - $2, updated_at = now()
     WHERE id = $1::uuid AND stock >= $2`,
    [productId, quantity]
  );
  return rowCount > 0;
}

export async function orderListForStore(storeId, status) {
  const params = [storeId];
  let sql = 'SELECT * FROM orders WHERE store_id = $1::uuid';
  if (status) {
    params.push(status);
    sql += ` AND status = $${params.length}`;
  }
  sql += ' ORDER BY created_at DESC LIMIT 200';
  const { rows } = await getPool().query(sql, params);
  return rows.map(mapOrder);
}

export async function orderFindByIdAndStore(id, storeId) {
  const { rows } = await getPool().query(
    'SELECT * FROM orders WHERE id = $1::uuid AND store_id = $2::uuid',
    [id, storeId]
  );
  return mapOrder(rows[0]);
}

export async function orderFindById(id) {
  const { rows } = await getPool().query('SELECT * FROM orders WHERE id = $1::uuid', [id]);
  return mapOrder(rows[0]);
}

export async function orderCreate({
  storeId,
  customerName,
  email,
  address,
  items,
  total,
  status,
  paymentMethod,
}) {
  const { rows } = await getPool().query(
    `INSERT INTO orders (
       store_id, customer_name, email, address, items, total, status, payment_method
     ) VALUES ($1::uuid, $2, $3, $4, $5::jsonb, $6, $7, $8)
     RETURNING *`,
    [
      storeId,
      customerName,
      email.toLowerCase().trim(),
      address,
      JSON.stringify(items),
      total,
      status || 'pending',
      paymentMethod || 'mercadopago',
    ]
  );
  return mapOrder(rows[0]);
}

export async function orderUpdatePreferenceId(orderId, preferenceId) {
  const { rows } = await getPool().query(
    `UPDATE orders SET mercadopago_preference_id = $2, updated_at = now()
     WHERE id = $1::uuid RETURNING *`,
    [orderId, preferenceId]
  );
  return mapOrder(rows[0]);
}

export async function orderDelete(orderId) {
  await getPool().query('DELETE FROM orders WHERE id = $1::uuid', [orderId]);
}

export async function orderUpdateStatus(id, storeId, status) {
  const { rows } = await getPool().query(
    `UPDATE orders SET status = $3, updated_at = now()
     WHERE id = $1::uuid AND store_id = $2::uuid
     RETURNING *`,
    [id, storeId, status]
  );
  return mapOrder(rows[0]);
}

export async function orderMarkPaid(orderId, paymentId) {
  const { rows } = await getPool().query(
    `UPDATE orders
     SET status = 'paid', mercadopago_payment_id = $2, updated_at = now()
     WHERE id = $1::uuid
     RETURNING *`,
    [orderId, paymentId]
  );
  return mapOrder(rows[0]);
}

export async function suggestSlugForStore(excludeStoreId, name) {
  const slug = await uniqueSlug(name, async (s) => {
    const { rows } = await getPool().query(
      'SELECT 1 FROM stores WHERE slug = $1 AND id <> $2::uuid',
      [s, excludeStoreId]
    );
    return rows.length > 0;
  });
  return slug;
}
