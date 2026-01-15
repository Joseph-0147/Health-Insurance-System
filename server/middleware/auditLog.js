const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');
const db = require('../models');

/**
 * Audit logging middleware for HIPAA compliance
 * Logs all access to PHI (Protected Health Information)
 */

/**
 * Resources that contain PHI
 */
const PHI_RESOURCES = [
  'members',
  'dependents',
  'claims',
  'medical-records',
  'prescriptions',
];

/**
 * Check if request accesses PHI
 */
const isPHIAccess = (req) => {
  const path = req.path.toLowerCase();
  return PHI_RESOURCES.some(resource => path.includes(resource));
};

/**
 * Audit middleware
 * Must be placed after authentication middleware
 */
const auditLog = async (req, res, next) => {
  // Generate unique request ID
  req.requestId = uuidv4();

  // Capture start time
  const startTime = Date.now();

  // Store original res.json to intercept response
  const originalJson = res.json;
  let responseBody;

  res.json = function (body) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  // Execute request
  res.on('finish', async () => {
    try {
      const duration = Date.now() - startTime;
      const phiAccessed = isPHIAccess(req);

      // Build audit log entry
      const auditEntry = {
        requestId: req.requestId,
        timestamp: new Date(),

        // User information
        userId: req.user?.userId || null,
        userRole: req.user?.role || 'anonymous',
        userEmail: req.user?.email || null,

        // Request information
        method: req.method,
        path: req.path,
        action: determineAction(req.method),
        resourceType: extractResourceType(req.path),
        resourceId: req.params.id || null,

        // Network information
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),

        // Response information
        statusCode: res.statusCode,
        success: res.statusCode < 400,
        duration,

        // PHI flag
        phiAccessed,

        // Additional context
        queryParams: Object.keys(req.query).length > 0 ? req.query : null,
        errorMessage: res.statusCode >= 400 ? responseBody?.message : null,
      };

      // Log to console/file
      if (phiAccessed) {
        logger.info(`AUDIT: ${auditEntry.action} ${auditEntry.resourceType} by ${auditEntry.userEmail} - Status: ${auditEntry.statusCode}`);
      }

      // Persist to database if model is available
      try {
        if (db.AuditLog) {
          await db.AuditLog.create(auditEntry);
        }
      } catch (persistErr) {
        logger.error(`Failed to persist audit log: ${persistErr.message}`);
      }

      // For high-risk actions, log to security log
      if (isHighRiskAction(req)) {
        logger.logSecurityEvent({
          event: 'HIGH_RISK_ACTION',
          userId: req.user?.userId,
          ipAddress: auditEntry.ipAddress,
          details: {
            action: auditEntry.action,
            resourceType: auditEntry.resourceType,
            statusCode: auditEntry.statusCode,
          },
        });
      }

    } catch (error) {
      logger.error(`Audit logging failed: ${error.message}`);
      // Don't fail the request if audit logging fails
    }
  });

  next();
};

/**
 * Determine action from HTTP method
 */
const determineAction = (method) => {
  const actionMap = {
    GET: 'READ',
    POST: 'CREATE',
    PUT: 'UPDATE',
    PATCH: 'UPDATE',
    DELETE: 'DELETE',
  };
  return actionMap[method] || method;
};

/**
 * Extract resource type from path
 */
const extractResourceType = (path) => {
  const match = path.match(/\/api\/([^\/]+)/);
  return match ? match[1] : 'unknown';
};

/**
 * Check if action is high-risk (requires extra logging)
 */
const isHighRiskAction = (req) => {
  const highRiskPaths = [
    '/api/admin',
    '/api/auth/password/reset',
    '/api/users/delete',
    '/api/members/delete',
    '/api/policies/delete',
  ];

  return highRiskPaths.some(path => req.path.includes(path)) ||
    (req.method === 'DELETE' && isPHIAccess(req));
};

/**
 * Audit log viewer middleware (admin only)
 * Returns sanitized audit logs
 */
const getAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, userId, action, resourceType, page = 1, limit = 50 } = req.query;

    // Build query filters
    const filters = {};
    const { Op } = require('sequelize');

    if (startDate) filters.timestamp = { [Op.gte]: new Date(startDate) };
    if (endDate) filters.timestamp = { ...filters.timestamp, [Op.lte]: new Date(endDate) };
    if (userId) filters.userId = userId;
    if (action) filters.action = action;
    if (resourceType) filters.resourceType = resourceType;

    const { count, rows } = await db.AuditLog.findAndCountAll({
      where: filters,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['timestamp', 'DESC']],
    });

    res.json({
      success: true,
      data: {
        logs: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        },
      },
    });

  } catch (error) {
    logger.error(`Failed to fetch audit logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve audit logs',
    });
  }
};

module.exports = {
  auditLog,
  getAuditLogs,
};
