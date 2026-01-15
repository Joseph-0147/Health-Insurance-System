const express = require('express');
const router = express.Router();
const { param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

const policyController = require('../controllers/policy.controller');

// Member's policies (before /:id to avoid UUID validation capture)
router.get('/my-policies', authenticate, policyController.getMyPolicies);

// Member self-enrollment
router.post('/enroll', authenticate, policyController.enrollInPolicy);

router.get('/:id', authenticate, param('id').isUUID(), validate, (req, res) => res.json({ success: true, message: 'Get policy - To be implemented' }));
router.post('/', authenticate, authorize('admin', 'employer'), (req, res) => res.json({ success: true, message: 'Create policy - To be implemented' }));
router.put('/:id', authenticate, authorize('admin'), param('id').isUUID(), validate, (req, res) => res.json({ success: true, message: 'Update policy - To be implemented' }));
router.get('/plans/all', (req, res) => res.json({ success: true, message: 'Get all plans - To be implemented' }));
router.post('/plans/compare', (req, res) => res.json({ success: true, message: 'Compare plans - To be implemented' }));

module.exports = router;
