import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Percent, 
  Calendar,
  X,
  Target
} from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: 'AdSense' | 'Sponsor' | 'Affiliate' | 'Merch' | 'Gear' | 'Software' | 'Travel' | 'Other';
  date: string;
}

interface FinanceTrackerProps {
  finances: Transaction[];
  setFinances: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

export default function FinanceTracker({ finances, setFinances }: FinanceTrackerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<Transaction['category']>('AdSense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Calculations
  const income = finances.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = finances.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = income - expenses;
  const estimatedTax = netProfit > 0 ? netProfit * 0.25 : 0; // 25% tax estimator

  // Monthly income goal progress
  const incomeGoal = 10000;
  const goalProgressPercentage = Math.min((income / incomeGoal) * 100, 100);

  // Submit Handler
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      type,
      category,
      date
    };

    setFinances(prev => [newTransaction, ...prev]);
    setDescription('');
    setAmount(0);
    setType('income');
    setCategory('AdSense');
    setDate(new Date().toISOString().split('T')[0]);
    setIsAddModalOpen(false);
  };

  // Delete Transaction
  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      setFinances(prev => prev.filter(t => t.id !== id));
    }
  };

  // Grouped amounts for Donut chart representation (Income Categories)
  const incomeCategories = ['AdSense', 'Sponsor', 'Affiliate', 'Merch'];
  const incomeCategorySums = incomeCategories.map(cat => ({
    name: cat,
    value: finances.filter(t => t.type === 'income' && t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  }));
  const totalCategoryIncome = incomeCategorySums.reduce((sum, c) => sum + c.value, 0);

  // Filtered Ledger List
  const filteredTransactions = finances.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header controls */}
      <div style={headerStyle}>
        <div>
          <h1>Finance Tracker</h1>
          <p>Manage content revenue pipelines, business expenses, and quarterly tax reserves.</p>
        </div>
        
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="metric-grid">
        {/* Income Card */}
        <div className="glass-panel metric-card">
          <div className="metric-card-header">
            <span>Total Income</span>
            <TrendingUp size={18} color="#10b981" />
          </div>
          <div className="metric-card-value" style={{ color: '#10b981' }}>
            ₹{income.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Expenses Card */}
        <div className="glass-panel metric-card">
          <div className="metric-card-header">
            <span>Total Expenses</span>
            <TrendingDown size={18} color="#ef4444" />
          </div>
          <div className="metric-card-value" style={{ color: '#ef4444' }}>
            ₹{expenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="glass-panel metric-card">
          <div className="metric-card-header">
            <span>Net Profit</span>
            <IndianRupee size={18} color={netProfit >= 0 ? '#6366f1' : '#ef4444'} />
          </div>
          <div className="metric-card-value" style={{ color: netProfit >= 0 ? '#6366f1' : '#ef4444' }}>
            ₹{netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Tax Reserve Estimate Card */}
        <div className="glass-panel metric-card">
          <div className="metric-card-header">
            <span>Tax Reserve (25% Est.)</span>
            <Percent size={18} color="#f59e0b" />
          </div>
          <div className="metric-card-value" style={{ color: '#f59e0b' }}>
            ₹{estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Layout Split */}
      <div style={splitLayout}>
        
        {/* Left Hand: Custom SVG Charts & Goal Tracker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1.2, minWidth: '320px' }}>
          
          {/* Target Goal Progress Panel */}
          <div className="glass-panel" style={cardPanelStyle}>
            <div style={goalHeaderStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Target size={20} color="#8b5cf6" />
                <h2>Monthly Income Target</h2>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>
                ₹{income.toLocaleString()} / ₹{incomeGoal.toLocaleString()}
              </span>
            </div>
            
            <div style={progressBarBg}>
              <div style={progressBarFill(goalProgressPercentage)} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Progress: {goalProgressPercentage.toFixed(1)}%</span>
              <span>Needs ₹{(incomeGoal - income) > 0 ? (incomeGoal - income).toLocaleString() : 0} to reach target</span>
            </div>
          </div>

          {/* SVG Category Breakdown Chart */}
          <div className="glass-panel" style={cardPanelStyle}>
            <h2>Revenue Breakdown</h2>
            <div style={chartContainerStyle}>
              
              {/* Custom SVG Bar Chart */}
              <div style={barGraphContainer}>
                {incomeCategorySums.map((cat, idx) => {
                  const share = totalCategoryIncome > 0 ? (cat.value / totalCategoryIncome) * 100 : 0;
                  return (
                    <div key={idx} style={barRowStyle}>
                      <div style={barLabel}>{cat.name}</div>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <div style={barTrack}>
                          <div style={barFill(share)} />
                        </div>
                      </div>
                      <div style={barValue}>
                        <strong>₹{cat.value.toLocaleString()}</strong>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                          ({share.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
                {totalCategoryIncome === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-subtle)' }}>
                    No income logged to show breakdown charts.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Right Hand: Transaction Ledger list */}
        <div className="glass-panel" style={{ ...cardPanelStyle, flex: 1.5, minWidth: '350px' }}>
          <div style={ledgerHeaderStyle}>
            <h2>Ledger History</h2>
            <div style={filterToggleGroup}>
              {(['all', 'income', 'expense'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  style={filterToggleBtn(filterType === f)}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={ledgerListStyle}>
            {filteredTransactions.map(trans => (
              <div key={trans.id} style={ledgerRowStyle(trans.type)}>
                <div style={ledgerDetailsStyle}>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{trans.description}</div>
                  <div style={ledgerMetaRow}>
                    <span style={{ color: 'var(--text-muted)' }}>{trans.category}</span>
                    <span style={dotDivider} />
                    <span>{new Date(trans.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ ...ledgerValueStyle(trans.type), fontWeight: '700' }}>
                    {trans.type === 'income' ? '+' : '-'}₹{trans.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <button 
                    onClick={() => handleDeleteTransaction(trans.id)}
                    style={deleteBtnStyle}
                    title="Delete Transaction"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div style={noDataStyle}>
                <p>No transactions logged in this filter.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ADD TRANSACTION MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>Log Financial Transaction</h3>
              <button className="modal-close" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="e.g. AdSense June Payout, Camera Lens upgrade"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Amount (₹ INR)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    value={amount || ''} 
                    onChange={(e) => setAmount(Number(e.target.value))} 
                    placeholder="0.00"
                    min={0.01}
                    step="0.01"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Transaction Type</label>
                  <select 
                    className="select-field" 
                    value={type} 
                    onChange={(e) => {
                      const newType = e.target.value as 'income' | 'expense';
                      setType(newType);
                      setCategory(newType === 'income' ? 'AdSense' : 'Gear');
                    }}
                  >
                    <option value="income">Income (Deposit)</option>
                    <option value="expense">Expense (Withdrawal)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    className="select-field" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    {type === 'income' ? (
                      <>
                        <option value="AdSense">AdSense Revenue</option>
                        <option value="Sponsor">Brand Sponsorship</option>
                        <option value="Affiliate">Affiliate Sales</option>
                        <option value="Merch">Merch Payout</option>
                        <option value="Other">Other Revenue</option>
                      </>
                    ) : (
                      <>
                        <option value="Gear">Hardware & Equipment</option>
                        <option value="Software">Software & Subs</option>
                        <option value="Travel">Travel & Lodging</option>
                        <option value="Other">Office / Production Expense</option>
                      </>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>Transaction Date</label>
                  <input 
                    type="date" 
                    className="input-field" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Log Entry</button>
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

const goalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const progressBarBg: React.CSSProperties = {
  height: '10px',
  borderRadius: '5px',
  backgroundColor: 'rgba(255,255,255,0.05)',
  width: '100%',
  overflow: 'hidden',
  marginTop: '0.25rem',
};

const progressBarFill = (pct: number): React.CSSProperties => ({
  height: '100%',
  width: `${pct}%`,
  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(99,102,241,0.5)',
  transition: 'width 0.4s ease-out',
});

const chartContainerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  padding: '0.5rem 0',
};

const barGraphContainer: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
};

const barRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const barLabel: React.CSSProperties = {
  width: '80px',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  fontWeight: '500',
};

const barTrack: React.CSSProperties = {
  height: '14px',
  borderRadius: '7px',
  backgroundColor: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  width: '100%',
  overflow: 'hidden',
};

const barFill = (pct: number): React.CSSProperties => ({
  height: '100%',
  width: `${pct}%`,
  background: 'linear-gradient(90deg, #10b981, #34d399)',
  borderRadius: '7px',
});

const barValue: React.CSSProperties = {
  width: '120px',
  textAlign: 'right',
  fontSize: '0.85rem',
};

const ledgerHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--border-color)',
  paddingBottom: '0.75rem',
};

const filterToggleGroup: React.CSSProperties = {
  display: 'flex',
  gap: '2px',
  backgroundColor: 'rgba(0,0,0,0.15)',
  padding: '2px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-color)',
};

const filterToggleBtn = (active: boolean): React.CSSProperties => ({
  background: active ? 'rgba(99, 102, 241, 0.15)' : 'none',
  border: 'none',
  padding: '0.35rem 0.75rem',
  fontSize: '0.7rem',
  fontWeight: '600',
  borderRadius: '4px',
  color: active ? '#ffffff' : 'var(--text-muted)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
});

const ledgerListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  overflowY: 'auto',
  maxHeight: '400px',
  paddingRight: '4px',
};

const ledgerRowStyle = (type: string): React.CSSProperties => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.65rem 0.75rem',
  borderRadius: 'var(--radius-sm)',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.04)',
  borderLeft: `3px solid ${type === 'income' ? '#10b981' : '#ef4444'}`,
  transition: 'background var(--transition-fast)',
});

const ledgerDetailsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  minWidth: 0,
};

const ledgerMetaRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontSize: '0.75rem',
  color: 'var(--text-subtle)',
};

const dotDivider: React.CSSProperties = {
  width: '3px',
  height: '3px',
  borderRadius: '50%',
  backgroundColor: 'var(--text-subtle)',
};

const ledgerValueStyle = (type: string): React.CSSProperties => ({
  fontSize: '0.92rem',
  color: type === 'income' ? '#10b981' : '#f87171',
});

const deleteBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-subtle)',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  transition: 'all var(--transition-fast)',
};

const noDataStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2.5rem',
  color: 'var(--text-subtle)',
  fontSize: '0.88rem',
};
