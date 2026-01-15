const { v4: uuidv4 } = require('uuid');

/**
 * Kenya Member Profile & Policy Seeder
 */
module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Get the demo member user
        const [users] = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE email = 'member@demo.com' LIMIT 1;`
        );

        if (!users || users.length === 0) {
            console.log('Skipping Member Seeder: Demo user not found.');
            return;
        }

        const userId = users[0].id;
        const now = new Date();

        // 2. Create Member Profile
        // Check if exists first
        const [existingMembers] = await queryInterface.sequelize.query(
            `SELECT id FROM members WHERE userId = '${userId}' LIMIT 1;`
        );

        let memberId;
        if (existingMembers && existingMembers.length > 0) {
            memberId = existingMembers[0].id;
            // Update existing if needed, or skip
        } else {
            memberId = uuidv4();
            await queryInterface.bulkInsert('members', [{
                id: memberId,
                userId: userId,
                dateOfBirth: '1985-06-15',
                gender: 'male',
                phoneNumber: '0712 345 678',
                address: 'Rhapta Road, Westlands',
                city: 'Nairobi',
                state: 'Nairobi',
                zipCode: '00100',
                ssn: 'KRA-A001234567Z', // Using KRA PIN format as placeholder
                createdAt: now,
                updatedAt: now
            }]);
        }

        // 3. Create Policy
        // Check if exists
        const [existingPolicies] = await queryInterface.sequelize.query(
            `SELECT id FROM policies WHERE memberId = '${memberId}' LIMIT 1;`
        );

        if (!existingPolicies || existingPolicies.length === 0) {
            const policyId = uuidv4();
            await queryInterface.bulkInsert('policies', [{
                id: policyId,
                memberId: memberId,
                policyNumber: 'POL-2025-KEN-001',
                type: 'individual', // or family
                status: 'active',
                startDate: '2025-01-01',
                endDate: '2025-12-31',
                premiumAmount: 15500.00,
                deductibleAmount: 5000.00,
                coverageLimit: 5000000.00, // 5M
                // For prototype simplicity, storing plan details in a JSON user-defined field if model supports, 
                // or just rely on hardcoded plan logic in frontend if model is simple. 
                // Assuming we might not have a full 'Plan' model, let's stick to basic Policy fields.
                createdAt: now,
                updatedAt: now
            }]);
        }
    },

    async down(queryInterface, Sequelize) {
        // Be careful deleting, maybe just leave it or use cascade
        // await queryInterface.bulkDelete('policies', null, {});
        // await queryInterface.bulkDelete('members', null, {});
    }
};
