const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1';
let dbPath;

if (isVercel) {
    dbPath = path.join('/tmp', 'database.sqlite');
} else {
    dbPath = path.join(__dirname, '../../database.sqlite');
}

// On Vercel, we might need to copy a pre-seeded DB or create new.
// For now, we create new if not exists.
const db = new Database(dbPath);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

function initDb() {
    console.log('Initializing database at ' + dbPath);

    // Students Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Tests Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      pattern TEXT NOT NULL, -- e.g. "Pattern A"
      questions TEXT NOT NULL, -- JSON string
      duration INTEGER NOT NULL, -- in minutes
      is_active BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Attempts Table
    db.exec(`
    CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      test_id TEXT NOT NULL,
      status TEXT CHECK(status IN ('in-progress', 'completed', 'failed')) DEFAULT 'in-progress',
      score INTEGER DEFAULT 0,
      answers TEXT, -- JSON string
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(test_id) REFERENCES tests(id)
    )
  `);

    // Seed Admin implementation would go here (or separate seed script)
}

initDb();

module.exports = db;
