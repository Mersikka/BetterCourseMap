import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PASSWORD,
  ssl: false
});

pool.on('connect', () => {
  console.log('[db] pool connected');
});

pool.on('error', (err) => {
  console.error('[db] pool error', err);
});
