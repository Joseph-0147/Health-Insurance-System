// Placeholder controllers for member routes
const logger = require('../utils/logger');

const { Member, User, Policy } = require('../models');

exports.getMember = async (req, res, next) => {
  try {
    // If accessing own profile 'me', or specific ID
    let queryUserId;
    if (req.params.id === 'me') {
      queryUserId = req.user.userId; // Middleware decoded token
    } else {
      // Only admin/provider/self can view specific ID (omitting strict auth check for now)
      // If ID matches UUID format, assume it's member ID, else assume userId or 'me'
      // For simplicity: fetching member profile for logged in user if 'me'
    }

    // We need to find the member profile associated with this User
    // The auth middleware gives us req.user object.

    // Find member by userId
    const member = await Member.findOne({
      where: { userId: req.user.userId },
      include: [
        { model: User, as: 'user', attributes: ['email', 'firstName', 'lastName'] },
        // { model: Policy, as: 'policies' } // Could include policies here
      ]
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Member profile not found' });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    logger.error(`Get member error: ${error.message}`);
    next(error);
  }
};

exports.updateMember = async (req, res, next) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, address, city, state, zipCode } = req.body;

    // Update User (names)
    await User.update(
      { firstName, lastName },
      { where: { id: req.user.userId } }
    );

    // Find or Create Member profile
    let member = await Member.findOne({ where: { userId: req.user.userId } });

    if (member) {
      // Update existing
      await member.update({
        phoneNumber: phone,
        dateOfBirth: dateOfBirth || member.dateOfBirth,
        address,
        city,
        state,
        zipCode
      });
    } else {
      // Create new Member record with required fields
      member = await Member.create({
        userId: req.user.userId,
        phoneNumber: phone,
        dateOfBirth: dateOfBirth || '1990-01-01', // Default if not provided
        gender: 'other', // Default value for new profiles
        address,
        city,
        state,
        zipCode
      });
    }

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    logger.error(`Update member error: ${error.message}`);
    next(error);
  }
};

exports.enrollMember = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Enroll member - To be implemented' });
  } catch (error) {
    next(error);
  }
};

exports.getMemberPolicies = async (req, res, next) => {
  try {
    const member = await Member.findOne({ where: { userId: req.user.userId } });
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const policies = await Policy.findAll({ where: { memberId: member.id, status: 'active' } });

    res.json({ success: true, data: policies });
  } catch (error) {
    next(error);
  }
};

exports.getMemberClaims = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Get member claims - To be implemented' });
  } catch (error) {
    next(error);
  }
};

exports.generateIDCard = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Generate ID card - To be implemented' });
  } catch (error) {
    next(error);
  }
};

exports.addDependent = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Add dependent - To be implemented' });
  } catch (error) {
    next(error);
  }
};

exports.getDependents = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Get dependents - To be implemented' });
  } catch (error) {
    next(error);
  }
};

exports.getDocuments = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Get documents - To be implemented' });
  } catch (error) {
    next(error);
  }
};
