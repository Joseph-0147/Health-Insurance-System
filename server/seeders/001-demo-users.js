const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const password = await bcrypt.hash('Password123!', 10);
        const now = new Date();

        const users = [
            {
                id: uuidv4(),
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@demo.com',
                password: password,
                role: 'admin',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'John',
                lastName: 'Member',
                email: 'member@demo.com',
                password: password,
                role: 'member',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'Dr. Sarah',
                lastName: 'Provider',
                email: 'provider@demo.com',
                password: password,
                role: 'provider',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'Acme',
                lastName: 'Corp',
                email: 'employer@demo.com',
                password: password,
                role: 'employer',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'Agent',
                lastName: 'Smith',
                email: 'agent@demo.com',
                password: password,
                role: 'insurance_agent',
                isActive: true,
                createdAt: now,
                updatedAt: now
            }
        ];

        await queryInterface.bulkInsert('users', users, {});

        // We should also look up the users to create associated profiles if needed, 
        // but for login access, the user table is sufficient.
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    }
};
