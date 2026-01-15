import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Claims = () => {
    const [filter, setFilter] = useState('all');
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClaims();
    }, [filter]);

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const statusParam = filter !== 'all' ? `&status=${filter}` : '';
            const res = await fetch(`/api/claims?limit=50${statusParam}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const formatted = data.data.claims.map(c => ({
                    id: `CLM-${c.id.substring(0, 8).toUpperCase()}`,
                    patient: c.policy?.member?.user ? `${c.policy.member.user.firstName} ${c.policy.member.user.lastName}` : 'Unknown Patient',
                    service: c.notes || 'Medical Service',
                    amount: parseFloat(c.totalAmount),
                    status: c.status,
                    date: new Date(c.serviceDate).toLocaleDateString('en-KE')
                }));
                setClaims(formatted);
            }
        } catch (error) {
            toast.error('Failed to load claims');
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            submitted: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
            pending: 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20',
            received: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
            under_review: 'bg-purple-500/10 text-purple-600 border border-purple-500/20',
            approved: 'bg-green-500/10 text-green-600 border border-green-500/20',
            denied: 'bg-red-500/10 text-red-600 border border-red-500/20',
            paid: 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20',
        };
        return styles[status] || 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Claims Tracking</h1>
                    <p className="text-gray-500 mt-1">Monitor the status of your practice submissions</p>
                </div>
                <Link
                    to="/provider/claims/submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg font-bold flex items-center gap-2"
                >
                    <span>+</span> Submit New Claim
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4 overflow-x-auto bg-gray-50/50 scrollbar-hide">
                    {['all', 'submitted', 'under_review', 'approved', 'paid', 'denied'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filter === f
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            {f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 font-medium">Loading claims...</div>
                    ) : (
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Claim ID</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Service</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {claims.length > 0 ? claims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-purple-600 group-hover:text-pink-600 transition-colors uppercase">{claim.id}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium text-sm">{claim.patient}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm truncate max-w-[200px]">{claim.service}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{claim.date}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900 text-sm">Ksh {claim.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${getStatusBadge(claim.status)}`}>
                                                {claim.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="px-3 py-1 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg text-xs font-bold transition-all uppercase">Detail</button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="p-12 text-center text-gray-500 font-medium italic">No claims found matching filters.</td>
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

export default Claims;
