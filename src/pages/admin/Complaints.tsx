import React, { useEffect, useState } from 'react';
import { getComplaints, type Complaint } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const Complaints: React.FC = () => {
  const { profile } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.pgId) {
      loadComplaints();
    } else if (profile) {
      setLoading(false);
    }
  }, [profile]);

  const loadComplaints = async () => {
    try {
      const data = await getComplaints(profile!.pgId);
      setComplaints(data);
    } catch (error) {
      console.error("Failed to load complaints", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: Complaint['priority']) => {
    switch (priority) {
      case 'Urgent': return 'var(--color-danger)';
      case 'High': return 'var(--color-warning)';
      case 'Medium': return 'var(--color-primary)';
      case 'Low': return 'var(--text-muted)';
    }
  };

  if (loading) return <div className="page-content">Loading complaints...</div>;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Complaints & SLA Tracking</h2>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-color)' }}>
            <tr>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Category</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Tenant ID</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Priority</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>SLA Deadline</th>
              <th style={{ padding: '1rem', fontWeight: '500' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No active complaints! Great job.
                </td>
              </tr>
            ) : (
              complaints.map(complaint => (
                <tr key={complaint.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{complaint.category}</td>
                  <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{complaint.tenantId.slice(0, 8)}...</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      backgroundColor: getPriorityColor(complaint.priority), 
                      color: 'white', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.75rem' 
                    }}>
                      {complaint.priority}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>{complaint.status}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {complaint.resolutionTimeTarget ? new Date(complaint.resolutionTimeTarget.seconds * 1000).toLocaleString() : 'N/A'}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Button variant="ghost" size="sm">Review</Button>
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
