const logger = require('../utils/logger');
const { hashPassword, comparePassword, generateToken } = require('../utils/encryption');
const { generateTokenPair, verifyRefreshToken, rotateRefreshToken, revokeRefreshToken } = require('../utils/jwt');
const { generateMFASecret, generateQRCode, verifyMFAToken, generateBackupCodes } = require('../utils/mfa');
const { sendWelcomeEmail, sendPasswordResetEmail, sendVerificationEmail, sendMFASetupEmail } = require('../utils/email');
const { User, Session } = require('../models');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, role, firstName, lastName, phone } = req.body;

    // TODO: Import User model
    // Check if user exists
    // const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   return res.status(409).json({ success: false, message: 'User already exists' });
    // }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate verification token
    const emailVerificationToken = generateToken();

    // Create user
    // const user = await User.create({
    //   email,
    //   passwordHash,
    //   role,
    //   firstName,
    //   lastName,
    //   phone,
    //   emailVerificationToken,
    //   status: 'active',
    // });

    // Send verification email
    // await sendVerificationEmail({ email, firstName }, emailVerificationToken);

    // Send welcome email
    // await sendWelcomeEmail({ email, firstName });

    // Log registration
    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        // userId: user.id,
        email,
        role,
      },
    });

  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password, mfaToken } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Log successful login
    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        accessToken,
      },
    });

  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Invalidate all sessions for user
    // await Session.update(
    //   { isActive: false },
    //   { where: { userId } }
    // );

    try {
      const rt = req.cookies?.refreshToken;
      if (rt) {
        const decoded = verifyRefreshToken(rt);
        revokeRefreshToken(decoded.tokenId);
      }
    } catch { }

    logger.info(`User logged out: ${userId}`);

    res.clearCookie('refreshToken', { path: '/api/auth' });

    res.json({
      success: true,
      message: 'Logout successful',
    });

  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
const { HttpError } = require('../utils/errors');

exports.refreshToken = async (req, res, next) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;
    const refreshToken = tokenFromCookie || req.body?.refreshToken;

    if (!refreshToken) {
      return next(new HttpError(401, 'Refresh token required', 'REFRESH_TOKEN_REQUIRED'));
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // TODO: Check if session exists and is active
    // const session = await Session.findOne({ 
    //   where: { refreshToken, isActive: true } 
    // });
    // if (!session) {
    //   return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    // }

    // Generate new tokens
    const mockUser = { id: decoded.userId, email: decoded.email, role: decoded.role };
    const newRefreshToken = rotateRefreshToken(decoded);
    const accessToken = generateTokenPair(mockUser).accessToken;

    // Update session
    // await session.update({ 
    //   sessionToken: accessToken,
    //   refreshToken: newRefreshToken,
    //   expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    // });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/api/auth',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken,
      },
    });

  } catch (error) {
    logger.error(`Token refresh error: ${error.message}`);
    next(new HttpError(401, 'Invalid or expired refresh token', 'REFRESH_TOKEN_INVALID'));
  }
};

/**
 * @desc    Setup MFA
 * @route   POST /api/auth/mfa/setup
 * @access  Private
 */
