import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  CheckSquare, 
  Briefcase, 
  ArrowUpRight, 
  Sparkles,
  Play
} from 'lucide-react';

interface DashboardProps {
  events: any[];
  brandDeals: any[];
  finances: any[];
  tasks: any[];
  setActiveTab: (tab: string) => void;
  creatorName: string;
}

export default function Dashboard({ events, brandDeals, finances, tasks, setActiveTab, creatorName }: DashboardProps) {
  // Calculations
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;
  
  // Calculate total monthly revenue from finances (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = finances
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear && t.type === 'income';
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const activeSponsorships = brandDeals.filter(d => ['negotiating', 'signed', 'in-progress'].includes(d.status));
  const activeSponsorsCount = activeSponsorships.length;
  const sponsorshipPipelineValue = activeSponsorships.reduce((sum, d) => sum + d.value, 0);

  // Next scheduled video
  const nextVideo = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {creatorName || 'Creator'}</h1>
          <p>Here is how your channels are performing today.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('ai-suite')}>
          <Sparkles size={16} />
          <span>Generate Ideas</span>
        </button>
      </div>

      {/* Metrics Section */}
      <div className="metric-grid">
        {/* Metric 1 */}
        <div className="glass-panel metric-card glass-panel-glow">
          <div className="metric-card-header">
            <span>Monthly Revenue</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <div className="metric-card-value">${monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="metric-card-change up">
            <TrendingUp size={14} />
            <span>+14.2% from last month</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel metric-card glass-panel-glow">
          <div className="metric-card-header">
            <span>Active Brand Deals</span>
            <Briefcase size={18} color="#6366f1" />
          </div>
          <div className="metric-card-value">{activeSponsorsCount}</div>
          <div className="metric-card-change" style={{ color: 'var(--text-muted)' }}>
            <span>Pipeline: ${sponsorshipPipelineValue.toLocaleString()}</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel metric-card glass-panel-glow">
          <div className="metric-card-header">
            <span>Pending Checklist Tasks</span>
            <CheckSquare size={18} color="#8b5cf6" />
          </div>
          <div className="metric-card-value">{pendingTasksCount}</div>
          <div className="metric-card-change" style={{ color: 'var(--text-muted)' }}>
            <span>Total tasks: {tasks.length}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel metric-card glass-panel-glow">
          <div className="metric-card-header">
            <span>Followers / Subs</span>
            <TrendingUp size={18} color="#3b82f6" />
          </div>
          <div className="metric-card-value">148,250</div>
          <div className="metric-card-change up">
            <TrendingUp size={14} />
            <span>+3,200 this week</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Layout Split */}
      <div style={layoutSplitStyle}>
        
        {/* Left Side: Schedule and Sponsorships */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 2, minWidth: 0 }}>
          
          {/* Calendar Spotlight */}
          <div className="glass-panel" style={cardPanelStyle}>
            <div style={cardHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={20} color="#6366f1" />
                <h2>Content Spotlight</h2>
              </div>
              <button onClick={() => setActiveTab('calendar')} style={textButtonStyle}>
                <span>Full Calendar</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
            
            {nextVideo ? (
              <div style={spotlightVideoStyle}>
                <div style={platformIconWrapperStyle(nextVideo.platform)}>
                  {nextVideo.platform === 'youtube' && (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#ff0000"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.387.507 9.387.507s7.517 0 9.387-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  )}
                  {nextVideo.platform === 'instagram' && (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#e1306c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  )}
                  {nextVideo.platform === 'tiktok' && <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#00f2fe' }}>🎦</span>}
                  {nextVideo.platform === 'twitter' && <span style={{ fontSize: '1.25rem', color: '#fff' }}>𝕏</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={spotlightLabelStyle}>NEXT PUBLISHING</div>
                  <h3 style={spotlightTitleStyle}>{nextVideo.title}</h3>
                  <div style={spotlightMetaStyle}>
                    <span>Scheduled for: {new Date(nextVideo.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                    <span style={dotDivider} />
                    <span className={`badge badge-${nextVideo.platform}`}>{nextVideo.platform.toUpperCase()}</span>
                    <span style={dotDivider} />
                    <span style={{ textTransform: 'capitalize', color: '#8b5cf6', fontWeight: '600' }}>{nextVideo.status}</span>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => setActiveTab('ai-suite')} style={{ alignSelf: 'center' }}>
                  <Play size={14} />
                  <span>Script</span>
                </button>
              </div>
            ) : (
              <div style={noDataStyle}>
                <p>No content scheduled. Start filling your calendar!</p>
                <button className="btn btn-secondary" onClick={() => setActiveTab('calendar')} style={{ marginTop: '0.5rem' }}>Add Event</button>
              </div>
            )}
          </div>

          {/* Active Sponsorships */}
          <div className="glass-panel" style={cardPanelStyle}>
            <div style={cardHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Briefcase size={20} color="#8b5cf6" />
                <h2>Sponsorship Pipeline</h2>
              </div>
              <button onClick={() => setActiveTab('brand-deals')} style={textButtonStyle}>
                <span>Manage Deals</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
            
            <div style={brandListStyle}>
              {activeSponsorships.slice(0, 3).map((deal, idx) => (
                <div key={deal.id || idx} style={brandRowStyle}>
                  <div style={brandBadgeStyle}>{deal.brand.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{deal.brand}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{deal.deliverable}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: '700', color: '#10b981', fontSize: '0.95rem' }}>${deal.value.toLocaleString()}</div>
                    <span className="badge" style={statusBadgeStyle(deal.status)}>
                      {deal.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
              {activeSponsorships.length === 0 && (
                <div style={noDataStyle}>
                  <p>No active sponsorships. Pitch new brands to start tracking!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: AI Quick Strategy & Tasks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, minWidth: '300px' }}>
          
          {/* AI Strategy Advisor */}
          <div className="glass-panel" style={{ ...cardPanelStyle, border: '1px solid rgba(99, 102, 241, 0.25)', background: 'linear-gradient(145deg, rgba(13, 19, 33, 0.6) 0%, rgba(99, 102, 241, 0.04) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={20} color="#8b5cf6" style={{ filter: 'drop-shadow(0 0 5px rgba(139, 92, 246, 0.5))' }} />
              <h2>AI Strategy Advisor</h2>
            </div>
            
            <div style={aiBoxStyle}>
              <p style={{ fontSize: '0.88rem', lineHeight: '1.45', color: '#d1d5db' }}>
                "Based on competitor trends and viewer demand in the <strong>Tech & Productivity</strong> niche, your audience engagement peaks on <strong>Thursdays at 6 PM</strong>. 
                <br /><br />
                Consider scripting a <strong>'Desk Setup & Automation tour'</strong>. Comment logs show 14 questions regarding your cable management and audio setup."
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setActiveTab('ai-suite')}>
                  Draft Script
                </button>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setActiveTab('comments')}>
                  See Comments
                </button>
              </div>
            </div>
          </div>

          {/* Pending Tasks Quick List */}
          <div className="glass-panel" style={cardPanelStyle}>
            <div style={cardHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckSquare size={20} color="#10b981" />
                <h2>Tasks</h2>
              </div>
              <button onClick={() => setActiveTab('tasks')} style={textButtonStyle}>
                <span>All Tasks</span>
                <ArrowUpRight size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tasks.filter(t => t.status !== 'completed').slice(0, 4).map((task, idx) => (
                <div key={task.id || idx} style={taskRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={taskDotStyle(task.priority)} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-main)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                      {task.title}
                    </span>
                  </div>
                  {task.dueDate && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              ))}
              {tasks.filter(t => t.status !== 'completed').length === 0 && (
                <div style={noDataStyle}>
                  <p>All caught up! No pending tasks.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// Inline Styles for Layout
const layoutSplitStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2rem',
};

const cardPanelStyle: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const textButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#6366f1',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  fontSize: '0.85rem',
  fontWeight: '600',
};

const spotlightVideoStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: 'var(--radius-md)',
  padding: '1rem',
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
};

const platformIconWrapperStyle = (platform: string): React.CSSProperties => {
  let bg = 'rgba(255, 255, 255, 0.05)';
  if (platform === 'youtube') bg = 'rgba(255, 0, 0, 0.1)';
  else if (platform === 'instagram') bg = 'rgba(225, 48, 108, 0.1)';
  else if (platform === 'tiktok') bg = 'rgba(0, 242, 254, 0.1)';
  
  return {
    width: '48px',
    height: '48px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: bg,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  };
};

const spotlightLabelStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: '700',
  letterSpacing: '0.05em',
  color: 'var(--color-primary)',
  marginBottom: '0.25rem',
};

const spotlightTitleStyle: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: '600',
  marginBottom: '0.25rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const spotlightMetaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
};

const dotDivider: React.CSSProperties = {
  width: '3px',
  height: '3px',
  borderRadius: '50%',
  backgroundColor: 'var(--text-subtle)',
};

const brandListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
};

const brandRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  padding: '0.75rem',
  borderRadius: 'var(--radius-sm)',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
};

const brandBadgeStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: 'rgba(99, 102, 241, 0.15)',
  color: '#8b5cf6',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '0.9rem',
};

const statusBadgeStyle = (status: string): React.CSSProperties => {
  let color = '#9ca3af';
  let bg = 'rgba(255, 255, 255, 0.05)';
  
  if (status === 'signed') { color = '#3b82f6'; bg = 'rgba(59, 130, 246, 0.15)'; }
  else if (status === 'in-progress') { color = '#f59e0b'; bg = 'rgba(245, 158, 11, 0.15)'; }
  else if (status === 'paid') { color = '#10b981'; bg = 'rgba(16, 185, 129, 0.15)'; }
  
  return {
    color,
    backgroundColor: bg,
    border: `1px solid ${color}33`,
    fontSize: '0.65rem',
    fontWeight: '700',
    marginTop: '0.2rem',
  };
};

const aiBoxStyle: React.CSSProperties = {
  backgroundColor: 'rgba(99, 102, 241, 0.03)',
  border: '1px solid rgba(99, 102, 241, 0.1)',
  borderRadius: 'var(--radius-sm)',
  padding: '1rem',
};

const taskRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.6rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.04)',
};

const taskDotStyle = (priority: string): React.CSSProperties => {
  let backgroundColor = '#9ca3af';
  if (priority === 'high') backgroundColor = 'var(--color-danger)';
  else if (priority === 'medium') backgroundColor = 'var(--color-warning)';
  else if (priority === 'low') backgroundColor = 'var(--color-info)';

  return {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor,
    boxShadow: `0 0 6px ${backgroundColor}`,
  };
};

const noDataStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '1.5rem',
  color: 'var(--text-muted)',
  fontSize: '0.88rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
};
