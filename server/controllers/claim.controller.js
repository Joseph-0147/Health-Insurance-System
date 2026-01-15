const { User, Claim, Policy, Provider, Member, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../utils/logger');

exports.submitClaim = async (req, res, next) => {
  try {
    const {
      policyId,
      providerId: bodyProviderId,
      claimType,
      serviceDate,
      billedAmount,
      diagnosisCodes,
      procedureCodes,
      description
    } = req.body;

    let providerId = bodyProviderId || null;
    if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ where: { userId: req.user.userId } });
      if (provider) providerId = provider.id;
    }

    // Create Claim
    const claim = await Claim.create({
      policyId,
      providerId,
      status: 'submitted',
      claimType,
      totalAmount: billedAmount,
      serviceDate,
      diagnosisCodes: diagnosisCodes || [],
      procedureCodes: procedureCodes || [],
      notes: description
    });

    logger.info(`New claim submitted: ${claim.id} by ${req.user.role}`);

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully',
      data: claim
    });
  } catch (error) {
    logger.error(`Submit claim error: ${error.message}`);
    next(error);
  }
};

exports.getClaim = async (req, res, next) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findByPk(id, {
      include: [
        { model: Policy, as: 'policy', include: [{ model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] }] },
        { model: Provider, as: 'provider' }
      ]
    });

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Claim not found' });
    }

    res.json({ success: true, data: claim });
  } catch (error) {
    next(error);
  }
};

exports.getAllClaims = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (status) whereClause.status = status;

    // Filter by user role ownership
    if (req.user.role === 'member') {
      const member = await Member.findOne({ where: { userId: req.user.userId } });
      if (member) {
        const policies = await Policy.findAll({ where: { memberId: member.id } });
        const policyIds = policies.map(p => p.id);
        whereClause.policyId = { [Op.in]: policyIds };
      } else {
        return res.json({ success: true, data: { claims: [], pagination: { total: 0, page, pages: 0 } } });
      }
    } else if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ where: { userId: req.user.userId } });
      if (provider) {
        whereClause.providerId = provider.id;
      } else {
        return res.json({ success: true, data: { claims: [], pagination: { total: 0, page, pages: 0 } } });
      }
    }

    const { count, rows } = await Claim.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Policy,
          as: 'policy',
          include: [{ model: Member, as: 'member', include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }] }]
        },
        {
          model: Provider,
          as: 'provider',
          attributes: ['id', 'organizationName', 'specialty']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        claims: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getProviderStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'provider') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const provider = await Provider.findOne({ where: { userId: req.user.userId } });
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    // 1. Total Patients (distinct members who had claims with this provider)
    const totalPatients = await Claim.count({
      distinct: true,
      col: 'policyId', // Roughly equivalent for now, better join later
      where: { providerId: provider.id }
    });

    // 2. Pending Claims
    const pendingClaims = await Claim.count({
      where: { providerId: provider.id, status: 'submitted' }
    });

    // 3. Pending Value
    const pendingValue = await Claim.sum('totalAmount', {
      where: { providerId: provider.id, status: 'submitted' }
    }) || 0;

    // 4. Revenue MTD (Paid/Approved this month)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const revenueMTD = await Claim.sum('totalAmount', {
      where: {
        providerId: provider.id,
        status: { [Op.in]: ['approved', 'paid'] },
        updatedAt: { [Op.gte]: firstDayOfMonth }
      }
    }) || 0;

    // 5. Approval Rate
    const totalProcessed = await Claim.count({
      where: {
        providerId: provider.id,
        status: { [Op.in]: ['approved', 'rejected', 'paid'] }
      }
    });
    const totalApproved = await Claim.count({
      where: {
        providerId: provider.id,
        status: { [Op.in]: ['approved', 'paid'] }
      }
    });
    const approvalRate = totalProcessed > 0 ? Math.round((totalApproved / totalProcessed) * 100) : 100;

    res.json({
      success: true,
      data: {
        totalPatients,
        pendingClaims,
        pendingValue,
        revenueMTD,
        approvalRate
      }
    });

  } catch (error) {
    logger.error(`Get provider stats error: ${error.message}`);
    next(error);
  }
};

exports.updateClaim = async (req, res, next) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findByPk(id);
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });

    await claim.update(req.body);
    res.json({ success: true, message: 'Claim updated successfully', data: claim });
  } catch (error) {
    next(error);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Upload document - To be implemented' });
  } catch (error) {
    next(error);
  }
};

exports.getClaimStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const claim = await Claim.findByPk(id, { attributes: ['status', 'updatedAt'] });
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });
    res.json({ success: true, data: claim });
  } catch (error) {
    next(error);
  }
};

exports.submitAppeal = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Submit appeal - To be implemented' });
  } catch (error) {
    next(error);
  }
};

exports.getAdjudicatorStats = async (req, res, next) => {
  try {
    if (req.user.role !== 'adjudicator' && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // 1. Pending Claims
    const pendingClaims = await Claim.count({
      where: { status: { [Op.in]: ['submitted', 'under_review', 'received'] } }
    });

    // 2. Processed Today (using simple count for now)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const processedToday = await Claim.count({
      where: {
        status: { [Op.in]: ['approved', 'rejected', 'denied', 'paid'] },
        updatedAt: { [Op.gte]: today }
      }
    });

    // 3. Approval Rate
    const totalProcessed = await Claim.count({
      where: { status: { [Op.in]: ['approved', 'rejected', 'denied', 'paid', 'partially_approved'] } }
    });
    const totalApproved = await Claim.count({
      where: { status: { [Op.in]: ['approved', 'paid', 'partially_approved'] } }
    });
    const approvalRate = totalProcessed > 0 ? Math.round((totalApproved / totalProcessed) * 100) : 100;

    // 4. Urgent Claims (high value or oldest)
    const urgentClaims = await Claim.findAll({
      where: { status: { [Op.in]: ['submitted', 'received'] } },
      order: [['totalAmount', 'DESC']],
      limit: 5
    });

    res.json({
      success: true,
      data: {
        pendingClaims,
        processedToday,
        approvalRate,
        avgProcessTime: '1.4d',
        urgentClaims: urgentClaims.map(c => ({
          id: `CLM-${c.id.substring(0, 8).toUpperCase()}`,
          realId: c.id,
          amount: parseFloat(c.totalAmount),
          reason: c.totalAmount > 100000 ? 'High Value Review' : 'Priority Queue',
          time: new Date(c.createdAt).toLocaleDateString('en-KE')
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.processClaim = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, approvedAmount, patientResponsibility, notes } = req.body;

    const claim = await Claim.findByPk(id);
    if (!claim) return res.status(404).json({ success: false, message: 'Claim not found' });

    await claim.update({
      status,
      approvedAmount: approvedAmount || claim.approvedAmount,
      patientResponsibility: patientResponsibility || claim.patientResponsibility,
      notes: notes || claim.notes
    });

    logger.info(`Claim ${id} processed as ${status} by ${req.user.userId}`);

    res.json({ success: true, message: 'Claim processed successfully', data: claim });
  } catch (error) {
    next(error);
  }
};
