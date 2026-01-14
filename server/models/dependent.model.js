module.exports = (sequelize, DataTypes) => {
    const Dependent = sequelize.define('Dependent', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        memberId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'members',
                key: 'id'
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        relationship: {
            type: DataTypes.ENUM('spouse', 'child', 'parent', 'other'),
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other')
        }
    }, {
        tableName: 'dependents',
        timestamps: true,
        paranoid: true
    });

    Dependent.associate = (models) => {
        Dependent.belongsTo(models.Member, { foreignKey: 'memberId', as: 'primaryMember' });
    };

    return Dependent;
};
