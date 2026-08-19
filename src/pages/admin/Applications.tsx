import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPgApplications, approveApplication, rejectApplication, type TenantApplication } from '../../services/applicationService';
import { Button } from '../../components/ui/Button';

export const Applications: React.FC = () => {
  const { profile } = useAuth();
  const [apps, setApps] = useState<TenantApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.pgId) {
      loadApps();
    }
  }, [profile]);

  const loadApps = async () => {
    try {
      const data = await getPgApplications(profile!.pgId);
      // Sort by newest first
      setApps(data.sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis()));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (app: TenantApplication) => {
    if (!confirm(`Are you sure you want to approve ${app.name} as a tenant?`)) return;
    try {
      await approveApplication(app);
      loadApps();
    } catch (e) {
      alert("Failed to approve application");
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm(`Are you sure you want to reject this application?`)) return;
    try {
      await rejectApplication(id);
      loadApps();
    } catch (e) {
      alert("Failed to reject application");
    }
  };

  if (loading) return <div className="page-content">Loading applications...</div>;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Tenant Applications</h2>
        <p style={{ color: 'var(--text-muted)' }}>Review prospective tenants who want to join your PG.</p>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Applicant</th>
              <th style={{ padding: '1rem' }}>Contact</th>
              <th style={{ padding: '1rem' }}>Move-in Date</th>
              <th style={{ padding: '1rem' }}>Stay Details</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No applications received yet.
                </td>
              </tr>
            ) : (
              apps.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500' }}>{app.name}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{app.email}</div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{app.phone || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>{app.moveInDate || 'N/A'}</td>
                  <td style={{ padding: '1rem' }}>
                    <div>{app.roomType || 'N/A'}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{app.durationMonths ? `${app.durationMonths} Months` : 'N/A'}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      backgroundColor: app.status === 'APPROVED' ? 'var(--color-secondary)' : app.status === 'REJECTED' ? 'var(--color-danger)' : 'var(--color-warning)', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.75rem' 
                    }}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                    {app.status === 'SUBMITTED' && (
                      <>
                        <Button size="sm" onClick={() => handleApprove(app)}>Approve</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleReject(app.id)}>Reject</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
