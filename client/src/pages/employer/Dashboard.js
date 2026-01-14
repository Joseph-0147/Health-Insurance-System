import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Employees', value: 48, change: '+3 this month', icon: '👥', gradient: 'from-blue-400 to-blue-600' },
    { label: 'Active Policies', value: 52, change: 'Including dependents', icon: '📋', gradient: 'from-green-400 to-green-600' },
    { label: 'Monthly Premium', value: 'KES 1,245,000', change: 'Due Jan 1', icon: '💰', gradient: 'from-purple-500 to-pink-500' },
    { label: 'Claims YTD', value: 156, change: 'KES 8.9M total', icon: '📊', gradient: 'from-orange-400 to-orange-600' },
  ];

  const employees = [
    { id: 1, name: 'John Kimani', email: 'john.kimani@company.com', plan: 'Family PPO', status: 'active', dependents: 3, enrolled: '2024-01-15' },
    { id: 2, name: 'Sarah Wambui', email: 'sarah.w@company.com', plan: 'Individual HMO', status: 'active', dependents: 0, enrolled: '2024-02-01' },
    { id: 3, name: 'Michael Omondi', email: 'm.omondi@company.com', plan: 'Family PPO', status: 'active', dependents: 2, enrolled: '2024-01-15' },
    { id: 4, name: 'Emily Chebet', email: 'emily.c@company.com', plan: 'Individual PPO', status: 'pending', dependents: 0, enrolled: '2024-12-20' },
    { id: 5, name: 'Robert Maina', email: 'r.maina@company.com', plan: 'Family HMO', status: 'terminated', dependents: 4, enrolled: '2023-06-01' },
  ];

  const invoices = [
    { id: 'INV-2024-012', period: 'December 2024', amount: 1245000, status: 'pending', due: '2025-01-01' },
    { id: 'INV-2024-011', period: 'November 2024', amount: 1198000, status: 'paid', due: '2024-12-01' },
    { id: 'INV-2024-010', period: 'October 2024', amount: 1198000, status: 'paid', due: '2024-11-01' },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-500/10 text-green-600 border border-green-500/20',
      pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
      terminated: 'bg-red-500/10 text-red-600 border border-red-500/20',
      paid: 'bg-green-500/10 text-green-600 border border-green-500/20',
    };
    return styles[status] || 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
  };

  const inputClassName = "px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your organization's health benefits</p>
        </div>
        <Link to="/employer/employees/add" className="px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2">
          <span>+</span> Add Employee
        </Link>
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
          <nav className="flex">
            {['overview', 'employees', 'billing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium capitalize transition-all ${activeTab === tab
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
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">📊</span>
                  Plan Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Family PPO</span>
                    <div className="flex items-center gap-3">
                      <div className="w-36 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-3/5 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12 text-right">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Individual PPO</span>
                    <div className="flex items-center gap-3">
                      <div className="w-36 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-1/4 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12 text-right">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">HMO Plans</span>
                    <div className="flex items-center gap-3">
                      <div className="w-36 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-[15%] h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12 text-right">15%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm">⚡</span>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all text-left group">
                    <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <span className="text-white">📄</span>
                    </span>
                    <span className="text-sm font-semibold text-gray-900 block">Download Census</span>
                  </button>
                  <Link to="/employer/reports" className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all text-left group">
                    <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <span className="text-white">📊</span>
                    </span>
                    <span className="text-sm font-semibold text-gray-900 block">View Reports</span>
                  </Link>
                  <Link to="/employer/support" className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all text-left group">
                    <span className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <span className="text-white">📧</span>
                    </span>
                    <span className="text-sm font-semibold text-gray-900 block">Contact Support</span>
                  </Link>
                  <Link to="/employer/settings" className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all text-left group">
                    <span className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <span className="text-white">⚙️</span>
                    </span>
                    <span className="text-sm font-semibold text-gray-900 block">Plan Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Employees Tab */}
          {activeTab === 'employees' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <input
                  type="text"
                  placeholder="Search employees..."
                  className={`${inputClassName} w-72`}
                />
                <select className={inputClassName}>
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Terminated</option>
                </select>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dependents</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{emp.name}</p>
                              <p className="text-sm text-gray-500">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{emp.plan}</td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                            {emp.dependents}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{emp.enrolled}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(emp.status)}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-purple-600 hover:text-pink-600 text-sm font-medium transition-colors">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-6 shadow-lg">
                <div className="flex justify-between items-center">
                  <div className="text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">💳</span>
                      Next Payment Due
                    </h3>
                    <p className="text-white/90 text-2xl font-bold mt-2">KES 1,245,000</p>
                    <p className="text-white/70 text-sm mt-1">December 2024 Premium • Due by January 1, 2025</p>
                  </div>
                  <button className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition-all font-bold shadow-lg">
                    Pay Now
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm">📋</span>
                <h3 className="text-lg font-bold text-gray-900">Invoice History</h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-purple-600">{inv.id}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{inv.period}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">KES {inv.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{inv.due}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(inv.status)}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-purple-600 hover:text-pink-600 text-sm font-medium transition-colors">Download</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
