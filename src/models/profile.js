const { pool } = require('../db');

async function findByUserId(userId) {
  const result = await pool.query('SELECT * FROM profiles WHERE user_id = $1', [userId]);
  return result.rows[0] || null;
}

async function create(userId, { full_name, phone, address }) {
  const result = await pool.query(
    `INSERT INTO profiles (user_id, full_name, phone, address)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, full_name, phone, address]
  );
  return result.rows[0];
}

async function update(userId, { full_name, phone, address, avatar_url }) {
  const result = await pool.query(
    `UPDATE profiles
     SET full_name = COALESCE($1, full_name),
         phone = COALESCE($2, phone),
         address = COALESCE($3, address),
         avatar_url = COALESCE($4, avatar_url)
     WHERE user_id = $5 RETURNING *`,
    [full_name, phone, address, avatar_url, userId]
  );
  return result.rows[0] || null;
}

async function remove(userId) {
  const result = await pool.query('DELETE FROM profiles WHERE user_id = $1 RETURNING id', [userId]);
  return result.rows[0] || null;
}

async function listAddresses(userId) {
  const result = await pool.query(
    'SELECT * FROM addresses WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

async function addAddress(userId, { label, line, city, pincode }) {
  const result = await pool.query(
    `INSERT INTO addresses (user_id, label, line, city, pincode)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, label, line, city, pincode]
  );
  return result.rows[0];
}

async function removeAddress(userId, addressId) {
  const result = await pool.query(
    'DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id',
    [addressId, userId]
  );
  return result.rows[0] || null;
}

module.exports = { findByUserId, create, update, remove, listAddresses, addAddress, removeAddress };