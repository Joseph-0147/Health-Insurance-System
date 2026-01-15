import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProviderProfile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [providerData, setProviderData] = useState({
        organizationName: '',
        npi: '',
        specialty: '',
        phoneNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        status: 'pending'
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/providers/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setProviderData(data.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProviderData({ ...providerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/providers/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(providerData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Profile updated successfully!');
                setIsEditing(false);
                setProviderData(data.data);
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isEditing) {
        return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Provider Profile</h1>
                    <p className="text-gray-500 mt-1">Manage your professional information and facility details</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all ${isEditing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                        }`}
                >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Overview Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-inner">
                        {providerData.organizationName?.charAt(0) || user?.firstName?.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{providerData.organizationName || `${user?.firstName} ${user?.lastName}`}</h2>
                    <p className="text-gray-500">{providerData.specialty || 'General Medicine'}</p>

                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Status:</span>
                            <span className={`font-semibold capitalize ${providerData.status === 'verified' ? 'text-green-600' : 'text-orange-500'
                                }`}>
                                {providerData.status}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">NPI:</span>
                            <span className="font-mono">{providerData.npi}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-50">
                        <p className="text-xs text-gray-400">Account Type: Healthcare Provider</p>
                        <p className="text-xs text-gray-400 mt-1">Member since: {new Date(providerData.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Form Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Professional Information</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Facility / Organization Name</label>
                                <input
                                    type="text"
                                    name="organizationName"
                                    value={providerData.organizationName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Enter clinic or hospital name"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={providerData.specialty}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="e.g. Cardiology"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">NPI (Registration Number)</label>
                                <input
                                    type="text"
                                    name="npi"
                                    value={providerData.npi}
                                    disabled={true} // Usually verified and fixed
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={providerData.phoneNumber}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={providerData.address}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={providerData.city}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 disabled:bg-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={providerData.zipCode}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 disabled:bg-gray-100"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium disabled:opacity-50"
                                >
                                    {loading ? '⏳ Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfile;
