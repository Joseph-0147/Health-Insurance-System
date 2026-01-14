const logger = require('../utils/logger');

/**
 * Role-based access control middleware
 * Checks if user has required role(s) to access resource
 */

/**
 * Authorize by role
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {Function} - Middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // User should be attached by authenticate middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const { role } = req.user;

      // Check if user's role is in allowed roles
      if (!allowedRoles.includes(role)) {
        logger.logSecurityEvent({
          event: 'UNAUTHORIZED_ACCESS_ATTEMPT',
          userId: req.user.userId,
          ipAddress: req.ip,
          details: {
            requestedPath: req.path,
            requiredRoles: allowedRoles,
            userRole: role,
          },
        });

        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
        });
      }

      next();
    } catch (error) {
      logger.error(`Authorization error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Authorization check failed',
      });
    }
  };
};

/**
 * Check if user owns the resource
 * Used to ensure members can only access their own data
 * @param {string} resourceIdParam - Name of URL parameter containing resource ID
 * @param {string} resourceType - Type of resource (member, claim, etc.)
 */
const authorizeOwnership = (resourceIdParam = 'id', resourceType = 'member') => {
  return async (req, res, next) => {
    try {
      const { role, userId } = req.user;
      
      // Admins and staff bypass ownership check
      if (['admin', 'staff'].includes(role)) {
        return next();
      }

      const resourceId = req.params[resourceIdParam];

      // For members, check if they're accessing their own resource
      if (role === 'member') {
        // This will need to query the database to check ownership
        // For now, simplified check
        
        // If accessing member resource, check if it's their profile
        if (resourceType === 'member' && resourceId !== userId) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You can only access your own data.',
          });
        }

        // For other resources (claims, etc.), need to verify ownership via database
        // This would require importing models, which we'll do later
      }

      next();
    } catch (error) {
      logger.error(`Ownership authorization error: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'Authorization check failed',
      });
    }
  };
};

/**
 * Check resource permissions based on role and resource type
 * @param {string} action - Action being performed (read, create, update, delete)
 */
const checkPermission = (action) => {
  return (req, res, next) => {
    const { role } = req.user;

    // Define permission matrix
    const permissions = {
      admin: ['read', 'create', 'update', 'delete', 'approve'],
      provider: ['read', 'create', 'update'],
      employer: ['read', 'create', 'update'],
      member: ['read', 'create'],
      regulator: ['read'],
    };

    if (!permissions[role] || !permissions[role].includes(action)) {
      return res.status(403).json({
        success: false,
        message: `You don't have permission to ${action} this resource`,
      });
    }

    next();
  };
};

module.exports = {
  authorize,
  authorizeOwnership,
  checkPermission,
};
