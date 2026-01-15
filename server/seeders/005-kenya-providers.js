const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/**
 * Kenya Healthcare Providers Seeder
 * Seeds realistic Kenyan hospitals and clinics
 */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();
        const passwordHash = await bcrypt.hash('Password123!', 10);

        // Create provider user accounts first
        const providerUsers = [
            {
                id: uuidv4(),
                firstName: 'Aga Khan',
                lastName: 'Hospital',
                email: 'contact@agakhan.co.ke',
                password: passwordHash,
                role: 'provider',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'Nairobi',
                lastName: 'Hospital',
                email: 'info@nairobihospital.org',
                password: passwordHash,
                role: 'provider',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'MP Shah',
                lastName: 'Hospital',
                email: 'info@mpshah.org',
                password: passwordHash,
                role: 'provider',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'Kenyatta National',
                lastName: 'Hospital',
                email: 'info@knh.or.ke',
                password: passwordHash,
                role: 'provider',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'Mater',
                lastName: 'Hospital',
                email: 'info@materkenya.com',
                password: passwordHash,
                role: 'provider',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'Karen',
                lastName: 'Hospital',
                email: 'info@karenhospital.org',
                password: passwordHash,
                role: 'provider',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'Gertrude',
                lastName: 'Children Hospital',
                email: 'info@gerties.org',
                password: passwordHash,
                role: 'provider',
                isActive: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                firstName: 'Avenue',
                lastName: 'Healthcare',
                email: 'info@avenuehealthcare.com',
                password: passwordHash,
                role: 'provider',
                isActive: true,
                createdAt: now,
                updatedAt: now
            }
        ];

        // Insert users (ignore duplicates)
        for (const user of providerUsers) {
            try {
                await queryInterface.bulkInsert('users', [user]);
            } catch (e) {
                // Skip if already exists
            }
        }

        // Provider details with Kenyan healthcare facilities
        const providers = [
            {
                id: uuidv4(),
                userId: providerUsers[0].id,
                npi: 'NPI1234567',
                specialty: 'General Medicine',
                organizationName: 'Aga Khan University Hospital',
                address: '3rd Parklands Avenue',
                city: 'Nairobi',
                state: 'Nairobi',
                zipCode: '00100',
                phoneNumber: '0722 123 456',
                status: 'verified',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                userId: providerUsers[1].id,
                npi: 'NPI2345678',
                specialty: 'Cardiology',
                organizationName: 'Nairobi Hospital',
                address: 'Argwings Kodhek Road',
                city: 'Nairobi',
                state: 'Nairobi',
                zipCode: '00100',
                phoneNumber: '0733 234 567',
                status: 'verified',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                userId: providerUsers[2].id,
                npi: 'NPI3456789',
                specialty: 'Orthopedics',
                organizationName: 'MP Shah Hospital',
                address: 'Shivachi Road, Parklands',
                city: 'Nairobi',
                state: 'Nairobi',
                zipCode: '00100',
                phoneNumber: '0711 345 678',
                status: 'verified',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                userId: providerUsers[3].id,
                npi: 'NPI4567890',
                specialty: 'General Medicine',
                organizationName: 'Kenyatta National Hospital',
                address: 'Hospital Road, Upper Hill',
                city: 'Nairobi',
                state: 'Nairobi',
                zipCode: '00202',
                phoneNumber: '0700 456 789',
                status: 'verified',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                userId: providerUsers[4].id,
                npi: 'NPI5678901',
                specialty: 'Obstetrics & Gynecology',
                organizationName: 'Mater Misericordiae Hospital',
                address: 'Dunga Road, South B',
                city: 'Nairobi',
                state: 'Nairobi',
                zipCode: '00200',
                phoneNumber: '0799 567 890',
                status: 'verified',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                userId: providerUsers[5].id,
                npi: 'NPI6789012',
                specialty: 'Surgery',
                organizationName: 'Karen Hospital',
                address: 'Langata Road, Karen',
                city: 'Nairobi',
                state: 'Nairobi',
                zipCode: '00502',
                phoneNumber: '0722 678 901',
                status: 'verified',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                userId: providerUsers[6].id,
                npi: 'NPI7890123',
                specialty: 'Pediatrics',
                organizationName: "Gertrude's Children Hospital",
                address: 'Muthaiga Road',
                city: 'Nairobi',
                state: 'Nairobi',
                zipCode: '00100',
                phoneNumber: '0733 789 012',
                status: 'verified',
                createdAt: now,
                updatedAt: now
            },
            {
                id: uuidv4(),
                userId: providerUsers[7].id,
                npi: 'NPI8901234',
                specialty: 'Dermatology',
                organizationName: 'Avenue Healthcare - Parklands',
                address: '3rd Parklands Avenue',
                city: 'Nairobi',
                state: 'Nairobi',
                zipCode: '00100',
                phoneNumber: '0711 890 123',
                status: 'verified',
                createdAt: now,
                updatedAt: now
            }
        ];

        // Insert providers (ignore duplicates)
        for (const provider of providers) {
            try {
                await queryInterface.bulkInsert('providers', [provider]);
            } catch (e) {
                // Skip if already exists
            }
        }

        console.log('Kenya providers seeded successfully!');
    },

    async down(queryInterface, Sequelize) {
        // Optional: delete seeded data
    }
};
