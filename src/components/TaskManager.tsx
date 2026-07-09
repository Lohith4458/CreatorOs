import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  Calendar, 
  X,
  AlertCircle,
  Play
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  dueDate?: string;
  notes?: string;
}

interface TaskManagerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#3b82f6'
};

export default function TaskManager({ tasks, setTasks }: TaskManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  // Submit Handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      priority,
      status,
      dueDate: dueDate || undefined,
      notes: notes || undefined
    };

    setTasks(prev => [newTask, ...prev]);
    setTitle('');
    setPriority('medium');
    setStatus('todo');
    setDueDate('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  // Toggle Complete Status
  const toggleComplete = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'completed' ? 'todo' : 'completed'
        };
      }
      return t;
    }));
  };

  // Delete Task
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  // Move Status Stage
  const changeStatus = (id: string, nextStatus: Task['status']) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: nextStatus } : t
    ));
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(t => {
    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesPriority && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header controls */}
      <div style={headerStyle}>
        <div>
          <h1>Task Manager</h1>
          <p>Organize post-production check-lists, filming details, and administrative checklists.</p>
        </div>
        
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Row */}
      <div style={filterRow}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Priority filter */}
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <span style={filterLabel}>Priority:</span>
            <select 
              className="select-field" 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <span style={filterLabel}>Status:</span>
            <select 
              className="select-field" 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Task Grid Columns / List View depending on screens */}
      <div style={taskListContainer}>
        {filteredTasks.map(task => {
          const isDone = task.status === 'completed';
          return (
            <div 
              key={task.id} 
              className="glass-panel" 
              style={{ 
                ...taskRowStyle, 
                borderLeft: `4px solid ${PRIORITY_COLORS[task.priority]}`,
                opacity: isDone ? 0.6 : 1,
              }}
            >
              <div style={taskLeftBox}>
                {/* Complete checkbox */}
                <button 
                  onClick={() => toggleComplete(task.id)}
                  style={checkboxStyle}
                >
                  {isDone ? (
                    <CheckSquare size={20} color="#10b981" />
                  ) : (
                    <Square size={20} color="var(--text-subtle)" />
                  )}
                </button>

                <div style={{ minWidth: 0 }}>
                  {/* Task title */}
                  <div style={{ 
                    fontWeight: '600', 
                    fontSize: '0.92rem', 
                    textDecoration: isDone ? 'line-through' : 'none',
                    color: isDone ? 'var(--text-muted)' : 'var(--text-main)'
                  }}>
                    {task.title}
                  </div>
                  
                  {/* Notes / Due Date details */}
                  <div style={metaRow}>
                    <span 
                      style={priorityLabel(task.priority)}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                    {task.dueDate && (
                      <>
                        <span style={dotDivider} />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Calendar size={12} />
                          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </>
                    )}
                    {task.notes && (
                      <>
                        <span style={dotDivider} />
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px' }}>
                          {task.notes}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Status adjust select and delete */}
              <div style={taskRightBox}>
                <select
                  className="select-field"
                  value={task.status}
                  onChange={(e) => changeStatus(task.id, e.target.value as any)}
                  style={statusSelectStyle}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="completed">Completed</option>
                </select>

                <button 
                  onClick={() => handleDelete(task.id)}
                  style={deleteBtn}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="glass-panel" style={emptyPlaceholder}>
            <p>No tasks matched current filter query.</p>
          </div>
        )}
      </div>

      {/* ADD TASK MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3>Create Project Task</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g. Edit Sponsor intro segment, Export thumbnail"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="select-field" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select className="select-field" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Under Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <label>Context / Notes</label>
                <textarea 
                  className="textarea-field" 
                  rows={3}
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  placeholder="Details about raw files location, specific sponsor brief requirements..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
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

const filterRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const filterLabel: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
};

const taskListContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
};

const taskRowStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '1rem',
  transition: 'opacity var(--transition-fast)',
};

const taskLeftBox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  flex: 1,
  minWidth: 0,
};

const checkboxStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: 0,
};

const metaRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  marginTop: '2px',
};

const priorityLabel = (priority: 'high' | 'medium' | 'low'): React.CSSProperties => {
  const color = PRIORITY_COLORS[priority];
  return {
    color,
    fontWeight: '700',
    fontSize: '0.65rem',
    background: `${color}15`,
    border: `1px solid ${color}33`,
    padding: '0.05rem 0.35rem',
    borderRadius: '4px',
  };
};

const dotDivider: React.CSSProperties = {
  width: '3px',
  height: '3px',
  borderRadius: '50%',
  backgroundColor: 'var(--text-subtle)',
};

const taskRightBox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
};

const statusSelectStyle: React.CSSProperties = {
  padding: '0.35rem 0.5rem',
  fontSize: '0.75rem',
  background: 'rgba(255, 255, 255, 0.02)',
  borderColor: 'var(--border-color)',
};

const deleteBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-subtle)',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  transition: 'color var(--transition-fast)',
};

const emptyPlaceholder: React.CSSProperties = {
  padding: '3rem 1rem',
  textAlign: 'center',
  color: 'var(--text-muted)',
};
