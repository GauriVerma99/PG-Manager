import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';
import { Register } from './pages/auth/Register';
import { PendingApproval } from './pages/auth/PendingApproval';
import { Rooms } from './pages/admin/Rooms';
import { Tenants } from './pages/admin/Tenants';
import { Billing } from './pages/admin/Billing';
import { Complaints } from './pages/admin/Complaints';
import { AdminDashboard } from './pages/admin/Dashboard';
import { Settings } from './pages/admin/Settings';
import { TenantDashboard } from './pages/tenant/Dashboard';
import { InvoiceView } from './pages/tenant/InvoiceView';
import { TenantComplaints } from './pages/tenant/Complaints';
import { StaffDashboard } from './pages/staff/Dashboard';
import { PgListing } from './pages/public/PgListing';
import { PgSearch } from './pages/public/PgSearch';
import { Home } from './pages/public/Home';
import { Applications } from './pages/admin/Applications';
import { SuperAdminDashboard } from './pages/superadmin/Dashboard';

// Basic skeleton components for now
const Unauthorized = () => <div className="page-content"><h1>Unauthorized</h1></div>;

const RoleRedirect = () => {
  const { user, profile } = useAuth();
  
  if (user && !profile) {
    return (
      <div className="page-content" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Profile Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
          Your login was successful, but your database profile is missing. <br/>
          This happens if registration was blocked by database rules. <br/>
          Please delete this account in the Firebase Console and register again.
        </p>
        <button onClick={() => window.location.href = '/register'} className="btn btn-primary" style={{ marginTop: '2rem' }}>Go to Register</button>
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;
  if (profile.role === 'superadmin') return <Navigate to="/superadmin/dashboard" replace />;
  if (!profile.isActive) return <Navigate to="/pending-approval" replace />;
  if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (profile.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
  if (profile.role === 'tenant') return <Navigate to="/tenant/dashboard" replace />;
  return <Navigate to="/unauthorized" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/pg/:id" element={<PgListing />} />
          <Route path="/find" element={<PgSearch />} />
          <Route path="/home" element={<Home />} />
          
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<RoleRedirect />} />

          {/* SuperAdmin Routes */}
          <Route path="/superadmin/*" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<SuperAdminDashboard />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="applications" element={<Applications />} />
                  <Route path="rooms" element={<Rooms />} />
                  <Route path="tenants" element={<Tenants />} />
                  <Route path="billing" element={<Billing />} />
                  <Route path="complaints" element={<Complaints />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Tenant Routes */}
          <Route path="/tenant/*" element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<TenantDashboard />} />
                  <Route path="invoice/:id" element={<InvoiceView />} />
                  <Route path="complaints" element={<TenantComplaints />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Staff Routes */}
          <Route path="/staff/*" element={
            <ProtectedRoute allowedRoles={['staff']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<StaffDashboard />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />

          {/* Tenant Routes */}
          <Route path="/tenant/*" element={
            <ProtectedRoute allowedRoles={['tenant']}>
              <MainLayout>
                <Routes>
                  <Route path="dashboard" element={<TenantDashboard />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
