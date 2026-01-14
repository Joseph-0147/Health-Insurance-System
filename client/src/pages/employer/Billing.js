import React from 'react';

const Billing = () => {
    const invoices = [
        { id: 'INV-2024-012', period: 'December 2024', amount: 1245000, status: 'pending', due: '2025-01-01' },
        { id: 'INV-2024-011', period: 'November 2024', amount: 1245000, status: 'paid', due: '2024-12-01' },
        { id: 'INV-2024-010', period: 'October 2024', amount: 1242000, status: 'paid', due: '2024-11-01' },
        { id: 'INV-2024-009', period: 'September 2024', amount: 1238000, status: 'paid', due: '2024-10-01' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
                    <p className="text-gray-500 mt-1">Manage invoices and payment methods</p>
                </div>
                <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center gap-2">
                    <span>💳</span> Payment Methods
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Invoice ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Period</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-purple-600">{inv.id}</td>
                                    <td className="px-6 py-4 text-gray-900">{inv.period}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">KES {inv.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{inv.due}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
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

export default Billing;
