import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Clock, 
  ThumbsUp, 
  Users, 
  ArrowUpRight, 
  CheckCircle,
  RefreshCw,
  IndianRupee
} from 'lucide-react';
import FinanceTracker from './FinanceTracker';
import CompetitorTracker from './CompetitorTracker';

type Platform = 'youtube' | 'tiktok' | 'instagram' | 'twitter';

interface PlatformMetric {
  value: string;
  change: string;
  isUp: boolean;
}

interface AnalyticsData {
  subscribers: PlatformMetric;
  views: PlatformMetric;
  watchTime: PlatformMetric;
  engagement: PlatformMetric;
  viewsHistory: number[];
  trafficSources: { name: string; pct: number }[];
}

const mockAnalytics: Record<Platform, AnalyticsData> = {
  youtube: {
    subscribers: { value: '124,500', change: '+4.2%', isUp: true },
    views: { value: '1.2M', change: '+8.7%', isUp: true },
    watchTime: { value: '96.4K hrs', change: '+12.1%', isUp: true },
    engagement: { value: '8.4%', change: '-0.3%', isUp: false },
    viewsHistory: [140, 180, 210, 190, 240, 290],
    trafficSources: [
      { name: 'YouTube Recommendation', pct: 55 },
      { name: 'YouTube Search', pct: 25 },
      { name: 'External / Direct Links', pct: 12 },
      { name: 'Shorts Feed', pct: 8 }
    ]
  },
  tiktok: {
    subscribers: { value: '382,100', change: '+18.4%', isUp: true },
    views: { value: '4.8M', change: '+22.1%', isUp: true },
    watchTime: { value: '41.2K hrs', change: '+19.6%', isUp: true },
    engagement: { value: '14.2%', change: '+1.5%', isUp: true },
    viewsHistory: [520, 680, 810, 750, 990, 1200],
    trafficSources: [
      { name: 'For You Page', pct: 82 },
      { name: 'Personal Profile Page', pct: 11 },
      { name: 'Followers Feed', pct: 5 },
      { name: 'Sound search', pct: 2 }
    ]
  },
  instagram: {
    subscribers: { value: '94,800', change: '+2.1%', isUp: true },
    views: { value: '840K', change: '-4.6%', isUp: false },
    watchTime: { value: '18.1K hrs', change: '-2.4%', isUp: false },
    engagement: { value: '6.8%', change: '+0.2%', isUp: true },
    viewsHistory: [85, 90, 110, 95, 105, 92],
    trafficSources: [
      { name: 'Explore Tab', pct: 40 },
      { name: 'Home Feed', pct: 35 },
      { name: 'Instagram Reels Feed', pct: 20 },
      { name: 'Direct Messages / Links', pct: 5 }
    ]
  },
  twitter: {
    subscribers: { value: '12,400', change: '+0.8%', isUp: true },
    views: { value: '310K', change: '+14.5%', isUp: true },
    watchTime: { value: 'N/A', change: '—', isUp: true },
    engagement: { value: '4.1%', change: '+0.5%', isUp: true },
    viewsHistory: [25, 29, 34, 30, 42, 49],
    trafficSources: [
      { name: 'For You Feed', pct: 60 },
      { name: 'Profile Visits', pct: 22 },
      { name: 'Search queries', pct: 15 },
      { name: 'Direct Links', pct: 3 }
    ]
  }
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

export default function AnalyticsDashboard({ 
  finances, 
  setFinances, 
  competitors, 
  setCompetitors, 
  apiKey 
}: {
  finances: any[];
  setFinances: React.Dispatch<React.SetStateAction<any[]>>;
  competitors: any[];
  setCompetitors: React.Dispatch<React.SetStateAction<any[]>>;
  apiKey: string;
}) {
  const [activeSubTab, setActiveSubTab] = useState<'growth' | 'finances' | 'competitors'>('growth');
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<Record<Platform, AnalyticsData>>(mockAnalytics);

  // Manual values for stats input updates (simulate real updates)
  const [editSubs, setEditSubs] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const activeStats = stats[platform];

  // Refresh animation simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Simulate minor growth variations
      setStats(prev => {
        const copy = JSON.parse(JSON.stringify(prev));
        const keys: Platform[] = ['youtube', 'tiktok', 'instagram', 'twitter'];
        keys.forEach(k => {
          const viewsNum = parseFloat(copy[k].views.value);
          if (!isNaN(viewsNum)) {
            copy[k].views.value = (viewsNum * 1.01).toFixed(1) + (copy[k].views.value.includes('M') ? 'M' : 'K');
          }
        });
        return copy;
      });
    }, 800);
  };

  // Submit metric override
  const handleUpdateMetricsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSubs) return;
    
    setStats(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        subscribers: {
          ...prev[platform].subscribers,
          value: parseInt(editSubs).toLocaleString()
        }
      }
    }));
    
    setEditSubs('');
    setIsUpdateModalOpen(false);
  };

  // SVG Chart Calculations (Max view history for scaling)
  const maxHistoryValue = Math.max(...activeStats.viewsHistory);
  const chartHeight = 160;
  const chartWidth = 500;
  const points = activeStats.viewsHistory.map((val, idx) => {
    const x = (idx / (activeStats.viewsHistory.length - 1)) * chartWidth;
    const y = chartHeight - (val / maxHistoryValue) * (chartHeight - 20) - 10;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Sub-tab Selector */}
      <div style={subTabsStyle}>
        <button onClick={() => setActiveSubTab('growth')} style={subTabButtonStyle(activeSubTab === 'growth')}>
          <BarChart3 size={15} />
          <span>Social Growth</span>
        </button>
        <button onClick={() => setActiveSubTab('finances')} style={subTabButtonStyle(activeSubTab === 'finances')}>
          <IndianRupee size={15} />
          <span>Revenue Hub</span>
        </button>
        <button onClick={() => setActiveSubTab('competitors')} style={subTabButtonStyle(activeSubTab === 'competitors')}>
          <Users size={15} />
          <span>Competitors</span>
        </button>
      </div>

      {activeSubTab === 'growth' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header */}
          <div style={headerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BarChart3 size={24} color="#6366f1" />
              <h1>Social Media Analytics</h1>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Channels'}</span>
              </button>
              
              <button className="btn btn-primary" onClick={() => setIsUpdateModalOpen(true)}>
                <span>Override Metrics</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={tabsContainer}>
            {(['youtube', 'tiktok', 'instagram', 'twitter'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                style={tabButtonStyle(platform === p, p)}
              >
                <span style={{ textTransform: 'capitalize' }}>{p}</span>
              </button>
            ))}
          </div>

          {/* Metric Cards Grid */}
          <div className="metric-grid">
            {/* Metric 1 */}
            <div className="glass-panel metric-card">
              <div className="metric-card-header">
                <span>{platform === 'youtube' ? 'Subscribers' : 'Followers'}</span>
                <Users size={16} color="var(--color-primary)" />
              </div>
              <div className="metric-card-value">{activeStats.subscribers.value}</div>
              <div className={`metric-card-change ${activeStats.subscribers.isUp ? 'up' : 'down'}`}>
                <span>{activeStats.subscribers.change}</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="glass-panel metric-card">
              <div className="metric-card-header">
                <span>Monthly Views</span>
                <Eye size={16} color="#10b981" />
              </div>
              <div className="metric-card-value">{activeStats.views.value}</div>
              <div className={`metric-card-change ${activeStats.views.isUp ? 'up' : 'down'}`}>
                <span>{activeStats.views.change}</span>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="glass-panel metric-card">
              <div className="metric-card-header">
                <span>Watch Time</span>
                <Clock size={16} color="#f59e0b" />
              </div>
              <div className="metric-card-value">{activeStats.watchTime.value}</div>
              <div className={`metric-card-change ${activeStats.watchTime.isUp ? 'up' : 'down'}`}>
                <span>{activeStats.watchTime.change}</span>
              </div>
            </div>

            {/* Metric 4 */}
            <div className="glass-panel metric-card">
              <div className="metric-card-header">
                <span>Engagement Rate</span>
                <ThumbsUp size={16} color="#ec4899" />
              </div>
              <div className="metric-card-value">{activeStats.engagement.value}</div>
              <div className={`metric-card-change ${activeStats.engagement.isUp ? 'up' : 'down'}`}>
                <span>{activeStats.engagement.change}</span>
              </div>
            </div>
          </div>

          {/* Analytics Charts & Traffic Split */}
          <div style={splitLayout}>
            {/* Left Column: Growth Chart */}
            <div className="glass-panel" style={{ ...cardPanelStyle, flex: 1.8, minWidth: '350px' }}>
              <div style={chartHeaderStyle}>
                <h2>Monthly View Trend</h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Values in thousands (K)</span>
              </div>
              
              <div style={svgChartWrapper}>
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={svgChartElement}>
                  <defs>
                    <linearGradient id="growthAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1={chartHeight - 10} x2={chartWidth} y2={chartHeight - 10} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <line x1="0" y1="15" x2={chartWidth} y2="15" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  
                  {/* Paths */}
                  <path d={areaPath} fill="url(#growthAreaGrad)" />
                  <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="3" />
                  
                  {/* Points */}
                  {points.map((p, idx) => (
                    <g key={idx}>
                      <circle cx={p.x} cy={p.y} r="5" fill="#6366f1" stroke="#0a0f1d" strokeWidth="2" />
                      <text x={p.x} y={p.y - 10} fill="var(--text-main)" fontSize="9" fontWeight="600" textAnchor="middle">
                        {activeStats.viewsHistory[idx]}K
                      </text>
                    </g>
                  ))}
                </svg>
                
                <div style={monthLabelRow}>
                  {MONTHS.map((m, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Traffic Sources */}
            <div className="glass-panel" style={{ ...cardPanelStyle, flex: 1.2, minWidth: '280px' }}>
              <h2>Traffic Sources Split</h2>
              <div style={trafficList}>
                {activeStats.trafficSources.map((source, idx) => (
                  <div key={idx} style={trafficItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: '500' }}>{source.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>{source.pct}%</span>
                    </div>
                    <div style={trafficTrack}>
                      <div style={trafficFill(source.pct, idx)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* OVERRIDE METRICS MODAL */}
          {isUpdateModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content glass-panel" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                  <h3>Override {platform.toUpperCase()} Stats</h3>
                  <button className="modal-close" onClick={() => setIsUpdateModalOpen(false)}>&times;</button>
                </div>
                <form onSubmit={handleUpdateMetricsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Set Total Followers / Subscribers</label>
                    <input
                      type="number"
                      className="input-field"
                      value={editSubs}
                      onChange={(e) => setEditSubs(e.target.value)}
                      placeholder="e.g. 150000"
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Update Metrics</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'finances' && (
        <FinanceTracker finances={finances} setFinances={setFinances} />
      )}

      {activeSubTab === 'competitors' && (
        <CompetitorTracker competitors={competitors} setCompetitors={setCompetitors} apiKey={apiKey} />
      )}

    </div>
  );
}

// Inline Styles
const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const tabsContainer: React.CSSProperties = {
  display: 'flex',
  gap: '0.4rem',
  padding: '4px',
  borderRadius: 'var(--radius-sm)',
  background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid var(--border-color)',
  alignSelf: 'flex-start',
};

const tabButtonStyle = (isActive: boolean, p: Platform): React.CSSProperties => {
  let activeBorder = 'var(--color-primary)';
  let activeBg = 'rgba(99, 102, 241, 0.15)';
  
  if (p === 'youtube') { activeBorder = '#ff0000'; activeBg = 'rgba(255, 0, 0, 0.1)'; }
  else if (p === 'instagram') { activeBorder = '#e1306c'; activeBg = 'rgba(225, 48, 108, 0.1)'; }
  else if (p === 'tiktok') { activeBorder = '#00f2fe'; activeBg = 'rgba(0, 242, 254, 0.1)'; }
  
  return {
    padding: '0.5rem 1.2rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    borderRadius: '4px',
    border: '1px solid transparent',
    cursor: 'pointer',
    background: isActive ? activeBg : 'none',
    borderColor: isActive ? activeBorder : 'transparent',
    color: isActive ? '#ffffff' : 'var(--text-muted)',
    transition: 'all var(--transition-fast)',
  };
};

const splitLayout: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '1.5rem',
  alignItems: 'stretch',
};

const cardPanelStyle: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const chartHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const svgChartWrapper: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0',
};

const svgChartElement: React.CSSProperties = {
  width: '100%',
  height: 'auto',
  overflow: 'visible',
};

const monthLabelRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0 10px',
  marginTop: '-0.25rem',
};

const trafficList: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const trafficItem: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const trafficTrack: React.CSSProperties = {
  height: '8px',
  backgroundColor: 'rgba(255,255,255,0.03)',
  borderRadius: '4px',
  overflow: 'hidden',
  width: '100%',
};

const trafficFill = (pct: number, index: number): React.CSSProperties => {
  const hues = ['#6366f1', '#8b5cf6', '#3b82f6', '#ec4899'];
  const background = hues[index % hues.length];
  
  return {
    height: '100%',
    width: `${pct}%`,
    background,
    borderRadius: '4px',
  };
};

const subTabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  padding: '6px',
  borderRadius: 'var(--radius-md)',
  background: 'rgba(0, 0, 0, 0.25)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  alignSelf: 'flex-start',
};

const subTabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.6rem 1.2rem',
  fontSize: '0.85rem',
  fontWeight: '600',
  borderRadius: '6px',
  border: '1px solid transparent',
  cursor: 'pointer',
  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'none',
  borderColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
  color: isActive ? '#ffffff' : 'var(--text-muted)',
  transition: 'all var(--transition-fast)',
});
