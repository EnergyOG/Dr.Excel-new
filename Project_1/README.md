[backend banner](/public/images/backend-banner2.png)
# Request API

A lightweight Express + MongoDB backend for managing user-submitted requests, with Redis caching for fast reads.

## Features

- RESTful CRUD API for requests
- Redis caching with automatic invalidation on writes
- MongoDB persistence via Mongoose
- Structured logging with Winston
- Centralized error handling and 404 fallback
- Input validation (required fields, MongoDB ObjectId format, email format)

## Tech Stack

| Layer       | Technology       |
|-------------|------------------|
| Runtime     | Node.js (ESM)    |
| Framework   | Express 4        |
| Database    | MongoDB (Mongoose) |
| Cache       | Redis            |
| Logging     | Winston          |

## Project Structure

```
.
├── server.js                          # App entry point
├── package.json
├── .env.example
└── src/
    ├── config/
    │   ├── database.js                # MongoDB connection
    │   └── redis.js                   # Redis client + connection
    ├── controllers/
    │   └── request.controller.js      # Route handler logic
    ├── model/
    │   └── request.model.js           # Mongoose schema
    ├── routes/
    │   └── route.request.js           # /api/requests routes
    ├── services/
    │   └── cache.service.js           # Redis get/set/invalidate helpers
    └── utils/
        └── logger.js                  # Winston logger
```

## Prerequisites

- Node.js 18+
- A running MongoDB instance (local or hosted, e.g. MongoDB Atlas)
- A running Redis instance (local or hosted, e.g. Redis Cloud, Upstash)

## Getting Started

1. **Clone and install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Copy the example file and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   | Variable      | Description                              | Example                                  |
   |---------------|-------------------------------------------|-------------------------------------------|
   | `PORT`        | Port the server listens on                | `5000`                                    |
   | `NODE_ENV`    | Environment mode                          | `development` or `production`             |
   | `MONGODB_URI` | MongoDB connection string                 | `mongodb://localhost:27017/request-api`   |
   | `REDIS_URL`   | Redis connection string                   | `redis://localhost:6379`                  |

3. **Run the server**

   ```bash
   npm run dev    # with nodemon, auto-restarts on file changes
   # or
   npm start      # plain node, for production
   ```

   On success you should see:

   ```
   MongoDB connected successfully
   Redis connected successfully
   Server running on port 5000
   ```

## API Reference

Base URL: `/api/requests`

### Health Check

```
GET /
```

Returns `200` if the API is running.

---

### Create a Request

```
POST /api/requests
```

**Body**

```json
{
  "requestName": "Jane Doe",
  "requestEmail": "jane@example.com",
  "requestDetails": "Optional details about the request"
}
```

`requestName` and `requestEmail` are required. `requestEmail` must be a valid email format.

**Response — `201 Created`**

```json
{
  "success": true,
  "message": "Request submitted successfully",
  "request": {
    "_id": "665f1c2e8a1b2c3d4e5f6789",
    "requestName": "Jane Doe",
    "requestEmail": "jane@example.com",
    "requestDetails": "Optional details about the request",
    "requestStatus": "backlog",
    "createdAt": "2026-06-21T10:00:00.000Z",
    "updatedAt": "2026-06-21T10:00:00.000Z"
  }
}
```

---

### Get All Requests

```
GET /api/requests
```

Returns all requests, newest first. Served from Redis cache when available.

**Response — `200 OK`**

```json
{
  "success": true,
  "source": "cache",
  "count": 2,
  "requests": [ /* array of request objects */ ]
}
```

---

### Get a Single Request

```
GET /api/requests/:id
```

**Response — `200 OK`**

```json
{
  "success": true,
  "source": "database",
  "request": { /* request object */ }
}
```

**Errors**
- `400` — `id` is not a valid MongoDB ObjectId
- `404` — no request found with that `id`

---

### Update Request Status

```
PATCH /api/requests/:id/status
```

**Body**

```json
{
  "status": "pending"
}
```

Valid values: `backlog`, `pending`, `done`.

**Response — `200 OK`**

```json
{
  "success": true,
  "message": "Request status updated successfully",
  "request": { /* updated request object */ }
}
```

**Errors**
- `400` — `id` is not a valid MongoDB ObjectId
- `404` — no request found with that `id`

---

### Delete a Request

```
DELETE /api/requests/:id
```

**Response — `200 OK`**

```json
{
  "success": true,
  "message": "Request deleted successfully"
}
```

**Errors**
- `400` — `id` is not a valid MongoDB ObjectId
- `404` — no request found with that `id`

---

## Caching Strategy

- `GET` requests check Redis first (`response.source` indicates `"cache"` or `"database"`).
- All cached entries expire after **1 hour** (`DEFAULT_TTL` in `cache.service.js`).
- Any write operation (create, update, delete) invalidates the relevant cache keys (`requests` list and the individual `request:<id>` entry) so stale data is never served.

## Error Handling

- Invalid MongoDB ObjectIds are caught before reaching the database, returning a `400` instead of a raw CastError.
- All controller logic is wrapped in `try/catch`, logging the error server-side and returning a generic `500 Internal server error` to the client — no internal error details are ever exposed in API responses.
- A global Express error handler and a catch-all `404` route cover anything that falls outside the defined routes.
- `uncaughtException` and `unhandledRejection` handlers are registered at startup so the process fails loudly and exits cleanly instead of running in a corrupted state.

## Logging

Logs are written to the console using Winston, with timestamps and color-coded log levels. Log verbosity is environment-aware:

- `development` — `debug` level and above
- `production` — `info` level and above

Logs are server-side only and never leaked to API consumers.

## License

ISC