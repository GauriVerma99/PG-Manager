import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { AuthLayout } from './AuthLayout';
import styles from './Auth.module.css';

export const PendingApproval: React.FC = () => {
  useEffect(() => {
    // Automatically sign out so they aren't stuck logged in as an inactive user
    signOut(auth).catch(console.error);
  }, []);

  return (
    <AuthLayout title="Account Pending Review" subtitle="PG Owner approval required">
      <div style={{ textAlign: 'center', padding: '1rem 0', color: 'var(--text-main)' }}>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
          For security purposes, your PG Owner must approve your account before you can access the dashboard.
        </p>
        <p style={{ marginBottom: '2rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          Please wait until they review your request. If it takes too long, contact your PG Owner directly.
        </p>
        <div className={styles.authLink}>
          <Link to="/login" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text-main)', fontWeight: '500' }}>
            Return to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
