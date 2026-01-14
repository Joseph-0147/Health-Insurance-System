const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Determine log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console(),
  
  // Error log file
  new winston.transports.File({
    filename: path.join(process.env.LOG_FILE_PATH || './logs', 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // All logs file
  new winston.transports.File({
    filename: path.join(process.env.LOG_FILE_PATH || './logs', 'all.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

/**
 * Log PHI access for HIPAA compliance
 * @param {Object} params - Logging parameters
 */
logger.logPHIAccess = async (params) => {
  const { userId, action, resourceType, resourceId, ipAddress, userAgent } = params;
  
  try {
    // This will also be saved to audit_logs table via middleware
    logger.info(`PHI_ACCESS: User ${userId} performed ${action} on ${resourceType}:${resourceId} from ${ipAddress}`);
    
    // In production, you might want to send to a separate compliance log service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to CloudWatch, Splunk, or dedicated audit system
    }
  } catch (error) {
    logger.error(`Failed to log PHI access: ${error.message}`);
  }
};

/**
 * Log security events
 * @param {Object} params - Security event parameters
 */
logger.logSecurityEvent = (params) => {
  const { event, userId, ipAddress, details } = params;
  logger.warn(`SECURITY_EVENT: ${event} - User: ${userId} - IP: ${ipAddress} - Details: ${JSON.stringify(details)}`);
};

module.exports = logger;
