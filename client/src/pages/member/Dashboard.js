import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  const [stats, setStats] = useState([
    {
      title: 'Active Policy',
      value: 'Loading...',
      subtitle: '-',
      gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
      icon: '🛡️',
      change: 'Active',
      changeType: 'positive'
    },
    {
      title: 'Claims YTD',
      value: '0',
      subtitle: 'ksh 0 total',
      gradient: 'bg-gradient-to-r from-green-500 to-teal-500',
      icon: '📋',
      change: '0 this month',
      changeType: 'neutral'
    },
    {
      title: 'Deductible',
      value: 'ksh 0',
      subtitle: 'of ksh 0 met',
      gradient: 'bg-gradient-to-r from-orange-500 to-pink-500',
      icon: '💰',
      change: '0% complete',
      changeType: 'positive'
    },
    {
      title: 'Coverage Limit',
      value: 'ksh 0',
      subtitle: 'Annual max',
      gradient: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      icon: '📊',
      change: 'Active',
      changeType: 'neutral'
    },
  ]);

  const [recentClaims, setRecentClaims] = useState([]);
  const [policyData, setPolicyData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Policies
        const policyRes = await fetch('/api/policies/my-policies', { headers });
        const policies = await policyRes.json();
        const activePolicy = policies.data && policies.data.length > 0 ? policies.data[0] : null;
        setPolicyData(activePolicy);

        // Fetch Claims (for stats)
        const claimsRes = await fetch('/api/claims', { headers });
        const claimsData = await claimsRes.json();
        const claims = claimsData.data?.claims || [];

        // Set recent claims (top 5)
        setRecentClaims(claims.slice(0, 5).map(c => ({
          id: c.id,
          provider: c.provider?.organizationName || 'Out-of-Network',
          date: new Date(c.serviceDate).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' }),
          amount: parseFloat(c.totalAmount || 0),
          status: c.status,
          service: Array.isArray(c.diagnosisCodes) && c.diagnosisCodes.length > 0 ? c.diagnosisCodes.join(', ') : (c.claimType || 'Medical')
        })));

        // Calculate Stats
        const totalClaims = claims.length;
        const totalClaimed = claims.reduce((acc, c) => acc + (c.totalAmount || 0), 0);
        const pendingClaims = claims.filter(c => c.status === 'pending').length;

        // Update Stats State
        setStats(prev => [
          {
            ...prev[0],
            value: activePolicy ? (activePolicy.type === 'family' ? 'Family Plan' : 'Individual Plan') : 'No Active Plan',
            subtitle: activePolicy ? `Valid until ${new Date(activePolicy.endDate).toLocaleDateString()}` : 'Enroll to get covered',
            change: activePolicy?.status === 'active' ? 'Active' : 'Inactive'
          },
          {
            ...prev[1],
            value: totalClaims.toString(),
            subtitle: `ksh ${totalClaimed.toLocaleString()} total`,
            change: `${pendingClaims} pending`
          },
          {
            ...prev[2],
            value: activePolicy ? `ksh ${(activePolicy.deductible || 0).toLocaleString()}` : 'ksh 0',
            subtitle: 'Annual deductible',
            change: 'Per year'
          },
          {
            ...prev[3],
            value: activePolicy ? `ksh ${(activePolicy.coverageLimit || 0).toLocaleString()}` : 'ksh 0',
            subtitle: 'Maximum coverage',
            change: 'Annual limit'
          }
        ]);

      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, []);

  // Quick Actions - with proper paths and colors
  const quickActions = [
    { label: 'Enroll in Policy', path: '/member/enroll', icon: '🛡️', color: 'from-emerald-500 to-green-600' },
    { label: 'Submit a Claim', path: '/member/claims/submit', icon: '📝', color: 'from-purple-500 to-pink-500' },
    { label: 'View ID Card', path: '/member/id-card', icon: '💳', color: 'from-blue-500 to-indigo-500' },
    { label: 'Find a Provider', path: '/member/providers', icon: '🏥', color: 'from-green-500 to-teal-500' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      denied: 'bg-red-100 text-red-800',
      paid: 'bg-blue-100 text-blue-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back! 👋</h1>
        <p className="text-gray-500 mt-1">Here's an overview of your health insurance benefits</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.gradient} rounded-xl p-6 text-white shadow-lg transform hover:-translate-y-1 transition-all duration-300`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.title}</p>
                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center text-2xl">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-white/70 text-sm">{stat.subtitle}</p>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Claims */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Recent Claims</h2>
            <Link to="/member/claims" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            {recentClaims.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Provider</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentClaims.map((claim) => (
                    <tr key={claim.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">ksh {claim.amount.toLocaleString()}</span>
                        <p className="text-xs text-gray-500 mt-1">{claim.service}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{claim.provider}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{claim.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <span className="text-4xl mb-2 block">📋</span>
                <p className="font-medium">No claims yet</p>
                <p className="text-sm mt-1">Submit your first claim to see it here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className={`flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${action.color} text-white hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-medium">{action.label}</span>
                <span className="ml-auto">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Coverage Summary */}
      <div className="mt-6 bg-white rounded-xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Coverage Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Deductible</p>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">ksh 0 of ksh {policyData?.deductible?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Coverage Used</p>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full" style={{ width: '0%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">ksh 0 of ksh {policyData?.coverageLimit?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Policy Status</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`w-3 h-3 rounded-full ${policyData?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              <span className="text-sm font-medium text-gray-700 capitalize">{policyData?.status || 'No Policy'}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {policyData?.policyNumber || 'Enroll to get coverage'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
