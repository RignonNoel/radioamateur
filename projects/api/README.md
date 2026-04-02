# 📦 Express Docker API (SQLite + Basic Auth)

Minimal API with:
- Express
- SQLite database
- Docker Compose
- Basic Authentication (with bcrypt hashing)

---

## 🚀 Quick Start

docker compose up --build

API runs on:
http://localhost:3000

---

## 🔐 Authentication

This API uses HTTP Basic Auth.

Default seeded user:
username: admin
password: supersecret

Example:
curl -u admin:supersecret http://localhost:3000/secure

---

## 📚 Endpoints

---

### 🟢 Health Check

GET /health

curl http://localhost:3000/health

Response:
{
  "ok": true
}

---

### 🔐 Secure Test

GET /secure

```
curl -u admin:supersecret http://localhost:3000/secure
```

Response:
```
{
  "message": "Authenticated call successful",
  "user": "admin"
}
```

---

### 👤 Create User

POST /users

```
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"username":"noel","password":"test123"}'
```

Response:
```
{
  "message": "User created"
}
```

Errors:
- 400 → missing username/password
- 409 → username already exists

---

### 📦 Create Item

POST /items

```
curl -u noel:test123 -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"demo","value":"hello"}'
```

Body:
```
{
  "name": "string (required)",
  "value": "string (optional)"
}
```

Response:
```
{
  "id": 1,
  "name": "demo",
  "value": "hello",
  "created_by": "noel",
  "created_at": "2026-01-01 12:00:00"
}
```

Errors:
- 400 → missing name
- 401 → invalid credentials

---

### 📋 List Items

GET /items

```
curl -u noel:test123 http://localhost:3000/items
```

Response:
```
[
  {
    "id": 1,
    "name": "demo",
    "value": "hello",
    "created_by": "noel",
    "created_at": "2026-01-01 12:00:00"
  }
]
```

---

## 🧠 Data Model

### Users
- id (int) — Primary key
- username (string) — Unique
- password_hash (string) — bcrypt hash

---

## ⚠️ Notes

- Passwords are hashed using bcrypt
- Basic Auth sends credentials on every request (prototype only)
- SQLite DB is persisted via Docker volume

---

## 🔜 Next Improvements

- JWT authentication
- Role-based access control
- Input validation
- Pagination