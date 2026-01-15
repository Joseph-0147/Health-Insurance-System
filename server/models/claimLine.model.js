module.exports = (sequelize, DataTypes) => {
    const ClaimLine = sequelize.define('ClaimLine', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        claimId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'claims',
                key: 'id'
            }
        },
        serviceCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        unitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('approved', 'rejected', 'pending'),
            defaultValue: 'pending'
        }
    }, {
        tableName: 'claim_lines',
        timestamps: true,
        paranoid: true
    });

    ClaimLine.associate = (models) => {
        ClaimLine.belongsTo(models.Claim, { foreignKey: 'claimId', as: 'claim' });
    };

    return ClaimLine;
};
