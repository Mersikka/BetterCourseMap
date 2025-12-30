import { Router } from "express";
import { pool } from '../db/pool.ts';

const router = Router();

router.get('/health', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT 1 AS ok');
    res.status(200).send(rows[0]?.ok ? 'OK' : 'NOT OK');
  } catch (e) {
    console.error(e);
    res.status(500).send('DB ERROR');
  }
});
