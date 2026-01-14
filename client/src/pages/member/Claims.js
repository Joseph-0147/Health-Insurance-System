import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Claims = () => {
  const [filter, setFilter] = useState('all');

  // Mock claims data
  const claims = [
    {
      id: 'CLM-2024-001',
      type: 'Medical',
      provider: 'City General Hospital',
      serviceDate: '2024-12-15',
      billedAmount: 1250.00,
      allowedAmount: 1000.00,
      paidAmount: 800.00,
      memberResponsibility: 200.00,
      status: 'paid',
      submittedDate: '2024-12-16',
    },
    {
      id: 'CLM-2024-002',
      type: 'Pharmacy',
      provider: 'CVS Pharmacy',
      serviceDate: '2024-12-10',
      billedAmount: 150.00,
      allowedAmount: 120.00,
      paidAmount: 96.00,
      memberResponsibility: 24.00,
      status: 'paid',
      submittedDate: '2024-12-11',
    },
    {
      id: 'CLM-2024-003',
      type: 'Dental',
      provider: 'Smile Dental Care',
      serviceDate: '2024-12-18',
      billedAmount: 500.00,
      allowedAmount: null,
      paidAmount: null,
      memberResponsibility: null,
      status: 'under_review',
      submittedDate: '2024-12-19',
    },
    {
      id: 'CLM-2024-004',
      type: 'Vision',
      provider: 'EyeCare Associates',
      serviceDate: '2024-12-05',
      billedAmount: 300.00,
      allowedAmount: 250.00,
      paidAmount: 0,
      memberResponsibility: 250.00,
      status: 'denied',
      denialReason: 'Service not covered under current plan',
      submittedDate: '2024-12-06',
    },
  ];

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
                ${claims.reduce((sum, c) => sum + c.billedAmount, 0).toLocaleString()}
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
                ${claims.reduce((sum, c) => sum + (c.paidAmount || 0), 0).toLocaleString()}
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
                ${claims.reduce((sum, c) => sum + (c.memberResponsibility || 0), 0).toLocaleString()}
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
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === status
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
                        {claim.type === 'Medical' && '🏥'}
                        {claim.type === 'Pharmacy' && '💊'}
                        {claim.type === 'Dental' && '🦷'}
                        {claim.type === 'Vision' && '👓'}
                      </span>
                      {claim.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {claim.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(claim.serviceDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${claim.billedAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {claim.paidAmount !== null ? `$${claim.paidAmount.toLocaleString()}` : '-'}
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
