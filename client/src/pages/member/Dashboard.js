import React from 'react';
import { Link } from 'react-router-dom';

const MemberDashboard = () => {
  const stats = [
    {
      title: 'Active Policy',
      value: 'Premium PPO',
      subtitle: 'Valid until Dec 2025',
      gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
      icon: '🛡️',
      change: 'Active',
      changeType: 'positive'
    },
    {
      title: 'Claims YTD',
      value: '3',
      subtitle: '$2,450 total claimed',
      gradient: 'bg-gradient-to-r from-green-500 to-teal-500',
      icon: '📋',
      change: '+1 this month',
      changeType: 'neutral'
    },
    {
      title: 'Deductible',
      value: '$1,200',
      subtitle: 'of $2,000 met',
      gradient: 'bg-gradient-to-r from-orange-500 to-pink-500',
      icon: '💰',
      change: '60% complete',
      changeType: 'positive'
    },
    {
      title: 'Out-of-Pocket',
      value: '$3,400',
      subtitle: 'of $6,000 max',
      gradient: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      icon: '📊',
      change: '43% used',
      changeType: 'neutral'
    },
  ];

  const recentClaims = [
    { id: 'CLM-2024-001', provider: 'Aga Khan University Hospital', date: 'Dec 15, 2024', amount: 12500, status: 'approved', service: 'General Consultation' },
    { id: 'CLM-2024-002', provider: 'Nairobi Hospital', date: 'Dec 10, 2024', amount: 45000, status: 'pending', service: 'Lab Tests' },
    { id: 'CLM-2023-089', provider: 'Goodlife Pharmacy', date: 'Nov 28, 2024', amount: 3200, status: 'approved', service: 'Medication' },
  ];

  const quickActions = [
    { label: 'Annual Limit', value: 'KES 5.0M', change: '85% remaining', icon: '🛡️', gradient: 'from-blue-400 to-blue-600' },
    { label: 'Deductible', value: 'KES 25,000', change: 'KES 15,000 used', icon: '📉', gradient: 'from-purple-400 to-purple-600' },
    { label: 'Active Claims', value: '2', change: 'KES 45,000 pending', icon: '📝', gradient: 'from-orange-400 to-orange-600' },
    { label: 'Next Premium', value: 'KES 12,450', change: 'Due Jan 1', icon: '💰', gradient: 'from-green-400 to-green-600' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      denied: 'bg-red-100 text-red-800',
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

      {/* Stat Cards - Corona Style */}
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
                      <span className="font-bold text-gray-900">KES {claim.amount.toLocaleString()}</span>
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Coverage Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">Deductible Progress</p>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">$1,200 of $2,000</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Out-of-Pocket Maximum</p>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full" style={{ width: '43%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">$3,400 of $6,000</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Preventive Care Used</p>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">1 of 4 visits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