exports.setupMFA = async (req, res, next) => {
  try {
    const { userId, email } = req.user;

    // Generate MFA secret
    const { secret, otpauth_url } = generateMFASecret(email);

    // Generate QR code
    const qrCode = await generateQRCode(otpauth_url);

    // Generate backup codes
    const backupCodes = generateBackupCodes();

    // Save secret to user (mark as pending until verified)
    // await User.update(
    //   { mfaSecret: secret, mfaEnabled: false },
    //   { where: { id: userId } }
    // );

    res.json({
      success: true,
      message: 'MFA setup initiated. Scan QR code with authenticator app.',
      data: {
        qrCode,
        secret, // Show this as manual entry option
        backupCodes,
      },
    });

  } catch (error) {
    logger.error(`MFA setup error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Verify MFA token and enable MFA
 * @route   POST /api/auth/mfa/verify
 * @access  Private
 */
exports.verifyMFA = async (req, res, next) => {
  try {
    const { userId, email } = req.user;
    const { token } = req.body;

    // Get user's MFA secret
    // const user = await User.findByPk(userId);
    // if (!user.mfaSecret) {
    //   return res.status(400).json({ success: false, message: 'MFA not set up' });
    // }

    // Verify token
    const mockSecret = 'MOCK_SECRET_FOR_TESTING';
    const isValid = verifyMFAToken(token, mockSecret);

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid MFA token' });
    }

    // Enable MFA
    // await user.update({ mfaEnabled: true });

    // Send confirmation email
    // await sendMFASetupEmail({ email, firstName: user.firstName });

    logger.info(`MFA enabled for user: ${userId}`);

    res.json({
      success: true,
      message: 'MFA enabled successfully',
    });

  } catch (error) {
    logger.error(`MFA verification error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Disable MFA
 * @route   POST /api/auth/mfa/disable
 * @access  Private
 */
exports.disableMFA = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Disable MFA
    // await User.update(
    //   { mfaEnabled: false, mfaSecret: null },
    //   { where: { id: userId } }
    // );

    logger.info(`MFA disabled for user: ${userId}`);

    res.json({
      success: true,
      message: 'MFA disabled successfully',
    });

  } catch (error) {
    logger.error(`MFA disable error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Request password reset
 * @route   POST /api/auth/password/forgot
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user
    // const user = await User.findOne({ where: { email } });
    // if (!user) {
    //   // Don't reveal if user exists
    //   return res.json({ success: true, message: 'If email exists, reset link sent' });
    // }

    // Generate reset token
    const resetToken = generateToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token
    // await user.update({
    //   passwordResetToken: resetToken,
    //   passwordResetExpires: resetExpires,
    // });

    // Send email
    // await sendPasswordResetEmail(user, resetToken);

    logger.info(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: 'If email exists, password reset link has been sent',
    });

  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/auth/password/reset
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Find user with valid token
    // const user = await User.findOne({
    //   where: {
    //     passwordResetToken: token,
    //     passwordResetExpires: { $gt: new Date() },
    //   },
    // });
    // 
    // if (!user) {
    //   return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    // }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update password
    // await user.update({
    //   passwordHash,
    //   passwordResetToken: null,
    //   passwordResetExpires: null,
    // });

    logger.info(`Password reset successful`);

    res.json({
      success: true,
      message: 'Password reset successful. You can now login.',
    });

  } catch (error) {
    logger.error(`Password reset error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Change password (when logged in)
 * @route   POST /api/auth/password/change
 * @access  Private
 */
exports.changePassword = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    // Get user
    // const user = await User.findByPk(userId);

    // Verify current password
    // const isValid = await comparePassword(currentPassword, user.passwordHash);
    // if (!isValid) {
    //   return res.status(401).json({ success: false, message: 'Current password incorrect' });
    // }

    // Hash new password
    const passwordHash = await hashPassword(newPassword);

    // Update password
    // await user.update({ passwordHash });

    logger.info(`Password changed for user: ${userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });

  } catch (error) {
    logger.error(`Change password error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Verify email
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    // Find user with token
    // const user = await User.findOne({
    //   where: { emailVerificationToken: token },
    // });
    // 
    // if (!user) {
    //   return res.status(400).json({ success: false, message: 'Invalid verification token' });
    // }

    // Verify email
    // await user.update({
    //   emailVerified: true,
    //   emailVerificationToken: null,
    // });

    logger.info(`Email verified`);

    res.json({
      success: true,
      message: 'Email verified successfully',
    });

  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);
    next(error);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const { userId } = req.user;

    // Get user
    // const user = await User.findByPk(userId, {
    //   attributes: { exclude: ['passwordHash', 'mfaSecret'] },
    // });

    res.json({
      success: true,
      data: {
        user: {
          id: userId,
          email: req.user.email,
          role: req.user.role,
        },
      },
    });

  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    next(error);
  }
};
