import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPgListings, type PgSettings } from '../../services/pgSettingsService';
import { Button } from '../../components/ui/Button';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';

const PG_IMAGES = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1459535653751-d571815e906b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop',
];

export const PgSearch: React.FC = () => {
  const [pgs, setPgs] = useState<PgSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  useEffect(() => { loadPgs(); }, []);

  const loadPgs = async () => {
    try { setPgs(await getAllPgListings()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const availableStates = Array.from(new Set(pgs.map(p => p.state).filter(Boolean))) as string[];
  const availableCities = Array.from(new Set(
    pgs.filter(p => !stateFilter || p.state === stateFilter).map(p => p.city).filter(Boolean)
  )) as string[];

  const filteredPgs = pgs.filter(pg => {
    if (stateFilter && pg.state !== stateFilter) return false;
    if (cityFilter && pg.city !== cityFilter) return false;
    if (keyword && !pg.pgName?.toLowerCase().includes(keyword.toLowerCase()) && !pg.description?.toLowerCase().includes(keyword.toLowerCase())) return false;
    return true;
  });

  if (loading) return (
    <div style={{ textAlign: 'center', marginTop: '8rem' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
      <p style={{ color: '#64748b' }}>Loading PGs...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* Hero Search Bar */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: 'white', fontSize: '2.75rem', fontWeight: 900, margin: '0 0 0.75rem 0' }}>
            Find Your Perfect PG 🏠
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.15rem', marginBottom: '2.5rem' }}>
            Browse top-rated hostels and PGs across India
          </p>

          <div style={{ maxWidth: '750px', margin: '0 auto', backgroundColor: 'white', borderRadius: '1rem', padding: '1rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={18} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by name or keyword..."
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '1rem', width: '100%', color: '#1e1b4b' }}
              />
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#e2e8f0', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <SlidersHorizontal size={16} color="#94a3b8" />
              <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setCityFilter(''); }}
                style={{ border: 'none', outline: 'none', fontSize: '0.95rem', color: stateFilter ? '#1e1b4b' : '#94a3b8', cursor: 'pointer', backgroundColor: 'transparent' }}>
                <option value="">All States</option>
                {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#e2e8f0', flexShrink: 0 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="#94a3b8" />
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} disabled={!stateFilter}
                style={{ border: 'none', outline: 'none', fontSize: '0.95rem', color: cityFilter ? '#1e1b4b' : '#94a3b8', cursor: stateFilter ? 'pointer' : 'default', backgroundColor: 'transparent', opacity: stateFilter ? 1 : 0.5 }}>
                <option value="">All Cities</option>
                {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem', fontSize: '0.9rem' }}>
            {filteredPgs.length} PG{filteredPgs.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      {/* PG Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredPgs.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', border: '2px dashed #cbd5e1', borderRadius: '1.5rem', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3>No PGs found</h3>
              <p>Try adjusting your search or be the first to add one!</p>
              <Link to="/register" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none', backgroundColor: '#4f46e5', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600 }}>List Your PG Free</Link>
            </div>
          ) : (
            filteredPgs.map((pg, idx) => (
              <div key={pg.pgId}
                style={{ backgroundColor: 'white', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column' }}
                onMouseOver={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(-6px)'; d.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)'; }}
                onMouseOut={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(0)'; d.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
              >
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={pg.photos?.[0] || PG_IMAGES[idx % PG_IMAGES.length]}
                    alt={pg.pgName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                    onMouseOver={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)'}
                    onMouseOut={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                  />
                  {pg.city && pg.state && (
                    <span style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem', backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', color: 'white', padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 500 }}>
                      📍 {pg.city}, {pg.state}
                    </span>
                  )}
                  <span style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', backgroundColor: '#d1fae5', color: '#059669', padding: '0.25rem 0.6rem', borderRadius: '2rem', fontSize: '0.7rem', fontWeight: 700 }}>
                    ✓ Verified
                  </span>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '1.1rem', color: '#1e1b4b' }}>{pg.pgName}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
                    {pg.description || 'A well-maintained PG with all amenities for students and professionals.'}
                  </p>

                  {pg.amenities && pg.amenities.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                      {pg.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} style={{ backgroundColor: '#ede9fe', color: '#7c3aed', padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.72rem', fontWeight: 500 }}>{a}</span>
                      ))}
                      {pg.amenities.length > 3 && (
                        <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: '2rem', fontSize: '0.72rem' }}>+{pg.amenities.length - 3} more</span>
                      )}
                    </div>
                  )}

                  <Link to={`/pg/${pg.pgId}`} style={{ textDecoration: 'none' }}>
                    <Button style={{ width: '100%', borderRadius: '0.6rem', fontWeight: 600 }}>View Details & Join</Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'linear-gradient(135deg, #ede9fe, #dbeafe)', borderRadius: '1.5rem' }}>
          <h3 style={{ color: '#1e1b4b', margin: '0 0 0.5rem 0', fontWeight: 800 }}>🏠 Are you a PG Owner?</h3>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>List your property for free and manage everything from one dashboard.</p>
          <Link to="/register">
            <Button variant="outline" style={{ borderRadius: '0.6rem', fontWeight: 600 }}>List your PG for free →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
