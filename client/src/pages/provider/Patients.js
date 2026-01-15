import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch('/api/providers/patients', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setPatients(data.data);
            }
        } catch (error) {
            toast.error('Failed to load patient roster');
        } finally {
            setLoading(false);
        }
    };

    const filteredPatients = patients.filter(p => {
        const search = searchTerm.toLowerCase();
        const formattedId = `MEM-${p.id.substring(0, 8).toUpperCase()}`;
        return (
            p.name.toLowerCase().includes(search) ||
            p.id.toLowerCase().includes(search) ||
            formattedId.toLowerCase().includes(search)
        );
    });

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-500 font-medium tracking-wide">Accessing practice records...</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Patient Registry</h1>
                    <p className="text-gray-500 mt-1">Manage and track care for patients at your practice</p>
                </div>
                <div className="bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
                    <span className="text-purple-700 font-bold text-sm">{patients.length} Total Patients</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, ID or MEM-YYYY..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Beneficiary ID</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Policy Tier</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coverage Status</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Encounter</th>
                                <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-purple-50/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-bold text-purple-600 font-mono tracking-tighter">
                                            MEM-{patient.id.substring(0, 8).toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                                                {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            <span className="text-gray-900 font-bold text-sm tracking-tight">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm font-medium">
                                        {new Date(patient.dob).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm font-bold opacity-80">
                                        {patient.plan}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border transition-all ${patient.status === 'Active'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs font-bold uppercase tracking-tighter">
                                        {new Date(patient.lastVisit).toLocaleDateString('en-KE')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button className="px-4 py-1.5 bg-white text-purple-600 border border-purple-200 hover:bg-purple-600 hover:text-white rounded-lg text-[10px] font-black transition-all uppercase tracking-widest shadow-sm">
                                            Records
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="p-20 text-center">
                                        <div className="max-w-md mx-auto">
                                            <div className="text-6xl mb-6 grayscale opacity-50">📁</div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Practice Roster Empty</h3>
                                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                                Patients will automatically appear here once you submit your first claim for them.
                                                Verify patient eligibility to start the care delivery process.
                                            </p>
                                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                                <Link
                                                    to="/provider/dashboard"
                                                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-all shadow-lg"
                                                >
                                                    Verify Patient
                                                </Link>
                                                <button
                                                    onClick={() => setSearchTerm('')}
                                                    className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                                                >
                                                    Clear Filters
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Patients;
