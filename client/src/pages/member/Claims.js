import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Claims = () => {
  const [filter, setFilter] = useState('all');

  // Mock claims data
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch claims from API
    // Using a simple fetch for now, can be replaced with axios
    const fetchClaims = async () => {
      try {
        setLoading(true);
        // Assuming we have an auth context to get token, or axios interceptor handles it
        // For prototype, we'll try a direct fetch if proxy is set up, else simple mock fallback if fail
        const response = await fetch('/api/claims', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } // Simple token retrieval
        });
        const data = await response.json();

        if (data.success) {
          setClaims(data.data.claims);
        } else {
          // Fallback to empty if API fails (or handle error)
          setClaims([]);
        }
      } catch (error) {
        console.error("Failed to fetch claims:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [filter]); // Re-fetch if filter changes on server side, or client side filter below

  const getStatusBadge = (status) => {
    const styles = {
      submitted: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
      under_review: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
      approved: 'bg-green-500/10 text-green-600 border border-green-500/20',
      paid: 'bg-green-500/10 text-green-600 border border-green-500/20',
      denied: 'bg-red-500/10 text-red-600 border border-red-500/20',
      appealed: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
    };
    return styles[status] || 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredClaims = filter === 'all'
    ? claims
    : claims.filter(c => c.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Claims</h1>
          <p className="text-gray-500 mt-1">Track and manage your insurance claims</p>
        </div>
        <Link
          to="/member/claims/submit"
          className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
        >
          <span className="text-lg">+</span> Submit New Claim
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Claims</p>
              <p className="text-3xl font-bold text-white mt-1">{claims.length}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Billed</p>
              <p className="text-3xl font-bold text-white mt-1">
                ksh {claims.reduce((sum, c) => sum + parseFloat(c.totalAmount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💵</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Insurance Paid</p>
              <p className="text-3xl font-bold text-white mt-1">
                ksh {claims.reduce((sum, c) => sum + parseFloat(c.approvedAmount || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Your Responsibility</p>
              <p className="text-3xl font-bold text-white mt-1">
                ksh {claims.reduce((sum, c) => sum + parseFloat(c.patientResponsibility || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex gap-2 flex-wrap">
          {['all', 'submitted', 'under_review', 'approved', 'paid', 'denied'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === status
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {status === 'all' ? 'All Claims' : formatStatus(status)}
            </button>
          ))}
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Claim ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Service Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Billed
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-purple-600">{claim.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 flex items-center gap-2">
                      <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs">
                        {(claim.claimType === 'medical' || claim.claimType === 'Medical') && '🏥'}
                        {(claim.claimType === 'pharmacy' || claim.claimType === 'Pharmacy') && '💊'}
                        {(claim.claimType === 'dental' || claim.claimType === 'Dental') && '🦷'}
                        {(claim.claimType === 'vision' || claim.claimType === 'Vision') && '👓'}
                        {claim.claimType === 'mental_health' && '🧠'}
                      </span>
                      <span className="capitalize">{claim.claimType?.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.provider?.organizationName || 'Out-of-Network'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.serviceDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ksh {parseFloat(claim.totalAmount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {claim.approvedAmount ? `ksh ${parseFloat(claim.approvedAmount).toLocaleString()}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(claim.status)}`}>
                      {formatStatus(claim.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                        View
                      </button>
                      {claim.status === 'denied' && (
                        <button className="px-3 py-1.5 text-xs font-medium text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                          Appeal
                        </button>
                      )}
                    </div>
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

export default Claims;
