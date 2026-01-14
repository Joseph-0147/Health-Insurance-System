import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || 'User Name',
        email: user?.email || '',
        phone: '+254 700 000000',
        title: user?.role || 'Role',
        department: 'General',
        location: 'Nairobi, Kenya',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
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
                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4">
                        {formData.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                    <p className="text-gray-500 capitalize">{formData.title}</p>
                    <div className="mt-6 flex justify-center gap-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Verified</span>
                    </div>
                </div>

                {/* Details Form */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled={true} // Email usually uneditable
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 disabled:bg-gray-100 disabled:text-gray-500"
                            />
                        </div>
                    </form>

                    {isEditing && (
                        <div className="mt-8 flex justify-end">
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium">
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
