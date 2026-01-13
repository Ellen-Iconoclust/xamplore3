const db = require('../config/database');

const Attempt = {
    create: (studentId, testId) => {
        const id = Date.now().toString() + '-' + studentId; // simple ID
        const stmt = db.prepare('INSERT INTO attempts (id, student_id, test_id, status) VALUES (?, ?, ?, ?)');
        stmt.run(id, studentId, testId, 'in-progress');
        return id;
    },

    findByStudentAndTest: (studentId, testId) => {
        const stmt = db.prepare('SELECT * FROM attempts WHERE student_id = ? AND test_id = ?');
        return stmt.get(studentId, testId);
    },

    updateStatus: (id, status, score, answers) => {
        const answersStr = JSON.stringify(answers);
        const completedAt = new Date().toISOString();
        const stmt = db.prepare('UPDATE attempts SET status = ?, score = ?, answers = ?, completed_at = ? WHERE id = ?');
        return stmt.run(status, score, answersStr, completedAt, id);
    }
};

module.exports = Attempt;
