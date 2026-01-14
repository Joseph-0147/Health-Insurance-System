const express = require('express');
const router = express.Router();
const { param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');

// Placeholder controllers (to be implemented)
const policyController = {
  getPolicy: (req, res) => res.json({ success: true, message: 'Get policy - To be implemented' }),
  createPolicy: (req, res) => res.json({ success: true, message: 'Create policy - To be implemented' }),
  updatePolicy: (req, res) => res.json({ success: true, message: 'Update policy - To be implemented' }),
  getAllPlans: (req, res) => res.json({ success: true, message: 'Get all plans - To be implemented' }),
  comparePlans: (req, res) => res.json({ success: true, message: 'Compare plans - To be implemented' }),
};

router.get('/:id', authenticate, param('id').isUUID(), validate, policyController.getPolicy);
router.post('/', authenticate, authorize('admin', 'employer'), policyController.createPolicy);
router.put('/:id', authenticate, authorize('admin'), param('id').isUUID(), validate, policyController.updatePolicy);
router.get('/plans/all', policyController.getAllPlans);
router.post('/plans/compare', policyController.comparePlans);

module.exports = router;
