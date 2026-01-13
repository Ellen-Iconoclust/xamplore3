const express = require('express');
const router = express.Router();
const examController = require('../controllers/exam.controller');

// Middleware to ensure login
const requireAuth = (req, res, next) => {
    if (!req.session.user) return res.status(401).json({ error: 'Unauthorized' });
    next();
};

router.use(requireAuth);

router.get('/tests', examController.listTests);
router.post('/:testId/start', examController.startTest);
router.post('/submit', examController.submitTest);
router.get('/attempt/:attemptId/pdf', examController.downloadResult);

module.exports = router;
