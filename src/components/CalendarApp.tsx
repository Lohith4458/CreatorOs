import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Sparkles, 
  X
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  platform: 'youtube' | 'linkedin' | 'instagram' | 'x';
  date: string; // YYYY-MM-DD
  time: string;
  status: 'draft' | 'scripting' | 'filming' | 'editing' | 'scheduled' | 'published';
  notes?: string;
}

interface CalendarAppProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setActiveTab: (tab: string) => void;
  setSelectedEventForAI?: (event: Event) => void;
}

export default function CalendarApp({ events, setEvents, setActiveTab, setSelectedEventForAI }: CalendarAppProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // New Event Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPlatform, setNewPlatform] = useState<'youtube' | 'linkedin' | 'instagram' | 'x'>('youtube');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('12:00');
  const [newStatus, setNewStatus] = useState<Event['status']>('draft');
  const [newNotes, setNewNotes] = useState('');

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate Months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData('text/plain', eventId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    const eventId = e.dataTransfer.getData('text/plain');
    if (!eventId) return;

    setEvents(prev => prev.map(ev => 
      ev.id === eventId ? { ...ev, date: dateStr } : ev
    ));
  };

  // Add Event
  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;

    const newEv: Event = {
      id: Date.now().toString(),
      title: newTitle,
      platform: newPlatform,
      date: newDate,
      time: newTime,
      status: newStatus,
      notes: newNotes
    };

    setEvents(prev => [...prev, newEv]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const resetForm = () => {
    setNewTitle('');
    setNewPlatform('youtube');
    setNewDate('');
    setNewTime('12:00');
    setNewStatus('draft');
    setNewNotes('');
  };

  // Open Edit Modal
  const openEditModal = (event: Event) => {
    setSelectedEvent(event);
    setNewTitle(event.title);
    setNewPlatform(event.platform);
    setNewDate(event.date);
    setNewTime(event.time);
    setNewStatus(event.status);
    setNewNotes(event.notes || '');
    setIsEditModalOpen(true);
  };

  // Update Event
  const handleUpdateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !newTitle || !newDate) return;

    setEvents(prev => prev.map(ev => 
      ev.id === selectedEvent.id 
        ? { ...ev, title: newTitle, platform: newPlatform, date: newDate, time: newTime, status: newStatus, notes: newNotes }
        : ev
    ));

    setIsEditModalOpen(false);
    setSelectedEvent(null);
    resetForm();
  };

  // Delete Event
  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(ev => ev.id !== id));
      setIsEditModalOpen(false);
      setSelectedEvent(null);
      resetForm();
    }
  };

  // Send Event to AI Suite
  const handleSendToAISuite = (event: Event) => {
    if (setSelectedEventForAI) {
      setSelectedEventForAI(event);
      setActiveTab('content-generator');
    }
  };

  // Filter events
  const filteredEvents = events.filter(ev => {
    if (selectedPlatformFilter === 'all') return true;
    return ev.platform === selectedPlatformFilter;
  });

  // Render Calendar Grid Days
  const calendarCells = [];
  // Empty padding days for first week
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(<div key={`empty-${i}`} style={emptyCellStyle} />);
  }
  
  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = filteredEvents.filter(ev => ev.date === dateStr);

    calendarCells.push(
      <div 
        key={`day-${day}`} 
        style={dayCellStyle}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, dateStr)}
      >
        <div style={dayNumberStyle}>{day}</div>
        <div style={cellEventsContainerStyle}>
          {dayEvents.map(ev => (
            <div 
              key={ev.id} 
              onClick={() => openEditModal(ev)}
              style={eventBadgeStyle(ev.platform)}
              title={ev.title}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, ev.id)}
            >
              <div style={eventBadgeHeader}>
                <span style={eventBadgePlatformIndicator(ev.platform)}>
                  {ev.platform === 'youtube' && 'YT'}
                  {ev.platform === 'linkedin' && 'LN'}
                  {ev.platform === 'instagram' && 'IG'}
                  {ev.platform === 'x' && 'X'}
                </span>
                <span style={eventBadgeStatusIndicator(ev.status)} />
              </div>
              <div style={eventBadgeTitleStyle}>{ev.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Calendar Header Controls */}
      <div style={calendarHeaderControlsStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CalendarIcon size={24} color="#6366f1" />
          <h1>Content Calendar</h1>
        </div>
        
        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={filterGroupStyle}>
            {['all', 'youtube', 'linkedin', 'instagram', 'x'].map(platform => (
              <button
                key={platform}
                onClick={() => setSelectedPlatformFilter(platform)}
                style={{
                  ...filterButtonStyle,
                  backgroundColor: selectedPlatformFilter === platform ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  borderColor: selectedPlatformFilter === platform ? 'var(--color-primary)' : 'var(--border-color)',
                  color: selectedPlatformFilter === platform ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {platform === 'x' ? 'X' : platform.toUpperCase()}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <Plus size={16} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid Box */}
      <div className="glass-panel" style={{ padding: '1rem' }}>
        <div style={monthNavigatorStyle}>
          <button style={navBtnStyle} onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
          <h2 style={{ fontSize: '1.5rem' }}>{monthNames[month]} {year}</h2>
          <button style={navBtnStyle} onClick={handleNextMonth}><ChevronRight size={20} /></button>
        </div>

        {/* Days of Week headers */}
        <div style={weekHeaderGridStyle}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={weekDayHeaderStyle}>{day}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div style={daysGridStyle}>
          {calendarCells}
        </div>
      </div>

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Create Scheduled Content</h3>
              <button className="modal-close" onClick={() => { setIsAddModalOpen(false); resetForm(); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Video / Post Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="e.g. 10 Productivity Hacks for 2026"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Platform</label>
                  <select className="select-field" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value as any)}>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="x">X</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="select-field" value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)}>
                    <option value="draft">Draft</option>
                    <option value="scripting">Scripting</option>
                    <option value="filming">Filming</option>
                    <option value="editing">Editing</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Publishing Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Publishing Time</label>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Content Description / Brief</label>
                <textarea 
                  className="textarea-field" 
                  rows={3} 
                  value={newNotes} 
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Outline key messages, sponsorships to mention, or visual layout..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Content</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT & DETAIL MODAL */}
      {isEditModalOpen && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Edit Content Schedule</h3>
              <button className="modal-close" onClick={() => { setIsEditModalOpen(false); setSelectedEvent(null); resetForm(); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Video / Post Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Platform</label>
                  <select className="select-field" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value as any)}>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="instagram">Instagram</option>
                    <option value="x">X</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="select-field" value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)}>
                    <option value="draft">Draft</option>
                    <option value="scripting">Scripting</option>
                    <option value="filming">Filming</option>
                    <option value="editing">Editing</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Publishing Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Publishing Time</label>
                  <input 
                    type="time" 
                    className="input-field" 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Content Description / Brief</label>
                <textarea 
                  className="textarea-field" 
                  rows={3} 
                  value={newNotes} 
                  onChange={(e) => setNewNotes(e.target.value)}
                />
              </div>

              <div style={actionRowStyle}>
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  style={{ padding: '0.6rem 1rem' }}
                >
                  <Trash2 size={16} />
                  <span>Delete</span>
                </button>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => handleSendToAISuite(selectedEvent)}
                    style={{ border: '1px solid rgba(139, 92, 246, 0.4)', background: 'rgba(139, 92, 246, 0.08)' }}
                  >
                    <Sparkles size={16} color="#8b5cf6" />
                    <span style={{ color: '#a78bfa' }}>AI Suite</span>
                  </button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline Styles
const calendarHeaderControlsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const filterGroupStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.25rem',
  padding: '4px',
  borderRadius: 'var(--radius-sm)',
  background: 'rgba(0, 0, 0, 0.2)',
  border: '1px solid var(--border-color)',
};

