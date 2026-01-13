const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./config/database');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session Setup
app.use(session({
    secret: 'xamplore-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' } // secure: true requires https
}));

// Route imports
const authRoutes = require('./routes/auth.routes');
const examRoutes = require('./routes/exam.routes');
const adminRoutes = require('./routes/admin.routes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/admin', adminRoutes);

// View Routes (serving static html for now, or specific handlers if needed)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 Handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

module.exports = app;
