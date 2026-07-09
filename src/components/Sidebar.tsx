import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Sparkles, 
  Briefcase, 
  DollarSign, 
  BarChart3, 
  Users, 
  FolderHeart, 
  MessageSquareCode, 
  Bot, 
  CheckSquare, 
  Settings,
  Tv
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  creatorName: string;
  creatorNiche: string;
}

export default function Sidebar({ activeTab, setActiveTab, creatorName, creatorNiche }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Content Calendar', icon: Calendar },
    { id: 'ai-suite', label: 'AI Suite', icon: Sparkles },
    { id: 'brand-deals', label: 'Brand Deals', icon: Briefcase },
    { id: 'finances', label: 'Finance Tracker', icon: DollarSign },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'competitors', label: 'Competitor Tracker', icon: Users },
    { id: 'assets', label: 'Asset Library', icon: FolderHeart },
    { id: 'comments', label: 'Comment Analyzer', icon: MessageSquareCode },
    { id: 'chat', label: 'AI Chat Assistant', icon: Bot },
    { id: 'tasks', label: 'Task Manager', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="sidebar glass-panel" style={sidebarStyle}>
      <div className="sidebar-logo" style={logoStyle}>
        <Tv size={28} color="#6366f1" style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))' }} />
        <span style={logoTextStyle}>CreatorOS</span>
      </div>

      <nav className="sidebar-nav" style={navStyle}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{
                ...navItemStyle,
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
              }}
            >
              <Icon size={20} color={isActive ? '#8b5cf6' : 'var(--text-muted)'} />
              <span style={{ fontSize: '0.9rem', fontWeight: isActive ? '600' : '500' }}>{item.label}</span>
              {isActive && <div style={activeDotStyle} />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-profile" style={profileCardStyle}>
        <div style={avatarStyle}>
          {creatorName ? creatorName.charAt(0).toUpperCase() : 'C'}
        </div>
        <div style={profileInfoStyle}>
          <div style={profileNameStyle}>{creatorName || 'Your Name'}</div>
          <div style={profileNicheStyle}>{creatorNiche || 'Content Creator'}</div>
        </div>
        <div style={proBadgeStyle}>PRO</div>
      </div>
    </div>
  );
}

// Inline styles for modularity and layout integrity
const sidebarStyle: React.CSSProperties = {
  width: '260px',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '0',
  borderTop: 'none',
  borderBottom: 'none',
  borderLeft: 'none',
  padding: '1.5rem 1rem',
  zIndex: 10,
  flexShrink: 0
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '2rem',
  paddingLeft: '0.5rem',
};

const logoTextStyle: React.CSSProperties = {
  fontFamily: 'var(--font-heading)',
  fontSize: '1.4rem',
  fontWeight: '800',
  letterSpacing: '-0.03em',
  background: 'linear-gradient(135deg, #ffffff 40%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  flex: 1,
  overflowY: 'auto',
  paddingRight: '4px',
};

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.7rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid transparent',
  cursor: 'pointer',
  textAlign: 'left',
  width: '100%',
  position: 'relative',
  transition: 'all var(--transition-fast)',
};

const activeDotStyle: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '#8b5cf6',
  boxShadow: '0 0 8px #8b5cf6',
};

const profileCardStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem',
  borderRadius: 'var(--radius-md)',
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  marginTop: '1rem',
};

const avatarStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  color: 'white',
  boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)',
};

const profileInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
};

const profileNameStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  fontWeight: '600',
  color: 'var(--text-main)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const profileNicheStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const proBadgeStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: '800',
  color: '#6366f1',
  backgroundColor: 'rgba(99, 102, 241, 0.15)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  padding: '0.1rem 0.35rem',
  borderRadius: '4px',
};
