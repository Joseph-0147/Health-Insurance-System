const { User, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

/**
 * @desc    List all users (Admin only)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.listUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, role, status, q } = req.query;
        const offset = (page - 1) * limit;
        const where = {};

        if (role) where.role = role;
        if (status) where.isActive = status === 'active';
        if (q) {
            where[Op.or] = [
                { firstName: { [Op.iLike]: `%${q}%` } },
                { lastName: { [Op.iLike]: `%${q}%` } },
                { email: { [Op.iLike]: `%${q}%` } }
            ];
        }

        const { count, rows } = await User.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            attributes: { exclude: ['password'] }
        });

        res.json({
            success: true,
            data: {
                users: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit)
                }
            }
        });

    } catch (error) {
        logger.error(`List users error: ${error.message}`);
        next(error);
    }
};

/**
 * @desc    Update user status (Admin only)
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin)
 */
exports.updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent deactivating yourself
        if (user.id === req.user.userId) {
            return res.status(400).json({ success: false, message: 'Cannot update your own status' });
        }

        await user.update({ isActive });

        logger.info(`User ${id} status updated to ${isActive} by ${req.user.userId}`);

        res.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: { id: user.id, isActive: user.isActive }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user role (Admin only)
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private (Admin)
 */
exports.updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent changing your own role
        if (user.id === req.user.userId) {
            return res.status(400).json({ success: false, message: 'Cannot change your own role' });
        }

        await user.update({ role });

        logger.info(`User ${id} role updated to ${role} by ${req.user.userId}`);

        res.json({
            success: true,
            message: `User role updated to ${role} successfully`,
            data: { id: user.id, role: user.role }
        });

    } catch (error) {
        next(error);
    }
};
