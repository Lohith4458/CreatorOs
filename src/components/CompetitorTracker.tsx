import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  ArrowUpRight, 
  BarChart, 
  X,
  AlertCircle,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  subscribers: string;
  focusArea: string;
  lastVideoTitle: string;
  lastVideoViews: string;
  channelUrl?: string;
}

interface CompetitorTrackerProps {
  competitors: Competitor[];
  setCompetitors: React.Dispatch<React.SetStateAction<Competitor[]>>;
  apiKey: string;
}

export default function CompetitorTracker({ competitors, setCompetitors, apiKey }: CompetitorTrackerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingGapAnalysis, setLoadingGapAnalysis] = useState(false);
  const [gapAnalysisResult, setGapAnalysisResult] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [subscribers, setSubscribers] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [lastVideoTitle, setLastVideoTitle] = useState('');
  const [lastVideoViews, setLastVideoViews] = useState('');
  const [channelUrl, setChannelUrl] = useState('');

  // Gap Analyzer State
  const [competitorTitles, setCompetitorTitles] = useState('');

  // Reset form helper
  const resetForm = () => {
    setName('');
    setSubscribers('');
    setFocusArea('');
    setLastVideoTitle('');
    setLastVideoViews('');
    setChannelUrl('');
  };

  // Add Competitor
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subscribers) return;

    const newComp: Competitor = {
      id: Date.now().toString(),
      name,
      subscribers,
      focusArea,
      lastVideoTitle: lastVideoTitle || 'No videos logged',
      lastVideoViews: lastVideoViews || 'N/A',
      channelUrl
    };

    setCompetitors(prev => [...prev, newComp]);
    resetForm();
    setIsAddModalOpen(false);
  };

  // Delete Competitor
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to stop tracking this competitor?')) {
      setCompetitors(prev => prev.filter(c => c.id !== id));
    }
  };

  // Run AI Niche Gap Analysis
  const handleRunGapAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorTitles) return;
    
    setLoadingGapAnalysis(true);
    setGapAnalysisResult('');

    if (!apiKey) {
      // Simulation mode fallback
      setTimeout(() => {
        setGapAnalysisResult(`### 🔍 AI Content Gap & Opportunity Analysis

Based on the competitor video titles:
1. "${competitorTitles.split('\n')[0] || 'Competitor Title 1'}"
2. "${competitorTitles.split('\n')[1] || 'Competitor Title 2'}"

#### 1. Under-Served Angles (The Gaps)
*   **The Budget Constraint:** Competitors focus heavily on high-end luxury setups (e.g. $5k+). There is a significant search gap for "minimal budget aesthetic setups" (e.g. under $500).
*   **Detailed Ergonomics:** Competitors show *what* they bought but rarely explain *how* they set up their height, monitor distance, or lighting angles for maximum comfort and spine health.

#### 2. Your Strategic Video Concepts
*   **Option A (Budget Aesthetic):** *"I Built a Minimal Desk Setup for under $400 (From Scratch)"*
    *   *Strategic Spin:* Focus on IKEA hacks, smart cable management rails, and cheap LED diffuser stripes.
*   **Option B (Productivity focus):** *"The Ergonomic Workspace Guide: Set it up in 10 Minutes"*
    *   *Strategic Spin:* Partner with an ergonomics checklist, showing monitor height ratios to decrease neck fatigue.

#### 3. Recommended Focus Keywords:
\`desk setup guide\`, \`budget workspace hacks\`, \`aesthetic cable management\`, \`ergonomic desk calculator\``);
        setLoadingGapAnalysis(false);
      }, 1000);
      return;
    }

    try {
      const prompt = `You are a YouTube SEO strategist and content gap analyzer. 
I am pasting these top-performing competitor video titles:
"${competitorTitles}"

Please write a detailed Content Gap analysis in markdown:
1. Identify the core topics and angles that these videos covers.
2. Outline the "under-served angles" or "gaps" (e.g., budget, ease of setup, specific user personas) that these videos ignored.
3. Propose two specific, high-CTR video title ideas for my channel that exploit these gaps, along with the strategic spin for each.
4. List 5 key SEO tags/keywords I should target.`;

      const modelName = 'gemini-2.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7 }
        })
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
      setGapAnalysisResult(text);
    } catch (err) {
      setGapAnalysisResult('Error generating gap analysis. Check your API key in Settings.');
    } finally {
      setLoadingGapAnalysis(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header controls */}
      <div style={headerStyle}>
        <div>
          <h1>Competitor Tracker</h1>
          <p>Monitor channels in your niche to identify topic opportunities and formatting trends.</p>
        </div>
        
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Track Competitor</span>
        </button>
      </div>

      {/* Grid: Competitor Cards */}
      <div style={competitorsGrid}>
        {competitors.map(comp => (
          <div key={comp.id} className="glass-panel" style={compCardStyle}>
            <div style={cardTopStyle}>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{comp.name}</h3>
                <span style={{ fontSize: '0.78rem', color: '#8b5cf6', fontWeight: '600' }}>
                  {comp.focusArea || 'General Content'}
                </span>
              </div>
              <button onClick={() => handleDelete(comp.id)} style={deleteBtnStyle}>
                <Trash2 size={15} />
              </button>
            </div>

            <div style={statsRow}>
              <div>
                <span style={statLabel}>SUBSCRIBERS</span>
                <span style={statValue}>{comp.subscribers}</span>
              </div>
              <div>
                <span style={statLabel}>PLATFORM</span>
                <span className="badge badge-youtube" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>YOUTUBE</span>
              </div>
            </div>

            {/* Last uploaded video */}
            <div style={lastUploadBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 'bold' }}>
                <span>LAST UPLOAD</span>
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '1px' }}>
                  <TrendingUp size={10} />
                  {comp.lastVideoViews} views
                </span>
              </div>
              <p style={lastVideoTitleStyle} title={comp.lastVideoTitle}>{comp.lastVideoTitle}</p>
            </div>

            {comp.channelUrl && (
              <a 
                href={comp.channelUrl} 
                target="_blank" 
                rel="noreferrer" 
                style={linkButtonStyle}
              >
                <span>Visit Channel</span>
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>
        ))}

        {competitors.length === 0 && (
          <div className="glass-panel" style={{ ...compCardStyle, gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No competitors tracked yet. Add channels to monitor your niche!</p>
          </div>
        )}
      </div>

      {/* AI Niche Gap Analyzer */}
      <div className="glass-panel" style={gapAnalyzerPanel}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={20} color="#8b5cf6" />
          <h2>AI Niche Gap Analyzer</h2>
        </div>

        <div style={gapAnalyzerLayout}>
          {/* Left Form */}
          <form onSubmit={handleRunGapAnalysis} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Paste Competitor Video Titles (One per line)</label>
              <textarea 
                className="textarea-field" 
                rows={4}
                value={competitorTitles}
                onChange={(e) => setCompetitorTitles(e.target.value)}
                placeholder="e.g.&#10;My Ultimate desk setup tour (2026)&#10;Minimal workspace rebuild on a budget&#10;How I organize my editor timeline"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loadingGapAnalysis} style={{ justifyContent: 'center' }}>
              {loadingGapAnalysis ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
              <span>{loadingGapAnalysis ? 'Analyzing Content...' : 'Analyze Content Gaps'}</span>
            </button>
          </form>

          {/* Right Output */}
          <div style={gapOutputBox}>
            {gapAnalysisResult ? (
              <div className="markdown-render" dangerouslySetInnerHTML={{ __html: renderMarkdown(gapAnalysisResult) }} />
            ) : (
              <div style={outputPlaceholderStyle}>
                Paste competitor video titles on the left and trigger the AI Analyzer to inspect audience demands, format gaps, and generate customized titles with unique spins.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADD COMPETITOR MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Track Competitor Channel</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label>Channel Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. MKBHD, Ali Abdaal"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Subscriber Count</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={subscribers} 
                    onChange={(e) => setSubscribers(e.target.value)} 
                    placeholder="e.g. 1.2M, 450K"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Niche / Topic Focus Focus</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={focusArea} 
                    onChange={(e) => setFocusArea(e.target.value)} 
                    placeholder="e.g. Tech Reviews, Editing"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Latest Video Title</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={lastVideoTitle} 
                    onChange={(e) => setLastVideoTitle(e.target.value)} 
                    placeholder="e.g. iPhone 17 - First Look!"
                  />
                </div>
                <div className="form-group">
                  <label>Latest Video Views</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={lastVideoViews} 
                    onChange={(e) => setLastVideoViews(e.target.value)} 
                    placeholder="e.g. 500K, 1.2M"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Channel URL</label>
                <input 
                  type="url" 
                  className="input-field" 
                  value={channelUrl} 
                  onChange={(e) => setChannelUrl(e.target.value)} 
                  placeholder="e.g. https://youtube.com/c/mkbhd"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Start Tracking</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Basic markdown-like regex formatter for rendering inside the web app
function renderMarkdown(md: string): string {
  if (!md) return '';
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.3rem; color:#fff; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom: 0.25rem; margin-top:1rem; margin-bottom:0.75rem;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.15rem; color:#ffffff; margin-top:1rem; margin-bottom:0.5rem; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom:4px;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1rem; color:#a5b4fc; margin-top:0.75rem; margin-bottom:0.25rem;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:#ffffff;">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em style="color:#9ca3af; font-style:italic;">$1</em>')
    .replace(/`([^`]+)`/gim, '<code style="background:rgba(255,255,255,0.07); padding:2px 6px; border-radius:4px; font-family: monospace; font-size:0.82rem; color:#fb7185;">$1</code>')
    .replace(/^\* (.*$)/gim, '<li style="margin-left: 1.25rem; list-style-type: disc; margin-bottom: 0.2rem; color: #d1d5db; font-size:0.85rem;">$1</li>')
    .replace(/^\- (.*$)/gim, '<li style="margin-left: 1.25rem; list-style-type: circle; margin-bottom: 0.2rem; color: #d1d5db; font-size:0.85rem;">$1</li>')
    .replace(/^(?!<h|<li|<ul|<ol|<div|<code)(.*$)/gim, '<p style="margin-bottom: 0.5rem; line-height: 1.45; color: #d1d5db; font-size:0.85rem;">$1</p>');
  
  return html;
}

// Inline Styles
const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const competitorsGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1.25rem',
};

const compCardStyle: React.CSSProperties = {
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const cardTopStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
};

const deleteBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-subtle)',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  transition: 'color var(--transition-fast)',
};

const statsRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.01)',
  border: '1px solid rgba(255,255,255,0.03)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.6rem 0.75rem',
};

const statLabel: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  color: 'var(--text-muted)',
  fontWeight: 'bold',
  letterSpacing: '0.05em',
  marginBottom: '2px',
};

const statValue: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: '700',
  color: '#ffffff',
};

const lastUploadBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.75rem',
};

const lastVideoTitleStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: '500',
  color: 'var(--text-main)',
  lineHeight: '1.35',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const linkButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.4rem',
  fontSize: '0.8rem',
  fontWeight: '600',
  color: '#6366f1',
  textDecoration: 'none',
  marginTop: '0.25rem',
  alignSelf: 'flex-start',
};

const gapAnalyzerPanel: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  border: '1px solid rgba(139, 92, 246, 0.15)',
};

const gapAnalyzerLayout: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  alignItems: 'stretch',
};

const gapOutputBox: React.CSSProperties = {
  flex: 1.5,
  minWidth: '320px',
  background: 'rgba(7, 10, 18, 0.75)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  padding: '1.25rem',
  maxHeight: '400px',
  overflowY: 'auto',
};

const outputPlaceholderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  color: 'var(--text-subtle)',
  fontSize: '0.88rem',
  textAlign: 'center',
  padding: '2rem',
};
