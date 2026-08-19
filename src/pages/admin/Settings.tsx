import React, { useEffect, useState } from 'react';
import { getPgSettings, updatePgSettings, type PgSettings } from '../../services/pgSettingsService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

export const Settings: React.FC = () => {
  const { profile } = useAuth();
  const [settings, setSettings] = useState<Partial<PgSettings>>({
    pgName: '', upiId: '', bankAccountNumber: '', bankIfsc: '', bankAccountName: '', phoneNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (profile?.pgId) {
      loadSettings();
    }
  }, [profile]);

  const loadSettings = async () => {
    try {
      const data = await getPgSettings(profile!.pgId);
      if (data) setSettings(data);
    } catch (error) {
      console.error("Failed to load settings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updatePgSettings(profile!.pgId, settings);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-content">Loading settings...</div>;

  return (
    <div className="page-content">
      <div style={{ marginBottom: '2rem' }}>
        <h2>PG Owner Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Configure your PG details and payment methods for tenants to pay their bills.</p>
        
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
          <strong>Your Public Listing Link: </strong>
          <a href={`/pg/${profile?.pgId}`} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
            http://localhost:5173/pg/{profile?.pgId}
          </a>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Share this link with prospective tenants. They can view your photos/amenities and apply directly.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSave}>
          {message && <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: message.includes('Failed') ? '#fef2f2' : '#ecfdf5', color: message.includes('Failed') ? 'var(--color-danger)' : 'var(--color-secondary)', borderRadius: 'var(--radius-sm)' }}>{message}</div>}
          
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Basic Info</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>PG Name</label>
            <input 
              type="text" 
              value={settings.pgName || ''}
              onChange={e => setSettings({...settings, pgName: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              placeholder="e.g. Sunrise PG"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Google Maps Location Link</label>
            <input 
              type="url" 
              value={settings.mapUrl || ''}
              onChange={e => setSettings({...settings, mapUrl: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              placeholder="e.g. https://maps.app.goo.gl/..."
            />
          </div>

          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '2rem 0 1rem' }}>Public PG Listing</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            This information will be shown to prospective tenants on your public listing page.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>State (India)</label>
              <select 
                value={settings.state || ''}
                onChange={e => setSettings({...settings, state: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              >
                <option value="">Select State</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="West Bengal">West Bengal</option>
                {/* Add more states if needed */}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>City</label>
              <input 
                type="text" 
                value={settings.city || ''}
                onChange={e => setSettings({...settings, city: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                placeholder="e.g. Bangalore"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>PG Description</label>
            <textarea 
              value={settings.description || ''}
              onChange={e => setSettings({...settings, description: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', minHeight: '80px' }}
              placeholder="Describe your PG, the neighborhood, rules, etc."
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Amenities (Comma separated)</label>
            <input 
              type="text" 
              value={(settings.amenities || []).join(', ')}
              onChange={e => setSettings({...settings, amenities: e.target.value.split(',').map(s => s.trim())})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              placeholder="e.g. AC, WiFi, Laundry, 3 Meals, Security"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Upload PG Photos</label>
            <input 
              type="file" accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const newPhotos = [...(settings.photos || []), reader.result as string];
                    setSettings({...settings, photos: newPhotos});
                  };
                  reader.readAsDataURL(file);
                }
              }}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', overflowX: 'auto' }}>
              {(settings.photos || []).map((photo, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={photo} alt="PG Photo" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <button type="button" onClick={() => {
                    const newPhotos = [...settings.photos!];
                    newPhotos.splice(i, 1);
                    setSettings({...settings, photos: newPhotos});
                  }} style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>×</button>
                </div>
              ))}
            </div>
          </div>

          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: '2rem 0 1rem' }}>Payment Retrieval Methods</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>These details will be securely displayed on tenant invoices (Invio-style) so they can pay you directly with zero fees.</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>UPI ID (GPay / PhonePe / Paytm)</label>
            <input 
              type="text" 
              value={settings.upiId || ''}
              onChange={e => setSettings({...settings, upiId: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              placeholder="e.g. 9876543210@ybl"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Bank Account Number</label>
              <input 
                type="text" 
                value={settings.bankAccountNumber || ''}
                onChange={e => setSettings({...settings, bankAccountNumber: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                placeholder="Account Number"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>IFSC Code</label>
              <input 
                type="text" 
                value={settings.bankIfsc || ''}
                onChange={e => setSettings({...settings, bankIfsc: e.target.value})}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
                placeholder="IFSC Code"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>Account Holder Name</label>
            <input 
              type="text" 
              value={settings.bankAccountName || ''}
              onChange={e => setSettings({...settings, bankAccountName: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}
              placeholder="Name on Bank Account"
            />
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </div>
    </div>
  );
};
