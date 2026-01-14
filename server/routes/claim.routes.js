const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize, authorizeOwnership } = require('../middleware/authorization');
const claimController = require('../controllers/claim.controller');

/**
 * @route   POST /api/claims
 * @desc    Submit new claim
 * @access  Private (Member, Provider)
 */
router.post(
  '/',
  authenticate,
  authorize('member', 'provider'),
  [
    body('policyId').isUUID().withMessage('Valid policy ID required'),
    body('claimType')
      .isIn(['medical', 'dental', 'vision', 'pharmacy', 'mental_health'])
      .withMessage('Invalid claim type'),
    body('serviceDate').isISO8601().withMessage('Valid service date required'),
    body('billedAmount').isFloat({ min: 0 }).withMessage('Valid billed amount required'),
    body('diagnosisCodes').isArray().withMessage('Diagnosis codes must be array'),
    body('procedureCodes').isArray().withMessage('Procedure codes must be array'),
  ],
  validate,
  claimController.submitClaim
);

/**
 * @route   GET /api/claims/:id
 * @desc    Get claim details
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  param('id').isUUID(),
  validate,
  claimController.getClaim
);

/**
 * @route   GET /api/claims
 * @desc    Get all claims (filtered by user role)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['submitted', 'received', 'under_review', 'approved', 'denied', 'paid']),
  ],
  validate,
  claimController.getAllClaims
);

/**
 * @route   PUT /api/claims/:id
 * @desc    Update claim
 * @access  Private (Admin, Provider)
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'provider'),
  param('id').isUUID(),
  validate,
  claimController.updateClaim
);

/**
 * @route   POST /api/claims/:id/documents
 * @desc    Upload claim documents
 * @access  Private
 */
router.post(
  '/:id/documents',
  authenticate,
  param('id').isUUID(),
  validate,
  claimController.uploadDocument
);

/**
 * @route   GET /api/claims/:id/status
 * @desc    Get claim status
 * @access  Private
 */
router.get(
  '/:id/status',
  authenticate,
  param('id').isUUID(),
  validate,
  claimController.getClaimStatus
);

/**
 * @route   POST /api/claims/:id/appeal
 * @desc    Submit claim appeal
 * @access  Private (Member)
 */
router.post(
  '/:id/appeal',
  authenticate,
  authorize('member'),
  [
    param('id').isUUID(),
    body('appealReason').trim().escape().notEmpty().withMessage('Appeal reason required'),
    body('additionalInformation').optional().trim().escape(),
  ],
  validate,
  claimController.submitAppeal
);

/**
 * @route   PUT /api/claims/:id/process
 * @desc    Process/adjudicate claim
 * @access  Private (Admin only)
 */
router.put(
  '/:id/process',
  authenticate,
  authorize('admin'),
  [
    param('id').isUUID(),
    body('status')
      .isIn(['approved', 'partially_approved', 'denied'])
      .withMessage('Invalid status'),
    body('allowedAmount').optional().isFloat({ min: 0 }),
    body('denialReason').optional().trim(),
  ],
  validate,
  claimController.processClaim
);

module.exports = router;
