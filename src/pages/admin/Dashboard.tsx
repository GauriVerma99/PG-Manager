import React, { useEffect, useState } from 'react';
import { useAuth, type UserProfile } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { getPendingUsers, approveUser } from '../../services/userService';

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (profile?.pgId) {
      loadPendingUsers();
    }
  }, [profile]);

  const loadPendingUsers = async () => {
    const users = await getPendingUsers(profile!.pgId);
    setPendingUsers(users);
  };

  const handleApprove = async (uid: string, role: string) => {
    try {
      await approveUser(uid, role);
      setPendingUsers(pendingUsers.filter(u => u.uid !== uid));
    } catch (error) {
      console.error("Failed to approve user:", error);
    }
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Welcome back, {profile?.name || 'Owner'}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Here is what needs your attention today.</p>
        </div>
        <div style={{ backgroundColor: 'var(--bg-main)', border: '1px dashed var(--border-color)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your PG Code</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)', fontFamily: 'monospace' }}>{profile?.pgId}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Share with staff & tenants</div>
        </div>
      </div>

      {pendingUsers.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>Pending Approvals</h3>
          <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Email</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingUsers.map(u => (
                  <tr key={u.uid} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{u.name}</td>
                    <td style={{ padding: '1rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{u.role}</td>
                    <td style={{ padding: '1rem' }}>
                      <Button size="sm" onClick={() => handleApprove(u.uid, u.role)}>Approve</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Dashboard - Money Leakage focus */}
      <h3 style={{ marginBottom: '1rem', color: 'var(--color-danger)' }}>Action Required</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Overdue Rent</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>₹0</div>
          <Button variant="ghost" size="sm" style={{ padding: 0, color: 'var(--color-danger)' }}>View details &rarr;</Button>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Bills Under Review</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>0</div>
          <Button variant="ghost" size="sm" style={{ padding: 0, color: 'var(--color-warning)' }}>View bills &rarr;</Button>
        </div>

        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <h4 style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Vacant Beds</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>0</div>
          <Button variant="ghost" size="sm" style={{ padding: 0, color: 'var(--color-primary)' }}>Manage beds &rarr;</Button>
        </div>

      </div>

      <h3 style={{ marginBottom: '1rem' }}>PG Health & Metrics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* PG Health Score */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>N/A</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>PG Health Score</div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
            Score will be calculated once there is sufficient collection and occupancy data.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Operational Snapshot</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Collection Rate</span>
              <span style={{ fontWeight: '600' }}>0%</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Occupancy Rate</span>
              <span style={{ fontWeight: '600' }}>0%</span>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Tenant Satisfaction</span>
              <span style={{ fontWeight: '600' }}>0/5</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};
