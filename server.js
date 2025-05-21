import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

const app = express();
const PORT = 3000;

/* ---------- middleware ---------- */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- DB pool ---------- */
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Zhansaya0089',
  database: 'balalar_kiim',
  waitForConnections: true,
  connectionLimit: 10
});

/* ---------- /api/products (біреу ғана) ---------- */
app.get('/api/products', async (req, res) => {
  try {
    const { gender, category, sort } = req.query;
    let query = 'SELECT * FROM products';
    const params = [];

    if (gender)   { query += ' WHERE gender = ?'; params.push(gender); }
    if (category) {
      query += gender ? ' AND category = ?' : ' WHERE category = ?';
      params.push(category);
    }

    if (sort === 'price_asc')  query += ' ORDER BY price ASC';
    if (sort === 'price_desc') query += ' ORDER BY price DESC';
    if (sort === 'newest')     query += ' ORDER BY id DESC';

    const [rows] = await pool.query(query, params);
    res.json(rows);   // массив
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

/* ---------- start ---------- */
app.listen(PORT, () =>
  console.log(Server running on http://localhost:${PORT})
);