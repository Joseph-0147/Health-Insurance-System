import React, { useState } from 'react';

const ProviderSearch = () => {
  const [searchParams, setSearchParams] = useState({
    specialty: '',
    zipCode: '',
    distance: '25',
    name: '',
  });

  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const providers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Primary Care',
      facility: 'City Health Clinic',
      address: '123 Main St, Springfield, IL 62701',
      phone: '(555) 123-4567',
      distance: 2.3,
      rating: 4.8,
      reviewCount: 124,
      acceptingNew: true,
      networkStatus: 'in_network',
      languages: ['English', 'Spanish'],
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      facility: 'Heart Care Center',
      address: '456 Oak Ave, Springfield, IL 62702',
      phone: '(555) 234-5678',
      distance: 5.1,
      rating: 4.9,
      reviewCount: 89,
      acceptingNew: true,
      networkStatus: 'in_network',
      languages: ['English', 'Mandarin'],
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatology',
      facility: 'Skin Health Associates',
      address: '789 Elm St, Springfield, IL 62703',
      phone: '(555) 345-6789',
      distance: 8.7,
      rating: 4.6,
      reviewCount: 56,
      acceptingNew: false,
      networkStatus: 'in_network',
      languages: ['English'],
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      facility: 'Bone & Joint Specialists',
      address: '321 Pine Rd, Springfield, IL 62704',
      phone: '(555) 456-7890',
      distance: 12.4,
      rating: 4.7,
      reviewCount: 203,
      acceptingNew: true,
      networkStatus: 'in_network',
      languages: ['English'],
    },
    {
      id: 5,
      name: 'Dr. Lisa Park',
      specialty: 'Pediatrics',
      facility: 'Children\'s Wellness Center',
      address: '555 Maple Dr, Springfield, IL 62705',
      phone: '(555) 567-8901',
      distance: 3.8,
      rating: 4.9,
      reviewCount: 312,
      acceptingNew: true,
      networkStatus: 'in_network',
      languages: ['English', 'Korean'],
    },
  ];

  const specialties = [
    'Primary Care',
    'Cardiology',
    'Dermatology',
    'Orthopedics',
    'Pediatrics',
    'OB/GYN',
    'Neurology',
    'Psychiatry',
    'Ophthalmology',
    'ENT',
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    let filtered = providers;

    if (searchParams.specialty) {
      filtered = filtered.filter(p => p.specialty === searchParams.specialty);
    }
    if (searchParams.name) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchParams.name.toLowerCase()) ||
        p.facility.toLowerCase().includes(searchParams.name.toLowerCase())
      );
    }
    if (searchParams.distance) {
      filtered = filtered.filter(p => p.distance <= parseInt(searchParams.distance));
    }

    setResults(filtered);
    setHasSearched(true);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
              <input
                type="text"
                value={searchParams.zipCode}
                onChange={(e) => setSearchParams({ ...searchParams, zipCode: e.target.value })}
                placeholder="Enter ZIP"
                className={inputClassName}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <select
                value={searchParams.distance}
                onChange={(e) => setSearchParams({ ...searchParams, distance: e.target.value })}
                className={inputClassName}
              >
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
                <option value="25">Within 25 miles</option>
                <option value="50">Within 50 miles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider Name</label>
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
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center gap-2"
          >
            <span>🔍</span> Search Providers
          </button>
        </form>
      </div>

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 font-medium">{results.length} provider(s) found</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500">
                <option>Distance</option>
                <option>Rating</option>
                <option>Name</option>
              </select>
            </div>
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
                        <span className="ml-1 font-bold text-gray-900">{provider.rating}</span>
                        <span className="text-gray-500 text-sm ml-1">({provider.reviewCount})</span>
                      </div>
                      <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
                        📍 {provider.distance} miles away
                      </span>
                      <span className="text-gray-600 text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
                        🗣️ {provider.languages.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <button className="flex-1 lg:flex-none px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg text-sm font-medium">
                      View Profile
                    </button>
                    <button className="flex-1 lg:flex-none px-5 py-2.5 border border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 transition-all text-sm font-medium">
                      Get Directions
                    </button>
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
                <p className="text-gray-500">Try adjusting your search filters to see more results.</p>
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
            {['Primary Care', 'Cardiology', 'Pediatrics', 'Dermatology'].map(spec => (
              <button
                key={spec}
                onClick={() => {
                  setSearchParams({ ...searchParams, specialty: spec });
                  handleSearch({ preventDefault: () => {} });
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
