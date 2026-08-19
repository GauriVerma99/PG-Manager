import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getPgSettings, type PgSettings } from '../../services/pgSettingsService';
import { getTenantBills, updateBillStatus, type Bill } from '../../services/billingService';
import { Button } from '../../components/ui/Button';

export const InvoiceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  const [bill, setBill] = useState<Bill | null>(null);
  const [settings, setSettings] = useState<PgSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile?.uid && profile?.pgId) {
      loadData();
    }
  }, [profile, id]);

  const loadData = async () => {
    try {
      const [bills, pgSettings] = await Promise.all([
        getTenantBills(profile!.uid),
        getPgSettings(profile!.pgId)
      ]);
      const currentBill = bills.find(b => b.id === id);
      setBill(currentBill || null);
      setSettings(pgSettings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) return alert("Please enter a transaction ID");
    
    setSubmitting(true);
    try {
      await updateBillStatus(bill!.id, 'Under Review', transactionId);
      setBill(prev => prev ? { ...prev, status: 'Under Review', transactionId } : null);
    } catch (error) {
      console.error(error);
      alert("Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-content">Loading invoice...</div>;
  if (!bill) return <div className="page-content">Invoice not found.</div>;

  return (
    <div className="page-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => navigate('/tenant/dashboard')} style={{ marginBottom: '1rem', padding: 0 }}>
        &larr; Back to Dashboard
      </Button>

      <div className="card" style={{ padding: '3rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-color)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-primary)' }}>INVOICE</h1>
            <p style={{ color: 'var(--text-muted)' }}>Bill #{bill.id.slice(0, 8).toUpperCase()}</p>
            <div style={{ marginTop: '1rem' }}>
              <span style={{ 
                backgroundColor: bill.status === 'Paid' ? 'var(--color-secondary)' : 
                                 bill.status === 'Under Review' ? 'var(--color-warning)' : 
                                 bill.status === 'Overdue' ? 'var(--color-danger)' : 'var(--text-muted)',
                color: 'white', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 'bold'
              }}>
                {bill.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>{settings?.pgName || 'PG Management'}</h2>
            <p style={{ color: 'var(--text-muted)' }}>Billing Month: {bill.billingMonth}</p>
          </div>
        </div>

        {/* Bill Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Billed To</h3>
            <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>{profile?.name}</p>
            <p style={{ color: 'var(--text-muted)' }}>{profile?.email}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Amount Due</h3>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-primary)', margin: 0 }}>
              ₹{bill.totalPayable}
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ marginBottom: '3rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)' }}>Description</th>
                <th style={{ textAlign: 'right', padding: '0.75rem 0', color: 'var(--text-muted)' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--bg-main)' }}>
                <td style={{ padding: '1rem 0' }}>Base Rent</td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹{(bill as any).baseRent ?? (bill as any).rentAmount ?? 0}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--bg-main)' }}>
                <td style={{ padding: '1rem 0' }}>Utilities / Maintenance</td>
                <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹{(bill as any).electricityCharge ?? (bill as any).utilitiesAmount ?? 0}</td>
              </tr>
              {bill.discount > 0 && (
                <tr style={{ borderBottom: '1px solid var(--bg-main)' }}>
                  <td style={{ padding: '1rem 0', color: 'var(--color-secondary)' }}>Discount</td>
                  <td style={{ padding: '1rem 0', textAlign: 'right', color: 'var(--color-secondary)' }}>-₹{bill.discount}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td style={{ padding: '1.5rem 0', fontWeight: 'bold', fontSize: '1.25rem' }}>Total</td>
                <td style={{ padding: '1.5rem 0', textAlign: 'right', fontWeight: 'bold', fontSize: '1.25rem' }}>₹{bill.totalPayable}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Section */}
        {(bill.status === 'Pending' || bill.status === 'Overdue') && (
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ marginBottom: '1rem' }}>Payment Methods</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Pay directly to the owner using any of the methods below, then submit your transaction ID.
            </p>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {settings?.upiId && (
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>UPI ID</div>
                  <div style={{ fontWeight: 'bold', padding: '0.75rem', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    {settings.upiId}
                  </div>
                </div>
              )}
              {settings?.bankAccountNumber && (
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Bank Transfer</div>
                  <div style={{ padding: '0.75rem', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                    <strong>A/C:</strong> {settings.bankAccountNumber}<br/>
                    <strong>IFSC:</strong> {settings.bankIfsc}<br/>
                    <strong>Name:</strong> {settings.bankAccountName}
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleMarkPaid} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Submit Payment Reference</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  value={transactionId}
                  onChange={e => setTransactionId(e.target.value)}
                  placeholder="Enter UTR or Transaction ID" 
                  required
                  style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Mark as Paid'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {bill.status === 'Under Review' && (
          <div style={{ backgroundColor: '#fffbeb', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #fcd34d', color: '#b45309' }}>
            <strong>Payment Under Review:</strong> You submitted Transaction ID <code>{bill.transactionId}</code>. The admin will verify and approve this payment shortly.
          </div>
        )}

        {bill.status === 'Paid' && (
          <div style={{ backgroundColor: '#ecfdf5', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #6ee7b7', color: '#047857', textAlign: 'center' }}>
            <strong>Payment Successful!</strong><br/>
            Thank you. This bill has been paid in full.
          </div>
        )}
      </div>
    </div>
  );
};
