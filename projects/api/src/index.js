const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();
const port = 3000;

app.use(express.json());

const dbPath = "/data/app.db";
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value TEXT,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const admin = await get(
    `SELECT id, username FROM users WHERE username = ?`,
    ["admin"]
  );

  if (!admin) {
    const passwordHash = await bcrypt.hash("supersecret", 10);
    await run(
      `INSERT INTO users (username, password_hash) VALUES (?, ?)`,
      ["admin", passwordHash]
    );
    console.log("Seeded default user: admin / supersecret");
  }
}

async function basicAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      res.setHeader("WWW-Authenticate", 'Basic realm="API"');
      return res.status(401).json({ error: "Authentication required" });
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
    const [username, password] = credentials.split(":");

    if (!username || !password) {
      return res.status(401).json({ error: "Invalid credentials format" });
    }

    const user = await get(
      `SELECT id, username, password_hash FROM users WHERE username = ?`,
      [username]
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.user = { id: user.id, username: user.username };
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Authentication error" });
  }
}

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/secure", basicAuth, (req, res) => {
  res.json({
    message: "Authenticated call successful",
    user: req.user.username
  });
});

app.post("/items", basicAuth, async (req, res) => {
  try {
    const { name, value } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Field 'name' is required" });
    }

    const result = await run(
      `INSERT INTO items (name, value, created_by) VALUES (?, ?, ?)`,
      [name, value || null, req.user.username]
    );

    const item = await get(`SELECT * FROM items WHERE id = ?`, [result.lastID]);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.get("/items", basicAuth, async (req, res) => {
  try {
    const rows = await all(`SELECT * FROM items ORDER BY id DESC`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password are required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await run(
      `INSERT INTO users (username, password_hash) VALUES (?, ?)`,
      [username, passwordHash]
    );

    res.status(201).json({ message: "User created" });
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      return res.status(409).json({ error: "Username already exists" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API!" });
    }
);

initDb()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`API listening on port ${port}`);
      console.log(`DB file: ${dbPath}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize DB", err);
    process.exit(1);
  });