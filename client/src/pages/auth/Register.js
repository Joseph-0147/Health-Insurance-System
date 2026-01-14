import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

// Input field component defined OUTSIDE the main component to prevent re-renders
const InputField = ({ name, label, type = 'text', placeholder, required = true, value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-purple-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-200'
      }`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Account Info
    email: '',
    password: '',
    confirmPassword: '',
    role: 'member',
    // Personal Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    // Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    // For employer/provider
    organizationName: '',
    taxId: '',
  });
  const [errors, setErrors] = useState({});

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 12) newErrors.password = 'Password must be at least 12 characters';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
        newErrors.password = 'Password must include uppercase, lowercase, number, and special character (@$!%*?&)';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (currentStep === 2) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      
      if (formData.role === 'employer' || formData.role === 'provider') {
        if (!formData.organizationName) newErrors.organizationName = 'Organization name is required';
      }
    }

    if (currentStep === 3) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        organizationName: formData.organizationName,
        taxId: formData.taxId,
      });

      if (response.data.success) {
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
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
            Start Your<br />Healthcare Journey
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of members who trust us with their health insurance needs. Easy enrollment, comprehensive coverage.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
              <span>Easy online enrollment</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
              <span>Access to 890+ network providers</span>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">✓</div>
              <span>24/7 customer support</span>
            </div>
          </div>
        </div>

        <p className="text-white/50 text-sm">© 2025 HealthCare Insurance. All rights reserved.</p>
      </div>

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">H</span>
            </div>
            <span className="text-white text-2xl font-bold">HealthCare</span>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="text-gray-500 mt-1">Step {step} of 3</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center items-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      step > s 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
                        : step === s 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-110' 
                          : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-12 h-1 rounded-full transition-all duration-300 ${step > s ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-200'}`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Account Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">1</span>
                    Account Information
                  </h3>
              
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                    >
                      <option value="member">👤 Member (Individual/Family)</option>
                      <option value="employer">🏢 Employer</option>
                      <option value="provider">🏥 Healthcare Provider</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2 bg-purple-50 p-2 rounded-lg">
                      {formData.role === 'member' && '✨ Enroll in a health plan and manage your benefits'}
                      {formData.role === 'employer' && '✨ Manage employee benefits and group plans'}
                      {formData.role === 'provider' && '✨ Submit claims and verify patient eligibility'}
                    </p>
                  </div>

              <InputField name="email" label="Email Address" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} error={errors.email} />
              
              <InputField 
                name="password" 
                label="Password" 
                type="password" 
                placeholder="Min 12 chars, upper, lower, number, special (@$!%*?&)"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
              />
              
              <InputField 
                name="confirmPassword" 
                label="Confirm Password" 
                type="password" 
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">2</span>
                {formData.role === 'member' ? 'Personal Information' : 'Contact Information'}
              </h3>

              {(formData.role === 'employer' || formData.role === 'provider') && (
                <>
                  <InputField 
                    name="organizationName" 
                    label={formData.role === 'employer' ? 'Company Name' : 'Practice/Facility Name'} 
                    placeholder="Enter organization name"
                    value={formData.organizationName}
                    onChange={handleChange}
                    error={errors.organizationName}
                  />
                  <InputField 
                    name="taxId" 
                    label="Tax ID / NPI" 
                    placeholder="Enter Tax ID or NPI number" 
                    required={false}
                    value={formData.taxId}
                    onChange={handleChange}
                    error={errors.taxId}
                  />
                </>
              )}

              <div className="grid grid-cols-2 gap-4">
                <InputField name="firstName" label="First Name" placeholder="John" value={formData.firstName} onChange={handleChange} error={errors.firstName} />
                <InputField name="lastName" label="Last Name" placeholder="Doe" value={formData.lastName} onChange={handleChange} error={errors.lastName} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputField name="dateOfBirth" label="Date of Birth" type="date" value={formData.dateOfBirth} onChange={handleChange} error={errors.dateOfBirth} />
                <InputField name="phone" label="Phone Number" type="tel" placeholder="(555) 123-4567" value={formData.phone} onChange={handleChange} error={errors.phone} />
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">3</span>
                Address Information
              </h3>

              <InputField name="address" label="Street Address" placeholder="123 Main Street" value={formData.address} onChange={handleChange} error={errors.address} />

              <div className="grid grid-cols-2 gap-4">
                <InputField name="city" label="City" placeholder="New York" value={formData.city} onChange={handleChange} error={errors.city} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
                      errors.state ? 'border-red-400 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select State</option>
                    {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
              </div>

              <InputField name="zipCode" label="ZIP Code" placeholder="10001" value={formData.zipCode} onChange={handleChange} error={errors.zipCode} />

              {/* Terms */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mt-6 border border-purple-100">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" required className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-purple-600 hover:underline font-medium">Terms of Service</a> and{' '}
                    <a href="#" className="text-purple-600 hover:underline font-medium">Privacy Policy</a>. I understand that my 
                    health information will be protected under HIPAA regulations.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
              >
                <span>←</span> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
              >
                Next <span>→</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    Create Account <span>✓</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 hover:text-pink-600 font-semibold transition-colors">
              Sign in →
            </Link>
          </p>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
