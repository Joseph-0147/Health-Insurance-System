const { User, Claim, Provider, Member, AuditLog, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * @desc    Get aggregated stats for admin dashboard
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalMembers = await Member.count();
        const activeClaims = await Claim.count({ where: { status: { [Op.notIn]: ['paid', 'rejected', 'denied'] } } });
        const totalProviders = await Provider.count();

        // Revenue MTD (Using payments or just sum of approved claims for now)
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const revenueMTD = await Claim.sum('totalAmount', {
            where: {
                status: { [Op.in]: ['approved', 'paid'] },
                updatedAt: { [Op.gte]: firstDayOfMonth }
            }
        }) || 0;

        // Recent Activities (from Audit Logs)
        const recentActivities = await AuditLog.findAll({
            limit: 5,
            order: [['timestamp', 'DESC']],
            attributes: ['action', 'path', 'userEmail', 'timestamp', 'success']
        });

        // Status distribution for overview
        const statusDistribution = await Claim.findAll({
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
            group: ['status']
        });

        res.json({
            success: true,
            data: {
                totalMembers,
                activeClaims,
                totalProviders,
                revenueMTD,
                statusDistribution,
                recentActivities: recentActivities.map(a => ({
                    action: a.action,
                    detail: a.path,
                    user: a.userEmail || 'System',
                    time: a.timestamp,
                    success: a.success
                }))
            }
        });

    } catch (error) {
        logger.error(`Admin dashboard stats error: ${error.message}`);
        next(error);
    }
};

/**
 * @desc    Get detailed system analytics
 * @route   GET /api/admin/analytics
 * @access  Private (Admin)
 */
exports.getAnalytics = async (req, res, next) => {
    try {
        // Claims by status distribution
        const statusCounts = await Claim.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('status')), 'count']
            ],
            group: ['status']
        });

        // Claims trend last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await Claim.findAll({
            attributes: [
                [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
            ],
            where: {
                createdAt: { [Op.gte]: sixMonthsAgo }
            },
            group: [sequelize.fn('date_trunc', 'month', sequelize.col('createdAt'))],
            order: [[sequelize.fn('date_trunc', 'month', sequelize.col('createdAt')), 'ASC']]
        });

        res.json({
            success: true,
            data: {
                statusDistribution: statusCounts,
                monthlyTrend
            }
        });
    } catch (error) {
        logger.error(`Admin analytics error: ${error.message}`);
        next(error);
    }
};

/**
 * @desc    List claims for administrative review
 * @route   GET /api/admin/claims
 * @access  Private (Admin)
 */
exports.listClaims = async (req, res, next) => {
    try {
        const { status = 'submitted,received,under_review', limit = 10 } = req.query;
        const { Claim, Member, Provider, User } = require('../models');
        const { Op } = require('sequelize');
        const statusArray = status.split(',');

        const claims = await Claim.findAll({
            where: { status: { [Op.in]: statusArray } },
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: Member,
                    as: 'member',
                    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
                },
                {
                    model: Provider,
                    as: 'provider',
                    attributes: ['name']
                }
            ]
        });

        res.json({
            success: true,
            data: claims.map(c => ({
                id: c.id,
                displayId: `CLM-${c.id.substring(0, 8).toUpperCase()}`,
                member: c.member?.user ? `${c.member.user.firstName} ${c.member.user.lastName}` : 'Unknown',
                provider: c.provider?.name || 'Private Provider',
                amount: parseFloat(c.totalAmount),
                submitted: new Date(c.createdAt).toLocaleDateString('en-KE'),
                status: c.status,
                priority: c.totalAmount > 50000 ? 'high' : 'normal',
                type: 'Medical Service'
            }))
        });
    } catch (error) {
        next(error);
    }
};

