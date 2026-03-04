-- Campus Facility Booking System - Seed Data
-- Run this AFTER schema.sql

-- Seed Users
-- Default password for all seed users: password123
-- Hash generated with bcrypt cost factor 10
INSERT INTO users (name, email, role, password_hash) VALUES
  ('Admin User', 'admin@ug.edu.gh', 'admin', '$2b$10$yXjNLyf1oE8lMD01fK4vCuIkyANVvm0E1DWT9lF/J.WOO1IFpopy6'),
  ('Kwame Asante', 'kwame.asante@st.ug.edu.gh', 'user', '$2b$10$yXjNLyf1oE8lMD01fK4vCuIkyANVvm0E1DWT9lF/J.WOO1IFpopy6'),
  ('Ama Boateng', 'ama.boateng@st.ug.edu.gh', 'user', '$2b$10$yXjNLyf1oE8lMD01fK4vCuIkyANVvm0E1DWT9lF/J.WOO1IFpopy6')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Seed Facilities
INSERT INTO facilities (name, location, capacity) VALUES
  ('Engineering Lecture Hall A', 'Faculty of Engineering, Block A', 120),
  ('Computer Lab 1', 'Department of Computer Engineering, Ground Floor', 40),
  ('Seminar Room 3', 'Faculty of Engineering, Block B', 25),
  ('Chemistry Lab', 'Department of Chemistry, Science Block', 35),
  ('Physics Lab', 'Department of Physics, Science Block', 35),
  ('Conference Room', 'Main Administration Building, Level 2', 20),
  ('Electronics Laboratory', 'Department of Electrical Engineering, Block C', 40),
  ('Lecture Hall B', 'Faculty of Engineering, Block B', 100),
  ('Lecture Hall C', 'Faculty of Engineering, Block C', 100)
ON CONFLICT DO NOTHING;

-- Seed Bookings (using subqueries to get IDs dynamically)
INSERT INTO bookings (facility_id, user_id, date, start_time, end_time, status)
VALUES
  (
    (SELECT id FROM facilities WHERE name = 'Engineering Lecture Hall A'),
    (SELECT id FROM users WHERE email = 'kwame.asante@st.ug.edu.gh'),
    CURRENT_DATE + INTERVAL '1 day',
    '09:00',
    '10:30',
    'confirmed'
  ),
  (
    (SELECT id FROM facilities WHERE name = 'Computer Lab 1'),
    (SELECT id FROM users WHERE email = 'ama.boateng@st.ug.edu.gh'),
    CURRENT_DATE + INTERVAL '2 days',
    '14:00',
    '16:00',
    'confirmed'
  );
