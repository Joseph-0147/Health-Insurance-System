module.exports = (sequelize, DataTypes) => {
    const Appeal = sequelize.define('Appeal', {
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
        userId: { // Who submitted the appeal
            type: DataTypes.UUID,
            allowNull: false, // Could be member or provider
            references: {
                model: 'users',
                key: 'id'
            }
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('submitted', 'under_review', 'approved', 'rejected'),
            defaultValue: 'submitted'
        },
        reviewNotes: {
            type: DataTypes.TEXT
        },
        submissionDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'appeals',
        timestamps: true,
        paranoid: true
    });

    Appeal.associate = (models) => {
        Appeal.belongsTo(models.Claim, { foreignKey: 'claimId', as: 'claim' });
        Appeal.belongsTo(models.User, { foreignKey: 'userId', as: 'submitter' });
    };

    return Appeal;
};
