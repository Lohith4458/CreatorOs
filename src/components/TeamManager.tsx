import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Mail, 
  Shield, 
  Clock, 
  X, 
  Check, 
  Sliders
} from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TaskManager from './TaskManager';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  color: string;
}

interface TeamManagerProps {
  tasks: any[];
  setTasks: React.Dispatch<React.SetStateAction<any[]>>;
  creatorName: string;
}

const DEFAULT_TEAM = [
  { id: 'tm1', name: 'Abdul', role: 'Channel Owner / Host', email: 'abdul@creatoros.com', status: 'Reviewing script outline', color: '#6366f1' },
  { id: 'tm2', name: 'Rohan Sharma', role: 'Lead Video Editor', email: 'rohan@creatoros.com', status: 'Editing Setup Tour video', color: '#3b82f6' },
  { id: 'tm3', name: 'Priya Patel', role: 'Thumbnail Designer', email: 'priya@creatoros.com', status: 'A/B testing desk layout hook', color: '#10b981' },
  { id: 'tm4', name: 'Vikram Singh', role: 'Scriptwriter / Researcher', email: 'vikram@creatoros.com', status: 'Awaiting keyword approval', color: '#f59e0b' }
];

const MEMBER_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export default function TeamManager({ tasks, setTasks, creatorName }: TeamManagerProps) {
  const [team, setTeam] = useLocalStorage<TeamMember[]>('creatoros_team_members', DEFAULT_TEAM);
  
  // Synchronize creator name with the owner team member dynamically
  useEffect(() => {
    if (creatorName) {
      setTeam(prev => 
        prev.map(member => 
          member.id === 'tm1' || member.role.includes('Owner')
            ? { ...member, name: creatorName, email: `${creatorName.toLowerCase().replace(/\s+/g, '')}@creatoros.com` }
            : member
        )
      );
    }
  }, [creatorName, setTeam]);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('Idle');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !email) return;

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name,
      role,
      email,
      status: status || 'Idle',
      color: MEMBER_COLORS[Math.floor(Math.random() * MEMBER_COLORS.length)]
    };

    setTeam(prev => [...prev, newMember]);
    setName('');
    setRole('');
    setEmail('');
    setStatus('Idle');
    setInviteSuccess(true);
    
    setTimeout(() => {
      setInviteSuccess(false);
      setIsInviteOpen(false);
    }, 1500);
  };

  const handleRemoveMember = (id: string, memberName: string) => {
    const owner = team.find(m => m.id === 'tm1' || m.role.includes('Owner'));
    if (id === owner?.id) {
      alert("You cannot remove the channel owner.");
      return;
    }
    if (confirm(`Are you sure you want to remove ${memberName} from the team workspace?`)) {
      setTeam(prev => prev.filter(m => m.id !== id));
      // Optionally unassign tasks assigned to this member
      setTasks(prev => prev.map(t => t.assignee === memberName ? { ...t, assignee: undefined } : t));
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header section */}
      <div style={headerStyle}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2.2rem' }}>
            <Users size={28} color="#8b5cf6" />
            <span>Team Collaboration Workspace</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Coordinate roles, view active workloads, and assign scripting or editing pipelines to your production team.
          </p>
        </div>
        
        <button className="btn btn-primary" onClick={() => setIsInviteOpen(true)}>
          <UserPlus size={16} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Team Roster Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {team.map((member) => {
          // Count tasks assigned to this member
          const memberTaskCount = tasks.filter(t => t.assignee === member.name && t.status !== 'completed').length;
          
          return (
            <div key={member.id} className="glass-panel" style={memberCardStyle}>
              {/* Top Row: Avatar and Role */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={avatarStyle(member.color)}>
                  {member.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {member.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    <Shield size={12} color="#8b5cf6" />
                    <span>{member.role}</span>
                  </div>
                </div>
                
                {member.id !== 'tm1' && !member.role.includes('Owner') && (
                  <button 
                    onClick={() => handleRemoveMember(member.id, member.name)} 
                    style={removeBtnStyle}
                    title="Remove Member"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* Status Section */}
              <div style={statusWrapperStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <Clock size={12} />
                  <strong>Current Focus:</strong>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '4px', fontStyle: 'italic' }}>
                  "{member.status}"
                </p>
              </div>

              {/* Bottom stats details */}
              <div style={cardFooterStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                  <Mail size={12} />
                  <span>{member.email}</span>
                </div>
                
                <span className="badge" style={{ 
                  backgroundColor: memberTaskCount > 0 ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: memberTaskCount > 0 ? '#a5b4fc' : '#34d399',
                  border: 'none',
                  fontSize: '0.68rem',
                  fontWeight: '600'
                }}>
                  {memberTaskCount} Pending Tasks
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', margin: '1rem 0' }}></div>

      {/* Embedded Tasks Board */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sliders size={20} color="#10b981" />
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Production Task Board</h2>
        </div>
        <TaskManager tasks={tasks} setTasks={setTasks} teamMembers={team} />
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div style={modalOverlay}>
          <div className="glass-panel" style={modalContent}>
            
            <div style={modalHeader}>
              <h2>Invite Team Member</h2>
              <button style={closeBtn} onClick={() => setIsInviteOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '0.5rem' }}>
              <div className="form-group">
                <label>Name</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  required
                />
              </div>

              <div className="form-group">
                <label>Workspace Role</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Video Editor, Scriptwriter"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rohan@creatoros.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Current Status / Activity (Optional)</label>
                <input 
                  type="text" 
                  className="input-field"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="e.g. Editing setup vlog"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                {inviteSuccess ? <Check size={16} /> : null}
                <span>{inviteSuccess ? 'Invited Successfully!' : 'Invite to Workspace'}</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

// Styling definitions
const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const memberCardStyle: React.CSSProperties = {
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const avatarStyle = (color: string): React.CSSProperties => ({
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  backgroundColor: color,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  color: 'white',
  boxShadow: `0 0 12px ${color}40`,
  flexShrink: 0
});

const removeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-subtle)',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  transition: 'all var(--transition-fast)'
};

const statusWrapperStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.015)',
  border: '1px solid rgba(255,255,255,0.03)',
  borderRadius: '6px',
  padding: '0.75rem',
};

const cardFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  borderTop: '1px solid rgba(255,255,255,0.04)',
  paddingTop: '0.75rem',
};

// Modal styling
const modalOverlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(3, 5, 10, 0.8)',
  backdropFilter: 'blur(12px)',
  zIndex: 100,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
};

const modalContent: React.CSSProperties = {
  width: '100%',
  maxWidth: '460px',
  background: 'rgba(13, 20, 35, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const modalHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const closeBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '50%',
};
