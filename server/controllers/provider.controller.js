const { Provider, User, Member, Policy, Claim } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

exports.searchProviders = async (req, res, next) => {
  try {
    const { specialty, zipCode, city, name, networkStatus, page = 1, limit = 20 } = req.query;

    // Build where clause
    const where = { status: 'verified' };

    if (specialty) {
      where.specialty = { [Op.like]: `%${specialty}%` };
    }
    if (zipCode) {
      where.zipCode = zipCode;
    }
    if (city) {
      where.city = { [Op.like]: `%${city}%` };
    }
    if (name) {
      where.organizationName = { [Op.like]: `%${name}%` };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: providers } = await Provider.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }],
      limit: parseInt(limit),
      offset,
      order: [['organizationName', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        providers: providers.map(p => ({
          id: p.id,
          name: p.organizationName || `${p.user?.firstName} ${p.user?.lastName}`,
          specialty: p.specialty,
          facility: p.organizationName,
          address: `${p.address}, ${p.city}`,
          city: p.city,
          zipCode: p.zipCode,
          phone: p.phoneNumber,
          networkStatus: 'in_network',
          acceptingNew: true,
          rating: 4.5 + Math.random() * 0.5, // Mock rating for prototype
          reviewCount: Math.floor(Math.random() * 200) + 50 // Mock reviews
        })),
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    logger.error(`Search providers error: ${error.message}`);
    next(error);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ where: { userId: req.user.userId } });
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    // Find all distinct members who have claims with this provider
    const claims = await Claim.findAll({
      where: { providerId: provider.id },
      include: [{
        model: Policy,
        as: 'policy',
        include: [{
          model: Member,
          as: 'member',
          include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
        }]
      }],
      order: [['serviceDate', 'DESC']]
    });

    // Map to unique patients
    const patientMap = new Map();
    claims.forEach(c => {
      const member = c.policy?.member;
      if (member && !patientMap.has(member.id)) {
        // Human-readable plan names
        const planType = c.policy.type || 'standard';
        const planName = planType.charAt(0).toUpperCase() + planType.slice(1) + ' Health Plan';

        patientMap.set(member.id, {
          id: member.id,
          name: member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Anonymous Patient',
          dob: member.dateOfBirth,
          plan: planName,
          status: c.policy.status === 'active' ? 'Active' : 'Inactive',
          lastVisit: c.serviceDate
        });
      }
    });

    res.json({
      success: true,
      data: Array.from(patientMap.values())
    });
  } catch (error) {
    logger.error(`Get patients registry error: ${error.message}`);
    next(error);
  }
};

exports.getProvider = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    res.json({
      success: true,
      data: {
        id: provider.id,
        name: provider.organizationName || `${provider.user?.firstName} ${provider.user?.lastName}`,
        specialty: provider.specialty,
        facility: provider.organizationName,
        address: `${provider.address}, ${provider.city}`,
        city: provider.city,
        zipCode: provider.zipCode,
        phone: provider.phoneNumber,
        networkStatus: 'in_network',
        acceptingNew: true,
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 200) + 50
      }
    });
  } catch (error) {
    logger.error(`Get provider error: ${error.message}`);
    next(error);
  }
};

exports.getProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({
      where: { userId: req.user.userId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['firstName', 'lastName', 'email']
      }]
    });

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider profile not found' });
    }

    res.json({
      success: true,
      data: provider
    });
  } catch (error) {
    logger.error(`Get provider profile error: ${error.message}`);
    next(error);
  }
};

