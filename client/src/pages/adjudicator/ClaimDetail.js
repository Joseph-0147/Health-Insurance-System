import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ClaimDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [claim, setClaim] = useState(null);
    const [actionData, setActionData] = useState({
        approvedAmount: 0,
        patientResponsibility: 0,
        notes: ''
    });

    useEffect(() => {
        fetchClaimDetails();
    }, [id]);

    const fetchClaimDetails = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`/api/claims/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setClaim(data.data);
                setActionData({
                    approvedAmount: parseFloat(data.data.totalAmount),
                    patientResponsibility: 0,
                    notes: ''
                });
            } else {
                toast.error(data.message || 'Claim not found');
                navigate('/adjudicator/claims');
            }
        } catch (error) {
            toast.error('Failed to load claim details');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (status) => {
        setProcessing(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`/api/claims/${id}/process`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status,
                    approvedAmount: actionData.approvedAmount,
                    patientResponsibility: actionData.patientResponsibility,
                    notes: actionData.notes
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`Claim ${status === 'approved' ? 'Approved' : 'Rejected'} successfully`);
                navigate('/adjudicator/claims');
            } else {
                toast.error(data.message || 'Action failed');
            }
        } catch (error) {
            toast.error('Failed to process claim');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="py-20 text-center text-gray-400 font-black uppercase tracking-widest">Fetching Claim Data...</div>;
    if (!claim) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <Link to="/adjudicator/claims" className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
                            ←
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Adjudication: CLM-{claim.id.substring(0, 8).toUpperCase()}</h1>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleAction('rejected')}
                        disabled={processing}
                        className="px-6 py-2.5 border-2 border-red-100 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white hover:border-red-600 transition-all font-black uppercase text-xs tracking-widest disabled:opacity-50"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => handleAction('approved')}
                        disabled={processing}
                        className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl shadow-xl hover:shadow-blue-200/50 hover:scale-[1.02] transition-all font-black uppercase text-xs tracking-widest disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : 'Approve Claim'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Adjudication */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8 border-l-4 border-blue-600 pl-4">Financial adjudication</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Billed Amount</p>
                                <p className="text-3xl font-black text-gray-900">ksh {parseFloat(claim.totalAmount).toLocaleString()}</p>
                            </div>
                            <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 block">Allowed Amount (ksh)</label>
                                <input
                                    type="number"
                                    value={actionData.approvedAmount}
                                    onChange={(e) => setActionData({ ...actionData, approvedAmount: parseFloat(e.target.value) })}
                                    className="w-full bg-transparent text-3xl font-black text-blue-700 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Adjudicator Notes & Rational</label>
                                <textarea
                                    value={actionData.notes}
                                    onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                                    placeholder="Enter reason for approval/rejection..."
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium min-h-[120px]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Clinical Details */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-8 border-l-4 border-indigo-600 pl-4">Clinical Evidence</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-50">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">ICD-10 Diagnosis</p>
                                <div className="flex flex-wrap gap-2">
                                    {claim.diagnosisCodes?.map(code => (
                                        <span key={code} className="px-3 py-1 bg-white border border-indigo-100 text-indigo-700 rounded-lg text-xs font-bold uppercase">{code}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-5 bg-teal-50/30 rounded-2xl border border-teal-50">
                                <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2">CPT Procedures</p>
                                <div className="flex flex-wrap gap-2">
                                    {claim.procedureCodes?.map(code => (
                                        <span key={code} className="px-3 py-1 bg-white border border-teal-100 text-teal-700 rounded-lg text-xs font-bold uppercase">{code}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Supporting Documentation</p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 text-gray-600 rounded-2xl text-xs font-bold border border-gray-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all cursor-pointer">
                                    <span>📄</span> Medical_Records.pdf
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span> Beneficiary
                        </h3>
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-700 font-black text-lg">
                                    {claim.policy?.member?.user?.firstName?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-black text-gray-900">{claim.policy?.member?.user ? `${claim.policy.member.user.firstName} ${claim.policy.member.user.lastName}` : 'N/A'}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase">MEM-{claim.policy?.member?.id?.substring(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                            <div className="pt-5 border-t border-gray-50 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Coverage</span>
                                    <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[9px] font-black uppercase tracking-tighter">{claim.policy?.status || 'ACTIVE'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Plan Type</span>
                                    <span className="text-xs font-bold text-gray-700">{claim.policy?.type === 'family' ? 'Family Gold' : 'Individual'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-600 rounded-full"></span> Provider
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Facility Name</p>
                                <p className="text-sm font-bold text-gray-900">{claim.provider?.organizationName || 'Individual Provider'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Provider ID / KMPDC</p>
                                <p className="text-xs font-mono font-bold text-indigo-600">{claim.provider?.npi || 'PRV-10293'}</p>
                            </div>
                            <div className="pt-4">
                                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-[10px] font-black uppercase tracking-tighter">In-Network Facility</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimDetail;
