import pg from 'pg';

const { Pool } = pg;

let pool;

function useSsl(connectionString) {
  if (!connectionString) return false;
  const local =
    connectionString.includes('127.0.0.1') ||
    connectionString.includes('localhost');
  return !local;
}

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is required (Supabase PostgreSQL connection string)');
    }
    pool = new Pool({
      connectionString,
      ssl: useSsl(connectionString) ? { rejectUnauthorized: false } : false,
    });
  }
  return pool;
}

export async function connectDb() {
  await getPool().query('SELECT 1');
  console.log('PostgreSQL connected');
}
