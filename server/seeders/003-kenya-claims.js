const { v4: uuidv4 } = require('uuid');

/**
 * Kenyan Claims Seeder
 * Adds sample claims to the first active policy found for a member.
 */
module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Find a valid Policy to attach claims to
        // We'll look for any policy, or specifically one for our demo member if possible
        // For safety, we'll try to find a policy belonging to 'member@demo.com' if user exists, else any policy

        // Simplification: Fetch all policies (assuming seed 001/002 ran and created policies)
        const policies = await queryInterface.sequelize.query(
            `SELECT id, memberId from policies LIMIT 1;`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (!policies || policies.length === 0) {
            console.log('Skipping Claims Seeder: No policies found to attach claims to.');
            return;
        }

        const policyId = policies[0].id;
        const now = new Date();

        const claims = [
            {
                id: uuidv4(),
                policyId: policyId,
                providerId: null, // Submitting member self-claim for now, or could find a provider
                status: 'approved',
                diagnosisCodes: JSON.stringify(['A09', 'R50.9']), // Diarrhea, Fever
                procedureCodes: JSON.stringify(['99203']), // Office visit
                totalAmount: 4500.00,
                approvedAmount: 4000.00,
                patientResponsibility: 500.00,
                serviceDate: '2025-01-10',
                submissionDate: now,
                notes: 'Outpatient visit at Aga Khan Hospital',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                policyId: policyId,
                providerId: null,
                status: 'submitted',
                diagnosisCodes: JSON.stringify(['H10.1']), // Conjunctivitis
                procedureCodes: JSON.stringify(['92004']), // Eye exam
                totalAmount: 2500.00,
                approvedAmount: null,
                patientResponsibility: null,
                serviceDate: '2025-01-12',
                submissionDate: now,
                notes: 'Eye checkup at Lions SightFirst',
                createdAt: now,
                updatedAt: now
            }
        ];

        await queryInterface.bulkInsert('claims', claims, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('claims', null, {});
    }
};
