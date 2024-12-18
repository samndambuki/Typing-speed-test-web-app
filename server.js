/** @format */

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// SQLite Database Setup
const db = new sqlite3.Database("./typing.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
    db.run(
      `CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        wpm INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
  }
});

// API Endpoints

// Get Top Scores
app.get("/scores", (req, res) => {
  db.all("SELECT * FROM scores ORDER BY wpm DESC LIMIT 10", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Save a New Score
app.post("/scores", (req, res) => {
  const { username, wpm } = req.body;
  if (!username || !wpm) {
    return res.status(400).json({ error: "Username and WPM are required." });
  }

  db.run(
    "INSERT INTO scores (username, wpm) VALUES (?, ?)",
    [username, wpm],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID, username, wpm });
      }
    }
  );
});

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
