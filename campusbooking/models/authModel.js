const pool = require('../config/db');

const AuthModel = {
  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async createUser({ name, email, password_hash, role = 'user' }) {
    try {
      const result = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
        [name, email, password_hash, role]
      );
      return result.rows[0];
    } catch (err) {
      // Handle Postgres NOT NULL violations for legacy schema differences.
      // Common cases: missing `password` (legacy column) and/or missing `created_at`.
      const msg = err.message || '';

      // Treat missing-column / NOT NULL errors for legacy schema columns
      // even if SQLSTATE differs; detect by message contents.
      const needsPassword = /column "password"|null value in column "password"/i.test(msg);
      const needsCreatedAt = /column "created_at"|null value in column "created_at"/i.test(msg);

      if (err.code === '23502' || needsPassword || needsCreatedAt) {

        if (needsPassword && needsCreatedAt) {
          const result = await pool.query(
            'INSERT INTO users (name, email, password, password_hash, role, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, name, email, role',
            [name, email, password_hash, password_hash, role]
          );
          return result.rows[0];
        }

        if (needsPassword) {
          const result = await pool.query(
            'INSERT INTO users (name, email, password, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
            [name, email, password_hash, password_hash, role]
          );
          return result.rows[0];
        }

        if (needsCreatedAt) {
          const result = await pool.query(
            'INSERT INTO users (name, email, password_hash, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, email, role',
            [name, email, password_hash, role]
          );
          return result.rows[0];
        }
      }
      throw err;
    }
  },
};

module.exports = AuthModel;
