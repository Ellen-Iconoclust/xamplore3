const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

router.use(requireAdmin);

router.post('/tests', adminController.createTest);
router.get('/stats', adminController.getStats);

module.exports = router;
