import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [memberId, setMemberId] = useState('MEM-PENDING');
  const [policyData, setPolicyData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Fetch Member Profile
        const res = await fetch('/api/members/me', { headers });
        const data = await res.json();

        if (data.success && data.data) {
          const m = data.data;
          setFormData({
            firstName: m.user?.firstName || '',
            lastName: m.user?.lastName || '',
            email: m.user?.email || '',
            phone: m.phoneNumber || '',
            dateOfBirth: m.dateOfBirth || '',
            address: m.address || '',
            city: m.city || '',
            state: m.state || '',
            zipCode: m.zipCode || '',
            emergencyContact: 'Not Set',
            emergencyPhone: 'Not Set'
          });

          setMemberId(`MEM-${new Date(m.createdAt).getFullYear()}-${m.id.substring(0, 6).toUpperCase()}`);
        }

        // 2. Fetch Active Policy for Group Number
        const policyRes = await fetch('/api/policies/my-policies', { headers });
        const pData = await policyRes.json();
        if (pData.success && pData.data?.length > 0) {
          setPolicyData(pData.data[0]);
        }

      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/members/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  const inputClassName = `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${isEditing ? 'border-gray-200 bg-white hover:border-purple-300' : 'border-gray-100 bg-gray-50 text-gray-600'
    }`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
          >
            <span>✏️</span> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-24"></div>
          <div className="p-6 -mt-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl mx-auto flex items-center justify-center text-3xl font-bold text-purple-600 border-4 border-white shadow-lg">
              {formData.firstName[0]}{formData.lastName[0]}
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-500">{formData.email}</p>
            <span className="inline-flex items-center gap-1 mt-3 px-4 py-1.5 bg-green-500/10 text-green-600 rounded-full text-sm font-medium border border-green-500/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Active Member
            </span>
          </div>
          <div className="p-6 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Member ID</p>
                <p className="font-semibold text-gray-900">{memberId}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <span>🪪</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Policy Number</p>
                <p className="font-semibold text-gray-900">{policyData?.policyNumber || 'GRP-KEN-001'}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span>👥</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Coverage Start</p>
                <p className="font-semibold text-gray-900">
                  {policyData?.startDate
                    ? new Date(policyData.startDate).toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' })
                    : 'January 1, 2024'}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span>📅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Section Header */}
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">👤</span>
                Personal Information
              </h3>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClassName}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputClassName}
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📍</span> Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🚨</span> Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="pt-6 border-t border-gray-100 flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
                  >
                    <span>✓</span> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
