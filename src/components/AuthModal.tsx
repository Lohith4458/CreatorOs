import React, { useState } from 'react';
import { Tv, Mail, Lock, User, Sparkles, AlertCircle, ArrowRight, Bot } from 'lucide-react';
import { api } from '../services/api';

interface AuthModalProps {
  onSuccess: (token: string, user: any) => void;
  onClose: () => void;
}

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [niche, setNiche] = useState('Tech & Productivity');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const data = await api.login({ email, password });
        onSuccess(data.token, data.user);
      } else {
        const data = await api.register({ name, email, password, niche });
        onSuccess(data.token, data.user);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const niches = [
    'Tech & Productivity',
    'Gaming & Esports',
    'Finance & Business',
    'Lifestyle & Vlog',
    'Education & Science',
    'Fashion & Beauty',
    'Art & Design',
    'Food & Cooking'
  ];

  return (
    <div style={overlayStyle}>
      <div style={modalStyle} className="glass-panel animate-fade-in">
        
        {/* Decorative background lights */}
        <div style={glowBlob1Style} />
        <div style={glowBlob2Style} />

        {/* Header */}
        <div style={headerStyle}>
          <div style={logoWrapperStyle}>
            <Tv size={28} color="#6366f1" style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))' }} />
            <span style={logoTextStyle}>CreatorOS</span>
          </div>
          <p style={subtitleStyle}>
            {isLogin ? 'Log in to manage your creator workflow' : 'Sign up to launch your dashboard'}
          </p>
        </div>

        {/* Error pill */}
        {error && (
          <div style={errorStyle}>
            <AlertCircle size={15} color="#ef4444" />
            <span style={{ fontSize: '0.78rem', color: '#f87171', fontWeight: '500' }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={formStyle}>
          {!isLogin && (
            <div className="form-group" style={groupStyle}>
              <label style={labelStyle}><User size={13} style={{ marginRight: '4px' }} /> Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Marques Brownlee"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          )}

          <div className="form-group" style={groupStyle}>
            <label style={labelStyle}><Mail size={13} style={{ marginRight: '4px' }} /> Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="name@channel.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div className="form-group" style={groupStyle}>
            <label style={labelStyle}><Lock size={13} style={{ marginRight: '4px' }} /> Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {!isLogin && (
            <div className="form-group" style={groupStyle}>
              <label style={labelStyle}><Sparkles size={13} style={{ marginRight: '4px' }} /> Channel Niche</label>
              <select
                className="input-field"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
              >
                {niches.map((n) => (
                  <option key={n} value={n} style={{ backgroundColor: '#0f172a', color: 'white' }}>{n}</option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={submitBtnStyle}
          >
            {loading ? (
              <span className="spinner" style={spinnerStyle}></span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In Workspace' : 'Initialize Workspace'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Switch mode */}
        <div style={footerStyle}>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={switchBtnStyle}
          >
            {isLogin ? (
              <>New to CreatorOS? <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Create account</span></>
            ) : (
              <>Already registered? <span style={{ color: '#8b5cf6', fontWeight: 'bold' }}>Sign In</span></>
            )}
          </button>
        </div>

        {/* Close option for modal if they want to go back to Landing */}
        <button
          type="button"
          onClick={onClose}
          style={closeLinkStyle}
        >
          Cancel and return to Landing Page
        </button>
      </div>
    </div>
  );
}

// Inline Styles
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(5, 8, 16, 0.85)',
  backdropFilter: 'blur(12px)',
  zIndex: 1000,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem'
};

const modalStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '430px',
  padding: '2.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  background: 'rgba(15, 23, 42, 0.65)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  borderRadius: '20px',
  position: 'relative',
  overflow: 'hidden'
};

const glowBlob1Style: React.CSSProperties = {
  position: 'absolute',
  top: '-10%',
  right: '-10%',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
  zIndex: 0,
  pointerEvents: 'none'
};

const glowBlob2Style: React.CSSProperties = {
  position: 'absolute',
  bottom: '-10%',
  left: '-10%',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
  zIndex: 0,
  pointerEvents: 'none'
};

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  zIndex: 1
};

const logoWrapperStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem'
};

const logoTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '1.8rem',
  fontWeight: '800',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #ffffff 40%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const subtitleStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
};

const errorStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1rem',
  backgroundColor: 'rgba(239, 68, 68, 0.12)',
  border: '1px solid rgba(239, 68, 68, 0.25)',
  borderRadius: '8px',
  zIndex: 1
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  zIndex: 1
};

const groupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem'
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
  display: 'flex',
  alignItems: 'center'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '8px',
  color: 'white',
  outline: 'none',
  fontSize: '0.88rem',
  transition: 'border var(--transition-fast)'
};

const submitBtnStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
  width: '100%',
  padding: '0.85rem',
  marginTop: '0.5rem',
  cursor: 'pointer'
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  zIndex: 1
};

const switchBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  fontSize: '0.82rem',
  cursor: 'pointer',
  outline: 'none'
};

const closeLinkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-subtle)',
  fontSize: '0.75rem',
  cursor: 'pointer',
  outline: 'none',
  textDecoration: 'underline',
  textAlign: 'center',
  zIndex: 1,
  marginTop: '0.5rem'
};

const spinnerStyle: React.CSSProperties = {
  display: 'inline-block',
  width: '18px',
  height: '18px',
  border: '2px solid rgba(255,255,255,0.2)',
  borderTopColor: '#fff',
  borderRadius: '50%',
  animation: 'spin 0.6s linear infinite'
};
