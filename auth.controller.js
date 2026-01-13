const Student = require('../models/student.model');

exports.login = (req, res) => {
    const { student_id, password } = req.body;

    if (!student_id || !password) {
        return res.status(400).json({ error: 'Student ID and password are required' });
    }

    // Admin backdoor for demo purposes (or seed it properly)
    if (student_id === 'admin' && password === 'admin') {
        req.session.user = { id: 'admin', role: 'admin' };
        return res.json({ success: true, redirect: '/admin.html' });
    }

    const student = Student.verify(student_id, password);
    if (student) {
        req.session.user = { id: student.id, name: student.name, role: 'student' };
        res.json({ success: true, redirect: '/dashboard.html' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
};

exports.getSession = (req, res) => {
    if (req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.status(401).json({ authenticated: false });
    }
};
