import React, { useEffect, useState } from 'react';
import { getBills, updateBillStatus, generateBill, type Bill } from '../../services/billingService';
import { getTenants, type Tenant } from '../../services/tenantService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const Billing: React.FC = () => {
  const { profile } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newBill, setNewBill] = useState({
    tenantId: '',
    billingMonth: '',
    rentAmount: 0,
    utilitiesAmount: 0,
    discount: 0,
    totalPayable: 0,
    dueDate: ''
  });

  useEffect(() => {
    if (profile?.pgId) {
      loadData();
    } else if (profile) {
      setLoading(false);
    }
  }, [profile]);

  const loadData = async () => {
    try {
      const [billsData, tenantsData] = await Promise.all([
        getBills(profile!.pgId),
        getTenants(profile!.pgId)
      ]);
      setBills(billsData);
      setTenants(tenantsData);
    } catch (error) {
      console.error("Failed to load bills", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'Paid': return 'var(--color-secondary)';
      case 'Overdue': return 'var(--color-danger)';
      case 'Partially Paid': return 'var(--color-primary)';
      case 'Under Review': return 'var(--color-warning)';
      default: return 'var(--text-muted)';
    }
  };

  const handleApprove = async (billId: string) => {
    if (!confirm("Are you sure you want to mark this bill as PAID?")) return;
    try {
      await updateBillStatus(billId, 'Paid');
      setBills(bills.map(b => b.id === billId ? { ...b, status: 'Paid' } : b));
    } catch (error) {
      alert("Failed to approve payment");
    }
  };

  const handleGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const total = Number(newBill.rentAmount) + Number(newBill.utilitiesAmount) - Number(newBill.discount);
      await generateBill(profile!.pgId, {
        pgId: profile!.pgId,
        tenantId: newBill.tenantId,
        billingMonth: newBill.billingMonth,
        baseRent: Number(newBill.rentAmount),
        electricityCharge: Number(newBill.utilitiesAmount),
        waterCharge: 0,
        maintenanceCharge: 0,
        otherCharges: 0,
        previousBalance: 0,
        discount: Number(newBill.discount),
        totalPayable: total,
        dueDate: new Date(newBill.dueDate).toISOString()
      });
      setShowGenerateModal(false);
      loadData();
    } catch (error) {
      alert("Failed to generate bill");
    }
  };

  if (loading) return <div className="page-content">Loading billing data...</div>;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Billing & Payments</h2>
        <Button onClick={() => setShowGenerateModal(true)}>+ Generate Bill</Button>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Month</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Tenant Name</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Total Payable</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No bills generated yet.
                </td>
              </tr>
            ) : (
              bills.map(bill => {
                const tenant = tenants.find(t => t.id === bill.tenantId);
                return (
                  <tr key={bill.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{bill.billingMonth}</td>
                    <td style={{ padding: '1rem' }}>{tenant?.name || 'Unknown'}</td>
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
                      {bill.status === 'Under Review' && bill.transactionId && (
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                          UTR: {bill.transactionId}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {bill.status === 'Under Review' ? (
                        <Button size="sm" onClick={() => handleApprove(bill.id)}>Approve</Button>
                      ) : (
                        <Button variant="ghost" size="sm">View</Button>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Generate Bill Modal */}
      {showGenerateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Generate Bill</h3>
            <form onSubmit={handleGenerateSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Select Tenant</label>
                <select required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} value={newBill.tenantId} onChange={e => setNewBill({...newBill, tenantId: e.target.value})}>
                  <option value="">-- Choose Tenant --</option>
                  {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Billing Month</label>
                  <input type="month" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} value={newBill.billingMonth} onChange={e => setNewBill({...newBill, billingMonth: e.target.value})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Due Date</label>
                  <input type="date" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} value={newBill.dueDate} onChange={e => setNewBill({...newBill, dueDate: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Base Rent (₹)</label>
                  <input type="number" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} value={newBill.rentAmount} onChange={e => setNewBill({...newBill, rentAmount: Number(e.target.value)})} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Utilities (₹)</label>
                  <input type="number" required style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }} value={newBill.utilitiesAmount} onChange={e => setNewBill({...newBill, utilitiesAmount: Number(e.target.value)})} />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <Button type="button" variant="ghost" onClick={() => setShowGenerateModal(false)}>Cancel</Button>
                <Button type="submit">Generate</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
