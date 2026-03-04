const FacilityModel = require('../models/facilityModel');

const facilityController = {
  async getAllFacilities(req, res, next) {
    try {
      const facilities = await FacilityModel.getAll();
      res.json(facilities);
    } catch (err) {
      next(err);
    }
  },

  async getFacilityById(req, res, next) {
    try {
      const facility = await FacilityModel.getById(req.params.id);
      if (!facility) {
        return res.status(404).json({ error: 'Facility not found' });
      }
      res.json(facility);
    } catch (err) {
      next(err);
    }
  },

  async createFacility(req, res, next) {
    try {
      const { name, location, capacity } = req.body;
      if (!name || !location || !capacity) {
        return res.status(400).json({ error: 'name, location, and capacity are required' });
      }
      if (capacity <= 0) {
        return res.status(400).json({ error: 'capacity must be a positive integer' });
      }
      const facility = await FacilityModel.create({ name, location, capacity });
      res.status(201).json(facility);
    } catch (err) {
      next(err);
    }
  },

  async updateFacility(req, res, next) {
    try {
      const { name, location, capacity } = req.body;
      if (!name || !location || !capacity) {
        return res.status(400).json({ error: 'name, location, and capacity are required' });
      }
      const existing = await FacilityModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Facility not found' });
      }
      const facility = await FacilityModel.update(req.params.id, { name, location, capacity });
      res.json(facility);
    } catch (err) {
      next(err);
    }
  },

  async deleteFacility(req, res, next) {
    try {
      const existing = await FacilityModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'Facility not found' });
      }
      await FacilityModel.delete(req.params.id);
      res.json({ message: 'Facility deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = facilityController;
