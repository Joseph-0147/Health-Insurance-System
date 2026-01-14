module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        claimId: {
            type: DataTypes.UUID,
            references: {
                model: 'claims',
                key: 'id'
            }
        },
        policyId: { // For premium payments
            type: DataTypes.UUID,
            references: {
                model: 'policies',
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('premium', 'claim_payout', 'co_pay'),
            allowNull: false
        },
        method: {
            type: DataTypes.ENUM('credit_card', 'bank_transfer', 'check', 'stripe'),
            defaultValue: 'stripe'
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
            defaultValue: 'pending'
        },
        transactionId: { // Stripe or bank transaction ID
            type: DataTypes.STRING,
            unique: true
        },
        paymentDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'payments',
        timestamps: true,
        paranoid: true
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.Claim, { foreignKey: 'claimId', as: 'claim' });
        Payment.belongsTo(models.Policy, { foreignKey: 'policyId', as: 'policy' });
    };

    return Payment;
};
