module.exports = (sequelize, DataTypes) => {
    const ProviderCredential = sequelize.define('ProviderCredential', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        providerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'providers',
                key: 'id'
            }
        },
        type: {
            type: DataTypes.STRING, // e.g., 'Medical License', 'DEA Registration'
            allowNull: false
        },
        identifier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        issueDate: {
            type: DataTypes.DATEONLY
        },
        expiryDate: {
            type: DataTypes.DATEONLY
        },
        verificationStatus: {
            type: DataTypes.ENUM('pending', 'verified', 'rejected', 'expired'),
            defaultValue: 'pending'
        },
        documentUrl: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'provider_credentials',
        timestamps: true,
        paranoid: true
    });

    ProviderCredential.associate = (models) => {
        ProviderCredential.belongsTo(models.Provider, { foreignKey: 'providerId', as: 'provider' });
    };

    return ProviderCredential;
};
