import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTenantBills, type Bill } from '../../services/billingService';
import { getPgSettings, type PgSettings } from '../../services/pgSettingsService';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

export const TenantDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [pgSettings, setPgSettings] = useState<PgSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.uid) {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    try {
      const [billsData, settingsData] = await Promise.all([
        getTenantBills(profile!.uid),
        getPgSettings(profile!.pgId)
      ]);
      setBills(billsData);
      if (settingsData) setPgSettings(settingsData as PgSettings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'Paid': return 'var(--color-secondary)';
      case 'Under Review': return 'var(--color-warning)';
      case 'Overdue': return 'var(--color-danger)';
      default: return 'var(--text-muted)';
    }
  };

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Welcome, {profile?.name}</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Your tenant portal for {pgSettings?.pgName || 'the PG'}.</p>
        </div>
        {pgSettings?.mapUrl && (
          <a href={pgSettings.mapUrl} target="_blank" rel="noreferrer">
            <Button variant="outline">📍 Locate PG on Maps</Button>
          </a>
        )}
      </div>

      <h3 style={{ marginBottom: '1rem' }}>My Bills</h3>
      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem' }}>Month</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  You have no bills yet.
                </td>
              </tr>
            ) : (
              bills.map(bill => (
                <tr key={bill.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{bill.billingMonth}</td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{bill.totalPayable}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      backgroundColor: getStatusColor(bill.status), 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.75rem' 
                    }}>
                      {bill.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link to={`/tenant/invoice/${bill.id}`}>
                      <Button size="sm" variant={bill.status === 'Pending' || bill.status === 'Overdue' ? 'primary' : 'ghost'}>
                        {bill.status === 'Pending' || bill.status === 'Overdue' ? 'Pay Now' : 'View Invoice'}
                      </Button>
                    </Link>
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
