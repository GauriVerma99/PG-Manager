import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { AuthLayout } from './AuthLayout';
import styles from './Auth.module.css';

export const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const urlCode = searchParams.get('pgCode') || '';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'tenant' | 'staff' | 'admin'>(urlCode ? 'tenant' : 'admin');
  const [pgCode, setPgCode] = useState(urlCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const isOwner = role === 'admin';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const isOwner = role === 'admin';
    if (!isOwner && !pgCode.trim()) {
      setError('Please enter the PG Code provided by your PG Owner.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Generate a unique 6-character alphanumeric PG Code for new owners
      const generatedPgCode = 'PG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const pgId = isOwner ? generatedPgCode : pgCode.trim();
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name,
        role: role,
        pgId: pgId,
        isActive: isOwner, // Owners are instantly active, others need approval
        createdAt: new Date()
      });

      if (isOwner) {
        // Also initialize empty settings for the new PG
        await setDoc(doc(db, 'pg_settings', pgId), {
          pgId,
          pgName: `${name}'s PG`,
          updatedAt: new Date()
        });
      }

      // If tenant, create an Application instead of a direct inactive tenant record
      if (role === 'tenant') {
        const formData = new FormData(e.target as HTMLFormElement);
        // In a real app we'd upload formData.get('kycFile') to Firebase Storage and get a URL.
        const phone = formData.get('phone') as string;
        const moveInDate = formData.get('moveInDate') as string;
        const duration = parseInt(formData.get('duration') as string) || 6;
        const roomType = formData.get('roomType') as string;

        const { submitApplication } = await import('../../services/applicationService');
        await submitApplication({
          pgId,
          userId: userCredential.user.uid,
          name,
          email,
          phone: phone,
          moveInDate: moveInDate,
          durationMonths: duration,
          roomType: roomType,
        });
      }

      if (isOwner) {
        // Logged in automatically by Firebase, navigate to dashboard
        navigate('/admin/dashboard');
      } else {
        // Automatically sign out so staff/tenants have to wait for approval
        await signOut(auth);
        navigate('/pending-approval');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create an Account" subtitle="Join PG Manager to get started">
      <form onSubmit={handleRegister}>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>{error}</div>}
        
        <div className={styles.inputGroup}>
          <label>Full Name</label>
          <input 
            type="text" 
            className={styles.inputField}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Email Address</label>
          <input 
            type="email" 
            className={styles.inputField}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Password</label>
          <input 
            type="password" 
            className={styles.inputField}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>I am registering as a:</label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="admin" 
                checked={role === 'admin'} 
                onChange={() => setRole('admin')}
                style={{ accentColor: 'var(--color-primary)' }}
              /> PG Owner
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="tenant" 
                checked={role === 'tenant'} 
                onChange={() => setRole('tenant')}
                style={{ accentColor: 'var(--color-primary)' }}
              /> Tenant
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'normal', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="role" 
                value="staff" 
                checked={role === 'staff'} 
                onChange={() => setRole('staff')}
                style={{ accentColor: 'var(--color-primary)' }}
              /> Staff Member
            </label>
          </div>
        </div>

        {role !== 'admin' && (
          <div className={styles.inputGroup} style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}>
            <label style={{ color: 'var(--color-primary)' }}>PG Code (Required)</label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Ask your PG Owner for their unique PG Code to join their hostel.</p>
            <input 
              type="text" 
              className={styles.inputField}
              value={pgCode}
              onChange={e => setPgCode(e.target.value)}
              placeholder="e.g. pg_123456789"
              required={!isOwner}
            />
          </div>
        )}

        {role === 'tenant' && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Tenant Application Details</h4>
            
            <div className={styles.inputGroup} style={{ marginBottom: '1rem' }}>
              <label>Phone Number</label>
              <input type="tel" className={styles.inputField} name="phone" placeholder="10-digit number" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div className={styles.inputGroup}>
                <label>Move-in Date</label>
                <input type="date" className={styles.inputField} name="moveInDate" required />
              </div>
              <div className={styles.inputGroup}>
                <label>Stay Duration (Months)</label>
                <input type="number" min="1" max="24" defaultValue="6" className={styles.inputField} name="duration" required />
              </div>
            </div>

            <div className={styles.inputGroup} style={{ marginBottom: '1rem' }}>
              <label>Room Preference</label>
              <select className={styles.inputField} name="roomType" required>
                <option value="Single">Single Room</option>
                <option value="Double">Double Shared</option>
                <option value="Triple">Triple Shared</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>KYC Document (Aadhar / ID) - Image only</label>
              <input type="file" accept="image/*" className={styles.inputField} style={{ padding: '0.5rem' }} required />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>This document will be securely stored for owner verification.</p>
            </div>
          </div>
        )}

        <button type="submit" className={styles.submitBtn} disabled={loading} style={{ marginTop: '1.5rem' }}>
          {loading ? 'Creating account...' : role === 'tenant' ? 'Submit Application' : 'Create Account'}
        </button>
      </form>

      <div className={styles.authLink}>
        Already have an account? <Link to="/login">Sign in here</Link>
      </div>
    </AuthLayout>
  );
};
