import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { AuthLayout } from './auth/AuthLayout';
import styles from './auth/Auth.module.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue">
      <form onSubmit={handleLogin}>
        {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#fef2f2', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>{error}</div>}
        
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

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className={styles.authLink}>
        Don't have an account? <Link to="/register">Create one</Link>
      </div>
      <div className={styles.authLink} style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
        Looking for a place to stay? <Link to="/find" style={{ color: 'var(--color-secondary)' }}>Find a PG near you</Link>
      </div>
    </AuthLayout>
  );
};
