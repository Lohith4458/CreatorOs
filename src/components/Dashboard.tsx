import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  CheckSquare, 
  Briefcase, 
  ArrowUpRight, 
  Sparkles,
  Bot,
  Video,
  Activity,
  Layers,
  ChevronRight
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
  const [hoveredDataPoint, setHoveredDataPoint] = useState<any | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Dynamic day-time greeting
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning 🌅';
    if (hr < 17) return 'Good Afternoon ☀️';
    return 'Good Evening 🌌';
  };

  // Calculations for Today's Productivity
  const activeTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const activeSponsorsCount = brandDeals.filter(d => ['signed', 'in-progress'].includes(d.status)).length;
  
  // Total Projects (Tasks + Brand Deals)
  const totalProjects = activeTasksCount + activeSponsorsCount;
  
  // Scheduled events on Calendar
  const scheduledCount = events.filter(e => e.status !== 'published').length;
  const nextEvent = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Weekly subscriber analytics data (last 7 days simulation)
  const chartData = [
    { day: 'Mon', value: 145000, change: '+450' },
    { day: 'Tue', value: 145600, change: '+600' },
    { day: 'Wed', value: 146100, change: '+500' },
    { day: 'Thu', value: 146800, change: '+700' },
    { day: 'Fri', value: 147300, change: '+500' },
    { day: 'Sat', value: 147800, change: '+500' },
    { day: 'Sun', value: 148250, change: '+450' }
  ];

  // SVG dimensions
  const svgWidth = 500;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 20;

  // Map data to SVG coordinates
  const points = chartData.map((d, index) => {
    const x = paddingX + (index * (svgWidth - paddingX * 2)) / (chartData.length - 1);
    // Value range mapping: 144000 to 149000
    const minVal = 144000;
    const maxVal = 149000;
    const y = svgHeight - paddingY - ((d.value - minVal) * (svgHeight - paddingY * 2)) / (maxVal - minVal);
    return { x, y, ...d, index };
  });

  // SVG path construction
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  // Simulated recent AI conversations list
  const recentConversations = [
    {
      id: 'conv1',
      title: 'Ultimate 2026 Desk Setup Tour Script Outline',
      type: 'script',
      time: '2 hours ago',
      desc: '10-minute outline co-written with Gemini. Interactive tech tour format.'
    },
    {
      id: 'conv2',
      title: 'Squarespace Sponsor Outreach Email Draft',
      type: 'chat',
      time: 'Yesterday',
      desc: 'Negotiation outline for 1x Instagram Reel sponsorship.'
    },
    {
      id: 'conv3',
      title: '5 Accessories I Can\'t Live Without Titles',
      type: 'title',
      time: '3 days ago',
      desc: 'Generated 10 high-CTR title variations across clickbait and storytelling styles.'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Greeting */}
      <div className="dashboard-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em' }}>
            Hello, {(!creatorName || creatorName === 'Creator Pro') ? 'Abdul' : creatorName} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.25rem', fontWeight: '500' }}>
            {getGreeting()}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setActiveTab('content-generator')}>
          <Sparkles size={16} />
          <span>New AI Draft</span>
        </button>
      </div>

      {/* Today's Productivity Title */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8b5cf6', fontWeight: '700' }}>
          Today's Productivity
        </h2>
        
        {/* Productivity 2x2 Grid */}
        <div className="metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          
          {/* Card 1: AI Usage */}
          <div className="glass-panel metric-card glass-panel-glow" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>AI Usage</span>
              <Bot size={18} color="#8b5cf6" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>86 / 150</div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', marginTop: '4px' }}>
              <div style={{ width: '57%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '10px' }}></div>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>Daily requests consumed</span>
          </div>

          {/* Card 2: Projects */}
          <div className="glass-panel metric-card glass-panel-glow" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Active Projects</span>
              <Layers size={18} color="#3b82f6" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{totalProjects} Active</div>
            <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>{activeTasksCount} Tasks</span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <span>{activeSponsorsCount} Brand Contracts</span>
            </div>
          </div>

          {/* Card 3: Followers */}
          <div className="glass-panel metric-card glass-panel-glow" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Followers</span>
              <TrendingUp size={18} color="#10b981" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>148,250</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10b981', fontWeight: '600' }}>
              <TrendingUp size={12} />
              <span>+3,200 this week</span>
            </div>
          </div>

          {/* Card 4: Scheduled */}
          <div className="glass-panel metric-card glass-panel-glow" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Scheduled Content</span>
              <Calendar size={18} color="#f59e0b" />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{scheduledCount} Scheduled</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {nextEvent ? `Next: ${nextEvent.title}` : "No upcoming events"}
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid: 2-Column Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'stretch' }}>
        
        {/* Left Column: Weekly Analytics Chart & Recent Projects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Weekly Analytics Chart */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="#6366f1" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Weekly Analytics Chart</h2>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>Followers growth (last 7 days)</div>
            </div>

            {/* Interactive SVG Chart */}
            <div style={{ position: 'relative', width: '100%', height: `${svgHeight}px`, background: 'rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'visible' }}>
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
                <defs>
                  {/* Grid Line Gradient */}
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                {[0, 1, 2, 3].map((g) => {
                  const y = paddingY + (g * (svgHeight - paddingY * 2)) / 3;
                  return (
                    <line key={g} x1={paddingX} y1={y} x2={svgWidth - paddingX} y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />
                  );
                })}

                {/* Area Fill Gradient under the Curve */}
                <path d={areaPath} fill="url(#chartGlow)" />

                {/* Main Curve Line */}
                <path d={linePath} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />

                {/* Interactive Hover Vertical Slices / Interactive Points */}
                {points.map((p) => (
                  <g key={p.index} 
                     onMouseEnter={() => {
                       setHoveredDataPoint(p);
                       setHoveredIndex(p.index);
                     }}
                     onMouseLeave={() => {
                       setHoveredDataPoint(null);
                       setHoveredIndex(null);
                     }}
                     style={{ cursor: 'pointer' }}
                  >
                    {/* Hover column background bar */}
                    <rect x={p.x - 20} y={paddingY} width="40" height={svgHeight - paddingY * 2} fill="transparent" />

                    {/* Node Dot */}
                    <circle cx={p.x} cy={p.y} r={hoveredIndex === p.index ? 6 : 4} fill={hoveredIndex === p.index ? '#ffffff' : '#8b5cf6'} stroke="#6366f1" strokeWidth="2" style={{ transition: 'all 0.15s ease' }} />
                  </g>
                ))}

                {/* X Axis Labels */}
                {points.map((p) => (
                  <text key={p.index} x={p.x} y={svgHeight - 4} textAnchor="middle" fill="var(--text-subtle)" fontSize="10" fontWeight="600">
                    {p.day}
                  </text>
                ))}
              </svg>

              {/* Dynamic Interactive Tooltip */}
              {hoveredDataPoint && (
                <div style={{
                  position: 'absolute',
                  top: `${hoveredDataPoint.y - 55}px`,
                  left: `${(hoveredDataPoint.x / svgWidth) * 100}%`,
                  transform: 'translateX(-50%)',
                  background: 'rgba(10, 15, 30, 0.95)',
                  border: '1px solid rgba(99, 102, 241, 0.5)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 10px rgba(99, 102, 241, 0.25)',
                  pointerEvents: 'none',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase' }}>{hoveredDataPoint.day}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'white' }}>{hoveredDataPoint.value.toLocaleString()}</span>
                  <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700' }}>{hoveredDataPoint.change}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recent Projects List */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={18} color="#3b82f6" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Recent Projects</h2>
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveTab('calendar')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', gap: '4px' }}>
                <span>Calendar</span>
                <ArrowUpRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {events.slice(0, 3).map((video, idx) => (
                <div key={video.id || idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('calendar')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                }}
                >
                  {/* Platform Identifier */}
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: video.platform === 'youtube' ? 'rgba(255,0,0,0.1)' : 
                                     video.platform === 'instagram' ? 'rgba(236,72,153,0.1)' : 
                                     video.platform === 'linkedin' ? 'rgba(0,119,181,0.1)' : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0
                  }}>
                    {video.platform === 'youtube' && <span style={{ fontSize: '0.75rem', color: '#ff4d4d', fontWeight: 'bold' }}>YT</span>}
                    {video.platform === 'instagram' && <span style={{ fontSize: '0.75rem', color: '#ff8fa3', fontWeight: 'bold' }}>IG</span>}
                    {video.platform === 'linkedin' && <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 'bold' }}>LN</span>}
                    {video.platform === 'x' && <span style={{ fontSize: '0.75rem', color: '#ffffff', fontWeight: 'bold' }}>X</span>}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {video.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Publishing: {new Date(video.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <span className={`badge badge-${video.platform}`} style={{ textTransform: 'capitalize', padding: '0.2rem 0.5rem', fontSize: '0.65rem' }}>
                    {video.status}
                  </span>
                </div>
              ))}
              
              {events.length === 0 && (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  No projects currently active.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Column: Recent AI Conversations */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={18} color="#8b5cf6" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Recent AI Conversations</h2>
              </div>
              <button className="btn btn-secondary" onClick={() => setActiveTab('ai-studio')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', gap: '4px' }}>
                <span>Chat</span>
                <ArrowUpRight size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              {recentConversations.map((conv, idx) => (
                <div key={conv.id || idx} style={{
                  padding: '1rem',
                  background: 'rgba(99, 102, 241, 0.02)',
                  border: '1px solid rgba(99, 102, 241, 0.08)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
                onClick={() => setActiveTab(conv.type === 'chat' ? 'ai-studio' : 'content-generator')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.08)';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge" style={{ 
                      fontSize: '0.65rem', 
                      backgroundColor: conv.type === 'script' ? 'rgba(139, 92, 246, 0.15)' : 
                                       conv.type === 'chat' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                      color: conv.type === 'script' ? '#c084fc' : 
                             conv.type === 'chat' ? '#60a5fa' : '#f472b6',
                      border: 'none',
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {conv.type}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{conv.time}</span>
                  </div>

                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '200px' }}>{conv.title}</span>
                    <ChevronRight size={14} color="var(--text-subtle)" />
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {conv.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* AI Assistant Callout */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(99, 102, 241, 0.02))',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} color="#a5b4fc" />
                <span style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Brainstorm Tip</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Your cable management and audio setup comment count is rising! Pitch an audio kit overview to Squarespace in your next integration call.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
