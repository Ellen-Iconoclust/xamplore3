const db = require('../config/database');
const { hashPassword, verifyPassword } = require('../utils/auth.util');

const Student = {
    create: (id, name, password) => {
        const { salt, hash } = hashPassword(password);
        const stmt = db.prepare('INSERT INTO students (id, name, password) VALUES (?, ?, ?)');
        // Storing password as salt:hash
        return stmt.run(id, name, `${salt}:${hash}`);
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT * FROM students WHERE id = ?');
        return stmt.get(id);
    },

    verify: (id, password) => {
        const stmt = db.prepare('SELECT * FROM students WHERE id = ?');
        const student = stmt.get(id);
        if (!student) return null;

        const [salt, hash] = student.password.split(':');
        if (verifyPassword(password, hash, salt)) {
            return student;
        }
        return null;
    }
};

module.exports = Student;
