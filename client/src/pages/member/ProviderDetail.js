import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProviderDetail = () => {
    const { id } = useParams();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await fetch(`/api/providers/${id}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                const data = await res.json();
                if (data.success) {
                    setProvider(data.data);
                }
            } catch (error) {
                console.error('Error fetching provider:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProvider();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <span className="text-3xl">🏥</span>
                    </div>
                    <p className="text-gray-500">Loading provider details...</p>
                </div>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-bold text-gray-900">Provider not found</h2>
                <Link to="/member/providers" className="text-purple-600 mt-2 inline-block">← Back to search</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link to="/member/providers" className="text-gray-500 hover:text-gray-700">
                    ← Back to Search
                </Link>
            </div>

            {/* Provider Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-white">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
                            🏥
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold">{provider.name}</h1>
                            <p className="text-white/80 text-lg mt-1">{provider.specialty}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                                    ✓ In Network
                                </span>
                                {provider.acceptingNew && (
                                    <span className="px-3 py-1 bg-green-400/30 rounded-full text-sm font-medium backdrop-blur-sm">
                                        Accepting New Patients
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm">
                                <span className="text-yellow-300 text-xl">★</span>
                                <span className="text-2xl font-bold">{provider.rating?.toFixed(1) || '4.5'}</span>
                            </div>
                            <p className="text-white/70 text-sm mt-1">{provider.reviewCount || 100} reviews</p>
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📍</span>
                                Contact Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-gray-400">🏢</span>
                                    <div>
                                        <p className="font-medium text-gray-900">{provider.facility}</p>
                                        <p className="text-gray-600 text-sm">{provider.address}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400">📞</span>
                                    <a href={`tel:${provider.phone}`} className="text-purple-600 font-medium hover:underline">
                                        {provider.phone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-gray-400">🕐</span>
                                    <div>
                                        <p className="text-gray-900">Mon - Fri: 8:00 AM - 6:00 PM</p>
                                        <p className="text-gray-600 text-sm">Sat: 9:00 AM - 1:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600">💊</span>
                                Services Offered
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['Consultations', 'Diagnostics', 'Treatment', 'Follow-up Care', 'Emergency'].map(service => (
                                    <span key={service} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                                        {service}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Insurance Info */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <span>💳</span> Insurance & Payment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-500">Copay (PCP)</p>
                                <p className="text-xl font-bold text-gray-900">ksh 500</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-500">Copay (Specialist)</p>
                                <p className="text-xl font-bold text-gray-900">ksh 1,000</p>
                            </div>
                            <div className="bg-white rounded-lg p-4">
                                <p className="text-sm text-gray-500">Network Status</p>
                                <p className="text-xl font-bold text-green-600">In Network</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-wrap gap-4">
                        <a
                            href={`tel:${provider.phone}`}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg font-medium flex items-center gap-2"
                        >
                            📞 Call to Book Appointment
                        </a>
                        <button className="px-6 py-3 border border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-medium flex items-center gap-2">
                            📍 Get Directions
                        </button>
                        <button className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center gap-2">
                            ❤️ Save Provider
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderDetail;
