import React, { useEffect, useState } from 'react';
import { getTenants, type Tenant } from '../../services/tenantService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const Tenants: React.FC = () => {
  const { profile } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', email: '', password: '', phone: '' });

  useEffect(() => {
    if (profile?.pgId) {
      loadTenants();
    } else if (profile) {
      setLoading(false);
    }
  }, [profile]);

  const loadTenants = async () => {
    try {
      const data = await getTenants(profile!.pgId);
      setTenants(data);
    } catch (error) {
      console.error("Failed to load tenants", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create user in auth (mock creates it in local storage)
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const { auth, db } = await import('../../firebase/config');
      const { doc, setDoc } = await import('firebase/firestore');
      
      const userCredential = await createUserWithEmailAndPassword(auth, newTenant.email, newTenant.password);
      
      // Create user profile
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: newTenant.email,
        name: newTenant.name,
        role: 'tenant',
        pgId: profile!.pgId,
        isActive: true, // Auto-approve since admin is creating them
        createdAt: new Date()
      });

      // Create tenant record
      await setDoc(doc(db, 'tenants', userCredential.user.uid), {
        pgId: profile!.pgId,
        name: newTenant.name,
        email: newTenant.email,
        phone: newTenant.phone,
        status: 'Active',
        depositAmount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      alert('Tenant successfully created and approved!');
      setIsModalOpen(false);
      setNewTenant({ name: '', email: '', password: '', phone: '' });
      loadTenants();
    } catch (error) {
      alert("Failed to create tenant");
    }
  };

  if (loading) return <div className="page-content">Loading tenants...</div>;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Tenant Management</h2>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Tenant</Button>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Add New Tenant</h3>
            <form onSubmit={handleCreateTenant}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
                <input required type="text" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} value={newTenant.name} onChange={e => setNewTenant({...newTenant, name: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
                <input required type="email" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} value={newTenant.email} onChange={e => setNewTenant({...newTenant, email: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Phone</label>
                <input required type="text" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} value={newTenant.phone} onChange={e => setNewTenant({...newTenant, phone: e.target.value})} />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password (for their login)</label>
                <input required type="password" style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} value={newTenant.password} onChange={e => setNewTenant({...newTenant, password: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Tenant</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Email</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Phone</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No tenants found.
                </td>
              </tr>
            ) : (
              tenants.map(tenant => (
                <tr key={tenant.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{tenant.name}</td>
                  <td style={{ padding: '1rem' }}>{tenant.email}</td>
                  <td style={{ padding: '1rem' }}>{tenant.phone}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      backgroundColor: tenant.status === 'Active' ? 'var(--color-secondary)' : 'var(--color-danger)', 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.75rem' 
                    }}>
                      {tenant.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Button variant="ghost" size="sm">View</Button>
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
