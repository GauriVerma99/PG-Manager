import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createComplaint, getComplaints, type ComplaintPriority } from '../../services/complaintService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Button } from '../../components/ui/Button';

export const TenantComplaints: React.FC = () => {
  const { profile } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plumbing');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ComplaintPriority>('Medium');

  useEffect(() => {
    if (profile?.pgId) loadComplaints();
  }, [profile]);

  const loadComplaints = async () => {
    try {
      const data = await getComplaints(profile!.pgId);
      const myComplaints = data.filter((c: any) => c.tenantId === profile!.uid);
      setComplaints(myComplaints);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createComplaint(profile!.pgId, profile!.uid, title, category, description, priority);
      setTitle('');
      setDescription('');
      loadComplaints();
    } catch (error) {
      alert("Failed to submit complaint");
    }
  };

  const markResolved = async (id: string) => {
    if (!confirm("Are you sure this issue is resolved?")) return;
    try {
      await updateDoc(doc(db, 'complaints', id), { status: 'Resolved' });
      loadComplaints();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <h2 style={{ marginBottom: '2rem' }}>My Complaints</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Submit Complaint Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Raise an Issue</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
              <select 
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                value={category} onChange={e => setCategory(e.target.value)}
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning & Hygiene</option>
                <option value="Internet">Internet / WiFi</option>
                <option value="Noise">Noise / Disturbance</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Priority</label>
              <select 
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                value={priority} onChange={e => setPriority(e.target.value as ComplaintPriority)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title</label>
              <input 
                type="text" required placeholder="e.g. AC is not cooling"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                value={title} onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
              <textarea 
                required placeholder="Provide details..."
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', minHeight: '100px' }}
                value={description} onChange={e => setDescription(e.target.value)}
              />
            </div>

            <Button type="submit" style={{ width: '100%' }}>Submit Complaint</Button>
          </form>
        </div>

        {/* Complaints List */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0 }}>Complaint History</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No complaints raised.</p>
            ) : (
              complaints.map(c => (
                <div key={c.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0' }}>{c.title}</h4>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-main)', padding: '0.25rem 0.5rem', borderRadius: '1rem', marginRight: '0.5rem' }}>{c.category}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.875rem',
                      backgroundColor: c.status === 'Resolved' ? 'var(--color-secondary)' : 'var(--color-warning)',
                      color: 'white'
                    }}>
                      {c.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{c.description}</p>
                  
                  {c.status !== 'Resolved' && (
                    <Button variant="outline" size="sm" onClick={() => markResolved(c.id)}>
                      Mark as Resolved
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
