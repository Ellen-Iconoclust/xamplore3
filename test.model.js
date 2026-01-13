const db = require('../config/database');
const { v4: uuidv4 } = require('uuid'); // Need to check if uuid is installed or use crypto

const Test = {
    create: (title, pattern, questions, duration) => {
        const id = Date.now().toString(); // simple ID for now
        const questionsStr = JSON.stringify(questions);

        // Check schema again just in case (optional, relying on initDb)
        const stmt = db.prepare('INSERT INTO tests (id, title, pattern, questions, duration, is_active) VALUES (?, ?, ?, ?, ?, 1)');
        return stmt.run(id, title, pattern, questionsStr, duration);
    },

    getAllActive: () => {
        return db.prepare('SELECT id, title, pattern, duration, created_at FROM tests WHERE is_active = 1').all();
    },

    findById: (id) => {
        const test = db.prepare('SELECT * FROM tests WHERE id = ?').get(id);
        if (test) {
            test.questions = JSON.parse(test.questions);
        }
        return test;
    }
};

module.exports = Test;
