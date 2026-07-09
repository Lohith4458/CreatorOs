import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle,
  TrendingUp,
  Smile,
  Meh,
  Frown
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface CommentAnalyzerProps {
  apiKey: string;
}

const SAMPLE_COMMENTS = `User1: Amazing video! Cable management look so neat. What desk shelf is that?
User2: The audio sounds a bit quiet in the middle section but otherwise awesome content!
User3: Subscribed immediately. Can you share the links to the wallpapers you used?
User4: How long did it take to assemble the standing desk? Looking to get the same one.
User5: Great editing style, very clean and no fluff. Keep it up!
User6: Nice video mate, but a bit too fast in the second part.`;

export default function CommentAnalyzer({ apiKey }: CommentAnalyzerProps) {
  const [commentsInput, setCommentsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [copiedResponse, setCopiedResponse] = useState<number | null>(null);

  // Analyze Comments Trigger
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentsInput) return;

    setLoading(true);
    setAnalysisResult('');

    try {
      const res = await geminiService.analyzeComments(commentsInput, apiKey);
      setAnalysisResult(res);
    } catch (err: any) {
      setAnalysisResult(`Error running analysis: ${err.message || 'Verification failure.'}`);
    } finally {
      setLoading(false);
    }
  };

  // Load sample text helper
  const handleLoadSample = () => {
    setCommentsInput(SAMPLE_COMMENTS);
  };

  // Copy reply suggestions helper
  const handleCopyReply = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(index);
    setTimeout(() => setCopiedResponse(null), 2000);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div className="dashboard-header" style={{ marginBottom: 0 }}>
        <div>
          <h1>AI Comment Analyzer</h1>
          <p>Paste video comments logs to instantly categorize sentiment and outline response recommendations.</p>
        </div>
      </div>

      {/* Main Split Layout */}
      <div style={splitLayout}>
        
        {/* Left Side: Input Panel */}
        <div className="glass-panel" style={{ ...cardPanel, flex: 1, minWidth: '320px', alignSelf: 'flex-start' }}>
          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: 'white' }}>Comments Log</h3>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleLoadSample}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
              >
                Load Sample Log
              </button>
            </div>

            <textarea 
              className="textarea-field" 
              rows={8}
              value={commentsInput}
              onChange={(e) => setCommentsInput(e.target.value)}
              placeholder="Paste comments here (e.g. 'Creator123: Awesome video!', 'TechFan: Where can I get that desk?')..."
              required
            />

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>{loading ? 'Analyzing Sentiment...' : 'Analyze Comments'}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Analysis Output */}
        <div className="glass-panel" style={{ ...cardPanel, flex: 1.5, minWidth: '350px' }}>
          <div style={outputHeaderStyle}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              AI SENTIMENT SUMMARY
            </span>
          </div>

          <div style={analysisOutputStyle}>
            {analysisResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Simulated Sentiment Meter widget */}
                <div style={sentimentWidgetContainer}>
                  <div style={sentimentBadgeStyle('#10b981')}>
                    <Smile size={18} />
                    <span>Positive: 70%</span>
                  </div>
                  <div style={sentimentBadgeStyle('#f59e0b')}>
                    <Meh size={18} />
                    <span>Neutral: 20%</span>
                  </div>
                  <div style={sentimentBadgeStyle('#ef4444')}>
                    <Frown size={18} />
                    <span>Negative: 10%</span>
                  </div>
                </div>

                <div className="markdown-render" dangerouslySetInnerHTML={{ __html: renderMarkdown(analysisResult) }} />
              </div>
            ) : (
              <div style={placeholderStyle}>
                <MessageSquareCode size={36} color="var(--text-subtle)" style={{ marginBottom: '0.5rem' }} />
                <p>Submit comments log to generate overall satisfaction rates, key themes, and ready-to-copy replies drafts.</p>
              </div>
            )}
          </div>
        </div>

      </div>

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
const splitLayout: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  alignItems: 'stretch',
};

const cardPanel: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const outputHeaderStyle: React.CSSProperties = {
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '0.75rem',
  marginBottom: '0.5rem',
};

const analysisOutputStyle: React.CSSProperties = {
  flex: 1,
  minHeight: '350px',
  maxHeight: '500px',
  overflowY: 'auto',
};

const placeholderStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  color: 'var(--text-subtle)',
  fontSize: '0.88rem',
  textAlign: 'center',
  padding: '2rem',
};

const sentimentWidgetContainer: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexWrap: 'wrap',
};

const sentimentBadgeStyle = (color: string): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.4rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  background: `${color}10`,
  border: `1px solid ${color}33`,
  color,
  fontSize: '0.8rem',
  fontWeight: '600',
});
