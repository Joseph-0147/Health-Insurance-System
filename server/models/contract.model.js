module.exports = (sequelize, DataTypes) => {
    const Contract = sequelize.define('Contract', {
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
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY
        },
        terms: {
            type: DataTypes.TEXT // JSON or text description of fee schedule
        },
        status: {
            type: DataTypes.ENUM('draft', 'active', 'terminated', 'expired'),
            defaultValue: 'draft'
        }
    }, {
        tableName: 'contracts',
        timestamps: true,
        paranoid: true
    });

    Contract.associate = (models) => {
        Contract.belongsTo(models.Provider, { foreignKey: 'providerId', as: 'provider' });
    };

    return Contract;
};
