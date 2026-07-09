import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Mail, 
  FileText 
} from 'lucide-react';

interface BrandDeal {
  id: string;
  brand: string;
  value: number;
  deliverable: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter';
  status: 'lead' | 'negotiating' | 'signed' | 'in-progress' | 'published' | 'paid';
  dueDate: string;
  contactEmail?: string;
  notes?: string;
}

interface BrandTrackerProps {
  brandDeals: BrandDeal[];
  setBrandDeals: React.Dispatch<React.SetStateAction<BrandDeal[]>>;
  setTransactions?: React.Dispatch<React.SetStateAction<any[]>>;
}

const COLUMNS = [
  { id: 'lead', label: 'Leads / Pitching', color: '#9ca3af' },
  { id: 'negotiating', label: 'Negotiations', color: '#f59e0b' },
  { id: 'signed', label: 'Signed / Agreement', color: '#3b82f6' },
  { id: 'in-progress', label: 'In Progress', color: '#a855f7' },
  { id: 'published', label: 'Published', color: '#ec4899' },
  { id: 'paid', label: 'Invoice Paid', color: '#10b981' }
];

export default function BrandTracker({ brandDeals, setBrandDeals, setTransactions }: BrandTrackerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<BrandDeal | null>(null);

  // Form State
  const [brand, setBrand] = useState('');
  const [value, setValue] = useState<number>(500);
  const [deliverable, setDeliverable] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | 'twitter'>('youtube');
  const [status, setStatus] = useState<BrandDeal['status']>('lead');
  const [dueDate, setDueDate] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Reset form helper
  const resetForm = () => {
    setBrand('');
    setValue(500);
    setDeliverable('');
    setPlatform('youtube');
    setStatus('lead');
    setDueDate('');
    setContactEmail('');
    setNotes('');
  };

  // Add Deal Submit
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !deliverable) return;

    const newDeal: BrandDeal = {
      id: Date.now().toString(),
      brand,
      value,
      deliverable,
      platform,
      status,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      contactEmail,
      notes
    };

    setBrandDeals(prev => [...prev, newDeal]);

    // If deal is added as paid directly, add transaction record to finances
    if (status === 'paid' && setTransactions) {
      setTransactions(prev => [...prev, {
        id: Date.now().toString() + '-t',
        description: `Sponsor: ${brand} (${deliverable})`,
        amount: value,
        type: 'income',
        category: 'Sponsor',
        date: new Date().toISOString().split('T')[0]
      }]);
    }

    resetForm();
    setIsAddModalOpen(false);
  };

  // Edit / Update Deal Stage Helper (Kanban Quick-Move)
  const moveDealStage = (dealId: string, direction: 'forward' | 'backward') => {
    setBrandDeals(prev => prev.map(deal => {
      if (deal.id === dealId) {
        const currentIndex = COLUMNS.findIndex(col => col.id === deal.status);
        let nextIndex = currentIndex;
        
        if (direction === 'forward' && currentIndex < COLUMNS.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (direction === 'backward' && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        }

        const nextStatus = COLUMNS[nextIndex].id as BrandDeal['status'];

        // Automatically log sponsor payout transaction if stage changes to PAID
        if (nextStatus === 'paid' && deal.status !== 'paid' && setTransactions) {
          setTransactions(tPrev => [...tPrev, {
            id: Date.now().toString() + '-t',
            description: `Sponsor Payout: ${deal.brand} (${deal.deliverable})`,
            amount: deal.value,
            type: 'income',
            category: 'Sponsor',
            date: new Date().toISOString().split('T')[0]
          }]);
        }

        return { ...deal, status: nextStatus };
      }
      return deal;
    }));
  };

  // Delete Deal
  const handleDeleteDeal = (dealId: string) => {
    if (confirm('Are you sure you want to delete this brand deal?')) {
      setBrandDeals(prev => prev.filter(d => d.id !== dealId));
      setIsDetailModalOpen(false);
      setSelectedDeal(null);
    }
  };

  // Open Detail Modal
  const openDetailModal = (deal: BrandDeal) => {
    setSelectedDeal(deal);
    setIsDetailModalOpen(true);
  };

  // Calculate sum value of deals in a column stage
  const getColValueSum = (colId: string) => {
    return brandDeals
      .filter(d => d.status === colId)
      .reduce((sum, d) => sum + d.value, 0);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header controls */}
      <div style={headerStyle}>
        <div>
          <h1>Brand Deals Tracker</h1>
          <p>Track sponsorships and campaign deliverables from pitch to payout.</p>
        </div>
        
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Add Sponsorship</span>
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div style={kanbanBoardContainerStyle}>
        {COLUMNS.map(col => {
          const colDeals = brandDeals.filter(d => d.status === col.id);
          const totalVal = getColValueSum(col.id);

          return (
            <div key={col.id} style={columnContainerStyle}>
              {/* Column Title Header */}
              <div style={columnHeaderStyle(col.color)}>
                <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>{col.label}</div>
                <div style={columnCountStyle(col.color)}>{colDeals.length}</div>
              </div>
              
              {/* Column Total Value */}
              <div style={columnTotalValueStyle}>
                <span>Pipeline: </span>
                <strong>${totalVal.toLocaleString()}</strong>
              </div>

              {/* Cards wrapper */}
              <div style={cardsListWrapperStyle}>
                {colDeals.map(deal => (
                  <div key={deal.id} style={dealCardStyle(col.color)}>
                    {/* Brand Card Title */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => openDetailModal(deal)}>
                      <h4 style={brandNameTitleStyle}>{deal.brand}</h4>
                      <span className={`badge badge-${deal.platform}`} style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>{deal.platform.toUpperCase()}</span>
                    </div>

                    <div style={dealDeliverableStyle}>{deal.deliverable}</div>

                    {/* Meta section */}
                    <div style={dealMetaRowStyle}>
                      <div style={dealPriceStyle}>
                        <DollarSign size={13} />
                        <span>{deal.value.toLocaleString()}</span>
                      </div>
                      
                      <div style={dealDateStyle}>
                        <Calendar size={12} />
                        <span>{new Date(deal.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    {/* Move controls row */}
                    <div style={cardControlsRowStyle}>
                      <button 
                        onClick={() => moveDealStage(deal.id, 'backward')} 
                        disabled={col.id === 'lead'}
                        style={cardMoveBtnStyle(col.id === 'lead')}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        onClick={() => moveDealStage(deal.id, 'forward')} 
                        disabled={col.id === 'paid'}
                        style={cardMoveBtnStyle(col.id === 'paid')}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                {colDeals.length === 0 && (
                  <div style={emptyColumnPlaceholderStyle}>Empty Stage</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD SPONSORSHIP MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h3>Track New Brand Deal</h3>
              <button className="modal-close" onClick={() => { setIsAddModalOpen(false); resetForm(); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Brand / Client Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={brand} 
                  onChange={(e) => setBrand(e.target.value)} 
                  placeholder="e.g. NordVPN, Squarespace"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Contract Value ($ USD)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={value} 
                    onChange={(e) => setValue(Number(e.target.value))} 
                    min={0}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Platform Target</label>
                  <select className="select-field" value={platform} onChange={(e) => setPlatform(e.target.value as any)}>
                    <option value="youtube">YouTube</option>
                    <option value="tiktok">TikTok</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter / X</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Deliverable Description</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={deliverable} 
                  onChange={(e) => setDeliverable(e.target.value)} 
                  placeholder="e.g. 60-second integrated mid-roll spot"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Pipeline Stage</label>
                  <select className="select-field" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                    {COLUMNS.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Content Deadline Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Brand Contact Email</label>
                <input 
                  type="email" 
                  className="input-field" 
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)} 
                  placeholder="e.g. sponsorships@brand.com"
                />
              </div>

              <div className="form-group">
                <label>Deal / Campaign Details & Scope</label>
                <textarea 
                  className="textarea-field" 
                  rows={3} 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add details, script key points, discount codes, tracking links..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Start Tracking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedDeal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <h3>Campaign Details</h3>
              <button className="modal-close" onClick={() => { setIsDetailModalOpen(false); setSelectedDeal(null); }}><X size={20} /></button>
            </div>
            
            <div style={detailContainer}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.6rem', color: 'white' }}>{selectedDeal.brand}</h2>
                <span className={`badge badge-${selectedDeal.platform}`} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}>
                  {selectedDeal.platform.toUpperCase()}
                </span>
              </div>
              
              <div style={detailValueBox}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Contract Value</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#10b981' }}>${selectedDeal.value.toLocaleString()}</div>
              </div>

              <div style={infoRowsLayout}>
                <div style={infoRowStyle}>
                  <strong>Deliverable:</strong>
                  <span>{selectedDeal.deliverable}</span>
                </div>
                
                <div style={infoRowStyle}>
                  <strong>Stage:</strong>
                  <span style={{ textTransform: 'capitalize', color: '#a855f7', fontWeight: '600' }}>
                    {selectedDeal.status.replace('-', ' ')}
                  </span>
                </div>

                <div style={infoRowStyle}>
                  <strong>Deadline:</strong>
                  <span>{new Date(selectedDeal.dueDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>

                {selectedDeal.contactEmail && (
                  <div style={infoRowStyle}>
                    <strong>Contact Email:</strong>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={14} color="var(--text-muted)" />
                      <a href={`mailto:${selectedDeal.contactEmail}`} style={{ color: '#6366f1', textDecoration: 'none' }}>
                        {selectedDeal.contactEmail}
                      </a>
                    </span>
                  </div>
                )}
              </div>

              {selectedDeal.notes && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Campaign Notes:</strong>
                  <div style={notesBlockStyle}>
                    {selectedDeal.notes}
                  </div>
                </div>
              )}

              <div style={modalFooterStyle}>
                <button className="btn btn-danger" onClick={() => handleDeleteDeal(selectedDeal.id)}>
                  <Trash2 size={16} />
                  <span>Delete Sponsorship</span>
                </button>
                <button className="btn btn-secondary" onClick={() => setIsDetailModalOpen(false)}>
                  Close Details
                </button>
              </div>
            </div>
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

const kanbanBoardContainerStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '0.75rem',
  alignItems: 'start',
  overflowX: 'auto',
  paddingBottom: '1rem',
  minHeight: '65vh',
};

const columnContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(10, 15, 26, 0.45)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  padding: '0.75rem',
  gap: '0.5rem',
  minHeight: '500px',
  minWidth: '170px',
};

const columnHeaderStyle = (color: string): React.CSSProperties => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '0.5rem',
  borderBottom: `2px solid ${color}80`,
  marginBottom: '0.25rem',
});

const columnCountStyle = (color: string): React.CSSProperties => ({
  fontSize: '0.75rem',
  fontWeight: '800',
  color,
  background: `${color}15`,
  border: `1px solid ${color}33`,
  padding: '0.05rem 0.4rem',
  borderRadius: '4px',
});

const columnTotalValueStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  marginBottom: '0.5rem',
  paddingLeft: '0.25rem',
};

const cardsListWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
  flex: 1,
};

const dealCardStyle = (borderColor: string): React.CSSProperties => ({
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderLeft: `3px solid ${borderColor}`,
  borderRadius: 'var(--radius-sm)',
  padding: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  transition: 'transform var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast)',
});

const brandNameTitleStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: '700',
  color: 'var(--text-main)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100px',
};

const dealDeliverableStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  lineHeight: '1.3',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const dealMetaRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.72rem',
  color: 'var(--text-subtle)',
  marginTop: '0.25rem',
};

const dealPriceStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1px',
  color: '#10b981',
  fontWeight: '700',
};

const dealDateStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
};

const cardControlsRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '0.4rem',
  paddingTop: '0.4rem',
  borderTop: '1px solid rgba(255, 255, 255, 0.03)',
};

const cardMoveBtnStyle = (disabled: boolean): React.CSSProperties => ({
  background: 'none',
  border: 'none',
  color: disabled ? 'var(--text-subtle)' : 'var(--text-muted)',
  cursor: disabled ? 'not-allowed' : 'pointer',
  padding: '2px',
  opacity: disabled ? 0.3 : 1,
  transition: 'color var(--transition-fast)',
});

const emptyColumnPlaceholderStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem 0.5rem',
  border: '1px dashed rgba(255, 255, 255, 0.04)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.75rem',
  color: 'var(--text-subtle)',
};

const detailContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
};

const detailValueBox: React.CSSProperties = {
  background: 'rgba(16, 185, 129, 0.05)',
  border: '1px solid rgba(16, 185, 129, 0.15)',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-sm)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const infoRowsLayout: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
};

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.9rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
  paddingBottom: '0.4rem',
};

const notesBlockStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.75rem',
  fontSize: '0.85rem',
  color: '#d1d5db',
  lineHeight: '1.45',
  whiteSpace: 'pre-wrap',
};

const modalFooterStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '1rem',
  borderTop: '1px solid var(--border-color)',
  paddingTop: '1rem',
};
