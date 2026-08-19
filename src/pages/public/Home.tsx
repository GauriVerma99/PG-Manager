import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Shield, Zap, Star, ChevronRight, Users, CreditCard, MessageSquare } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop',
];

const FEATURES = [
  { icon: <Users size={28} color="#4f46e5" />, title: 'Tenant Management', desc: 'Full lifecycle from application → lease → move-out. Track every tenant with ease.' },
  { icon: <CreditCard size={28} color="#059669" />, title: 'Smart Billing', desc: 'Auto-generate invoices for rent, food, electricity. Track dues and collections instantly.' },
  { icon: <MessageSquare size={28} color="#d97706" />, title: 'Complaints & Service', desc: 'Tenants raise complaints, staff resolve them. Full ticketing with priority and evidence.' },
  { icon: <Shield size={28} color="#dc2626" />, title: 'Secure by Design', desc: 'Strict role-based access. Tenant A can never see Tenant B\'s data. Ever.' },
  { icon: <Zap size={28} color="#7c3aed" />, title: 'Real-time Updates', desc: 'Firebase-powered live sync. Owners see payments the moment they land.' },
  { icon: <Star size={28} color="#f59e0b" />, title: 'Reviews & Ratings', desc: 'Build trust with verified tenant reviews. Attract better tenants with a great reputation.' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'PG Owner, Bangalore', text: 'I replaced 3 WhatsApp groups and an Excel sheet with this. My collection rate went from 60% to 95%.', avatar: 'P' },
  { name: 'Rahul M.', role: 'Tenant, Pune', text: 'I can see my bills, pay rent and raise complaints all from one place. Super convenient!', avatar: 'R' },
  { name: 'Anita K.', role: 'PG Manager, Hyderabad', text: 'Managing 3 PGs simultaneously is finally possible. The room allocation system is a game changer.', avatar: 'A' },
];

export const Home: React.FC = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#1e1b4b', overflowX: 'hidden' }}>

      {/* ─── NAVBAR ─────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#4f46e5' }}>
          <Building2 size={28} /> PG Manager
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/find" style={{ textDecoration: 'none', color: '#374151', fontWeight: 500 }}>Find PG</Link>
          <Link to="/login" style={{ textDecoration: 'none', color: '#374151', fontWeight: 500 }}>Login</Link>
          <Link to="/register" style={{ textDecoration: 'none', backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontWeight: 600 }}>Get Started Free</Link>
        </div>
      </nav>

      {/* ─── HERO ────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={HERO_IMAGES[0]} alt="Modern PG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(79,70,229,0.92) 0%, rgba(30,27,75,0.85) 100%)' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left text */}
          <div style={{ color: 'white' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: '0.35rem 1rem', borderRadius: '2rem', fontSize: '0.875rem', fontWeight: 600, letterSpacing: '0.05em', display: 'inline-block', marginBottom: '1.5rem' }}>
              🏠 India's #1 PG Management Platform
            </span>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.1, margin: '0 0 1.5rem 0', letterSpacing: '-0.02em' }}>
              One source of truth for your PG.
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, lineHeight: 1.7, marginBottom: '2.5rem' }}>
              Replace fragmented WhatsApp, Excel & notebooks with one secure system for tenants, staff, rooms, and payments.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none', backgroundColor: 'white', color: '#4f46e5', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
                List your PG Free <ChevronRight size={18} />
              </Link>
              <Link to="/find" style={{ textDecoration: 'none', backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.875rem 2rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '1rem', border: '2px solid rgba(255,255,255,0.4)' }}>
                Find a PG
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '2rem', marginTop: '3rem', opacity: 0.85 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>500+</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>PGs Listed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>12K+</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Tenants Managed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800 }}>95%</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Collection Rate</div>
              </div>
            </div>
          </div>

          {/* Right: floating card mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { emoji: '✅', title: 'Rent Collected', sub: 'Priya S. paid ₹8,500', color: '#d1fae5', accent: '#059669' },
              { emoji: '🔔', title: 'New Application', sub: 'Rahul M. applied for Bed 4B', color: '#ede9fe', accent: '#7c3aed' },
              { emoji: '🔧', title: 'Complaint Resolved', sub: 'Room 3: Plumbing fixed by Raj', color: '#fef3c7', accent: '#d97706' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: item.color, borderRadius: '1rem', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', animation: `slideIn 0.5s ease ${i * 0.15}s both` }}>
                <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, color: item.accent, fontSize: '0.95rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.85rem', color: '#374151' }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ────────────────────────────── */}
      <section style={{ backgroundColor: '#f8fafc', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 1rem 0' }}>Everything you need to run a PG</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Built specifically for Indian PG owners, managers and tenants.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 32px rgba(0,0,0,0.1)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '1.1rem', color: '#1e1b4b' }}>{f.title}</h3>
                <p style={{ color: '#64748b', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PHOTO STRIP ─────────────────────────── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', height: '400px', overflow: 'hidden' }}>
        {HERO_IMAGES.map((src, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
            <img src={src} alt="PG interior" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
              onMouseOver={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.08)'}
              onMouseOut={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,27,75,0.25)' }} />
          </div>
        ))}
      </section>

      {/* ─── TESTIMONIALS ───────────────────────── */}
      <section style={{ padding: '6rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e1b4b', margin: '0 0 1rem 0' }}>Trusted by owners & tenants</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ backgroundColor: '#f8fafc', borderRadius: '1rem', padding: '2rem', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#f59e0b', marginBottom: '1rem', fontSize: '1.25rem' }}>★★★★★</div>
                <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1e1b4b' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '5rem 2rem', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '2.75rem', fontWeight: 900, margin: '0 0 1rem 0' }}>Ready to upgrade your PG?</h2>
        <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '2.5rem' }}>Join 500+ PG owners managing their properties smarter.</p>
        <Link to="/register" style={{ textDecoration: 'none', backgroundColor: 'white', color: '#4f46e5', padding: '1rem 2.5rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          Get Started — It's Free <ChevronRight size={20} />
        </Link>
      </section>

      {/* ─── FOOTER ─────────────────────────────── */}
      <footer style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#6366f1', marginBottom: '1rem' }}>
          <Building2 size={24} /> PG Manager
        </div>
        <p style={{ margin: '0 0 0.5rem 0' }}>India's most complete PG Management SaaS</p>
        <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.6 }}>© {new Date().getFullYear()} PG Manager. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @media (max-width: 768px) {
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          h1 { font-size: 2.2rem !important; }
        }
      `}</style>
    </div>
  );
};
