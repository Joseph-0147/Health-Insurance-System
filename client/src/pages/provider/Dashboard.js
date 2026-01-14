import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProviderDashboard = () => {
  const [eligibilityCheck, setEligibilityCheck] = useState({ memberId: '', dob: '' });
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const stats = [
    { label: 'Total Patients', value: '1,248', change: '+12 this week', icon: '👥', gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Pending Claims', value: '23', change: 'KES 450,000 value', icon: '📝', gradient: 'from-orange-500 to-red-600' },
    { label: 'Approvals', value: '94%', change: 'Last 30 days', icon: '✅', gradient: 'from-green-500 to-emerald-600' },
    { label: 'Revenue MTD', value: 'KES 2.4M', change: '+8% vs last month', icon: '💰', gradient: 'from-purple-500 to-violet-600' },
  ];

  const recentClaims = [
    { id: 'CLM-2024-001', patient: 'Kamau Njoroge', service: 'General Consultation', amount: 4500, status: 'pending', date: '2024-01-14' },
    { id: 'CLM-2024-002', patient: 'Wanjiku Mwangi', service: 'Lab Work - Complete Blood Count', amount: 8200, status: 'approved', date: '2024-01-13' },
    { id: 'CLM-2024-003', patient: 'Otieno Ochieng', service: 'X-Ray Chest', amount: 5500, status: 'processing', date: '2024-01-12' },
    { id: 'CLM-2024-004', patient: 'Amina Abdi', service: 'Emergency Care', amount: 25000, status: 'approved', date: '2024-01-12' },
  ];

  const handleEligibilityCheck = (e) => {
    e.preventDefault();
    // Mock eligibility check
    setEligibilityResult({
      eligible: true,
      memberName: 'John Doe',
      planName: 'Premium PPO',
      copay: 'KES 500',
      deductibleMet: 'KES 12,000 of KES 20,000',
      coverageStatus: 'Active',
    });
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
      approved: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      paid: 'bg-green-500/10 text-green-600 border border-green-500/20',
      denied: 'bg-red-500/10 text-red-600 border border-red-500/20',
      processing: 'bg-purple-500/10 text-purple-600 border border-purple-500/20', // Added for 'processing' status
    };
    return styles[status] || 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
  };

  const inputClassName = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your practice overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-r ${stat.gradient} p-5 rounded-2xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                {stat.change && <p className="text-white/70 text-xs mt-1">{stat.change}</p>}
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligibility Verification */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center text-white text-sm">✓</span>
              Verify Patient Eligibility
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleEligibilityCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member ID</label>
                <input
                  type="text"
                  value={eligibilityCheck.memberId}
                  onChange={(e) => setEligibilityCheck({ ...eligibilityCheck, memberId: e.target.value })}
                  placeholder="Enter member ID"
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={eligibilityCheck.dob}
                  onChange={(e) => setEligibilityCheck({ ...eligibilityCheck, dob: e.target.value })}
                  className={inputClassName}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all shadow-lg hover:shadow-xl font-medium"
              >
                Check Eligibility
              </button>
            </form>

            {eligibilityResult && (
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">✓</span>
                  <span className="font-bold text-green-800 text-lg">Patient is Eligible</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Name</span>
                    <p className="font-semibold text-gray-900">{eligibilityResult.memberName}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Plan</span>
                    <p className="font-semibold text-gray-900">{eligibilityResult.planName}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Copay</span>
                    <p className="font-semibold text-gray-900">{eligibilityResult.copay}</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Deductible</span>
                    <p className="font-semibold text-gray-900">{eligibilityResult.deductibleMet}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">⚡</span>
              Quick Actions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/provider/claims/submit" className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all text-left group">
                <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-white">📝</span>
                </span>
                <span className="font-semibold text-gray-900 block">Submit Claim</span>
                <p className="text-sm text-gray-500 mt-1">File a new claim</p>
              </Link>
              <Link to="/provider/patients" className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all text-left group">
                <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-white">👥</span>
                </span>
                <span className="font-semibold text-gray-900 block">Patient Roster</span>
                <p className="text-sm text-gray-500 mt-1">View assigned patients</p>
              </Link>
              <Link to="/provider/claims" className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all text-left group">
                <span className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-white">📄</span>
                </span>
                <span className="font-semibold text-gray-900 block">EOB History</span>
                <p className="text-sm text-gray-500 mt-1">View payment history</p>
              </Link>
              <Link to="/provider/reports" className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all text-left group">
                <span className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-white">📊</span>
                </span>
                <span className="font-semibold text-gray-900 block">Reports</span>
                <p className="text-sm text-gray-500 mt-1">Generate reports</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Claims Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm">📋</span>
            Recent Claims
          </h2>
          <Link to="/provider/claims" className="text-purple-600 font-medium text-sm hover:text-pink-600 transition-colors">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-purple-600">{claim.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{claim.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">KES {claim.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(claim.status)}`}>
                      {claim.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
