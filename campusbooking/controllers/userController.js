const UserModel = require('../models/userModel');

const userController = {
  async getAllUsers(req, res, next) {
    try {
      const users = await UserModel.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  async getUserById(req, res, next) {
    try {
      const user = await UserModel.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async createUser(req, res, next) {
    try {
      const { name, email, role } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'name and email are required' });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      const existing = await UserModel.getByEmail(email);
      if (existing) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      const user = await UserModel.create({ name, email, role });
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },

  async updateUser(req, res, next) {
    try {
      const { name, email, role } = req.body;
      const existing = await UserModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'User not found' });
      }
      const user = await UserModel.update(req.params.id, {
        name: name || existing.name,
        email: email || existing.email,
        role: role || existing.role,
      });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const existing = await UserModel.getById(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: 'User not found' });
      }
      await UserModel.delete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
