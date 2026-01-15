import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            // Fetch approved, rejected, and paid claims as history
            const res = await fetch('/api/claims?status=approved,rejected,paid,denied&limit=50', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const formatted = data.data.claims.map(c => ({
                    id: c.id,
                    displayId: `CLM-${c.id.substring(0, 8).toUpperCase()}`,
                    date: new Date(c.updatedAt).toLocaleDateString('en-KE'),
                    time: new Date(c.updatedAt).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
                    action: c.status.charAt(0).toUpperCase() + c.status.slice(1),
                    amount: parseFloat(c.approvedAmount || c.totalAmount),
                    member: c.policy?.member?.user ? `${c.policy.member.user.firstName} ${c.policy.member.user.lastName}` : 'Unknown'
                }));
                setHistory(formatted);
            }
        } catch (error) {
            toast.error('Failed to load adjudication history');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Adjudication History</h1>
                    <p className="text-gray-500 mt-1 font-medium">Audit trail of processed insurance claims</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">Loading Audit Trail...</div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Claims ID</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Processed On</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Member</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Settlement</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {history.length > 0 ? history.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-black text-gray-900">{item.displayId}</td>
                                        <td className="px-6 py-4 text-gray-500 font-medium">
                                            {item.date} <span className="text-[10px] font-black text-blue-500 ml-2 uppercase tracking-tighter">{item.time}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-700">{item.member}</td>
                                        <td className="px-6 py-4 font-black text-gray-900">ksh {item.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${item.action.toLowerCase() === 'approved' || item.action.toLowerCase() === 'paid'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : 'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {item.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link to={`/adjudicator/claims/${item.id}`} className="text-blue-600 hover:text-indigo-700 font-black text-[10px] uppercase tracking-widest">
                                                View Log
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest opacity-50">No processed claims found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};


export default History;
