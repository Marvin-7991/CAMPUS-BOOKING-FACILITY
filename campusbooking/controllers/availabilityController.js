const BookingModel = require('../models/bookingModel');
const FacilityModel = require('../models/facilityModel');

// Generate 30-minute time slots between startHour and endHour
function generateSlots(startHour = 7, endHour = 22) {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({ start: `${String(hour).padStart(2, '0')}:00`, end: `${String(hour).padStart(2, '0')}:30` });
    slots.push({ start: `${String(hour).padStart(2, '0')}:30`, end: `${String(hour + 1).padStart(2, '0')}:00` });
  }
  return slots;
}

function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function isSlotBooked(slot, bookedSlots) {
  const slotStart = timeToMinutes(slot.start);
  const slotEnd = timeToMinutes(slot.end);
  return bookedSlots.some((booked) => {
    const bookedStart = timeToMinutes(booked.start_time.substring(0, 5));
    const bookedEnd = timeToMinutes(booked.end_time.substring(0, 5));
    return slotStart < bookedEnd && slotEnd > bookedStart;
  });
}

const availabilityController = {
  async checkAvailability(req, res, next) {
    try {
      const { facility_id, date } = req.query;

      if (!facility_id || !date) {
        return res.status(400).json({ error: 'facility_id and date query parameters are required' });
      }

      const facility = await FacilityModel.getById(facility_id);
      if (!facility) {
        return res.status(404).json({ error: 'Facility not found' });
      }

      const bookedSlots = await BookingModel.getBookedSlots(facility_id, date);
      const allSlots = generateSlots(7, 22);

      const availability = allSlots.map((slot) => ({
        start: slot.start,
        end: slot.end,
        available: !isSlotBooked(slot, bookedSlots),
      }));

      res.json({
        facility,
        date,
        slots: availability,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = availabilityController;
