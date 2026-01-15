const { User } = require('../server/models');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
    const emails = [
        'contact@agakhan.co.ke',
        'info@nairobihospital.org',
        'info@mpshah.org',
        'info@knh.or.ke',
        'info@materkenya.com',
        'info@karenhospital.org',
        'info@gerties.org',
        'info@avenuehealthcare.com'
    ];

    const newPassword = await bcrypt.hash('Password123!', 10);

    console.log('Starting password fix for seeded providers...');

    for (const email of emails) {
        try {
            const [updatedCount] = await User.update(
                { password: newPassword },
                { where: { email } }
            );
            if (updatedCount > 0) {
                console.log(`Successfully updated password for: ${email}`);
            } else {
                console.log(`User not found or already updated: ${email}`);
            }
        } catch (error) {
            console.error(`Failed to update ${email}:`, error.message);
        }
    }

    console.log('Done!');
    process.exit();
}

fixPasswords();
