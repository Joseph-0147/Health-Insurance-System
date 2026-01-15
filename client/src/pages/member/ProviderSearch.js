import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProviderSearch = () => {
  const [searchParams, setSearchParams] = useState({
    specialty: '',
    city: '',
    name: '',
  });

  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const specialties = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'Obstetrics & Gynecology',
    'Surgery',
    'Neurology',
    'Psychiatry',
    'Ophthalmology',
  ];

  // Load all providers on mount
  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async (params = {}) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const queryParams = new URLSearchParams();

      if (params.specialty) queryParams.append('specialty', params.specialty);
      if (params.city) queryParams.append('city', params.city);
      if (params.name) queryParams.append('name', params.name);

      const url = `/api/providers/search?${queryParams.toString()}`;
      const res = await fetch(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();

      if (data.success) {
        setResults(data.data.providers || []);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error('Provider search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
      setHasSearched(true);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProviders(searchParams);
  };

  const inputClassName = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find a Provider</h1>
        <p className="text-gray-500 mt-1">Search for in-network doctors, specialists, and facilities</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
              <select
                value={searchParams.specialty}
                onChange={(e) => setSearchParams({ ...searchParams, specialty: e.target.value })}
                className={inputClassName}
              >
                <option value="">All Specialties</option>
                {specialties.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={searchParams.city}
                onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                placeholder="e.g., Nairobi"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider/Facility Name</label>
              <input
                type="text"
                value={searchParams.name}
                onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                placeholder="Search by name"
                className={inputClassName}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>⏳ Searching...</>
            ) : (
              <><span>🔍</span> Search Providers</>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-medium">{results.length} provider(s) found</p>
          </div>

          <div className="space-y-4">
            {results.map(provider => (
              <div key={provider.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-semibold rounded-full border border-green-500/20">
                        ✓ In Network
                      </span>
                      {provider.acceptingNew && (
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-semibold rounded-full border border-blue-500/20">
                          Accepting New
                        </span>
                      )}
                    </div>
                    <p className="text-purple-600 font-medium">{provider.specialty}</p>

                    <div className="mt-3 space-y-1">
                      <p className="text-gray-900 font-medium flex items-center gap-2">
                        <span className="text-gray-400">🏥</span> {provider.facility}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <span className="text-gray-400">📍</span> {provider.address}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center gap-2">
                        <span className="text-gray-400">📞</span> {provider.phone}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-lg">
                        <span className="text-yellow-500 text-lg">★</span>
                        <span className="ml-1 font-bold text-gray-900">{provider.rating?.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm ml-1">({provider.reviewCount})</span>
                      </div>
                      <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
                        📍 {provider.city}
                      </span>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <Link
                      to={`/member/providers/${provider.id}`}
                      className="flex-1 lg:flex-none px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg text-sm font-medium text-center"
                    >
                      View Profile
                    </Link>
                    <a
                      href={`tel:${provider.phone}`}
                      className="flex-1 lg:flex-none px-5 py-2.5 border border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all text-sm font-medium text-center"
                    >
                      📞 Call Now
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No providers found</h3>
                <p className="text-gray-500">Try adjusting your search filters or run the seed command to populate providers.</p>
                <p className="text-sm text-purple-600 mt-2 font-mono">npm run seed</p>
              </div>
            )}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-4xl text-white">🏥</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Find In-Network Providers</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Search for doctors, specialists, and healthcare facilities covered by your insurance plan. All providers shown are in-network.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['General Medicine', 'Cardiology', 'Pediatrics', 'Surgery'].map(spec => (
              <button
                key={spec}
                onClick={() => {
                  setSearchParams({ ...searchParams, specialty: spec });
                  fetchProviders({ specialty: spec });
                }}
                className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-all shadow-sm border border-gray-200"
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderSearch;
