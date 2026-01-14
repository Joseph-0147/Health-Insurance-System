import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Claims = () => {
    const [filter, setFilter] = useState('all');

    const claims = [
        { id: 'CLM-2024-001', patient: 'Kamau Njoroge', service: 'General Consultation', amount: 4500, status: 'pending', date: '2024-01-14' },
        { id: 'CLM-2024-002', patient: 'Wanjiku Mwangi', service: 'Lab Work - Complete Blood Count', amount: 8200, status: 'approved', date: '2024-01-13' },
        { id: 'CLM-2024-003', patient: 'Otieno Ochieng', service: 'X-Ray Chest', amount: 5500, status: 'processing', date: '2024-01-12' },
        { id: 'CLM-2024-004', patient: 'Amina Abdi', service: 'Emergency Care', amount: 25000, status: 'approved', date: '2024-01-12' },
        { id: 'CLM-2024-005', patient: 'John Kimani', service: 'Dental Clean', amount: 3500, status: 'paid', date: '2024-01-10' },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
            approved: 'bg-green-500/10 text-green-600 border border-green-500/20',
            paid: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
            processing: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
            denied: 'bg-red-500/10 text-red-600 border border-red-500/20',
        };
        return styles[status] || 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
    };

    const filteredClaims = filter === 'all' ? claims : claims.filter(c => c.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
                    <p className="text-gray-500 mt-1">View and manage patient claims</p>
                </div>
                <Link
                    to="/provider/claims/submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg font-medium flex items-center gap-2"
                >
                    <span>+</span> New Claim
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4 overflow-x-auto bg-gray-50/50">
                    {['all', 'pending', 'approved', 'paid', 'processing'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f
                                    ? 'bg-purple-500 text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Claim ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredClaims.map((claim) => (
                                <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-purple-600">{claim.id}</td>
                                    <td className="px-6 py-4 text-gray-900">{claim.patient}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{claim.service}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{claim.date}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">KES {claim.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadge(claim.status)}`}>
                                            {claim.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Details</button>
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
