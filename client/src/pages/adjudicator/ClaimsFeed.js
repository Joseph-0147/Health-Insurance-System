import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ClaimsFeed = () => {
    const [filter, setFilter] = useState('submitted');
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, [filter]);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`/api/claims?status=${filter}&limit=100`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const formatted = data.data.claims.map(c => ({
                    id: c.id,
                    displayId: `CLM-${c.id.substring(0, 8).toUpperCase()}`,
                    provider: c.provider?.organizationName || 'Direct Submission',
                    member: c.policy?.member?.user ? `${c.policy.member.user.firstName} ${c.policy.member.user.lastName}` : 'Unknown',
                    amount: parseFloat(c.totalAmount),
                    date: new Date(c.serviceDate).toLocaleDateString('en-KE'),
                    priority: parseFloat(c.totalAmount) > 100000 ? 'High' : (parseFloat(c.totalAmount) > 20000 ? 'Medium' : 'Low')
                }));
                setClaims(formatted);
            }
        } catch (error) {
            toast.error('Failed to load claims feed');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-red-50 text-red-700 border-red-100 font-bold uppercase text-[10px]';
            case 'medium': return 'bg-orange-50 text-orange-700 border-orange-100 font-bold uppercase text-[10px]';
            default: return 'bg-gray-50 text-gray-700 border-gray-100 font-bold uppercase text-[10px]';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Review Queue</h1>
                    <p className="text-gray-500 mt-1 font-medium">Claims awaiting adjudication and processing</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/30 flex gap-4">
                    {['submitted', 'received', 'under_review'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-100'
                                }`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest">Refreshing queue...</div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Provider</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Member</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Service Date</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Level</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {claims.length > 0 ? claims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-4 font-black text-blue-600 group-hover:text-indigo-700">{claim.displayId}</td>
                                        <td className="px-6 py-4 text-gray-900 font-bold text-sm">{claim.provider}</td>
                                        <td className="px-6 py-4 text-gray-500 font-medium text-sm">{claim.member}</td>
                                        <td className="px-6 py-4 font-black text-gray-900">ksh {claim.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-400 font-mono italic">{claim.date}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full border ${getPriorityColor(claim.priority)}`}>
                                                {claim.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/adjudicator/claims/${claim.id}`}
                                                className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-xs font-black uppercase tracking-tight shadow-sm"
                                            >
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest opacity-50">Queue is currently empty</td>
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


export default ClaimsFeed;
