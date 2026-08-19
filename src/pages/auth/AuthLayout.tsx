import React from 'react';
import styles from './Auth.module.css';
import { Home } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode, title: string, subtitle: string }> = ({ children, title, subtitle }) => {
  return (
    <div className={styles.authContainer}>
      <div className={styles.brandPanel}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4rem' }}>
            <Home size={32} />
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>PG Manager</span>
          </div>
          <h1 className={styles.brandTitle}>One source of truth for your PG.</h1>
          <p className={styles.brandSubtitle}>
            Replace fragmented use of WhatsApp, Excel, notebooks, and screenshots with one secure system for tenants, staff, rooms, and payments.
          </p>
        </div>
        <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} PG Manager SaaS. All rights reserved.
        </div>
      </div>
      
      <div className={styles.formPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
