'use client';
import { useState } from 'react';

const BRAND = {
  teal: '#0d9488',
  dark: '#0f172a',
  mid: '#1e293b',
  border: '#334155',
  text: '#f1f5f9',
  muted: '#94a3b8',
};

interface LineItem {
  id: string;
  description: string;
  amount: string;
}

function newItem(): LineItem {
  return { id: Math.random().toString(36).slice(2), description: '', amount: '' };
}

export default function AdminInvoicePage() {
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [memo, setMemo] = useState('');
  const [items, setItems] = useState<LineItem[]>([newItem()]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ total: string; url: string } | null>(null);
  const [error, setError] = useState('');

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/invoice/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthed(true); setAuthError(''); }
    else setAuthError('Wrong password. Try again.');
  }

  function updateItem(id: string, field: 'description' | 'amount', val: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));
  }

  function addItem() { setItems(prev => [...prev, newItem()]); }
  function removeItem(id: string) { setItems(prev => prev.filter(i => i.id !== id)); }

  const subtotal = items.reduce((s, i) => s + (parseFloat(i.amount) || 0), 0);
  const tax = subtotal * 0.125;
  const afterTax = subtotal + tax;
  const fee = afterTax * 0.06;
  const total = afterTax + fee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setResult(null); setLoading(true);
    try {
      const res = await fetch('/api/invoice/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, memo, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invoice failed');
      setResult({ total: data.total, url: data.invoiceUrl });
      setName(''); setEmail(''); setMemo('');
      setItems([newItem()]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const fmt = (n: number) => '$' + n.toFixed(2);

  // ── Auth gate ─────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: BRAND.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: 360, background: BRAND.mid, borderRadius: 16, padding: '2rem', border: `1px solid ${BRAND.border}` }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔒</div>
          <h1 style={{ color: BRAND.text, fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Staff Access</h1>
          <p style={{ color: BRAND.muted, fontSize: '0.85rem', marginTop: 4 }}>Rene&apos;s Adventures — Invoice Tool</p>
        </div>
        <form onSubmit={handleAuth}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={inputStyle}
            autoFocus
          />
          {authError && <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: 6 }}>{authError}</p>}
          <button type="submit" style={{ ...btnStyle, width: '100%', marginTop: '1rem' }}>
            Enter
          </button>
        </form>
      </div>
    </div>
  );

  // ── Invoice form ──────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: BRAND.dark, padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ padding: '1rem 0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 24 }}>🧾</span>
            <div>
              <h1 style={{ color: BRAND.text, fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Send Invoice</h1>
              <p style={{ color: BRAND.muted, fontSize: '0.8rem', margin: 0 }}>Taxes auto-applied · Stripe emails the customer</p>
            </div>
          </div>
        </div>

        {result ? (
          <div style={{ background: '#064e3b', border: '1px solid #10b981', borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
            <h2 style={{ color: '#6ee7b7', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 4px' }}>Invoice Sent!</h2>
            <p style={{ color: '#a7f3d0', fontSize: '0.9rem', margin: '0 0 1rem' }}>Total charged: <strong>{result.total}</strong></p>
            <a href={result.url} target="_blank" rel="noreferrer"
              style={{ display: 'inline-block', background: BRAND.teal, color: '#fff', padding: '0.6rem 1.4rem', borderRadius: 8, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
              View in Stripe →
            </a>
            <br />
            <button onClick={() => setResult(null)} style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: BRAND.muted, fontSize: '0.85rem', cursor: 'pointer' }}>
              Send another invoice
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {/* Customer */}
            <section style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Customer</h2>
              <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} required style={inputStyle} />
              <input placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ ...inputStyle, marginTop: 10 }} />
            </section>

            {/* Line items */}
            <section style={{ ...sectionStyle, marginTop: 12 }}>
              <h2 style={sectionTitleStyle}>Line Items</h2>
              {items.map((item, idx) => (
                <div key={item.id} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input
                    placeholder={`Item ${idx + 1} description`}
                    value={item.description}
                    onChange={e => updateItem(item.id, 'description', e.target.value)}
                    required
                    style={{ ...inputStyle, flex: 1 }}
                  />
                  <input
                    placeholder="$0.00"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.amount}
                    onChange={e => updateItem(item.id, 'amount', e.target.value)}
                    required
                    style={{ ...inputStyle, width: 90 }}
                  />
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(item.id)}
                      style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: 20, cursor: 'pointer', padding: '0 4px' }}>×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addItem}
                style={{ background: 'transparent', border: `1px dashed ${BRAND.border}`, color: BRAND.muted, borderRadius: 8, padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem', width: '100%', marginTop: 4 }}>
                + Add item
              </button>
            </section>

            {/* Memo */}
            <section style={{ ...sectionStyle, marginTop: 12 }}>
              <h2 style={sectionTitleStyle}>Memo <span style={{ color: BRAND.muted, fontWeight: 400 }}>(optional)</span></h2>
              <textarea placeholder="e.g. Extra boat time, custom activity, equipment..." value={memo} onChange={e => setMemo(e.target.value)}
                rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </section>

            {/* Tax preview */}
            <section style={{ ...sectionStyle, marginTop: 12, fontSize: '0.9rem' }}>
              <h2 style={sectionTitleStyle}>Total Preview</h2>
              <div style={rowStyle}><span style={{ color: BRAND.muted }}>Subtotal</span><span style={{ color: BRAND.text }}>{fmt(subtotal)}</span></div>
              <div style={rowStyle}><span style={{ color: BRAND.muted }}>Belize Sales Tax (12.5%)</span><span style={{ color: BRAND.text }}>{fmt(tax)}</span></div>
              <div style={rowStyle}><span style={{ color: BRAND.muted }}>Card Processing Fee (6%)</span><span style={{ color: BRAND.text }}>{fmt(fee)}</span></div>
              <div style={{ ...rowStyle, borderTop: `1px solid ${BRAND.border}`, paddingTop: 10, marginTop: 6 }}>
                <span style={{ color: BRAND.text, fontWeight: 700 }}>Total</span>
                <span style={{ color: BRAND.teal, fontWeight: 800, fontSize: '1.1rem' }}>{fmt(total)}</span>
              </div>
            </section>

            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: 8, padding: '0 0.25rem' }}>{error}</p>}

            <button type="submit" disabled={loading} style={{ ...btnStyle, width: '100%', marginTop: 16, opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Sending invoice...' : `Send Invoice · ${fmt(total)}`}
            </button>

            <p style={{ color: BRAND.muted, fontSize: '0.75rem', textAlign: 'center', marginTop: 10 }}>
              Stripe will email the customer a secure payment link.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  background: '#0f172a', border: '1px solid #334155',
  borderRadius: 8, padding: '0.65rem 0.85rem',
  color: '#f1f5f9', fontSize: '0.95rem', outline: 'none',
};
const btnStyle: React.CSSProperties = {
  background: '#0d9488', color: '#fff', border: 'none',
  borderRadius: 10, padding: '0.85rem 1.5rem',
  fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
};
const sectionStyle: React.CSSProperties = {
  background: '#1e293b', borderRadius: 12,
  padding: '1rem', border: '1px solid #334155',
};
const sectionTitleStyle: React.CSSProperties = {
  color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600,
  textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px',
};
const rowStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between',
  padding: '4px 0',
};
