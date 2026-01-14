const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorization');
const authController = require('../controllers/auth.controller');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 12 })
      .withMessage('Password must be at least 12 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('role')
      .isIn(['member', 'provider', 'employer'])
      .withMessage('Invalid role'),
    body('firstName').trim().escape().notEmpty().withMessage('First name required'),
    body('lastName').trim().escape().notEmpty().withMessage('Last name required'),
  ],
  validate,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  validate,
  authController.login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   POST /api/auth/mfa/setup
 * @desc    Setup MFA for user
 * @access  Private
 */
router.post('/mfa/setup', authenticate, authController.setupMFA);

/**
 * @route   POST /api/auth/mfa/verify
 * @desc    Verify MFA token
 * @access  Private
 */
router.post(
  '/mfa/verify',
  [
    body('token').isLength({ min: 6, max: 6 }).withMessage('Invalid MFA token'),
  ],
  validate,
  authenticate,
  authController.verifyMFA
);

/**
 * @route   POST /api/auth/mfa/disable
 * @desc    Disable MFA
 * @access  Private
 */
router.post('/mfa/disable', authenticate, authController.disableMFA);

/**
 * @route   POST /api/auth/password/forgot
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/password/forgot',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  ],
  validate,
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/password/reset
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/password/reset',
  [
    body('token').notEmpty().withMessage('Reset token required'),
    body('password')
      .isLength({ min: 12 })
      .withMessage('Password must be at least 12 characters'),
  ],
  validate,
  authController.resetPassword
);

/**
 * @route   POST /api/auth/password/change
 * @desc    Change password (when logged in)
 * @access  Private
 */
router.post(
  '/password/change',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword')
      .isLength({ min: 12 })
      .withMessage('Password must be at least 12 characters'),
  ],
  validate,
  authController.changePassword
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post(
  '/verify-email',
  [
    body('token').notEmpty().withMessage('Verification token required'),
  ],
  validate,
  authController.verifyEmail
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;