const filterButtonStyle: React.CSSProperties = {
  padding: '0.4rem 0.8rem',
  fontSize: '0.75rem',
  fontWeight: '600',
  borderRadius: '4px',
  border: '1px solid transparent',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
  background: 'none',
};

const monthNavigatorStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
  padding: '0 0.5rem',
};

const navBtnStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border-color)',
  cursor: 'pointer',
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'var(--text-main)',
  transition: 'background var(--transition-fast)',
};

const weekHeaderGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  textAlign: 'center',
  fontWeight: '600',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  paddingBottom: '0.75rem',
  borderBottom: '1px solid var(--border-color)',
};

const weekDayHeaderStyle: React.CSSProperties = {
  padding: '0.5rem 0',
};

const daysGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gridAutoRows: 'minmax(120px, 1fr)',
  gap: '1px',
  backgroundColor: 'var(--border-color)',
  borderRadius: '0 0 var(--radius-md) var(--radius-md)',
  overflow: 'hidden',
  marginTop: '0.5rem',
};

const dayCellStyle: React.CSSProperties = {
  background: 'var(--bg-main)',
  padding: '0.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  position: 'relative',
};

const emptyCellStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.01)',
};

const dayNumberStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
  alignSelf: 'flex-start',
};

const cellEventsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  overflowY: 'auto',
  maxHeight: '90px',
};

const eventBadgeStyle = (platform: string): React.CSSProperties => {
  let border = 'rgba(255,255,255,0.08)';
  let bg = 'rgba(255,255,255,0.02)';
  
  if (platform === 'youtube') { border = 'rgba(255,0,0,0.3)'; bg = 'rgba(255,0,0,0.06)'; }
  else if (platform === 'instagram') { border = 'rgba(236,72,153,0.3)'; bg = 'rgba(236,72,153,0.06)'; }
  else if (platform === 'linkedin') { border = 'rgba(0,119,181,0.3)'; bg = 'rgba(0,119,181,0.06)'; }
  else if (platform === 'x') { border = 'rgba(255,255,255,0.2)'; bg = 'rgba(255,255,255,0.04)'; }
  
  return {
    padding: '4px 6px',
    borderRadius: '4px',
    background: bg,
    border: `1px solid ${border}`,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    transition: 'transform var(--transition-fast), background var(--transition-fast)',
  };
};

const eventBadgeHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const eventBadgePlatformIndicator = (platform: string): React.CSSProperties => {
  let color = 'var(--text-muted)';
  if (platform === 'youtube') color = '#ff4d4d';
  else if (platform === 'instagram') color = '#ff8fa3';
  else if (platform === 'linkedin') color = '#38bdf8';
  else if (platform === 'x') color = '#ffffff';
  
  return {
    fontSize: '0.6rem',
    fontWeight: '800',
    color,
  };
};

const eventBadgeStatusIndicator = (status: string): React.CSSProperties => {
  let backgroundColor = '#9ca3af';
  if (status === 'published') backgroundColor = '#10b981';
  else if (status === 'scheduled') backgroundColor = '#3b82f6';
  else if (status === 'editing') backgroundColor = '#f59e0b';
  else if (status === 'filming') backgroundColor = '#ec4899';
  else if (status === 'scripting') backgroundColor = '#8b5cf6';
  
  return {
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor,
    boxShadow: `0 0 4px ${backgroundColor}`,
  };
};

const eventBadgeTitleStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'var(--text-main)',
};

const actionRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '1rem',
  borderTop: '1px solid var(--border-color)',
  paddingTop: '1rem',
};
