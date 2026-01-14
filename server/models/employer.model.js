module.exports = (sequelize, DataTypes) => {
    const Employer = sequelize.define('Employer', {
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
        companyName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ein: { // Employer Identification Number
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        address: {
            type: DataTypes.STRING
        },
        contactPerson: {
            type: DataTypes.STRING
        },
        phoneNumber: {
            type: DataTypes.STRING
        },
        industry: {
            type: DataTypes.STRING
        },
        groupPolicyNumber: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'employers',
        timestamps: true,
        paranoid: true
    });

    Employer.associate = (models) => {
        Employer.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };

    return Employer;
};
