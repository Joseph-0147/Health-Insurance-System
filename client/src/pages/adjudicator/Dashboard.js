import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdjudicatorDashboard = () => {
    const [stats, setStats] = useState([
        { label: 'Pending Claims', value: '...', change: 'Loading', icon: '📥', gradient: 'from-blue-500 to-indigo-600' },
        { label: 'Processed Today', value: '...', change: 'Target: 25', icon: '✅', gradient: 'from-green-500 to-emerald-600' },
        { label: 'Avg Process Time', value: '...', change: 'Tracking...', icon: '⏱️', gradient: 'from-orange-500 to-red-500' },
        { label: 'Approval Rate', value: '...', change: 'MTD', icon: '📊', gradient: 'from-purple-500 to-violet-600' },
    ]);
    const [urgentClaims, setUrgentClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/claims/adjudicator-stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                const s = data.data;
                setStats([
                    { label: 'Pending Claims', value: s.pendingClaims.toString(), change: '+5 since login', icon: '📥', gradient: 'from-blue-500 to-indigo-600' },
                    { label: 'Processed Today', value: s.processedToday.toString(), change: 'Target: 25', icon: '✅', gradient: 'from-green-500 to-emerald-600' },
                    { label: 'Avg Process Time', value: s.avgProcessTime || '1.4d', change: '-0.3d vs avg', icon: '⏱️', gradient: 'from-orange-500 to-red-500' },
                    { label: 'Approval Rate', value: `${s.approvalRate}%`, change: 'Lifetime avg', icon: '📊', gradient: 'from-purple-500 to-violet-600' },
                ]);
                setUrgentClaims(s.urgentClaims);
            }
        } catch (error) {
            console.error('Error fetching adjudicator stats:', error);
            toast.error('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Adjudicator Command Center</h1>
                    <p className="text-gray-500 mt-1">Real-time claim processing and analytics</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchStats}
                        className="p-2.5 text-gray-400 hover:text-blue-600 bg-white rounded-xl border border-gray-100 shadow-sm transition-all"
                        title="Refresh Data"
                    >
                        🔄
                    </button>
                    <Link
                        to="/adjudicator/claims"
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-bold tracking-tight hover:scale-[1.02]"
                    >
                        Review Queue
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className={`bg-gradient-to-br ${stat.gradient} p-5 rounded-2xl shadow-lg text-white`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black mt-1">{stat.value}</p>
                                <p className="text-white/70 text-[10px] mt-1 font-medium">{stat.change}</p>
                            </div>
                            <div className="text-2xl opacity-50">{stat.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
                        <span className="text-red-500">🔥</span> High Priority Queue
                    </h2>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="py-12 text-center text-gray-400 font-medium">Loading priority claims...</div>
                        ) : urgentClaims.length > 0 ? urgentClaims.map((claim) => (
                            <Link
                                key={claim.id}
                                to={`/adjudicator/claims/${claim.realId}`}
                                className="flex justify-between items-center p-4 bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 rounded-2xl transition-all group"
                            >
                                <div>
                                    <p className="font-bold text-gray-900 group-hover:text-red-700">{claim.id}</p>
                                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">{claim.reason}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900">ksh {claim.amount.toLocaleString()}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{claim.time}</p>
                                </div>
                            </Link>
                        )) : (
                            <div className="py-12 text-center text-gray-400 font-medium italic">No urgent claims pending!</div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-hidden">
                    <h2 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">Productivity Trend</h2>
                    <div className="h-44 flex items-end justify-around gap-2 px-2">
                        {[12, 19, 15, 22, 18, 25, 20].map((val, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 max-w-[40px]">
                                <div className="w-full bg-blue-50 rounded-t-lg relative group overflow-hidden">
                                    <div
                                        className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-lg transition-all duration-700 group-hover:from-indigo-600"
                                        style={{ height: `${(val / 25) * 100}%` }}
                                    ></div>
                                    <div className="h-32 w-full opacity-0"></div>
                                </div>
                                <span className="text-[9px] font-bold text-gray-400 mt-2 uppercase">Day {i + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AdjudicatorDashboard;
