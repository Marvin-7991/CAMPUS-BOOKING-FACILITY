-- Campus Facility Booking System - Database Schema
-- Run this in pgAdmin Query Tool on the campusbooking database

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  password_hash VARCHAR(255)
);

-- Migration: add password_hash if table already exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

CREATE TABLE IF NOT EXISTS facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(150) NOT NULL,
  capacity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  booked_by_name VARCHAR(150),
  purpose VARCHAR(255),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migrations: add new columns if table already exists
ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booked_by_name VARCHAR(150);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS purpose VARCHAR(255);
