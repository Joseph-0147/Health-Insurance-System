import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success('Login successful!');

        // Redirect based on role
        const role = result.user.role;
        switch (role) {
          case 'member':
            navigate('/member/dashboard');
            break;
          case 'provider':
            navigate('/provider/dashboard');
            break;
          case 'employer':
            navigate('/employer/dashboard');
            break;
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'insurance_agent':
            navigate('/agent/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191c24] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">H</span>
            </div>
            <span className="text-white text-2xl font-bold">HealthCare</span>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white mb-6">
            Your Health,<br />Our Priority
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Access your health insurance benefits, track claims, find providers, and manage your coverage all in one place.
          </p>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex-1">
              <p className="text-3xl font-bold text-white">12K+</p>
              <p className="text-white/70 text-sm">Active Members</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex-1">
              <p className="text-3xl font-bold text-white">890+</p>
              <p className="text-white/70 text-sm">Network Providers</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex-1">
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-white/70 text-sm">Satisfaction Rate</p>
            </div>
          </div>
        </div>

        <p className="text-white/50 text-sm">© 2025 HealthCare Insurance. All rights reserved.</p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">H</span>
            </div>
            <span className="text-white text-2xl font-bold">HealthCare</span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to access your portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Create Account
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Demo Accounts (for testing)</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-medium text-gray-700">Member</p>
                  <p className="text-gray-400">member@demo.com</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-medium text-gray-700">Provider</p>
                  <p className="text-gray-400">provider@demo.com</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-medium text-gray-700">Employer</p>
                  <p className="text-gray-400">employer@demo.com</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="font-medium text-gray-700">Admin</p>
                  <p className="text-gray-400">admin@demo.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
