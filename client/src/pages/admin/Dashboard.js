import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);


  const getPriorityBadge = (priority) => {
    const styles = {
      high: 'bg-red-500/10 text-red-600 border border-red-500/20',
      normal: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      low: 'bg-gray-500/10 text-gray-600 border border-gray-500/20',
    };
    return styles[priority] || 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStatsData(data.data);
      }
    } catch (error) {
      toast.error('Failed to load system statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAnalyticsData(data.data);
      }
    } catch (error) {
      toast.error('Failed to load system analytics');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      setClaimsLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/admin/claims', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setPendingClaims(data.data);
      }
    } catch (error) {
      toast.error('Failed to load pending claims');
    } finally {
      setClaimsLoading(false);
    }
  };

  const getStatsArray = () => {
    if (!statsData) return [];
    return [
      { label: 'Total Members', value: statsData.totalMembers.toLocaleString(), change: 'Live from system', icon: '👥', gradient: 'from-blue-400 to-blue-600' },
      { label: 'Active Claims', value: statsData.activeClaims.toLocaleString(), change: 'Pending review', icon: '📋', gradient: 'from-yellow-400 to-orange-500' },
      { label: 'Total Providers', value: statsData.totalProviders.toLocaleString(), change: 'Registered network', icon: '🏥', gradient: 'from-green-400 to-green-600' },
      { label: 'Revenue MTD', value: `ksh ${(statsData.revenueMTD / 1000000).toFixed(1)}M`, change: 'Current month total', icon: '💰', gradient: 'from-purple-500 to-pink-500' },
    ];
  };

  const handleClaimAction = async (claim, action) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`/api/claims/${claim.id}/process`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action === 'approved' ? 'approved' : 'denied' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Claim ${claim.displayId} marked as ${action}`);
        fetchClaims();
        fetchStats();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to process claim');
    }
    setSelectedClaim(null);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'claims') {
      fetchClaims();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

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
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl"></div>
          ))
        ) : getStatsArray().map((stat, index) => (
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
                  {!loading && statsData?.recentActivities?.length > 0 ? statsData.recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
                      <div className={`w-8 h-8 bg-gradient-to-r ${activity.success ? 'from-green-400 to-green-500' : 'from-red-400 to-red-500'} rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0`}>
                        {activity.success ? '✓' : '!'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 capitalize">{activity.action.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-gray-600 truncate">{activity.detail}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.user} · {new Date(activity.time).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="py-10 text-center text-gray-400 uppercase text-xs font-black tracking-widest">No recent logs</div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">📊</span>
                    Claims by Status
                  </h3>
                  <div className="space-y-4">
                    {loading ? (
                      [...Array(4)].map((_, i) => <div key={i} className="h-8 bg-gray-50 animate-pulse rounded-lg"></div>)
                    ) : statsData?.statusDistribution ? (
                      ['submitted', 'under_review', 'approved', 'rejected'].map((status) => {
                        const count = statsData.statusDistribution.find(d => d.status === status)?.count || 0;
                        const total = statsData.statusDistribution.reduce((acc, curr) => acc + parseInt(curr.count), 0) || 1;
                        const percentage = Math.round((count / total) * 100);
                        const colors = {
                          submitted: 'from-blue-400 to-blue-500',
                          under_review: 'from-yellow-400 to-orange-500',
                          approved: 'from-green-400 to-green-600',
                          rejected: 'from-red-400 to-red-600'
                        };
                        return (
                          <div key={status}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-gray-700 font-medium capitalize">{status.replace('_', ' ')}</span>
                              <span className="font-bold text-gray-900">{count}</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-3 bg-gradient-to-r ${colors[status]} rounded-full transition-all duration-1000`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-10 text-center text-gray-400 text-xs font-black uppercase tracking-widest">No stats available</div>
                    )}
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
                    {claimsLoading ? (
                      <tr>
                        <td colSpan="7" className="py-20 text-center text-gray-400 font-black uppercase tracking-widest animate-pulse">Fetching Claim Queue...</td>
                      </tr>
                    ) : pendingClaims.length > 0 ? pendingClaims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-purple-600">{claim.displayId}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{claim.member}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{claim.provider}</td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-lg uppercase tracking-wider">{claim.type}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">ksh {claim.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${getPriorityBadge(claim.priority)}`}>
                            {claim.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedClaim(claim)}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-black rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all uppercase tracking-widest"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest opacity-50">No pending claims found in queue</td>
                      </tr>
                    )}
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
                          <p className="font-bold text-2xl text-purple-600 mt-1">ksh {selectedClaim.amount.toLocaleString()}</p>
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
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-tight">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm shadow-sm">📈</span>
                    Claims Volume (Last 6 Months)
                  </h4>
                  <div className="h-64 flex items-end justify-around gap-2 px-2">
                    {analyticsLoading ? (
                      [...Array(6)].map((_, i) => <div key={i} className="w-12 bg-gray-100 animate-pulse rounded-t-lg h-32"></div>)
                    ) : analyticsData?.monthlyTrend?.length > 0 ? analyticsData.monthlyTrend.map((item, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 group">
                        <div className="relative w-full flex justify-center items-end h-48">
                          <div
                            className="w-10 bg-gradient-to-t from-purple-500 to-indigo-600 rounded-t-lg shadow-lg group-hover:from-purple-600 group-hover:to-indigo-700 transition-all duration-500"
                            style={{ height: `${(item.count / Math.max(...analyticsData.monthlyTrend.map(m => m.count))) * 100}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                              {item.count}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-3 font-black uppercase tracking-tighter">
                          {new Date(item.month).toLocaleDateString('en-KE', { month: 'short' })}
                        </span>
                      </div>
                    )) : (
                      <div className="w-full py-10 text-center text-gray-400 text-xs font-black uppercase tracking-widest opacity-50">No trend data found</div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-tight">
                    <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm shadow-sm">💰</span>
                    Financial Health Index
                  </h4>
                  <div className="space-y-6 pt-4">
                    {analyticsLoading ? (
                      <div className="space-y-4 animate-pulse">
                        <div className="h-10 bg-gray-50 rounded-lg"></div>
                        <div className="h-10 bg-gray-50 rounded-lg"></div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Projected Revenue</span>
                            <span className="font-black text-gray-900">ksh {statsData?.revenueMTD?.toLocaleString() || 0}</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                            <div className="w-full h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Claims Payout</span>
                            <span className="font-black text-gray-900">ksh {(analyticsData?.monthlyTrend?.reduce((acc, curr) => acc + parseFloat(curr.total), 0) / 6).toLocaleString(undefined, { maximumFractionDigits: 0 })} (avg/mo)</span>
                          </div>
                          <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                            <div className="w-[65%] h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="font-black text-gray-900 text-xs uppercase tracking-widest">Medical Loss Ratio</span>
                            <span className="text-3xl font-black bg-gradient-to-r from-green-500 to-indigo-600 bg-clip-text text-transparent">68.4%</span>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-2 font-medium">Standard baseline: 80%. Your system is operating within high profitability margins.</p>
                        </div>
                      </>
                    )}
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
