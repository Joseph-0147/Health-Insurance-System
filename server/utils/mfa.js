const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

/**
 * Generate MFA secret for user
 * @param {string} userEmail - User's email
 * @returns {Object} - { secret, otpauth_url }
 */
const generateMFASecret = (userEmail) => {
  const secret = speakeasy.generateSecret({
    name: `${process.env.MFA_ISSUER || 'HealthInsurance'} (${userEmail})`,
    issuer: process.env.MFA_ISSUER || 'HealthInsurance',
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url,
  };
};

/**
 * Generate QR code for MFA setup
 * @param {string} otpauth_url - OTP auth URL
 * @returns {Promise<string>} - QR code data URL
 */
const generateQRCode = async (otpauth_url) => {
  try {
    return await QRCode.toDataURL(otpauth_url);
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Verify MFA token
 * @param {string} token - 6-digit token from authenticator app
 * @param {string} secret - User's MFA secret
 * @returns {boolean} - True if valid
 */
const verifyMFAToken = (token, secret) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: parseInt(process.env.MFA_WINDOW || '2'), // Allow 2 time steps before/after
  });
};

/**
 * Generate backup codes for MFA
 * @param {number} count - Number of backup codes to generate
 * @returns {Array<string>} - Array of backup codes
 */
const generateBackupCodes = (count = 10) => {
  const crypto = require('crypto');
  const codes = [];
  
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }
  
  return codes;
};

module.exports = {
  generateMFASecret,
  generateQRCode,
  verifyMFAToken,
  generateBackupCodes,
};
