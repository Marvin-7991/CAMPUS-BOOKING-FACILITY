const pool = require('../config/db');

const BookingModel = {
  async getAll(userId = null) {
    let query = `
      SELECT b.*,
             f.name AS facility_name, f.location, f.capacity,
             u.name AS user_name, u.email AS user_email,
             COALESCE(b.booked_by_name, u.name) AS display_name
      FROM bookings b
      JOIN facilities f ON b.facility_id = f.id
      LEFT JOIN users u ON b.user_id = u.id
    `;
    const params = [];
    if (userId) {
      query += ' WHERE b.user_id = $1';
      params.push(userId);
    }
    query += ' ORDER BY b.date DESC, b.start_time DESC';
    const result = await pool.query(query, params);
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query(
      `SELECT b.*,
              f.name AS facility_name, f.location, f.capacity,
              u.name AS user_name, u.email AS user_email,
              COALESCE(b.booked_by_name, u.name) AS display_name
       FROM bookings b
       JOIN facilities f ON b.facility_id = f.id
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async checkConflict(facilityId, date, startTime, endTime, excludeId = null) {
    let query = `
      SELECT id FROM bookings
      WHERE facility_id = $1
        AND date = $2
        AND status != 'cancelled'
        AND start_time < $4
        AND end_time > $3
    `;
    const params = [facilityId, date, startTime, endTime];
    if (excludeId) {
      query += ` AND id != $5`;
      params.push(excludeId);
    }
    const result = await pool.query(query, params);
    return result.rows.length > 0;
  },

  async create({ facility_id, user_id, booked_by_name, purpose, date, start_time, end_time, status = 'confirmed' }) {
    const result = await pool.query(
      `INSERT INTO bookings (facility_id, user_id, booked_by_name, purpose, date, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [facility_id, user_id || null, booked_by_name || null, purpose || null, date, start_time, end_time, status]
    );
    return result.rows[0];
  },

  async update(id, { facility_id, user_id, date, start_time, end_time, status }) {
    const result = await pool.query(
      `UPDATE bookings
       SET facility_id = $1, user_id = $2, date = $3,
           start_time = $4, end_time = $5, status = $6
       WHERE id = $7 RETURNING *`,
      [facility_id, user_id, date, start_time, end_time, status, id]
    );
    return result.rows[0];
  },

  async cancel(id) {
    const result = await pool.query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  },

  async getBookedSlots(facilityId, date) {
    const result = await pool.query(
      `SELECT start_time, end_time FROM bookings
       WHERE facility_id = $1 AND date = $2 AND status != 'cancelled'`,
      [facilityId, date]
    );
    return result.rows;
  },
};

module.exports = BookingModel;
