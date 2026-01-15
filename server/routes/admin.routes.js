const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');
const { getAuditLogs } = require('../middleware/auditLog');
const adminController = require('../controllers/admin.controller');
const userController = require('../controllers/user.controller');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// System metrics & Analytics
router.get('/dashboard', adminController.getDashboardStats);
router.get('/analytics', adminController.getAnalytics);
router.get('/claims', adminController.listClaims);
router.get('/audit-logs', getAuditLogs);

// User Management
router.get('/users', userController.listUsers);
router.patch('/users/:id/status', userController.updateUserStatus);
router.patch('/users/:id/role', userController.updateUserRole);

router.get('/compliance-reports', (req, res) => res.json({ success: true, message: 'Compliance reports - To be implemented' }));

module.exports = router;
