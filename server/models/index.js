const { Sequelize } = require('sequelize');
const config = require('../config/database.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize with proper options for SQLite or other dialects
const sequelizeOptions = {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  pool: dbConfig.pool,
};

// Add storage path for SQLite
if (dbConfig.dialect === 'sqlite' && dbConfig.storage) {
  sequelizeOptions.storage = dbConfig.storage;
}

// Add dialect options for production (SSL, etc.)
if (dbConfig.dialectOptions) {
  sequelizeOptions.dialectOptions = dbConfig.dialectOptions;
}

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  sequelizeOptions
);

const db = {};

// Import models
db.User = require('./user.model')(sequelize, Sequelize.DataTypes);
db.Member = require('./member.model')(sequelize, Sequelize.DataTypes);
db.Dependent = require('./dependent.model')(sequelize, Sequelize.DataTypes);
db.Policy = require('./policy.model')(sequelize, Sequelize.DataTypes);
db.Claim = require('./claim.model')(sequelize, Sequelize.DataTypes);
db.ClaimDocument = require('./claimDocument.model')(sequelize, Sequelize.DataTypes);
db.ClaimLine = require('./claimLine.model')(sequelize, Sequelize.DataTypes);
db.Appeal = require('./appeal.model')(sequelize, Sequelize.DataTypes);
db.Provider = require('./provider.model')(sequelize, Sequelize.DataTypes);
db.ProviderCredential = require('./providerCredential.model')(sequelize, Sequelize.DataTypes);
db.Contract = require('./contract.model')(sequelize, Sequelize.DataTypes);
db.Employer = require('./employer.model')(sequelize, Sequelize.DataTypes);
db.Payment = require('./payment.model')(sequelize, Sequelize.DataTypes);
db.AuditLog = require('./auditLog.model')(sequelize, Sequelize.DataTypes);
db.Notification = require('./notification.model')(sequelize, Sequelize.DataTypes);
db.Session = require('./session.model')(sequelize, Sequelize.DataTypes);

// Define model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
