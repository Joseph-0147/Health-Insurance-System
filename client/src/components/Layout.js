import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children, portalType }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getNavLinks = () => {
    switch (portalType) {
      case 'member':
        return [
          { path: '/member/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/member/claims', label: 'My Claims', icon: '📋' },
          { path: '/member/providers', label: 'Find Provider', icon: '🏥' },
          { path: '/member/id-card', label: 'ID Card', icon: '🪪' },
          { path: '/member/profile', label: 'My Profile', icon: '👤' },
        ];
      case 'provider':
        return [
          { path: '/provider/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/provider/claims', label: 'Claims', icon: '📋' },
          { path: '/provider/patients', label: 'Patients', icon: '👥' },
        ];
      case 'employer':
        return [
          { path: '/employer/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/employer/employees', label: 'Employees', icon: '👥' },
          { path: '/employer/billing', label: 'Billing', icon: '💰' },
        ];
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/admin/claims', label: 'Claims', icon: '📋' },
          { path: '/admin/members', label: 'Members', icon: '👥' },
          { path: '/admin/providers', label: 'Providers', icon: '🏥' },
          { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
        ];
      case 'insurance_agent':
        return [
          { path: '/agent/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/agent/enrollment', label: 'Enroll Member', icon: '📝' },
          { path: '/agent/policies', label: 'Policies', icon: '🛡️' },
          { path: '/agent/risk-assessments', label: 'Risk Assessment', icon: '⚖️' },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const getPortalGradient = () => {
    switch (portalType) {
      case 'member': return 'from-blue-500 to-purple-600';
      case 'provider': return 'from-green-500 to-teal-600';
      case 'employer': return 'from-orange-500 to-red-600';
      case 'admin': return 'from-purple-500 to-pink-600';
      case 'insurance_agent': return 'from-indigo-500 to-cyan-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      {/* Dark Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-[#191c24] text-gray-300 transition-all duration-300 z-50 ${sidebarCollapsed ? 'w-20' : 'w-64'}`}>
        {/* Logo */}
        <div className="h-[70px] flex items-center px-6 border-b border-[#2c2e33]">
          <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getPortalGradient()} flex items-center justify-center text-white font-bold text-lg`}>
              H
            </div>
            {!sidebarCollapsed && (
              <div>
                <span className="text-white font-semibold text-lg">HealthCare</span>
                <span className="block text-xs text-gray-500 capitalize">{portalType} Portal</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="mb-4">
            {!sidebarCollapsed && <p className="px-4 text-xs text-gray-500 uppercase tracking-wider mb-2">Navigation</p>}
          </div>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${isActive
                  ? `bg-gradient-to-r ${getPortalGradient()} text-white shadow-lg`
                  : 'text-gray-400 hover:text-white hover:bg-[#2c2e33]'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? link.label : ''}
              >
                <span className="text-xl">{link.icon}</span>
                {!sidebarCollapsed && <span className="font-medium">{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#2c2e33] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Header */}
        <header className="h-[70px] bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800 capitalize">{portalType} Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link to={`/${portalType}/notifications`} className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPortalGradient()} flex items-center justify-center text-white font-semibold`}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-800">{user?.email || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{portalType}</p>
              </div>
              <Link
                to={`/${portalType}/profile`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-right md:text-left"
              >
                My Profile
              </Link>
              <button
                onClick={logout}
                className="ml-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border-l border-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
