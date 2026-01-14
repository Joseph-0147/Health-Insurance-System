import React from 'react';
import { Link } from 'react-router-dom';

const AgentDashboard = () => {
    const stats = [
        {
            title: 'New Enrollments',
            value: '12',
            subtitle: 'This week',
            gradient: 'bg-gradient-to-r from-indigo-500 to-blue-600',
            icon: '📝',
            change: '+15%',
            changeType: 'positive'
        },
        {
            title: 'Pending Approvals',
            value: '5',
            subtitle: 'Requires attention',
            gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
            icon: '⏳',
            change: '2 urgent',
            changeType: 'negative'
        },
        {
            title: 'Total Policies',
            value: '1,240',
            subtitle: 'Active portfolio',
            gradient: 'bg-gradient-to-r from-green-500 to-teal-500',
            icon: '🛡️',
            change: '+8 this month',
            changeType: 'positive'
        },
        {
            title: 'Risk Alerts',
            value: '3',
            subtitle: 'High risk flagged',
            gradient: 'bg-gradient-to-r from-red-500 to-pink-600',
            icon: '⚠️',
            change: 'New alert',
            changeType: 'negative'
        },
    ];

    const recentApprovals = [
        { id: 'POL-2024-001', applicant: 'James Kimani', plan: 'Gold Family', riskScore: 15, status: 'pending' },
        { id: 'POL-2024-002', applicant: 'Maria Odhiambo', plan: 'Silver Individual', riskScore: 85, status: 'flagged' },
        { id: 'POL-2024-003', applicant: 'Robert Cheruiyot', plan: 'Platinum PPO', riskScore: 5, status: 'approved' },
    ];

    const quickActions = [
        { label: 'New Enrollment', icon: '📝', path: '/agent/enrollment', color: 'from-blue-500 to-indigo-600' },
        { label: 'Risk Assessment', icon: '⚖️', path: '/agent/risk-assessments', color: 'from-purple-500 to-pink-600' },
        { label: 'Policy Lookup', icon: '🔍', path: '/agent/policies', color: 'from-green-500 to-teal-600' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            approved: 'bg-green-100 text-green-800',
            pending: 'bg-yellow-100 text-yellow-800',
            flagged: 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div>
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage enrollments, policies, and risk assessments.</p>
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
                {/* Pending Approvals / Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-card overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                        <Link to="/agent/policies" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Application ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Plan</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Risk Score</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentApprovals.map((app) => (
                                    <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-blue-600">{app.id}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{app.applicant}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{app.plan}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            <span className={app.riskScore > 50 ? 'text-red-600' : 'text-green-600'}>
                                                {app.riskScore}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(app.status)}`}>
                                                {app.status}
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
        </div>
    );
};

export default AgentDashboard;
