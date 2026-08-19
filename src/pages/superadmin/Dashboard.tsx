import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAllPgListings, type PgSettings } from '../../services/pgSettingsService';
import { Button } from '../../components/ui/Button';

export const SuperAdminDashboard: React.FC = () => {
  const { } = useAuth();
  const [pgs, setPgs] = useState<PgSettings[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlatformData();
  }, []);

  const loadPlatformData = async () => {
    try {
      const data = await getAllPgListings();
      setPgs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = (pgId: string) => {
    // In a real app, updates isVerified on pg_settings
    alert(`Verified PG ${pgId}`);
  };

  const handleSuspend = (pgId: string) => {
    if (!confirm('Suspend this PG? They will not appear in search.')) return;
    alert(`Suspended PG ${pgId}`);
  };

  if (loading) return <div className="page-content">Loading Platform Data...</div>;

  return (
    <div className="page-content">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Super Admin - Platform Control</h2>
        <p style={{ color: 'var(--text-muted)' }}>Global overview of the PG Marketplace.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{pgs.length}</div>
          <div style={{ color: 'var(--text-muted)' }}>Total Listed PGs</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>24</div>
          <div style={{ color: 'var(--text-muted)' }}>Active Tenants (Mock)</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-warning)' }}>₹ 4.2L</div>
          <div style={{ color: 'var(--text-muted)' }}>GMV Processed (Mock)</div>
        </div>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>PG Moderation Queue</h3>
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>PG Name</th>
              <th style={{ padding: '1rem' }}>Location</th>
              <th style={{ padding: '1rem' }}>Owner UID</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pgs.map(pg => (
              <tr key={pg.pgId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{pg.pgName}</td>
                <td style={{ padding: '1rem' }}>{pg.city ? `${pg.city}, ${pg.state}` : 'Not set'}</td>
                <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{pg.pgId.slice(0,8)}...</td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <Button size="sm" onClick={() => handleVerify(pg.pgId)}>Verify</Button>
                  <Button size="sm" variant="ghost" onClick={() => handleSuspend(pg.pgId)}>Suspend</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
