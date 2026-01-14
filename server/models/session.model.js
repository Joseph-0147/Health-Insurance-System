module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        ipAddress: {
            type: DataTypes.STRING
        },
        userAgent: {
            type: DataTypes.STRING
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'sessions',
        timestamps: true
    });

    Session.associate = (models) => {
        Session.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Session;
};
