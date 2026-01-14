module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define('Member', {
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
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: false
        },
        phoneNumber: {
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
        ssn: { // Encrypted in transit/rest usually, but simple storage here for prototype
            type: DataTypes.STRING
        }
    }, {
        tableName: 'members',
        timestamps: true,
        paranoid: true
    });

    Member.associate = (models) => {
        Member.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        Member.hasMany(models.Policy, { foreignKey: 'memberId', as: 'policies' });
        Member.hasMany(models.Dependent, { foreignKey: 'memberId', as: 'dependents' });
    };

    return Member;
};
