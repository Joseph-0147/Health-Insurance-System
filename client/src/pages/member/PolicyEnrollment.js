import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const PolicyEnrollment = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [formData, setFormData] = useState({
        planType: '',
        startDate: '',
        paymentMethod: 'mpesa',
        agreeTerms: false,
    });

    const plans = [
        {
            id: 'individual_basic',
            name: 'Individual Basic',
            type: 'individual',
            premium: 8500,
            deductible: 10000,
            coverageLimit: 2000000,
            features: ['Outpatient Cover', 'Inpatient Cover', '24/7 Support'],
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 'individual_premium',
            name: 'Individual Premium',
            type: 'individual',
            premium: 15500,
            deductible: 5000,
            coverageLimit: 5000000,
            features: ['Outpatient Cover', 'Inpatient Cover', 'Dental & Optical', 'Maternity', '24/7 Support'],
            color: 'from-purple-500 to-pink-500',
            popular: true
        },
        {
            id: 'family_gold',
            name: 'Family Gold',
            type: 'family',
            premium: 35000,
            deductible: 5000,
            coverageLimit: 10000000,
            features: ['Covers up to 6 members', 'Outpatient Cover', 'Inpatient Cover', 'Dental & Optical', 'Maternity', 'Wellness Programs'],
            color: 'from-yellow-500 to-orange-500'
        },
    ];

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan);
        setFormData({ ...formData, planType: plan.type });
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreeTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/policies/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    planId: selectedPlan.id,
                    planType: selectedPlan.type,
                    startDate: formData.startDate,
                    premiumAmount: selectedPlan.premium,
                    deductible: selectedPlan.deductible,
                    coverageLimit: selectedPlan.coverageLimit,
                    paymentMethod: formData.paymentMethod
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success('🎉 Successfully enrolled in ' + selectedPlan.name + '!');
                navigate('/member/dashboard');
            } else {
                toast.error(data.message || 'Enrollment failed');
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            toast.error('Failed to complete enrollment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Enroll in a Policy</h1>
                    <p className="text-gray-500 mt-1">Choose a health insurance plan that fits your needs</p>
                </div>
                <Link to="/member/dashboard" className="text-gray-500 hover:text-gray-700">
                    ← Back to Dashboard
                </Link>
            </div>

            {/* Progress Steps */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-center">
                    {[
                        { num: 1, label: 'Choose Plan' },
                        { num: 2, label: 'Confirm Details' },
                        { num: 3, label: 'Payment' }
                    ].map((s, idx) => (
                        <React.Fragment key={s.num}>
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${step > s.num
                                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                                        : step === s.num
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110'
                                            : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {step > s.num ? '✓' : s.num}
                                </div>
                                <span className={`mt-2 text-sm font-medium ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {s.label}
                                </span>
                            </div>
                            {idx < 2 && (
                                <div className={`w-20 h-1 mx-2 rounded-full transition-all ${step > s.num ? 'bg-green-400' : 'bg-gray-200'}`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step 1: Choose Plan */}
            {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div
                            key={plan.id}
                            className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl cursor-pointer ${selectedPlan?.id === plan.id ? 'border-purple-500' : 'border-gray-100 hover:border-purple-200'
                                }`}
                            onClick={() => handlePlanSelect(plan)}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}
                            <div className={`bg-gradient-to-r ${plan.color} p-6 rounded-t-2xl text-white`}>
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <div className="mt-2">
                                    <span className="text-3xl font-bold">ksh {plan.premium.toLocaleString()}</span>
                                    <span className="text-white/70">/month</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Cover Limit</span>
                                        <span className="font-semibold text-gray-900">ksh {(plan.coverageLimit / 1000000).toFixed(0)}M</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Deductible</span>
                                        <span className="font-semibold text-gray-900">ksh {plan.deductible.toLocaleString()}</span>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                            <span className="text-green-500">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full mt-6 py-3 rounded-xl font-medium transition-all ${selectedPlan?.id === plan.id
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                                    }`}>
                                    {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Step 2: Confirm Details */}
            {step === 2 && selectedPlan && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Confirm Your Enrollment</h2>

                    {/* Selected Plan Summary */}
                    <div className={`bg-gradient-to-r ${selectedPlan.color} p-6 rounded-xl text-white mb-6`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">{selectedPlan.name}</h3>
                                <p className="text-white/80">ksh {selectedPlan.premium.toLocaleString()}/month</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-4 py-2 bg-white/20 rounded-lg text-sm font-medium hover:bg-white/30 transition-all"
                            >
                                Change Plan
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                            <select
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="mpesa">M-Pesa</option>
                                <option value="card">Credit/Debit Card</option>
                                <option value="bank">Bank Transfer</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={formData.agreeTerms}
                                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                className="mt-1 w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-600">
                                I agree to the <a href="#" className="text-purple-600 underline">Terms and Conditions</a> and
                                <a href="#" className="text-purple-600 underline"> Privacy Policy</a>. I understand that my policy will
                                begin on the selected start date and I will be charged monthly.
                            </span>
                        </label>
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                        >
                            ← Back
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg font-medium disabled:opacity-50"
                        >
                            {loading ? '⏳ Processing...' : '✓ Complete Enrollment'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PolicyEnrollment;
