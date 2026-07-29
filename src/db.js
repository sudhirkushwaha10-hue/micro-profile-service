const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5433/profile_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL,
      full_name VARCHAR(255),
      phone VARCHAR(20),
      address TEXT,
      avatar_url TEXT
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS addresses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      label VARCHAR(50) NOT NULL,
      line TEXT NOT NULL,
      city VARCHAR(100),
      pincode VARCHAR(10),
      created_at TIMESTAMP DEFAULT now()
    )
  `);
}

module.exports = { pool, initDb };