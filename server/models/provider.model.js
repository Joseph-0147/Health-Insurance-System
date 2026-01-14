module.exports = (sequelize, DataTypes) => {
    const Provider = sequelize.define('Provider', {
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
        npi: { // National Provider Identifier
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        specialty: {
            type: DataTypes.STRING,
            allowNull: false
        },
        organizationName: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        city: {
            type: DataTypes.STRING
        },
        state: {
            type: DataTypes.STRING
        },
        zipCode: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM('pending', 'verified', 'suspended', 'rejected'),
            defaultValue: 'pending'
        }
    }, {
        tableName: 'providers',
        timestamps: true,
        paranoid: true
    });

    Provider.associate = (models) => {
        Provider.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        // Provider.hasMany(models.Contract, { foreignKey: 'providerId', as: 'contracts' });
        // Provider.hasMany(models.ProviderCredential, { foreignKey: 'providerId', as: 'credentials' });
    };

    return Provider;
};
