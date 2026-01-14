const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');
const providerController = require('../controllers/provider.controller');

/**
 * @route   GET /api/providers/search
 * @desc    Search provider directory
 * @access  Public (optionalAuth for personalized results)
 */
router.get(
  '/search',
  [
    query('specialty').optional().trim(),
    query('zipCode').optional().trim(),
    query('networkStatus').optional().isIn(['in_network', 'out_of_network']),
    query('acceptingNewPatients').optional().isBoolean(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  providerController.searchProviders
);

/**
 * @route   GET /api/providers/:id
 * @desc    Get provider details
 * @access  Public
 */
router.get(
  '/:id',
  param('id').isUUID(),
  validate,
  providerController.getProvider
);

/**
 * @route   POST /api/providers
 * @desc    Register new provider
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('npi').isLength({ min: 10, max: 10 }).withMessage('Valid NPI required'),
    body('providerType').isIn(['individual', 'facility', 'group']),
    body('primarySpecialty').trim().notEmpty(),
    body('phone').trim().notEmpty(),
    body('email').isEmail(),
  ],
  validate,
  providerController.registerProvider
);

/**
 * @route   PUT /api/providers/:id
 * @desc    Update provider
 * @access  Private (Provider, Admin)
 */
router.put(
  '/:id',
  authenticate,
  authorize('provider', 'admin'),
  param('id').isUUID(),
  validate,
  providerController.updateProvider
);

/**
 * @route   POST /api/providers/:id/credentials
 * @desc    Add/update provider credentials
 * @access  Private (Admin)
 */
router.post(
  '/:id/credentials',
  authenticate,
  authorize('admin'),
  [
    param('id').isUUID(),
    body('credentialType')
      .isIn(['medical_license', 'board_certification', 'dea', 'malpractice_insurance', 'hospital_privileges'])
      .withMessage('Invalid credential type'),
    body('credentialNumber').trim().notEmpty(),
    body('issuingAuthority').trim().notEmpty(),
    body('expirationDate').isISO8601(),
  ],
  validate,
  providerController.addCredential
);

/**
 * @route   GET /api/providers/:id/credentials
 * @desc    Get provider credentials
 * @access  Private (Provider, Admin)
 */
router.get(
  '/:id/credentials',
  authenticate,
  authorize('provider', 'admin'),
  param('id').isUUID(),
  validate,
  providerController.getCredentials
);

/**
 * @route   POST /api/providers/verify-eligibility
 * @desc    Verify patient eligibility
 * @access  Private (Provider)
 */
router.post(
  '/verify-eligibility',
  authenticate,
  authorize('provider'),
  [
    body('memberId').isUUID().withMessage('Valid member ID required'),
    body('serviceDate').isISO8601().withMessage('Valid service date required'),
    body('serviceType').optional().trim(),
  ],
  validate,
  providerController.verifyEligibility
);

/**
 * @route   GET /api/providers/:id/contracts
 * @desc    Get provider contracts
 * @access  Private (Provider, Admin)
 */
router.get(
  '/:id/contracts',
  authenticate,
  authorize('provider', 'admin'),
  param('id').isUUID(),
  validate,
  providerController.getContracts
);

module.exports = router;
