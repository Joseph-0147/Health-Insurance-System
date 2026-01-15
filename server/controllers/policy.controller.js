const { Policy, Member, User } = require('../models');
const logger = require('../utils/logger');

exports.getMyPolicies = async (req, res, next) => {
    try {
        // 1. Find member profile
        const member = await Member.findOne({ where: { userId: req.user.userId } });

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member profile not found' });
        }

        // 2. Find policies
        const policies = await Policy.findAll({
            where: { memberId: member.id },
            order: [['endDate', 'DESC']]
        });

        res.json({
            success: true,
            data: policies
        });

    } catch (error) {
        logger.error(`Get my policies error: ${error.message}`);
        next(error);
    }
};

exports.enrollInPolicy = async (req, res, next) => {
    try {
        const { planId, planType, startDate, premiumAmount, deductible, coverageLimit, paymentMethod } = req.body;

        // 1. Find or create member profile
        let member = await Member.findOne({ where: { userId: req.user.userId } });

        if (!member) {
            // Create member profile if it doesn't exist
            member = await Member.create({
                userId: req.user.userId,
                dateOfBirth: '1990-01-01',
                gender: 'other'
            });
        }

        // 2. Check if member already has an active policy
        const existingPolicy = await Policy.findOne({
            where: {
                memberId: member.id,
                status: 'active'
            }
        });

        if (existingPolicy) {
            return res.status(400).json({
                success: false,
                message: 'You already have an active policy. Please contact support to upgrade or change your plan.'
            });
        }

        // 3. Calculate end date (1 year from start)
        const start = new Date(startDate);
        const endDate = new Date(start);
        endDate.setFullYear(endDate.getFullYear() + 1);

        // 4. Generate policy number
        const policyNumber = `POL-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

        // 5. Create the policy
        const policy = await Policy.create({
            memberId: member.id,
            policyNumber,
            type: planType,
            status: 'active',
            startDate: start,
            endDate,
            premiumAmount,
            deductible,
            coverageLimit
        });

        logger.info(`New policy enrolled: ${policyNumber} for member ${member.id}`);

        res.status(201).json({
            success: true,
            message: 'Successfully enrolled in policy!',
            data: {
                policyId: policy.id,
                policyNumber: policy.policyNumber,
                startDate: policy.startDate,
                endDate: policy.endDate
            }
        });

    } catch (error) {
        logger.error(`Policy enrollment error: ${error.message}`);
        next(error);
    }
};
