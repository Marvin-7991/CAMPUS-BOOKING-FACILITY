const pool = require('../config/db');

const FacilityModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM facilities ORDER BY id');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM facilities WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create({ name, location, capacity }) {
    const result = await pool.query(
      'INSERT INTO facilities (name, location, capacity) VALUES ($1, $2, $3) RETURNING *',
      [name, location, capacity]
    );
    return result.rows[0];
  },

  async update(id, { name, location, capacity }) {
    const result = await pool.query(
      'UPDATE facilities SET name = $1, location = $2, capacity = $3 WHERE id = $4 RETURNING *',
      [name, location, capacity, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM facilities WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },
};

module.exports = FacilityModel;
