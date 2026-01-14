module.exports = (sequelize, DataTypes) => {
    const ClaimDocument = sequelize.define('ClaimDocument', {
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
        documentType: {
            type: DataTypes.ENUM('bill', 'prescription', 'lab_report', 'other'),
            allowNull: false
        },
        fileUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        uploadDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'claim_documents',
        timestamps: true,
        paranoid: true
    });

    ClaimDocument.associate = (models) => {
        ClaimDocument.belongsTo(models.Claim, { foreignKey: 'claimId', as: 'claim' });
    };

    return ClaimDocument;
};
