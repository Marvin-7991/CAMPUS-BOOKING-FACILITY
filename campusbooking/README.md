# Campus Booking System

A full-stack web application for booking campus facilities (lecture halls, computer labs, seminar rooms) at a university. Built with Node.js/Express on the backend and React/Vite on the frontend, backed by PostgreSQL.

---

## Table of Contents

- [Campus Booking System](#campus-booking-system)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Project Structure](#project-structure)
  - [Local Setup](#local-setup)
  - [Database Setup](#database-setup)
  - [Environment Variables](#environment-variables)
  - [Running the Project](#running-the-project)
  - [Authentication](#authentication)
    - [Token Payload](#token-payload)
  - [API Reference](#api-reference)
    - [Auth Endpoints](#auth-endpoints)
      - [`POST /auth/register`](#post-authregister)
      - [`POST /auth/login`](#post-authlogin)
    - [Facilities Endpoints](#facilities-endpoints)
      - [`GET /facilities`](#get-facilities)
      - [`GET /facilities/:id`](#get-facilitiesid)
      - [`POST /facilities`](#post-facilities)
      - [`PUT /facilities/:id`](#put-facilitiesid)
      - [`DELETE /facilities/:id`](#delete-facilitiesid)
    - [Users Endpoints](#users-endpoints)
      - [`GET /users`](#get-users)
      - [`GET /users/:id`](#get-usersid)
      - [`POST /users`](#post-users)
      - [`PUT /users/:id`](#put-usersid)
      - [`DELETE /users/:id`](#delete-usersid)
    - [Bookings Endpoints](#bookings-endpoints)
      - [`GET /bookings`](#get-bookings)
      - [`GET /bookings/:id`](#get-bookingsid)
      - [`POST /bookings`](#post-bookings)
      - [`PUT /bookings/:id`](#put-bookingsid)
      - [`DELETE /bookings/:id`](#delete-bookingsid)
    - [Availability Endpoint](#availability-endpoint)
      - [`GET /availability`](#get-availability)
  - [Frontend Pages](#frontend-pages)
  - [Seed Accounts](#seed-accounts)
  - [Known Limitations](#known-limitations)

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Backend   | Node.js 18+, Express 4              |
| Database  | PostgreSQL 15+ via `pg` (node-postgres) |
| Frontend  | React 18, Vite 5, React Router 6    |
| HTTP      | Axios                               |
| Auth      | bcryptjs (password hashing), jsonwebtoken (JWT) |

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **PostgreSQL** 15+ (via [pgAdmin](https://www.pgadmin.org/) or CLI)

---

## Project Structure

```
campusbooking/
├── server.js                    # Express entry point
├── package.json                 # Backend dependencies + scripts
├── .env                         # Environment variables (not committed)
├── config/
│   └── db.js                    # PostgreSQL connection pool
├── middleware/
│   └── errorHandler.js          # Centralized error handler
├── models/
│   ├── authModel.js             # Auth DB queries
│   ├── facilityModel.js         # Facility DB queries
│   ├── userModel.js             # User DB queries
│   └── bookingModel.js          # Booking DB queries
├── controllers/
│   ├── authController.js        # Register / login logic
│   ├── facilityController.js
│   ├── userController.js
│   ├── bookingController.js
│   └── availabilityController.js
├── routes/
│   ├── authRoutes.js
│   ├── facilityRoutes.js
│   ├── userRoutes.js
│   ├── bookingRoutes.js
│   └── availabilityRoutes.js
├── database/
│   ├── schema.sql               # Table definitions
│   └── seed.sql                 # Sample data
└── client/                      # React frontend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/api.js           # Axios client + API methods
        ├── context/
        │   └── AuthContext.jsx  # JWT auth context
        ├── components/
        │   ├── Navbar.jsx
        │   ├── FacilityCard.jsx
        │   ├── AvailabilityGrid.jsx
        │   ├── BookingList.jsx
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── FacilitiesPage.jsx
            ├── BookingPage.jsx
            ├── HistoryPage.jsx
            └── AdminPage.jsx
```

---

## Local Setup

```bash
# 1. Clone or download the project
cd campusbooking

# 2. Install backend dependencies
npm install

# 3. Install frontend dependencies
cd client && npm install && cd ..
```

---

## Database Setup

1. Open **pgAdmin** and connect to your local PostgreSQL server.
2. Create a new database named `campusbooking`.
3. Open the **Query Tool** on the `campusbooking` database.
4. Run `database/schema.sql` — this creates the `users`, `facilities`, and `bookings` tables.
5. Run `database/seed.sql` — this populates sample facilities, users (with hashed passwords), and bookings.

> **Note:** If the `users` table already exists without the `password_hash` column, the schema migration line `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)` will add it automatically.

---

## Environment Variables

Create a `.env` file in the project root (already included):

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campusbooking
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=campus_booking_jwt_secret_2024
```

| Variable      | Description                                      |
|---------------|--------------------------------------------------|
| `PORT`        | Backend server port (default: 3001)              |
| `DB_HOST`     | PostgreSQL host                                  |
| `DB_PORT`     | PostgreSQL port (default: 5432)                  |
| `DB_NAME`     | Database name                                    |
| `DB_USER`     | PostgreSQL username                              |
| `DB_PASSWORD` | PostgreSQL password                              |
| `JWT_SECRET`  | Secret key used to sign/verify JWT tokens        |

---

## Running the Project

```bash
# From the project root — starts both backend and frontend
npm run dev
```

| Server   | URL                        |
|----------|----------------------------|
| Backend  | http://localhost:3001       |
| Frontend | http://localhost:5173       |

The Vite dev server proxies all `/auth`, `/facilities`, `/users`, `/bookings`, and `/availability` requests to the backend automatically.

---

## Authentication

The app uses **JWT (JSON Web Token)** authentication.

- Tokens are signed with `JWT_SECRET` and expire after **7 days**.
- On login or registration, the server returns a `{ token, user }` object.
- The frontend stores the token in `localStorage` and attaches it to every API request via an Axios interceptor (`Authorization: Bearer <token>`).
- All pages except `/login` and `/register` are protected — unauthenticated visitors are redirected to `/login`.
- The **Admin** nav link is only visible to users with `role = 'admin'`.

### Token Payload

```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@ug.edu.gh",
  "role": "admin",
  "iat": 1700000000,
  "exp": 1700604800
}
```

---

## API Reference

Base URL: `http://localhost:3001`

All request/response bodies use `Content-Type: application/json`.

---

### Auth Endpoints

#### `POST /auth/register`

Create a new user account and receive a JWT token.

**Request body:**
```json
{
  "name": "Kwame Asante",
  "email": "kwame@ug.edu.gh",
  "password": "mypassword"
}
```

**Success response — `201 Created`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "name": "Kwame Asante",
    "email": "kwame@ug.edu.gh",
    "role": "user"
  }
}
```

**Error responses:**
| Status | Condition |
|--------|-----------|
| `400`  | Missing name, email, or password |
| `400`  | Invalid email format |
| `400`  | Password shorter than 6 characters |
| `409`  | Email already registered |

---

#### `POST /auth/login`

Authenticate an existing user and receive a JWT token.

**Request body:**
```json
{
  "email": "admin@ug.edu.gh",
  "password": "password123"
}
```

**Success response — `200 OK`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@ug.edu.gh",
    "role": "admin"
  }
}
```

**Error responses:**
| Status | Condition |
|--------|-----------|
| `400`  | Missing email or password |
| `401`  | Email not found or wrong password |

---

### Facilities Endpoints

#### `GET /facilities`

Returns all facilities ordered by ID.

**Response — `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "Engineering Lecture Hall A",
    "location": "Faculty of Engineering, Block A",
    "capacity": 120
  },
  {
    "id": 2,
    "name": "Computer Lab 1",
    "location": "Department of Computer Engineering, Ground Floor",
    "capacity": 40
  }
]
```

---

#### `GET /facilities/:id`

Returns a single facility by ID.

**Response — `200 OK`:**
```json
{
  "id": 1,
  "name": "Engineering Lecture Hall A",
  "location": "Faculty of Engineering, Block A",
  "capacity": 120
}
```

**Error:** `404 Not Found` if no facility with that ID.

---

#### `POST /facilities`

Create a new facility.

**Request body:**
```json
{
  "name": "Seminar Room 4",
  "location": "Faculty of Science, Block C",
  "capacity": 30
}
```

**Response — `201 Created`:**
```json
{
  "id": 4,
  "name": "Seminar Room 4",
  "location": "Faculty of Science, Block C",
  "capacity": 30
}
```

**Error responses:**
| Status | Condition |
|--------|-----------|
| `400`  | Missing name, location, or capacity |
| `400`  | Capacity is not a positive integer |

---

#### `PUT /facilities/:id`

Update an existing facility (all fields required).

**Request body:**
```json
{
  "name": "Seminar Room 4 (Renovated)",
  "location": "Faculty of Science, Block C",
  "capacity": 35
}
```

**Response — `200 OK`:** Updated facility object.

**Error:** `404 Not Found` if no facility with that ID.

---

#### `DELETE /facilities/:id`

Delete a facility. All associated bookings are also deleted (cascade).

**Response — `200 OK`:**
```json
{ "message": "Facility deleted successfully" }
```

**Error:** `404 Not Found` if no facility with that ID.

---

### Users Endpoints

#### `GET /users`

Returns all users ordered by ID. **Password hashes are never returned.**

**Response — `200 OK`:**
```json
[
  {
    "id": 1,
    "name": "Admin User",
    "email": "admin@ug.edu.gh",
    "role": "admin"
  },
  {
    "id": 2,
    "name": "Kwame Asante",
    "email": "kwame.asante@st.ug.edu.gh",
    "role": "user"
  }
]
```

---

#### `GET /users/:id`

Returns a single user by ID.

**Error:** `404 Not Found` if no user with that ID.

---

#### `POST /users`

Create a new user (admin operation; for self-registration use `POST /auth/register`).

**Request body:**
```json
{
  "name": "Ama Boateng",
  "email": "ama@ug.edu.gh",
  "role": "user"
}
```

**Response — `201 Created`:** Created user object.

**Error responses:**
| Status | Condition |
|--------|-----------|
| `400`  | Missing name or email |
| `400`  | Invalid email format |
| `409`  | Email already exists |

---

#### `PUT /users/:id`

Update an existing user. Partial updates are allowed.

**Request body (partial):**
```json
{
  "name": "Ama Boateng-Mensah",
  "email": "ama@ug.edu.gh",
  "role": "admin"
}
```

**Response — `200 OK`:** Updated user object.

---

#### `DELETE /users/:id`

Delete a user. All associated bookings are also deleted (cascade).

**Response — `200 OK`:**
```json
{ "message": "User deleted successfully" }
```

---

### Bookings Endpoints

#### `GET /bookings`

Returns all bookings, joined with facility and user info. Optionally filter by user.

**Query params:**
| Param     | Type    | Description                          |
|-----------|---------|--------------------------------------|
| `user_id` | integer | (optional) Filter bookings by user   |

**Response — `200 OK`:**
```json
[
  {
    "id": 1,
    "facility_id": 1,
    "user_id": 2,
    "date": "2026-03-03",
    "start_time": "09:00:00",
    "end_time": "10:30:00",
    "status": "confirmed",
    "created_at": "2026-03-02T10:00:00.000Z",
    "facility_name": "Engineering Lecture Hall A",
    "location": "Faculty of Engineering, Block A",
    "capacity": 120,
    "user_name": "Kwame Asante",
    "user_email": "kwame.asante@st.ug.edu.gh"
  }
]
```

---

#### `GET /bookings/:id`

Returns a single booking with joined facility and user info.

**Error:** `404 Not Found` if no booking with that ID.

---

#### `POST /bookings`

Create a new booking. Checks for time slot conflicts automatically.

**Request body:**
```json
{
  "facility_id": 1,
  "user_id": 2,
  "date": "2026-03-05",
  "start_time": "09:00",
  "end_time": "10:30",
  "status": "confirmed"
}
```

**Response — `201 Created`:** Created booking object.

**Error responses:**
| Status | Condition |
|--------|-----------|
| `400`  | Missing required fields |
| `400`  | `start_time` is not before `end_time` |
| `404`  | Facility not found |
| `404`  | User not found |
| `409`  | Time slot conflicts with an existing booking |

---

#### `PUT /bookings/:id`

Update an existing booking. Re-validates times and checks conflicts (excluding the current booking).

**Request body:** Same shape as `POST /bookings`.

**Response — `200 OK`:** Updated booking object.

---

#### `DELETE /bookings/:id`

Cancel a booking (sets `status = 'cancelled'`). Does not permanently delete the record.

**Response — `200 OK`:**
```json
{ "message": "Booking cancelled successfully" }
```

**Error responses:**
| Status | Condition |
|--------|-----------|
| `404`  | Booking not found |
| `400`  | Booking is already cancelled |

---

### Availability Endpoint

#### `GET /availability`

Returns 30-minute time slots for a facility on a given date, with availability status.

**Query params:**
| Param         | Type   | Required | Description                  |
|---------------|--------|----------|------------------------------|
| `facility_id` | integer | Yes      | ID of the facility           |
| `date`        | string  | Yes      | Date in `YYYY-MM-DD` format  |

**Example:** `GET /availability?facility_id=1&date=2026-03-05`

**Response — `200 OK`:**
```json
[
  { "start": "07:00", "end": "07:30", "available": true },
  { "start": "07:30", "end": "08:00", "available": true },
  { "start": "09:00", "end": "09:30", "available": false },
  { "start": "09:30", "end": "10:00", "available": false },
  ...
  { "start": "21:30", "end": "22:00", "available": true }
]
```

Slots run from **07:00 to 22:00** in 30-minute increments (30 slots total). A slot is `available: false` if it overlaps with any confirmed or pending booking.

**Error responses:**
| Status | Condition |
|--------|-----------|
| `400`  | Missing `facility_id` or `date` |
| `400`  | Invalid date format |

---

## Frontend Pages

| Route            | Page             | Description                                                   |
|------------------|------------------|---------------------------------------------------------------|
| `/login`         | Login            | Email + password sign-in. Public.                             |
| `/register`      | Register         | Create a new account. Public.                                 |
| `/facilities`    | Facilities       | Browse all available facilities. Requires auth.               |
| `/book/:id?`     | Book             | Create a booking; shows availability grid. Requires auth.     |
| `/history`       | History          | View and cancel bookings, filtered by user. Requires auth.    |
| `/admin`         | Admin (admin only) | Manage facilities, users, and bookings. Requires auth.      |

---

## Seed Accounts

After running `seed.sql`, sample accounts are seeded for development. Credentials are defined in `database/seed.sql` and should not be used in production.

---

## Known Limitations

- **No backend route guards** — JWT tokens are validated on the frontend only. Backend API routes are publicly accessible without a valid token. Adding `middleware/authenticate.js` (a JWT verification middleware) to protect write routes is the recommended next step.
- **Admin role** — The Admin page is hidden from non-admin users in the UI, but the underlying API endpoints are not role-restricted on the backend.
- **No email verification** — Registration accepts any email format without sending a verification email.
- **Single time zone** — All times are stored and displayed in the server's local time zone. No timezone conversion is applied.
- **No file uploads** — Facility images are not supported.
