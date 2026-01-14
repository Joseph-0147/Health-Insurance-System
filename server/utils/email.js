const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email
 * @param {Object} options - Email options
 * @returns {Promise<Object>} - Email info
 */
const sendEmail = async (options) => {
  const { to, subject, text, html } = options;

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@healthinsurance.com',
      to,
      subject,
      text,
      html,
    });

    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
    throw error;
  }
};

/**
 * Send welcome email to new member
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to Health Insurance Portal';
  const html = `
    <h2>Welcome ${user.firstName}!</h2>
    <p>Your account has been successfully created.</p>
    <p>You can now log in to your member portal to:</p>
    <ul>
      <li>View your policy details</li>
      <li>Submit claims</li>
      <li>Search for providers</li>
      <li>Download your digital ID card</li>
    </ul>
    <p>If you have any questions, please contact our support team.</p>
    <br>
    <p>Best regards,<br>Health Insurance Team</p>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send claim status update email
 */
const sendClaimUpdateEmail = async (user, claim) => {
  const subject = `Claim Update: ${claim.claimNumber}`;
  const html = `
    <h2>Claim Status Update</h2>
    <p>Hello ${user.firstName},</p>
    <p>Your claim <strong>${claim.claimNumber}</strong> has been updated.</p>
    <p><strong>Status:</strong> ${claim.status}</p>
    <p><strong>Service Date:</strong> ${claim.serviceDate}</p>
    <p><strong>Amount:</strong> $${claim.billedAmount}</p>
    <p>Log in to your portal to view full details.</p>
    <br>
    <p>Best regards,<br>Health Insurance Team</p>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send payment confirmation email
 */
const sendPaymentConfirmation = async (user, payment) => {
  const subject = 'Payment Confirmation';
  const html = `
    <h2>Payment Received</h2>
    <p>Hello ${user.firstName},</p>
    <p>We have received your payment.</p>
    <p><strong>Payment Number:</strong> ${payment.paymentNumber}</p>
    <p><strong>Amount:</strong> $${payment.amount}</p>
    <p><strong>Payment Method:</strong> ${payment.paymentMethod}</p>
    <p><strong>Date:</strong> ${payment.paymentDate}</p>
    <p>Thank you for your payment!</p>
    <br>
    <p>Best regards,<br>Health Insurance Team</p>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  
  const subject = 'Password Reset Request';
  const html = `
    <h2>Password Reset</h2>
    <p>Hello ${user.firstName || user.email},</p>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <br>
    <p>Best regards,<br>Health Insurance Team</p>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send email verification
 */
const sendVerificationEmail = async (user, verificationToken) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  
  const subject = 'Verify Your Email';
  const html = `
    <h2>Email Verification</h2>
    <p>Hello ${user.firstName || user.email},</p>
    <p>Please verify your email address by clicking the link below:</p>
    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    <p>This link will expire in 24 hours.</p>
    <br>
    <p>Best regards,<br>Health Insurance Team</p>
  `;

  return sendEmail({ to: user.email, subject, html });
};

/**
 * Send MFA setup email
 */
const sendMFASetupEmail = async (user) => {
  const subject = 'Multi-Factor Authentication Enabled';
  const html = `
    <h2>MFA Enabled</h2>
    <p>Hello ${user.firstName},</p>
    <p>Multi-factor authentication has been successfully enabled on your account.</p>
    <p>You will now be required to enter a verification code when logging in.</p>
    <p>If you didn't enable this, please contact support immediately.</p>
    <br>
    <p>Best regards,<br>Health Insurance Team</p>
  `;

  return sendEmail({ to: user.email, subject, html });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendClaimUpdateEmail,
  sendPaymentConfirmation,
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendMFASetupEmail,
};
