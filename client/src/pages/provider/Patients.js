import React, { useState } from 'react';

const Patients = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const patients = [
        { id: 'MEM-001', name: 'Kamau Njoroge', dob: '1985-04-12', plan: 'Gold Family', status: 'Active', lastVisit: '2024-01-14' },
        { id: 'MEM-002', name: 'Wanjiku Mwangi', dob: '1990-08-23', plan: 'Silver Individual', status: 'Active', lastVisit: '2024-01-13' },
        { id: 'MEM-003', name: 'Otieno Ochieng', dob: '1978-11-30', plan: 'Platinum PPO', status: 'Active', lastVisit: '2024-01-12' },
        { id: 'MEM-004', name: 'Amina Abdi', dob: '1995-02-15', plan: 'Gold Family', status: 'Inactive', lastVisit: '2023-11-05' },
        { id: 'MEM-005', name: 'John Kimani', dob: '1982-06-20', plan: 'Silver Individual', status: 'Active', lastVisit: '2024-01-10' },
    ];

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Patient Roster</h1>
                    <p className="text-gray-500 mt-1">Manage your assigned patients</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-96 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Member ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">DOB</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Last Visit</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-semibold text-purple-600">{patient.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                                                {patient.name.charAt(0)}
                                            </div>
                                            <span className="text-gray-900 font-medium">{patient.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{patient.dob}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{patient.plan}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{patient.lastVisit}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">History</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Patients;
