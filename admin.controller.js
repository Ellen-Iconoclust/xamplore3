const Test = require('../models/test.model');
const Student = require('../models/student.model');
const db = require('../config/database');

exports.createTest = (req, res) => {
    const { title, pattern, questions, duration } = req.body;
    if (!title || !questions || !duration) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const result = Test.create(title, pattern || 'Default', questions, duration);
        res.json({ success: true, testId: result.lastInsertRowid }); // better-sqlite3 returns info object
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStats = (req, res) => {
    // Aggregate stats
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const totalAttempts = db.prepare('SELECT COUNT(*) as count FROM attempts').get().count;
    // Pass rate (score > 50% for example? or just completed)
    const completed = db.prepare("SELECT COUNT(*) as count FROM attempts WHERE status = 'completed'").get().count;

    res.json({
        stats: {
            students: totalStudents,
            attempts: totalAttempts,
            completed: completed
        }
    });
};
