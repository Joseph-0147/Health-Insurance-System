import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('accessToken');
            const url = `/api/admin/users?role=${roleFilter}&q=${searchTerm}`;
            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data.users);
            }
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        try {
            const token = localStorage.getItem('accessToken');
            const res = await fetch(`/api/admin/users/${userId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action is permanent.')) {
            // Implementation for delete if needed, for now we just deactivate
            handleStatusToggle(id, true);
        }
    };

    const getRoleBadge = (role) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-800',
            member: 'bg-blue-100 text-blue-800',
            provider: 'bg-green-100 text-green-800',
            employer: 'bg-orange-100 text-orange-800',
            insurance_agent: 'bg-indigo-100 text-indigo-800',
            adjudicator: 'bg-pink-100 text-pink-800'
        };
        return styles[role] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 capitalize">System User Management</h1>
                    <p className="text-gray-500 mt-1">Control access and roles across the platform</p>
                </div>
                <Link to="/admin/dashboard" className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-medium">Back to Dashboard</Link>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center bg-gray-50/50">
                    <div className="flex gap-3 flex-1 min-w-[300px]">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
                        />
                        <select
                            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">All Roles</option>
                            <option value="member">Members</option>
                            <option value="provider">Providers</option>
                            <option value="adjudicator">Adjudicators</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-bold shadow-md hover:shadow-lg"
                    >
                        Search
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Role</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Account Status</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Management</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-6 py-10 bg-gray-50/20"></td>
                                    </tr>
                                ))
                            ) : users.length > 0 ? users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-sm capitalize">
                                                {user.firstName?.charAt(0) || user.email.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-wider ${user.isActive ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                            }`}>
                                            {user.isActive ? 'Active' : 'Deactivated'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => handleStatusToggle(user.id, user.isActive)}
                                                className={`font-black text-[10px] uppercase tracking-widest transition-colors ${user.isActive ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'
                                                    }`}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-800 font-black text-[10px] uppercase tracking-widest"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest opacity-50">No users found matching requirements</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
