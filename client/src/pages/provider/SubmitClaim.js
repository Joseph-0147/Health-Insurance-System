import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProviderSubmitClaim = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [memberInfo, setMemberInfo] = useState(null);
    const [formData, setFormData] = useState({
        memberId: '',
        dob: '',
        policyId: '',
        claimType: 'medical',
        serviceDate: new Date().toISOString().split('T')[0],
        billedAmount: '',
        diagnosisCodes: '',
        procedureCodes: '',
        description: '',
        documents: [],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVerifyMember = async () => {
        if (!formData.memberId || !formData.dob) {
            toast.warning('Member ID and DOB required for verification');
            return;
        }

        setVerifying(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/providers/verify-eligibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ memberId: formData.memberId, dob: formData.dob })
            });
            const data = await res.json();
            if (data.success && data.eligible) {
                setMemberInfo(data.data);
                // Automatically set policyId if returned
                // We need to make sure verifyEligibility returns policyId
                // I'll update the controller to return policyId
                setFormData(prev => ({ ...prev, policyId: data.data.policyId || '' }));
                toast.success(`Verified: ${data.data.memberName}`);
            } else {
                toast.error(data.message || 'Patient not eligible');
                setMemberInfo(null);
            }
        } catch (error) {
            toast.error('Failed to verify member');
        } finally {
            setVerifying(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, documents: [...formData.documents, ...files] });
    };

    const removeFile = (index) => {
        const newDocs = formData.documents.filter((_, i) => i !== index);
        setFormData({ ...formData, documents: newDocs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!memberInfo || !formData.policyId) {
            toast.error('Please verify patient eligibility first');
            setStep(1);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');

            // Format codes as arrays
            const diagnosisCodes = formData.diagnosisCodes.split(',').map(c => c.trim()).filter(c => c);
            const procedureCodes = formData.procedureCodes.split(',').map(c => c.trim()).filter(c => c);

            const payload = {
                policyId: formData.policyId,
                claimType: formData.claimType,
                serviceDate: formData.serviceDate,
                billedAmount: parseFloat(formData.billedAmount),
                diagnosisCodes,
                procedureCodes,
                description: formData.description
            };

            const res = await fetch('/api/claims', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (data.success) {
                toast.success('Claim submitted successfully!');
                navigate('/provider/claims');
            } else {
                toast.error(data.message || 'Submission failed');
            }
        } catch (error) {
            toast.error('Failed to submit claim');
        } finally {
            setLoading(false);
        }
    };

    const inputClassName = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medical Claim Submission</h1>
                    <p className="text-gray-500 mt-1">Submit a real-time claim for patient reimbursement</p>
                </div>
                <Link
                    to="/provider/dashboard"
                    className="px-4 py-2 bg-white text-gray-700 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
                >
                    <span>←</span> Dashboard
                </Link>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-center">
                    {[
                        { num: 1, label: 'Verification' },
                        { num: 2, label: 'Claim Details' },
                        { num: 3, label: 'Review' }
                    ].map((s, idx) => (
                        <React.Fragment key={s.num}>
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${step > s.num
                                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg'
                                        : step === s.num
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110'
                                            : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    {step > s.num ? '✓' : s.num}
                                </div>
                                <span className={`mt-2 text-[10px] uppercase font-bold tracking-widest ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {idx < 2 && (
                                <div className={`w-20 h-1 mx-2 rounded-full transition-all ${step > s.num ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Step 1: Patient Verification */}
                {step === 1 && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">👤</span>
                                <h2 className="text-xl font-bold text-gray-900">Verify Patient Coverage</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Member ID *</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="memberId"
                                        value={formData.memberId}
                                        onChange={handleChange}
                                        placeholder="e.g. MEM-2024-XXXXXX"
                                        className={inputClassName}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Patient Date of Birth *</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className={inputClassName}
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleVerifyMember}
                            disabled={verifying}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-md ${verifying
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl'
                                }`}
                        >
                            {verifying ? '🔄 Verifying...' : 'Verify Beneficiary Coverage'}
                        </button>

                        {memberInfo && (
                            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center text-xl shadow-md">✓</div>
                                    <div>
                                        <h3 className="text-lg font-bold text-green-900">{memberInfo.memberName}</h3>
                                        <p className="text-green-700 text-sm font-medium">Valid Policy: {memberInfo.policyNumber}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/60 p-3 rounded-xl border border-white">
                                        <p className="text-[10px] uppercase font-bold text-gray-500">Plan</p>
                                        <p className="font-bold text-gray-800">{memberInfo.planName}</p>
                                    </div>
                                    <div className="bg-white/60 p-3 rounded-xl border border-white">
                                        <p className="text-[10px] uppercase font-bold text-gray-500">PCP Copay</p>
                                        <p className="font-bold text-gray-800">{memberInfo.copay}</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-lg transition-all flex items-center gap-2"
                                    >
                                        Proceed to Claim Details <span>→</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Claim Details */}
                {step === 2 && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">📝</span>
                            <h2 className="text-xl font-bold text-gray-900">Claim Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type *</label>
                                <select
                                    name="claimType"
                                    value={formData.claimType}
                                    onChange={handleChange}
                                    className={inputClassName}
                                >
                                    <option value="medical">🏥 Medical</option>
                                    <option value="dental">🦷 Dental</option>
                                    <option value="vision">👓 Vision</option>
                                    <option value="pharmacy">💊 Pharmacy</option>
                                    <option value="mental_health">🧠 Mental Health</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Service *</label>
                                <input
                                    type="date"
                                    name="serviceDate"
                                    value={formData.serviceDate}
                                    onChange={handleChange}
                                    required
                                    max={new Date().toISOString().split('T')[0]}
                                    className={inputClassName}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Billed Amount (Ksh) *</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="billedAmount"
                                        value={formData.billedAmount}
                                        onChange={handleChange}
                                        required
                                        placeholder="0.00"
                                        className={inputClassName}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis Codes (ICD-10)</label>
                                <input
                                    type="text"
                                    name="diagnosisCodes"
                                    value={formData.diagnosisCodes}
                                    onChange={handleChange}
                                    placeholder="e.g. J06.9, R05 (comma separated)"
                                    className={inputClassName}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Procedure Codes (CPT)</label>
                                <input
                                    type="text"
                                    name="procedureCodes"
                                    value={formData.procedureCodes}
                                    onChange={handleChange}
                                    placeholder="e.g. 99213 (comma separated)"
                                    className={inputClassName}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Reason / Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Describe the service provided..."
                                className={inputClassName}
                            />
                        </div>

                        <div className="flex justify-between pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all font-bold"
                            >
                                ← Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                                Review Submission →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">✓</span>
                            <h2 className="text-xl font-bold text-gray-900">Review & Certify</h2>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Patient</p>
                                    <p className="font-bold text-gray-900">{memberInfo?.memberName}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Policy Number</p>
                                    <p className="font-mono font-bold text-gray-900">{memberInfo?.policyNumber}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Service Date</p>
                                    <p className="font-bold text-gray-900">{formData.serviceDate}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Billed Amount</p>
                                    <p className="font-bold text-xl text-purple-600">Ksh {parseFloat(formData.billedAmount || 0).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl flex gap-3">
                            <span className="text-xl">⚖️</span>
                            <div className="text-sm text-orange-800">
                                <p className="font-bold">Provider Certification</p>
                                <p className="mt-1">By submitting this claim, I certify that the services described were medically necessary and provided to this patient on the date indicated.</p>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all font-bold"
                            >
                                ← Edit
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-10 py-3 rounded-xl font-bold shadow-lg transition-all ${loading
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl'
                                    }`}
                            >
                                {loading ? 'Submitting...' : 'Submit Final Claim'}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProviderSubmitClaim;