exports.updateProviderProfile = async (req, res, next) => {
  try {
    const {
      npi,
      specialty,
      organizationName,
      address,
      city,
      state,
      zipCode,
      phoneNumber
    } = req.body;

    let provider = await Provider.findOne({ where: { userId: req.user.userId } });

    if (!provider) {
      // Create if not exists
      provider = await Provider.create({
        userId: req.user.userId,
        npi: npi || `NPI-${Date.now().toString().slice(-8)}`,
        specialty: specialty || 'General Medicine',
        organizationName,
        address,
        city,
        state,
        zipCode,
        phoneNumber,
        status: 'pending' // Default for new self-registered profiles
      });
    } else {
      // Update existing
      await provider.update({
        specialty,
        organizationName,
        address,
        city,
        state,
        zipCode,
        phoneNumber
      });
    }

    res.json({
      success: true,
      message: 'Provider profile updated successfully',
      data: provider
    });
  } catch (error) {
    logger.error(`Update provider profile error: ${error.message}`);
    next(error);
  }
};

exports.registerProvider = async (req, res, next) => {
  try {
    const provider = await Provider.create(req.body);
    res.status(201).json({ success: true, message: 'Provider registered successfully', data: provider });
  } catch (error) {
    next(error);
  }
};

exports.updateProvider = async (req, res, next) => {
  try {
    const { id } = req.params;
    const provider = await Provider.findByPk(id);
    if (!provider) return res.status(404).json({ success: false, message: 'Provider not found' });

    await provider.update(req.body);
    res.json({ success: true, message: 'Provider updated successfully', data: provider });
  } catch (error) {
    next(error);
  }
};

exports.addCredential = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Add credential - To be implemented' });
  } catch (error) {
    next(error);
  }
};

exports.getCredentials = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Get credentials - To be implemented' });
  } catch (error) {
    next(error);
  }
};

exports.verifyEligibility = async (req, res, next) => {
  try {
    const { memberId, dob } = req.body;

    // 1. Find member by ID (supports raw UUID or formatted MEM-YYYY-XXXXXX)
    let member;
    if (memberId && memberId.toString().startsWith('MEM-')) {
      const parts = memberId.split('-');
      // The last part is the first 6 characters of the UUID
      const uuidPrefix = parts[2].toLowerCase();
      member = await Member.findOne({
        where: {
          id: { [Op.like]: `${uuidPrefix}%` },
          dateOfBirth: dob
        },
        include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
      });
    } else {
      member = await Member.findOne({
        where: { id: memberId, dateOfBirth: dob },
        include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }]
      });
    }

    if (!member) {
      return res.status(404).json({ success: false, message: 'Patient not found with provided ID and Date of Birth' });
    }

    // 2. Check for active policies
    const policy = await Policy.findOne({
      where: { memberId: member.id, status: 'active' }
    });

    if (!policy) {
      return res.json({
        success: true,
        eligible: false,
        message: 'Patient found but has no active insurance policy',
        data: {
          memberName: `${member.user?.firstName || 'Unknown'} ${member.user?.lastName || 'Member'}`,
          coverageStatus: 'Inactive'
        }
      });
    }

    // Define plan names and copays based on policy type
    const planDisplayNames = {
      'gold': 'Gold Executive Plan',
      'silver': 'Silver Standard Plan',
      'bronze': 'Bronze Basic Plan',
      'platinum': 'Platinum Premium Plan'
    };

    const copays = {
      'gold': 'ksh 1,000',
      'silver': 'ksh 1,500',
      'bronze': 'ksh 2,000',
      'platinum': 'ksh 500'
    };

    res.json({
      success: true,
      eligible: true,
      data: {
        memberName: `${member.user?.firstName || ''} ${member.user?.lastName || ''}`.trim(),
        planName: planDisplayNames[policy.type] || 'Standard Plan',
        copay: copays[policy.type] || 'ksh 1,000',
        deductibleMet: `ksh 0 of ksh ${parseFloat(policy.deductible || 0).toLocaleString()}`,
        coverageStatus: 'Active',
        policyNumber: policy.policyNumber,
        policyId: policy.id
      }
    });

  } catch (error) {
    logger.error(`Verify eligibility error: ${error.message}`);
    next(error);
  }
};

exports.getContracts = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Get contracts - To be implemented' });
  } catch (error) {
    next(error);
  }
};
