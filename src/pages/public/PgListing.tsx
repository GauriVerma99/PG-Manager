import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPgSettings, type PgSettings } from '../../services/pgSettingsService';
import { Button } from '../../components/ui/Button';

export const PgListing: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pg, setPg] = useState<PgSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getPgSettings(id).then(data => {
        setPg(data as PgSettings);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) return <div className="page-content" style={{ textAlign: 'center', marginTop: '5rem' }}>Loading PG Details...</div>;
  if (!pg) return <div className="page-content" style={{ textAlign: 'center', marginTop: '5rem' }}><h2>PG Not Found</h2><p>Please check the link.</p></div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2.5rem' }}>{pg.pgName}</h1>
          {pg.mapUrl && (
            <a href={pg.mapUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
              📍 View on Google Maps
            </a>
          )}
        </div>
        <Link to={`/register?pgCode=${pg.pgId}`}>
          <Button size="lg">Apply to Join PG</Button>
        </Link>
      </div>

      {/* Image Gallery */}
      <div style={{ marginBottom: '2rem' }}>
        {pg.photos && pg.photos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {pg.photos.map((photo, i) => (
              <img key={i} src={photo} alt={`${pg.pgName} - ${i}`} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            ))}
          </div>
        ) : (
          <img 
            src={`https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop&sig=${pg.pgId}`} 
            alt="PG placeholder" 
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: 'var(--radius-md)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
          />
        )}
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>About this PG</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-color)' }}>
            {pg.description || 'No description provided by the owner.'}
          </p>
        </div>

        <div className="card">
          <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Amenities</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {pg.amenities && pg.amenities.length > 0 ? pg.amenities.map((amenity, i) => (
              <li key={i} style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-primary)' }}>✓</span> {amenity}
              </li>
            )) : (
              <li style={{ color: 'var(--text-muted)' }}>Amenities not listed</li>
            )}
          </ul>
        </div>
        
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Interested in joining {pg.pgName}?</p>
        <Link to={`/register?pgCode=${pg.pgId}`}>
          <Button>Create a Tenant Account</Button>
        </Link>
      </div>

    </div>
  );
};
