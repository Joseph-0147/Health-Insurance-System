import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const EnrollMember = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        idNumber: '', // National ID for Kenya
        kraPin: '',   // KRA PIN for Kenya
        county: '',
        planType: 'silver_individual',
        coverageStart: '',
    });

    const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu', 'Machakos', 'Kajiado'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        toast.success(`Member ${formData.firstName} ${formData.lastName} enrolled successfully!`);
        navigate('/agent/dashboard');
    };

    const inputClassName = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white";

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">New Member Enrollment</h1>
                    <p className="text-gray-500 mt-1">Register a new policyholder</p>
                </div>
                <Link
                    to="/agent/dashboard"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2 font-medium"
                >
                    <span>←</span> Back to Dashboard
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">👤</span>
                            Personal Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                    placeholder="Kamau"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                    placeholder="Njoroge"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                    placeholder="kamau.njoroge@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                    placeholder="+254 7..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">National ID *</label>
                                <input
                                    type="text"
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">KRA PIN</label>
                                <input
                                    type="text"
                                    name="kraPin"
                                    value={formData.kraPin}
                                    onChange={handleChange}
                                    className={inputClassName}
                                    placeholder="A00..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm">📋</span>
                            Policy Configuration
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">County of Residence</label>
                                <select
                                    name="county"
                                    value={formData.county}
                                    onChange={handleChange}
                                    className={inputClassName}
                                >
                                    <option value="">Select County</option>
                                    {counties.map(county => <option key={county} value={county}>{county}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Selected Plan *</label>
                                <select
                                    name="planType"
                                    value={formData.planType}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                >
                                    <option value="silver_individual">Silver Individual - KES 4,500/mo</option>
                                    <option value="gold_family">Gold Family - KES 12,000/mo</option>
                                    <option value="platinum_ppo">Platinum PPO - KES 25,000/mo</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Coverage Start Date *</label>
                                <input
                                    type="date"
                                    name="coverageStart"
                                    value={formData.coverageStart}
                                    onChange={handleChange}
                                    required
                                    className={inputClassName}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100 gap-4">
                        <Link
                            to="/agent/dashboard"
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-bold flex items-center gap-2"
                        >
                            <span>+</span> Submit Enrollment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EnrollMember;
