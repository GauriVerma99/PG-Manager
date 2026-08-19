import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, setDoc, getDocs, doc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Button } from '../../components/ui/Button';

export const StaffDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [area, setArea] = useState('');
  const [taskType, setTaskType] = useState('Cleaning');
  const [image, setImage] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (profile?.pgId) loadLogs();
  }, [profile]);

  const loadLogs = async () => {
    try {
      const q = query(collection(db, 'cleaningLogs'), where('pgId', '==', profile!.pgId));
      const snap = await getDocs(q);
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => b.timestamp - a.timestamp));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Save as Base64 for local demo
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return alert("Please upload a photo of the completed task.");

    try {
      const newLogRef = doc(collection(db, 'cleaningLogs'));
      await setDoc(newLogRef, {
        pgId: profile!.pgId,
        staffId: profile!.uid,
        staffName: profile!.name,
        area,
        taskType,
        image,
        notes,
        timestamp: Date.now()
      });
      
      setArea('');
      setImage('');
      setNotes('');
      alert("Proof submitted successfully!");
      loadLogs();
    } catch (error) {
      console.error(error);
      alert("Failed to submit proof");
    }
  };

  if (loading) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <h2 style={{ marginBottom: '2rem' }}>Staff Dashboard</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Submission Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Submit Task Proof</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Task Type</label>
              <select 
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                value={taskType} onChange={e => setTaskType(e.target.value)}
              >
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance / Repair</option>
                <option value="Inspection">Routine Inspection</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Room / Area</label>
              <input 
                type="text" required
                placeholder="e.g. Room 101, Corridor 2, Kitchen"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                value={area} onChange={e => setArea(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Photo Proof (Required)</label>
              <input 
                type="file" required accept="image/*"
                onChange={handleImageUpload}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)', backgroundColor: 'var(--bg-main)' }}
              />
              {image && (
                <div style={{ marginTop: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                  <img src={image} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Notes (Optional)</label>
              <textarea 
                placeholder="Any issues found?"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', minHeight: '80px' }}
                value={notes} onChange={e => setNotes(e.target.value)}
              />
            </div>

            <Button type="submit" style={{ width: '100%' }}>Submit Proof</Button>
          </form>
        </div>

        {/* Task Log */}
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h3 style={{ margin: 0 }}>Recent Activity</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
            {logs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No tasks recorded yet.</p>
            ) : (
              logs.map(log => (
                <div key={log.id} style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  <img src={log.image} alt={log.area} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{log.area}</span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--bg-main)', padding: '0.25rem 0.5rem', borderRadius: '1rem' }}>{log.taskType}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      By {log.staffName} on {new Date(log.timestamp).toLocaleDateString()}
                    </p>
                    {log.notes && <p style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>"{log.notes}"</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
