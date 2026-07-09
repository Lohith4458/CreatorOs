import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Copy, 
  Check, 
  AlertCircle,
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface AISuiteProps {
  apiKey: string;
  selectedEventForAI: any | null;
  setSelectedEventForAI: (event: any | null) => void;
  setActiveTab: (tab: string) => void;
  creatorNiche: string;
}

type AISubTab = 'titles' | 'scripts' | 'thumbnails' | 'captions';

export default function AISuite({ apiKey, selectedEventForAI, setSelectedEventForAI, setActiveTab, creatorNiche }: AISuiteProps) {
  const [subTab, setSubTab] = useState<AISubTab>('titles');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shared outputs
  const [titlesOutput, setTitlesOutput] = useState('');
  const [scriptOutput, setScriptOutput] = useState('');
  const [thumbnailOutput, setThumbnailOutput] = useState('');
  const [captionOutput, setCaptionOutput] = useState('');

  // Form states
  const [keywords, setKeywords] = useState('');
  const [titleStyle, setTitleStyle] = useState('educational');
  
  const [scriptTitle, setScriptTitle] = useState('');
  const [scriptNiche, setScriptNiche] = useState(creatorNiche || 'Tech & Productivity');
  const [scriptTone, setScriptTone] = useState('engaging');
  const [scriptDuration, setScriptDuration] = useState('5 minutes');

  const [thumbnailTitle, setThumbnailTitle] = useState('');
  const [thumbnailStyle, setThumbnailStyle] = useState('high-contrast');

  const [captionContent, setCaptionContent] = useState('');
  const [captionPlatform, setCaptionPlatform] = useState('instagram');
  const [captionTone, setCaptionTone] = useState('energetic');

  // Pre-fill inputs when a calendar event is redirected
  useEffect(() => {
    if (selectedEventForAI) {
      const { title, platform, notes } = selectedEventForAI;
      
      // Auto fill and route to the corresponding sub-feature
      setScriptTitle(title);
      setThumbnailTitle(title);
      setCaptionContent(notes || title);
      setKeywords(title);
      
      if (platform === 'youtube') {
        setCaptionPlatform('youtube-shorts');
      } else if (platform === 'tiktok' || platform === 'instagram' || platform === 'twitter') {
        setCaptionPlatform(platform);
      }
      
      // Clear the event context so it doesn't overwrite user edits later
      setSelectedEventForAI(null);
    }
  }, [selectedEventForAI, setSelectedEventForAI]);

  // Copy to Clipboard Helper
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generation Handlers
  const handleGenerateTitles = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await geminiService.generateTitles(keywords, titleStyle, apiKey);
      setTitlesOutput(res);
    } catch (err: any) {
      setError(err.message || 'Failed to generate titles');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await geminiService.generateScript(scriptTitle, scriptNiche, scriptTone, scriptDuration, apiKey);
      setScriptOutput(res);
    } catch (err: any) {
      setError(err.message || 'Failed to generate script outline');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateThumbnails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await geminiService.generateThumbnailIdeas(thumbnailTitle, thumbnailStyle, apiKey);
      setThumbnailOutput(res);
    } catch (err: any) {
      setError(err.message || 'Failed to generate thumbnail concepts');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCaption = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await geminiService.generateCaption(captionContent, captionPlatform, captionTone, apiKey);
      setCaptionOutput(res);
    } catch (err: any) {
      setError(err.message || 'Failed to generate caption');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Title */}
      <div className="dashboard-header" style={{ marginBottom: 0 }}>
        <div>
          <h1>AI Creation Suite</h1>
          <p>Supercharge your production process using Gemini-powered tools.</p>
        </div>
      </div>

      {/* Simulated Mode Warning Banner */}
      {!apiKey && (
        <div style={warningBannerStyle}>
          <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, fontSize: '0.88rem' }}>
            <strong>Running in Simulated AI Mode</strong>. Add your real <strong>Gemini API Key</strong> in the Settings panel to connect live to the latest Gemini 2.5 Flash model.
          </div>
          <button className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setActiveTab('settings')}>
            <span>Add Key</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}

      {/* Main Tabs Selection */}
      <div style={tabsRowStyle}>
        <button 
          onClick={() => { setSubTab('titles'); setError(null); }}
          style={subTabButtonStyle(subTab === 'titles')}
        >
          <Sparkles size={16} />
          <span>Title Generator</span>
        </button>
        <button 
          onClick={() => { setSubTab('scripts'); setError(null); }}
          style={subTabButtonStyle(subTab === 'scripts')}
        >
          <FileText size={16} />
          <span>Script Writer</span>
        </button>
        <button 
          onClick={() => { setSubTab('thumbnails'); setError(null); }}
          style={subTabButtonStyle(subTab === 'thumbnails')}
        >
          <ImageIcon size={16} />
          <span>Thumbnail Generator</span>
        </button>
        <button 
          onClick={() => { setSubTab('captions'); setError(null); }}
          style={subTabButtonStyle(subTab === 'captions')}
        >
          <MessageSquare size={16} />
          <span>Caption Generator</span>
        </button>
      </div>

      {error && (
        <div style={errorContainerStyle}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Columns Grid Layout */}
      <div style={columnsGridStyle}>
        
        {/* Left Hand: Controls Form */}
        <div className="glass-panel" style={{ padding: '1.5rem', flex: 1, minWidth: '320px', alignSelf: 'flex-start' }}>
          
          {/* TAB 1: TITLE GENERATOR FORM */}
          {subTab === 'titles' && (
            <form onSubmit={handleGenerateTitles} style={formLayout}>
              <h3>Catchy Title Architect</h3>
              <div className="form-group">
                <label>Keywords / Main Topic</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={keywords} 
                  onChange={(e) => setKeywords(e.target.value)} 
                  placeholder="e.g. iPad Pro review, passive income"
                  required 
                />
              </div>
              <div className="form-group">
                <label>CTR Title Style</label>
                <select className="select-field" value={titleStyle} onChange={(e) => setTitleStyle(e.target.value)}>
                  <option value="educational">Educational / Value</option>
                  <option value="clickbait">Curiosity Gap (Clickbait-lite)</option>
                  <option value="storytelling">Storytelling Narrative</option>
                  <option value="listicle">Listicle / Numbered</option>
                  <option value="bold-assertion">Bold Statement</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>{loading ? 'Crafting Ideas...' : 'Generate Titles'}</span>
              </button>
            </form>
          )}

          {/* TAB 2: SCRIPT WRITER FORM */}
          {subTab === 'scripts' && (
            <form onSubmit={handleGenerateScript} style={formLayout}>
              <h3>AI Video Script Outline</h3>
              <div className="form-group">
                <label>Approved Title / Topic</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={scriptTitle} 
                  onChange={(e) => setScriptTitle(e.target.value)} 
                  placeholder="e.g. How I Edit Videos In Under 1 Hour"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Niche / Category</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={scriptNiche} 
                  onChange={(e) => setScriptNiche(e.target.value)} 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Tone of Voice</label>
                  <select className="select-field" value={scriptTone} onChange={(e) => setScriptTone(e.target.value)}>
                    <option value="engaging">Engaging & Energetic</option>
                    <option value="educational">Informative & Professional</option>
                    <option value="witty">Witty & Humorous</option>
                    <option value="inspiring">Inspiring & Personal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Duration</label>
                  <select className="select-field" value={scriptDuration} onChange={(e) => setScriptDuration(e.target.value)}>
                    <option value="60 seconds">60 seconds (Shorts/TikTok)</option>
                    <option value="3 minutes">3 minutes (Short form)</option>
                    <option value="5 minutes">5 minutes (Mid-roll focus)</option>
                    <option value="10 minutes">10 minutes (Deep-dive vlog)</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <FileText size={16} />}
                <span>{loading ? 'Structuring Outline...' : 'Write Script Outline'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: THUMBNAIL IDEA FORM */}
          {subTab === 'thumbnails' && (
            <form onSubmit={handleGenerateThumbnails} style={formLayout}>
              <h3>Thumbnail Layout Ideas</h3>
              <div className="form-group">
                <label>Video Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={thumbnailTitle} 
                  onChange={(e) => setThumbnailTitle(e.target.value)} 
                  placeholder="e.g. Double Your Income In 2026"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Art / Graphic Style</label>
                <select className="select-field" value={thumbnailStyle} onChange={(e) => setThumbnailStyle(e.target.value)}>
                  <option value="high-contrast">High Contrast & Vibrant</option>
                  <option value="minimalist">Minimalist & Elegant</option>
                  <option value="dramatic">Dramatic Lighting & 3D Text</option>
                  <option value="illustrative">Illustrative & Vector Graphic</option>
                  <option value="face-reaction">Expressive Face Reaction Close-up</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                <span>{loading ? 'Designing Layouts...' : 'Generate Thumbnail Concepts'}</span>
              </button>
            </form>
          )}

          {/* TAB 4: CAPTION GENERATOR FORM */}
          {subTab === 'captions' && (
            <form onSubmit={handleGenerateCaption} style={formLayout}>
              <h3>Caption & Hashtag Architect</h3>
              <div className="form-group">
                <label>Video Concept / Description / Script</label>
                <textarea 
                  className="textarea-field" 
                  rows={4}
                  value={captionContent} 
                  onChange={(e) => setCaptionContent(e.target.value)} 
                  placeholder="Pasted script segments or general topic details..."
                  required 
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Social Platform</label>
                  <select className="select-field" value={captionPlatform} onChange={(e) => setCaptionPlatform(e.target.value)}>
                    <option value="instagram">Instagram Feed</option>
                    <option value="tiktok">TikTok Post</option>
                    <option value="youtube-shorts">YouTube Shorts</option>
                    <option value="twitter">Twitter / X Post</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mood / Tone</label>
                  <select className="select-field" value={captionTone} onChange={(e) => setCaptionTone(e.target.value)}>
                    <option value="energetic">Energetic & Hyped</option>
                    <option value="witty">Witty & Sarcastic</option>
                    <option value="professional">Professional & Crisp</option>
                    <option value="thoughtful">Thoughtful / Narrative</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                {loading ? <RefreshCw size={16} className="animate-spin" /> : <MessageSquare size={16} />}
                <span>{loading ? 'Formulating Caption...' : 'Generate Copy'}</span>
              </button>
            </form>
          )}
          
        </div>

        {/* Right Hand: Output Panel */}
        <div className="glass-panel" style={outputPanelContainerStyle}>
          <div style={outputHeaderStyle}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              OUTPUT SANDBOX
            </span>
            <button 
              className="btn btn-secondary" 
              onClick={() => handleCopy(
                subTab === 'titles' ? titlesOutput : 
                subTab === 'scripts' ? scriptOutput : 
                subTab === 'thumbnails' ? thumbnailOutput : captionOutput
              )}
              disabled={
                (subTab === 'titles' && !titlesOutput) ||
                (subTab === 'scripts' && !scriptOutput) ||
                (subTab === 'thumbnails' && !thumbnailOutput) ||
                (subTab === 'captions' && !captionOutput)
              }
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Markdown'}</span>
            </button>
          </div>

          <div style={outputWindowStyle}>
            {subTab === 'titles' && (
              titlesOutput ? (
                <div className="markdown-render" style={outputMarkdownStyle} dangerouslySetInnerHTML={{ __html: renderMarkdown(titlesOutput) }} />
              ) : (
                <div style={outputPlaceholderStyle}>Your generated video titles will appear here...</div>
              )
            )}

            {subTab === 'scripts' && (
              scriptOutput ? (
                <div className="markdown-render" style={outputMarkdownStyle} dangerouslySetInnerHTML={{ __html: renderMarkdown(scriptOutput) }} />
              ) : (
                <div style={outputPlaceholderStyle}>Your structured script outline script will appear here...</div>
              )
            )}

            {subTab === 'thumbnails' && (
              thumbnailOutput ? (
                <div className="markdown-render" style={outputMarkdownStyle} dangerouslySetInnerHTML={{ __html: renderMarkdown(thumbnailOutput) }} />
              ) : (
                <div style={outputPlaceholderStyle}>Your visual thumbnail concept layouts and midjourney prompts will appear here...</div>
              )
            )}

            {subTab === 'captions' && (
              captionOutput ? (
                <div className="markdown-render" style={outputMarkdownStyle} dangerouslySetInnerHTML={{ __html: renderMarkdown(captionOutput) }} />
              ) : (
                <div style={outputPlaceholderStyle}>Your optimized platform captions and tags will appear here...</div>
              )
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
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.6rem; color:#fff; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom: 0.5rem; margin-top:1.5rem; margin-bottom:1rem;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.25rem; color:#ffffff; margin-top:1.5rem; margin-bottom:0.75rem; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom:4px;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.05rem; color:#a5b4fc; margin-top:1.25rem; margin-bottom:0.5rem;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:#ffffff;">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em style="color:#9ca3af; font-style:italic;">$1</em>')
    .replace(/`([^`]+)`/gim, '<code style="background:rgba(255,255,255,0.07); padding:2px 6px; border-radius:4px; font-family: monospace; font-size:0.85rem; color:#fb7185;">$1</code>')
    .replace(/^\* (.*$)/gim, '<li style="margin-left: 1.5rem; list-style-type: disc; margin-bottom: 0.25rem; color: #d1d5db;">$1</li>')
    .replace(/^\- (.*$)/gim, '<li style="margin-left: 1.5rem; list-style-type: circle; margin-bottom: 0.25rem; color: #d1d5db;">$1</li>')
    .replace(/^(?!<h|<li|<ul|<ol|<div|<code)(.*$)/gim, '<p style="margin-bottom: 0.75rem; line-height: 1.5; color: #d1d5db;">$1</p>');
  
  return html;
}

// Inline styles
const warningBannerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.85rem 1.25rem',
  borderRadius: 'var(--radius-md)',
  background: 'rgba(245, 158, 11, 0.08)',
  border: '1px solid rgba(245, 158, 11, 0.25)',
  color: '#fef3c7',
};

const tabsRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '0.5rem',
};

const subTabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.6rem 1.1rem',
  borderRadius: 'var(--radius-sm)',
  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
  border: '1px solid',
  borderColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
  color: isActive ? '#ffffff' : 'var(--text-muted)',
  cursor: 'pointer',
  fontWeight: isActive ? '600' : '500',
  fontSize: '0.85rem',
  transition: 'all var(--transition-fast)',
});

const errorContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-sm)',
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.25)',
  color: '#fca5a5',
  fontSize: '0.88rem',
};

const columnsGridStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  alignItems: 'stretch',
};

const formLayout: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.2rem',
};

const outputPanelContainerStyle: React.CSSProperties = {
  flex: 1.5,
  minWidth: '350px',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem',
  background: 'rgba(7, 10, 18, 0.85)',
};

const outputHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '0.75rem',
  marginBottom: '1rem',
};

const outputWindowStyle: React.CSSProperties = {
  flex: 1,
  minHeight: '380px',
  maxHeight: '520px',
  overflowY: 'auto',
};

const outputPlaceholderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  color: 'var(--text-subtle)',
  fontSize: '0.9rem',
  textAlign: 'center',
  padding: '2rem',
};

const outputMarkdownStyle: React.CSSProperties = {
  fontSize: '0.92rem',
  lineHeight: '1.6',
};
