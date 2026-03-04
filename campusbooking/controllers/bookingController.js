const BookingModel = require('../models/bookingModel');
const FacilityModel = require('../models/facilityModel');
const UserModel = require('../models/userModel');

const bookingController = {
  async getAllBookings(req, res, next) {
    try {
      const { user_id } = req.query;
      const bookings = await BookingModel.getAll(user_id || null);
      res.json(bookings);
    } catch (err) {
      next(err);
    }
  },

  async getBookingById(req, res, next) {
    try {
      const booking = await BookingModel.getById(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(booking);
    } catch (err) {
      next(err);
    }
  },

  async createBooking(req, res, next) {
    try {
      const { facility_id, user_id, booked_by_name, purpose, date, start_time, end_time, status } = req.body;

      // Validate required fields
      if (!facility_id || !date || !start_time || !end_time) {
        return res.status(400).json({ error: 'facility_id, date, start_time, and end_time are required' });
      }
      if (!user_id && !booked_by_name) {
        return res.status(400).json({ error: 'Either user_id or booked_by_name is required' });
      }

      // Validate time logic
      if (start_time >= end_time) {
        return res.status(400).json({ error: 'start_time must be before end_time' });
      }

      // Check facility exists
      const facility = await FacilityModel.getById(facility_id);
      if (!facility) {
        return res.status(404).json({ error: 'Facility not found' });
      }

      // Check user exists if user_id provided
      if (user_id) {
        const user = await UserModel.getById(user_id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
      }

      // Check for booking conflicts
      const hasConflict = await BookingModel.checkConflict(facility_id, date, start_time, end_time);
      if (hasConflict) {
        return res.status(409).json({ error: 'Booking conflict: the selected time slot is already taken' });
      }

      const booking = await BookingModel.create({ facility_id, user_id, booked_by_name, purpose, date, start_time, end_time, status });
      res.status(201).json(booking);
    } catch (err) {
      next(err);
    }
  },

  async updateBooking(req, res, next) {
    try {
      const existing = await BookingModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const { facility_id, user_id, date, start_time, end_time, status } = req.body;

      const updatedFacilityId = facility_id || existing.facility_id;
      const updatedUserId = user_id || existing.user_id;
      const updatedDate = date || existing.date;
      const updatedStart = start_time || existing.start_time;
      const updatedEnd = end_time || existing.end_time;
      const updatedStatus = status || existing.status;

      if (updatedStart >= updatedEnd) {
        return res.status(400).json({ error: 'start_time must be before end_time' });
      }

      // Only check conflicts if time/facility/date changed
      if (updatedStatus !== 'cancelled') {
        const hasConflict = await BookingModel.checkConflict(
          updatedFacilityId, updatedDate, updatedStart, updatedEnd, req.params.id
        );
        if (hasConflict) {
          return res.status(409).json({ error: 'Booking conflict: the selected time slot is already taken' });
        }
      }

      const booking = await BookingModel.update(req.params.id, {
        facility_id: updatedFacilityId,
        user_id: updatedUserId,
        date: updatedDate,
        start_time: updatedStart,
        end_time: updatedEnd,
        status: updatedStatus,
      });
      res.json(booking);
    } catch (err) {
      next(err);
    }
  },

  async cancelBooking(req, res, next) {
    try {
      const existing = await BookingModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      if (existing.status === 'cancelled') {
        return res.status(400).json({ error: 'Booking is already cancelled' });
      }
      const booking = await BookingModel.cancel(req.params.id);
      res.json(booking);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = bookingController;
