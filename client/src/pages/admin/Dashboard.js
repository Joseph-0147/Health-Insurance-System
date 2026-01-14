import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClaim, setSelectedClaim] = useState(null);

  const stats = [
    { label: 'Total Members', value: '12,458', change: '+245 this month', icon: '👥', gradient: 'from-blue-400 to-blue-600' },
    { label: 'Active Claims', value: '1,847', change: '156 pending review', icon: '📋', gradient: 'from-yellow-400 to-orange-500' },
    { label: 'Total Providers', value: '892', change: '+12 this month', icon: '🏥', gradient: 'from-green-400 to-green-600' },
    { label: 'Revenue MTD', value: 'KES 24.5M', change: '+8.5% vs last month', icon: '💰', gradient: 'from-purple-500 to-pink-500' },
  ];

  const pendingClaims = [
    { id: 'CLM-2024-1847', member: 'Kamau Njoroge', provider: 'Nairobi Hospital', type: 'Inpatient', amount: 154200, submitted: '2024-12-20', priority: 'high' },
    { id: 'CLM-2024-1846', member: 'Wanjiku Mwangi', provider: 'Aga Khan University Hospital', type: 'Office Visit', amount: 4500, submitted: '2024-12-20', priority: 'normal' },
    { id: 'CLM-2024-1845', member: 'Otieno Ochieng', provider: 'Lancet Laboratories', type: 'Lab Work', amount: 8900, submitted: '2024-12-19', priority: 'normal' },
    { id: 'CLM-2024-1844', member: 'Amina Abdi', provider: 'Coast General Hospital', type: 'Emergency', amount: 87500, submitted: '2024-12-19', priority: 'high' },
    { id: 'CLM-2024-1843', member: 'Michael Kimani', provider: 'Goodlife Pharmacy', type: 'Pharmacy', amount: 3400, submitted: '2024-12-18', priority: 'low' },
  ];

  const recentActivities = [
    { action: 'Claim Approved', detail: 'CLM-2024-1842 - KES 23,400', user: 'Admin Sarah', time: '5 min ago', icon: '✓', color: 'from-green-400 to-green-500' },
    { action: 'New Member', detail: 'Emily Wanjiru enrolled in PPO Plan', user: 'System', time: '15 min ago', icon: '👤', color: 'from-blue-400 to-blue-500' },
    { action: 'Provider Added', detail: 'Metro Health Clinic - Westlands', user: 'Admin John', time: '1 hour ago', icon: '🏥', color: 'from-purple-400 to-purple-500' },
    { action: 'Claim Denied', detail: 'CLM-2024-1838 - Pre-auth required', user: 'Admin Sarah', time: '2 hours ago', icon: '✕', color: 'from-red-400 to-red-500' },
    { action: 'Policy Updated', detail: 'Employer Safaricom PLC - added 5 members', user: 'System', time: '3 hours ago', icon: '📋', color: 'from-orange-400 to-orange-500' },
  ];

  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-500/10 text-red-600 border border-red-500/20',
      normal: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      low: 'bg-gray-500/10 text-gray-600 border border-gray-500/20',
    };
    return styles[priority] || 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
  };

  const handleClaimAction = (claim, action) => {
    toast.success(`Claim ${claim.id} marked as ${action}`);
    setSelectedClaim(null);
  };

  const inputClassName = "px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">System overview and management</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/reports" className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-gray-700 flex items-center gap-2">
            <span>📊</span> Export Reports
          </Link>
          <Link to="/admin/settings" className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2">
            <span>⚙️</span> System Settings
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-gradient-to-r ${stat.gradient} p-5 rounded-2xl shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-white/70 text-xs mt-1">{stat.change}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50">
          <nav className="flex overflow-x-auto">
            {['overview', 'claims', 'members', 'providers', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize transition-all whitespace-nowrap ${activeTab === tab
                  ? 'border-b-2 border-purple-500 text-purple-600 bg-white'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm">📡</span>
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                      <div className={`w-8 h-8 bg-gradient-to-r ${activity.color} rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600 truncate">{activity.detail}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.user} · {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">📊</span>
                    Claims by Status
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700 font-medium">Pending Review</span>
                        <span className="font-bold text-gray-900">156</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-1/4 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700 font-medium">In Processing</span>
                        <span className="font-bold text-gray-900">342</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-1/2 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700 font-medium">Approved</span>
                        <span className="font-bold text-gray-900">1,245</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-4/5 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700 font-medium">Denied</span>
                        <span className="font-bold text-gray-900">104</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-[8%] h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm">⚡</span>
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/admin/reports" className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all text-left group">
                      <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-white text-sm">📊</span>
                      </span>
                      <span className="text-sm font-semibold text-gray-900 block">Generate Report</span>
                    </Link>
                    <Link to="/admin/users" className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all text-left group">
                      <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-white text-sm">👤</span>
                      </span>
                      <span className="text-sm font-semibold text-gray-900 block">Manage Users</span>
                    </Link>
                    <Link to="/admin/users" className="p-3 bg-gradient-to-r from-green-50 to-green-100 border border-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all text-left group">
                      <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-white text-sm">🏥</span>
                      </span>
                      <span className="text-sm font-semibold text-gray-900 block">Add Provider</span>
                    </Link>
                    <Link to="/admin/settings" className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all text-left group">
                      <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <span className="text-white text-sm">⚙️</span>
                      </span>
                      <span className="text-sm font-semibold text-gray-900 block">System Config</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Claims Tab */}
          {activeTab === 'claims' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Search claims..."
                    className={`${inputClassName} w-72`}
                  />
                  <select className={inputClassName}>
                    <option>All Priorities</option>
                    <option>High Priority</option>
                    <option>Normal</option>
                    <option>Low</option>
                  </select>
                </div>
                <span className="text-sm text-gray-500 bg-yellow-100 px-3 py-1 rounded-full font-medium text-yellow-700">
                  {pendingClaims.length} claims pending review
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Claim ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-purple-600">{claim.id}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{claim.member}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{claim.provider}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">{claim.type}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">KES {claim.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityBadge(claim.priority)}`}>
                            {claim.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedClaim(claim)}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Claim Review Modal */}
              {selectedClaim && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                      <div className="flex justify-between items-start">
                        <div className="text-white">
                          <h3 className="text-xl font-bold">Review Claim</h3>
                          <p className="text-white/80">{selectedClaim.id}</p>
                        </div>
                        <button onClick={() => setSelectedClaim(null)} className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-all">✕</button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Member</p>
                          <p className="font-semibold text-gray-900 mt-1">{selectedClaim.member}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Provider</p>
                          <p className="font-semibold text-gray-900 mt-1">{selectedClaim.provider}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Service Type</p>
                          <p className="font-semibold text-gray-900 mt-1">{selectedClaim.type}</p>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                          <p className="text-xs text-purple-600 uppercase tracking-wide">Claimed Amount</p>
                          <p className="font-bold text-2xl text-purple-600 mt-1">KES {selectedClaim.amount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Adjudication Notes</label>
                        <textarea
                          rows={3}
                          className={`${inputClassName} w-full`}
                          placeholder="Enter notes for this claim..."
                        ></textarea>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleClaimAction(selectedClaim, 'denied')}
                          className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all font-medium"
                        >
                          Deny Claim
                        </button>
                        <button
                          onClick={() => handleClaimAction(selectedClaim, 'requested more info')}
                          className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                        >
                          Request Info
                        </button>
                        <button
                          onClick={() => handleClaimAction(selectedClaim, 'approved')}
                          className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-lg"
                        >
                          Approve Claim
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-5 rounded-2xl shadow-lg">
                  <p className="text-white/80 text-sm font-medium">Active Members</p>
                  <p className="text-3xl font-bold text-white mt-1">11,892</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-5 rounded-2xl shadow-lg">
                  <p className="text-white/80 text-sm font-medium">Pending Enrollment</p>
                  <p className="text-3xl font-bold text-white mt-1">234</p>
                </div>
                <div className="bg-gradient-to-r from-gray-400 to-gray-600 p-5 rounded-2xl shadow-lg">
                  <p className="text-white/80 text-sm font-medium">Terminated</p>
                  <p className="text-3xl font-bold text-white mt-1">332</p>
                </div>
              </div>
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <p className="text-gray-500 font-medium">Member management interface</p>
                <p className="text-gray-400 text-sm mt-1">Search, add, and edit members</p>
              </div>
            </div>
          )}

          {/* Providers Tab */}
          {activeTab === 'providers' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-green-400 to-green-600 p-5 rounded-2xl shadow-lg">
                  <p className="text-white/80 text-sm font-medium">In-Network Providers</p>
                  <p className="text-3xl font-bold text-white mt-1">756</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-5 rounded-2xl shadow-lg">
                  <p className="text-white/80 text-sm font-medium">Out-of-Network</p>
                  <p className="text-3xl font-bold text-white mt-1">136</p>
                </div>
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-5 rounded-2xl shadow-lg">
                  <p className="text-white/80 text-sm font-medium">Pending Credentialing</p>
                  <p className="text-3xl font-bold text-white mt-1">28</p>
                </div>
              </div>
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏥</span>
                </div>
                <p className="text-gray-500 font-medium">Provider management interface</p>
                <p className="text-gray-400 text-sm mt-1">Credentialing, contracts, network management</p>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm">📈</span>
                    Claims Trend (Last 6 Months)
                  </h4>
                  <div className="h-48 flex items-end justify-around gap-2">
                    {[65, 78, 82, 74, 88, 92].map((value, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div
                          className="w-12 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg shadow-lg"
                          style={{ height: `${value * 1.5}px` }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2 font-medium">
                          {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm">💰</span>
                    Revenue vs Claims Paid
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700 font-medium">Premium Revenue</span>
                        <span className="font-bold text-gray-900">KES 24.5M</span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-full h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700 font-medium">Claims Paid</span>
                        <span className="font-bold text-gray-900">KES 18.2M</span>
                      </div>
                      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-3/4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Loss Ratio</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">75%</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Target: below 80%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
