const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');
const memberController = require('../controllers/member.controller');

/**
 * @route   GET /api/members/me
 * @desc    Get current member profile
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  memberController.getMember
);

/**
 * @route   PUT /api/members/me
 * @desc    Update current member profile
 * @access  Private
 */
router.put(
  '/me',
  authenticate,
  memberController.updateMember
);

/**
 * @route   GET /api/members/:id
 * @desc    Get member profile
 * @access  Private
 */
router.get(
  '/:id',
  authenticate,
  param('id').isUUID(),
  validate,
  memberController.getMember
);

/**
 * @route   PUT /api/members/:id
 * @desc    Update member profile
 * @access  Private
 */
router.put(
  '/:id',
  authenticate,
  param('id').isUUID(),
  validate,
  memberController.updateMember
);

/**
 * @route   POST /api/members/enroll
 * @desc    Enroll new member
 * @access  Private (Admin, Employer)
 */
router.post(
  '/enroll',
  authenticate,
  authorize('admin', 'employer'),
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('firstName').trim().notEmpty().withMessage('First name required'),
    body('lastName').trim().notEmpty().withMessage('Last name required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth required'),
    body('ssn').optional().trim(),
    body('phone').optional().trim(),
  ],
  validate,
  memberController.enrollMember
);

/**
 * @route   GET /api/members/:id/policies
 * @desc    Get member policies
 * @access  Private
 */
router.get(
  '/:id/policies',
  authenticate,
  param('id').isUUID(),
  validate,
  memberController.getMemberPolicies
);

/**
 * @route   GET /api/members/:id/claims
 * @desc    Get member claims
 * @access  Private
 */
router.get(
  '/:id/claims',
  authenticate,
  [
    param('id').isUUID(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  validate,
  memberController.getMemberClaims
);

/**
 * @route   GET /api/members/:id/id-card
 * @desc    Generate digital ID card
 * @access  Private
 */
router.get(
  '/:id/id-card',
  authenticate,
  param('id').isUUID(),
  validate,
  memberController.generateIDCard
);

/**
 * @route   POST /api/members/:id/dependents
 * @desc    Add dependent
 * @access  Private (Member)
 */
router.post(
  '/:id/dependents',
  authenticate,
  authorize('member', 'admin'),
  [
    param('id').isUUID(),
    body('firstName').trim().notEmpty().withMessage('First name required'),
    body('lastName').trim().notEmpty().withMessage('Last name required'),
    body('dateOfBirth').isISO8601().withMessage('Valid date of birth required'),
    body('relationship')
      .isIn(['spouse', 'child', 'domestic_partner', 'other'])
      .withMessage('Invalid relationship'),
  ],
  validate,
  memberController.addDependent
);

/**
 * @route   GET /api/members/:id/dependents
 * @desc    Get member dependents
 * @access  Private
 */
router.get(
  '/:id/dependents',
  authenticate,
  param('id').isUUID(),
  validate,
  memberController.getDependents
);

/**
 * @route   GET /api/members/:id/documents
 * @desc    Get member documents
 * @access  Private
 */
router.get(
  '/:id/documents',
  authenticate,
  param('id').isUUID(),
  validate,
  memberController.getDocuments
);

module.exports = router;
