import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Users, Home, Settings, FileText, CreditCard, Building2, ClipboardList } from 'lucide-react';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getBaseRoute = () => {
    if (profile?.role === 'admin') return '/admin';
    if (profile?.role === 'superadmin') return '/superadmin';
    if (profile?.role === 'staff') return '/staff';
    return '/tenant';
  };
  const base = getBaseRoute();

  return (
    <div className="app-container">
      <nav className="sidebar">
        <div style={{ padding: '1.5rem', fontWeight: 'bold', fontSize: '1.5rem', borderBottom: '1px solid #1f2937', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Building2 size={28} />
          PG Manager
        </div>
        
        <ul style={{ listStyle: 'none', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <li>
            <NavLink to={`${base}/dashboard`} style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', color: isActive ? 'white' : 'inherit' })}>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          
          {profile?.role === 'admin' && (
            <>
              <li>
                <NavLink to={`/admin/applications`} style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', color: isActive ? 'white' : 'inherit' })}>
                  <ClipboardList size={20} />
                  <span>Applications</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={`/admin/rooms`} style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', color: isActive ? 'white' : 'inherit' })}>
                  <Home size={20} />
                  <span>Rooms & Beds</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={`/admin/tenants`} style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', color: isActive ? 'white' : 'inherit' })}>
                  <Users size={20} />
                  <span>Tenants</span>
                </NavLink>
              </li>
              <li>
                <NavLink to={`/admin/billing`} style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', color: isActive ? 'white' : 'inherit' })}>
                  <CreditCard size={20} />
                  <span>Billing & Payments</span>
                </NavLink>
              </li>
            </>
          )}

          {profile?.role !== 'superadmin' && (
            <li>
              <NavLink to={`${base}/complaints`} style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', color: isActive ? 'white' : 'inherit' })}>
                <FileText size={20} />
                <span>Complaints</span>
              </NavLink>
            </li>
          )}

          {profile?.role === 'admin' && (
            <li>
              <NavLink to={`/admin/settings`} style={({isActive}) => ({ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: isActive ? 'var(--color-primary)' : 'transparent', color: isActive ? 'white' : 'inherit' })}>
                <Settings size={20} />
                <span>Settings</span>
              </NavLink>
            </li>
          )}
        </ul>

        {/* User Profile Footer in Sidebar */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1f2937', margin: '0 1rem 1rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {profile?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 'bold', fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{profile?.role}</div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{profile?.role} Panel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button 
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                color: 'var(--color-danger)',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>
        <div style={{ padding: '2rem' }}>
          {children}
        </div>
      </main>
    </div>
  );
};
