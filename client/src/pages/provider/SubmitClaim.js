import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProviderSubmitClaim = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        patientId: '',
        patientName: '',
        claimType: '',
        serviceDate: '',
        diagnosisCodes: '',
        procedureCodes: '',
        billedAmount: '',
        description: '',
        documents: [],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, documents: [...formData.documents, ...files] });
    };

    const removeFile = (index) => {
        const newDocs = formData.documents.filter((_, i) => i !== index);
        setFormData({ ...formData, documents: newDocs });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success('Claim submitted successfully! Claim ID: CLM-2024-PROV-001');
        navigate('/provider/claims');
    };

    const patients = [
        { id: 'PAT-001', name: 'John Doe', dob: '1985-05-12' },
        { id: 'PAT-002', name: 'Jane Smith', dob: '1992-08-23' },
        { id: 'PAT-003', name: 'Robert Johnson', dob: '1978-11-30' },
    ];

    const inputClassName = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Provider Claim Submission</h1>
                    <p className="text-gray-500 mt-1">Submit a claim on behalf of a patient</p>
                </div>
                <Link
                    to="/provider/dashboard"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 font-medium"
                >
                    <span>←</span> Back to Dashboard
                </Link>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-center">
                    {[
                        { num: 1, label: 'Patient & Service' },
                        { num: 2, label: 'Documents' },
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
                                <span className={`mt-2 text-sm font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
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
                {/* Step 1: Patient & Service Information */}
                {step === 1 && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">👤</span>
                            <h2 className="text-xl font-bold text-gray-900">Patient & Service Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Patient *</label>
                                <select
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={(e) => {
                                        const patient = patients.find(p => p.id === e.target.value);
                                        setFormData({
                                            ...formData,
                                            patientId: e.target.value,
                                            patientName: patient?.name || ''
                                        });
                                    }}
                                    required
                                    className={inputClassName}
                                >
                                    <option value="">Select patient</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (DOB: {p.dob})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Claim Type *</label>
                                <select
                                    name="claimType"
                                    value={formData.claimType}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                >
                                    <option value="">Select claim type</option>
                                    <option value="medical">🏥 Medical</option>
                                    <option value="dental">🦷 Dental</option>
                                    <option value="vision">👓 Vision</option>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Billed Amount *</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                                    <input
                                        type="number"
                                        name="billedAmount"
                                        value={formData.billedAmount}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className={`${inputClassName} pl-8`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis Codes</label>
                                <input
                                    type="text"
                                    name="diagnosisCodes"
                                    value={formData.diagnosisCodes}
                                    onChange={handleChange}
                                    placeholder="e.g., J06.9, R05"
                                    className={inputClassName}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Procedure Codes</label>
                                <input
                                    type="text"
                                    name="procedureCodes"
                                    value={formData.procedureCodes}
                                    onChange={handleChange}
                                    placeholder="e.g., 99213, 99214"
                                    className={inputClassName}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes / Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Brief description of the service provided"
                                className={inputClassName}
                            />
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
                            >
                                Next: Upload Documents <span>→</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Upload Documents (Same as Member) */}
                {step === 2 && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">📎</span>
                            <h2 className="text-xl font-bold text-gray-900">Upload Supporting Documents</h2>
                        </div>

                        <div className="border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-3xl text-white">📄</span>
                                </div>
                                <p className="text-gray-700 font-semibold text-lg">Drop files here or click to upload</p>
                                <p className="text-sm text-gray-500 mt-2">PDF, JPG, PNG, DOC up to 10MB each</p>
                            </label>
                        </div>

                        {formData.documents.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <span>📁</span> Uploaded Files ({formData.documents.length})
                                </h3>
                                {formData.documents.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <span className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">📄</span>
                                            <span className="text-sm font-medium text-gray-700">{file.name}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
                            >
                                <span>←</span> Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
                            >
                                Next: Review <span>→</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review & Submit */}
                {step === 3 && (
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">✓</span>
                            <h2 className="text-xl font-bold text-gray-900">Review Claim Details</h2>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 space-y-4 border border-purple-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-xl p-4">
                                    <p className="text-sm text-gray-500">Patient</p>
                                    <p className="font-semibold text-gray-900">{formData.patientName}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4">
                                    <p className="text-sm text-gray-500">Claim Type</p>
                                    <p className="font-semibold text-gray-900 capitalize">{formData.claimType.replace('_', ' ')}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4">
                                    <p className="text-sm text-gray-500">Date of Service</p>
                                    <p className="font-semibold text-gray-900">{formData.serviceDate ? new Date(formData.serviceDate).toLocaleDateString() : '-'}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4">
                                    <p className="text-sm text-gray-500">Billed Amount</p>
                                    <p className="font-bold text-2xl text-purple-600">${parseFloat(formData.billedAmount || 0).toFixed(2)}</p>
                                </div>
                            </div>

                            {(formData.diagnosisCodes || formData.procedureCodes) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {formData.diagnosisCodes && (
                                        <div className="bg-white rounded-xl p-4">
                                            <p className="text-sm text-gray-500">Diagnosis Codes</p>
                                            <p className="font-mono font-semibold text-gray-900">{formData.diagnosisCodes}</p>
                                        </div>
                                    )}
                                    {formData.procedureCodes && (
                                        <div className="bg-white rounded-xl p-4">
                                            <p className="text-sm text-gray-500">Procedure Codes</p>
                                            <p className="font-mono font-semibold text-gray-900">{formData.procedureCodes}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="bg-white rounded-xl p-4">
                                <p className="text-sm text-gray-500">Documents Attached</p>
                                <p className="font-semibold text-gray-900">{formData.documents.length} file(s)</p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <p className="font-semibold text-yellow-800">Provider Certification</p>
                                <p className="text-sm text-yellow-700 mt-1">
                                    I certify that the services listed were performed by me or under my supervision and that the information provided is accurate and complete.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
                            >
                                <span>←</span> Back
                            </button>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
                            >
                                <span>✓</span> Submit Claim
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default ProviderSubmitClaim;
