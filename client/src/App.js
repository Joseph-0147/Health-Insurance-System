import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Member Portal
import MemberDashboard from './pages/member/Dashboard';
import MemberProfile from './pages/member/Profile';
import Claims from './pages/member/Claims';
import SubmitClaim from './pages/member/SubmitClaim';
import ProviderSearch from './pages/member/ProviderSearch';
import IDCard from './pages/member/IDCard';

// Provider Portal
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderSubmitClaim from './pages/provider/SubmitClaim';
import ProviderClaims from './pages/provider/Claims';
import ProviderPatients from './pages/provider/Patients';

// Employer Portal
import EmployerDashboard from './pages/employer/Dashboard';
import AddEmployee from './pages/employer/AddEmployee';
import Employees from './pages/employer/Employees';
import Billing from './pages/employer/Billing';

// Common
import Reports from './pages/common/Reports';
import Settings from './pages/common/Settings';
import Notifications from './pages/common/Notifications';
import Profile from './pages/common/Profile';
import Support from './pages/common/Support';

// Admin Portal
import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';

// Agent Portal
import AgentDashboard from './pages/agent/Dashboard';
import EnrollMember from './pages/agent/EnrollMember';

// Components
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Member Routes */}
          <Route
            path="/member/*"
            element={
              <PrivateRoute allowedRoles={['member']}>
                <Layout portalType="member">
                  <Routes>
                    <Route path="dashboard" element={<MemberDashboard />} />
                    <Route path="profile" element={<MemberProfile />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="claims" element={<Claims />} />
                    <Route path="claims/submit" element={<SubmitClaim />} />
                    <Route path="providers" element={<ProviderSearch />} />
                    <Route path="id-card" element={<IDCard />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Provider Routes */}
          <Route
            path="/provider/*"
            element={
              <PrivateRoute allowedRoles={['provider']}>
                <Layout portalType="provider">
                  <Routes>
                    <Route path="dashboard" element={<ProviderDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="claims" element={<ProviderClaims />} />
                    <Route path="claims/submit" element={<ProviderSubmitClaim />} />
                    <Route path="patients" element={<ProviderPatients />} />
                    <Route path="reports" element={<Reports />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Employer Routes */}
          <Route
            path="/employer/*"
            element={
              <PrivateRoute allowedRoles={['employer']}>
                <Layout portalType="employer">
                  <Routes>
                    <Route path="dashboard" element={<EmployerDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="employees/add" element={<AddEmployee />} />
                    <Route path="billing" element={<Billing />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="support" element={<Support />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <Layout portalType="admin">
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Agent Routes */}
          <Route
            path="/agent/*"
            element={
              <PrivateRoute allowedRoles={['insurance_agent']}>
                <Layout portalType="insurance_agent">
                  <Routes>
                    <Route path="dashboard" element={<AgentDashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="enrollment" element={<EnrollMember />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </AuthProvider>
    </Router>
  );
}

export default App;
