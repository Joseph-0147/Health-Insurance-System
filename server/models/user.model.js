module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM(
        'admin',
        'member',
        'provider',
        'employer',
        'insurance_agent',
        'adjudicator' // Added as per architectural requirements
      ),
      defaultValue: 'member'
    },
    mfaSecret: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mfaEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Soft delete
    hooks: {
      afterCreate: (user, options) => {
        delete user.dataValues.password;
        delete user.dataValues.mfaSecret;
      }
    }
  });

  User.associate = (models) => {
    // Associations will be added as other models are created
    // User.hasOne(models.Member, { foreignKey: 'userId', as: 'memberProfile' });
    // User.hasOne(models.Provider, { foreignKey: 'userId', as: 'providerProfile' });
  };

  return User;
};
