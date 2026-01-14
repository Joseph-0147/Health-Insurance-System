module.exports = (sequelize, DataTypes) => {
    const Policy = sequelize.define('Policy', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        memberId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'members',
                key: 'id'
            }
        },
        policyNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        type: {
            type: DataTypes.ENUM('gold', 'silver', 'bronze', 'platinum'),
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('active', 'expired', 'cancelled', 'pending'),
            defaultValue: 'pending'
        },
        premiumAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        deductible: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0
        },
        coverageLimit: {
            type: DataTypes.DECIMAL(12, 2)
        }
    }, {
        tableName: 'policies',
        timestamps: true,
        paranoid: true
    });

    Policy.associate = (models) => {
        Policy.belongsTo(models.Member, { foreignKey: 'memberId', as: 'member' });
        Policy.hasMany(models.Claim, { foreignKey: 'policyId', as: 'claims' });
    };

    return Policy;
};
