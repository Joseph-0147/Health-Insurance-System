const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'; // Extended for dev
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// In-memory refresh token store for prototype
// Maps tokenId -> { userId, expiresAt, valid }
const refreshTokenStore = new Map();

/**
 * Generate JWT access token
 * @param {Object} payload - Token payload (userId, email, role)
 * @returns {string} - JWT token
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'health-insurance-system',
    audience: 'health-insurance-api',
  });
};

/**
 * Generate JWT refresh token
 * @param {Object} payload - Token payload
 * @returns {string} - Refresh token
 */
const generateRefreshToken = (payload) => {
  const tokenId = uuidv4();
  const token = jwt.sign(
    { ...payload, tokenId },
    JWT_REFRESH_SECRET,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
      issuer: 'health-insurance-system',
      audience: 'health-insurance-api',
    }
  );
  try {
    const decoded = jwt.decode(token);
    refreshTokenStore.set(tokenId, {
      userId: payload.userId,
      expiresAt: decoded?.exp ? decoded.exp * 1000 : Date.now(),
      valid: true,
    });
  } catch { }
  return token;
};

/**
 * Verify JWT access token
 * @param {string} token - JWT token
 * @returns {Object} - Decoded payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'health-insurance-system',
      audience: 'health-insurance-api',
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Verify JWT refresh token
 * @param {string} token - Refresh token
 * @returns {Object} - Decoded payload
 */
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'health-insurance-system',
      audience: 'health-insurance-api',
    });
    const record = refreshTokenStore.get(decoded.tokenId);
    if (!record || !record.valid || record.userId !== decoded.userId || record.expiresAt < Date.now()) {
      throw new Error('Refresh token revoked or invalid');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

const revokeRefreshToken = (tokenId) => {
  const record = refreshTokenStore.get(tokenId);
  if (record) {
    record.valid = false;
    refreshTokenStore.set(tokenId, record);
  }
};

const rotateRefreshToken = (decodedOld) => {
  revokeRefreshToken(decodedOld.tokenId);
  return generateRefreshToken({ userId: decodedOld.userId, email: decodedOld.email, role: decodedOld.role });
};

/**
 * Generate both access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} - { accessToken, refreshToken }
 */
const generateTokenPair = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} - Decoded payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
  decodeToken,
  revokeRefreshToken,
  rotateRefreshToken,
};
