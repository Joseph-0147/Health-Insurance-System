const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const password = await bcrypt.hash('Password123!', 10);
        const now = new Date();

        // Check if adjudicator already exists to avoid duplicates if re-run without undo
        const existing = await queryInterface.rawSelect('users', {
            where: {
                email: 'adjudicator@demo.com',
            },
        }, ['id']);

        if (!existing) {
            await queryInterface.bulkInsert('users', [{
                id: uuidv4(),
                firstName: 'Claims',
                lastName: 'Adjudicator',
                email: 'adjudicator@demo.com',
                password: password,
                role: 'adjudicator',
                isActive: true,
                createdAt: now,
                updatedAt: now
            }], {});
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', { email: 'adjudicator@demo.com' }, {});
    }
};
