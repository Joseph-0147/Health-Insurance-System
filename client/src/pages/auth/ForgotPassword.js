import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#191c24] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-12 flex-col justify-between">
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
            Forgot Your<br />Password?
          </h1>
          <p className="text-white/80 text-lg mb-8">
            No worries! We'll help you reset it securely. Just enter your email and we'll send you instructions.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">🔒</div>
              <span>Secure password reset</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">📧</div>
              <span>Email verification</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">⏱️</div>
              <span>Quick & easy process</span>
            </div>
          </div>
        </div>

        <p className="text-white/50 text-sm">© 2025 HealthCare Insurance. All rights reserved.</p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">H</span>
            </div>
            <span className="text-white text-2xl font-bold">HealthCare</span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔐</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
                  <p className="text-gray-500 mt-2">Enter your email to receive reset instructions</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>Send Reset Link</>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-white">✓</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-500 mb-6">
                  We've sent password reset instructions to<br />
                  <span className="font-medium text-gray-700">{email}</span>
                </p>
                <div className="bg-purple-50 p-4 rounded-xl text-sm text-gray-600 mb-6">
                  <p>Didn't receive the email? Check your spam folder or</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-purple-600 font-medium hover:underline"
                  >
                    try another email address
                  </button>
                </div>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center mt-6 pt-6 border-t border-gray-100">
              <Link to="/login" className="text-purple-600 hover:text-pink-600 font-medium transition-colors flex items-center justify-center gap-2">
                <span>←</span> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
