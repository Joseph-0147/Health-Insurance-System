module.exports = (sequelize, DataTypes) => {
    const Claim = sequelize.define('Claim', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        policyId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'policies',
                key: 'id'
            }
        },
        providerId: { // Nullable if out-of-network claim submitted by member
            type: DataTypes.UUID,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('submitted', 'received', 'under_review', 'approved', 'rejected', 'paid', 'appealed'),
            defaultValue: 'submitted'
        },
        claimType: {
            type: DataTypes.ENUM('medical', 'dental', 'vision', 'pharmacy', 'mental_health'),
            allowNull: false,
            defaultValue: 'medical'
        },
        diagnosisCodes: { // Store as JSON array of ICD-10 codes
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },
        procedureCodes: { // Store as JSON array of CPT codes
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: []
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        approvedAmount: {
            type: DataTypes.DECIMAL(10, 2)
        },
        patientResponsibility: {
            type: DataTypes.DECIMAL(10, 2)
        },
        serviceDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        submissionDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        notes: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'claims',
        timestamps: true,
        paranoid: true
    });

    Claim.associate = (models) => {
        Claim.belongsTo(models.Policy, { foreignKey: 'policyId', as: 'policy' });
        Claim.belongsTo(models.Provider, { foreignKey: 'providerId', as: 'provider' });
        Claim.hasMany(models.ClaimDocument, { foreignKey: 'claimId', as: 'documents' });
        Claim.hasMany(models.ClaimLine, { foreignKey: 'claimId', as: 'claimLines' });
    };

    return Claim;
};
