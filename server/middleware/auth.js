const { verifyAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authentication required.',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    // Check if session is still valid (optional - requires Session model)
    // const session = await Session.findOne({ where: { userId: decoded.userId, isActive: true } });
    // if (!session) {
    //   return res.status(401).json({ success: false, message: 'Session expired' });
    // }

    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token. Authentication failed.',
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token
 * Used for endpoints that have both public and authenticated behavior
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };
    }
    
    next();
  } catch (error) {
    // Don't fail - just proceed without user
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth,
};
