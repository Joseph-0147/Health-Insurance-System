import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Employees = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const employees = [
        { id: 1, name: 'Kamau Njoroge', role: 'Software Engineer', plan: 'Premium PPO', status: 'Active', enrollmentDate: '2024-01-15' },
        { id: 2, name: 'Wanjiku Mwangi', role: 'Product Manager', plan: 'Standard HMO', status: 'Active', enrollmentDate: '2024-02-01' },
        { id: 3, name: 'Otieno Ochieng', role: 'Designer', plan: 'Basic', status: 'Pending', enrollmentDate: '2024-03-01' },
        { id: 4, name: 'Amina Abdi', role: 'Data Analyst', plan: 'Premium PPO', status: 'Active', enrollmentDate: '2024-01-20' },
        { id: 5, name: 'John Kimani', role: 'HR Specialist', plan: 'Standard HMO', status: 'Active', enrollmentDate: '2024-02-15' },
        { id: 6, name: 'James Maina', role: 'Sales Director', plan: 'Premium PPO', status: 'Inactive', enrollmentDate: '2023-11-01' },
    ];

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
                    <p className="text-gray-500 mt-1">Manage your workforce coverage</p>
                </div>
                <Link to="/employer/employees/add" className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg font-medium flex items-center gap-2">
                    <span>+</span> Add Employee
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full md:w-96 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Employee</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Current Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Enrolled</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-900">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{emp.role}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                                            {emp.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${emp.status === 'Active' ? 'text-green-600 bg-green-50' :
                                                emp.status === 'Pending' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-600 bg-gray-100'
                                            }`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{emp.enrollmentDate}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">Edit</button>
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

export default Employees;
