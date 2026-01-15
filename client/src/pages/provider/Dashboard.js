import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProviderDashboard = () => {
  const [eligibilityCheck, setEligibilityCheck] = useState({ memberId: '', dob: '' });
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Patients', value: '0', change: 'Calculating...', icon: '👥', gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Pending Claims', value: '0', change: 'Ksh 0 value', icon: '📝', gradient: 'from-orange-500 to-red-600' },
    { label: 'Approvals', value: '0%', change: 'Last 30 days', icon: '✅', gradient: 'from-green-500 to-emerald-600' },
    { label: 'Revenue MTD', value: 'Ksh 0', change: 'This month', icon: '💰', gradient: 'from-purple-500 to-violet-600' },
  ]);
  const [recentClaims, setRecentClaims] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Fetch Stats
      const statsRes = await fetch('/api/claims/provider-stats', { headers });
      const statsData = await statsRes.json();
      if (statsData.success) {
        const s = statsData.data;
        setStats([
          { label: 'Total Patients', value: s.totalPatients.toLocaleString(), change: 'Across all history', icon: '👥', gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Pending Claims', value: s.pendingClaims.toString(), change: `Ksh ${s.pendingValue.toLocaleString()} value`, icon: '📝', gradient: 'from-orange-500 to-red-600' },
          { label: 'Approvals', value: `${s.approvalRate}%`, change: 'Lifetime rate', icon: '✅', gradient: 'from-green-500 to-emerald-600' },
          { label: 'Revenue MTD', value: `Ksh ${(s.revenueMTD / 1e6).toFixed(1)}M`, change: 'Settled this month', icon: '💰', gradient: 'from-purple-500 to-violet-600' },
        ]);
      }

      // 2. Fetch Recent Claims
      const claimsRes = await fetch('/api/claims?limit=5', { headers });
      const claimsData = await claimsRes.json();
      if (claimsData.success) {
        const formattedClaims = claimsData.data.claims.map(c => ({
          id: `CLM-${c.id.substring(0, 8).toUpperCase()}`,
          patient: c.policy?.member?.user ? `${c.policy.member.user.firstName} ${c.policy.member.user.lastName}` : 'Unknown Patient',
          service: c.notes || 'Medical Service',
          amount: parseFloat(c.totalAmount),
          status: c.status,
          date: new Date(c.serviceDate).toLocaleDateString('en-KE')
        }));
        setRecentClaims(formattedClaims);
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleEligibilityCheck = async (e) => {
    e.preventDefault();
    if (!eligibilityCheck.memberId || !eligibilityCheck.dob) {
      toast.warning('Please enter both Member ID and Date of Birth');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/providers/verify-eligibility', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eligibilityCheck)
      });
      const data = await res.json();
      if (data.success) {
        setEligibilityResult({
          eligible: data.eligible,
          ...data.data
        });
        if (data.eligible) {
          toast.success('Patient is eligible!');
        } else {
          toast.error(data.message || 'Patient not eligible');
        }
      } else {
        toast.error(data.message || 'Check failed');
        setEligibilityResult(null);
      }
    } catch (error) {
      console.error('Eligibility check error:', error);
      toast.error('Failed to verify eligibility');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      submitted: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
      approved: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      paid: 'bg-green-500/10 text-green-600 border border-green-500/20',
      rejected: 'bg-red-500/10 text-red-600 border border-red-500/20',
      denied: 'bg-red-500/10 text-red-600 border border-red-500/20',
    };
    return styles[status] || 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
  };

  const inputClassName = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your practice overview.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
          title="Refresh Dashboard"
        >
          🔄
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-r ${stat.gradient} p-5 rounded-2xl shadow-lg border border-white/10`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                {stat.change && <p className="text-white/70 text-xs mt-1">{stat.change}</p>}
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eligibility Verification */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md">✓</span>
              Verify Patient Eligibility
            </h2>
          </div>
          <div className="p-6 flex-1">
            <form onSubmit={handleEligibilityCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member ID</label>
                <input
                  type="text"
                  value={eligibilityCheck.memberId}
                  onChange={(e) => setEligibilityCheck({ ...eligibilityCheck, memberId: e.target.value })}
                  placeholder="e.g., MEM-2024-XXXXXX"
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
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl font-bold"
              >
                Check Eligibility
              </button>
            </form>

            {eligibilityResult && (
              <div className={`mt-6 p-4 rounded-xl border ${eligibilityResult.eligible
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                }`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${eligibilityResult.eligible ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {eligibilityResult.eligible ? '✓' : '!'}
                  </span>
                  <span className={`font-bold text-lg ${eligibilityResult.eligible ? 'text-green-800' : 'text-red-800'
                    }`}>
                    {eligibilityResult.eligible ? 'Patient is Eligible' : 'Ineligible / Not Found'}
                  </span>
                </div>
                {eligibilityResult.memberName && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50 shadow-sm">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Patient Name</span>
                      <p className="font-bold text-gray-900">{eligibilityResult.memberName}</p>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50 shadow-sm">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Coverage Status</span>
                      <p className={`font-bold ${eligibilityResult.eligible ? 'text-green-600' : 'text-red-600'}`}>
                        {eligibilityResult.coverageStatus}
                      </p>
                    </div>
                    {eligibilityResult.eligible && (
                      <>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50 shadow-sm">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Plan</span>
                          <p className="font-bold text-gray-900 truncate">{eligibilityResult.planName}</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50 shadow-sm">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Copay</span>
                          <p className="font-bold text-gray-900">{eligibilityResult.copay}</p>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm shadow-md">⚡</span>
              Practice Management
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/provider/claims/submit" className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all text-left group shadow-sm">
                <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-white text-lg">📝</span>
                </span>
                <span className="font-bold text-gray-900 block">Submit Claim</span>
                <p className="text-xs text-gray-500 mt-1">File a new medical claim</p>
              </Link>
              <Link to="/provider/patients" className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all text-left group shadow-sm">
                <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-white text-lg">👥</span>
                </span>
                <span className="font-bold text-gray-900 block">Patient Roster</span>
                <p className="text-xs text-gray-500 mt-1">View treated patients</p>
              </Link>
              <Link to="/provider/claims" className="p-4 bg-gradient-to-br from-green-50 to-teal-50 border border-green-100 rounded-xl hover:from-green-100 hover:to-teal-100 transition-all text-left group shadow-sm">
                <span className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-white text-lg">📄</span>
                </span>
                <span className="font-bold text-gray-900 block">Payment Advice</span>
                <p className="text-xs text-gray-500 mt-1">Check settlement status</p>
              </Link>
              <Link to="/provider/profile" className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all text-left group shadow-sm">
                <span className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                  <span className="text-white text-lg">🏥</span>
                </span>
                <span className="font-bold text-gray-900 block">Facility Profile</span>
                <p className="text-xs text-gray-500 mt-1">Manage office details</p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Claims Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">📋</span>
            Recent Claims
          </h2>
          <Link to="/provider/claims" className="px-4 py-2 bg-purple-50 text-purple-600 font-bold text-sm rounded-lg hover:bg-purple-100 transition-colors">
            View All History
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentClaims.length > 0 ? (
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Claim ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Service</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-purple-600 group-hover:text-pink-600 transition-colors">{claim.id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{claim.patient}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{claim.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Ksh {claim.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{claim.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter shadow-sm ${getStatusBadge(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-gray-500 font-medium">No recent claims found for your practice.</p>
              <Link to="/provider/claims/submit" className="mt-4 inline-block text-purple-600 font-bold hover:underline">
                Submit your first claim →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
