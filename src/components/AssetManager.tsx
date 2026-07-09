import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  Folder, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  X,
  FileVideo,
  Music,
  Volume2,
  Image as ImageIcon,
  Type
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  category: 'b-roll' | 'music' | 'sfx' | 'graphics' | 'fonts';
  url: string;
  sizeOrDetails: string;
  dateAdded: string;
}

interface AssetManagerProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
}

export default function AssetManager({ assets, setAssets }: AssetManagerProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Asset['category']>('b-roll');
  const [url, setUrl] = useState('');
  const [sizeOrDetails, setSizeOrDetails] = useState('');

  // Reset form helper
  const resetForm = () => {
    setName('');
    setCategory('b-roll');
    setUrl('');
    setSizeOrDetails('');
  };

  // Add Asset
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url) return;

    const newAsset: Asset = {
      id: Date.now().toString(),
      name,
      category,
      url,
      sizeOrDetails: sizeOrDetails || 'External Link',
      dateAdded: new Date().toISOString().split('T')[0]
    };

    setAssets(prev => [newAsset, ...prev]);
    resetForm();
    setIsAddModalOpen(false);
  };

  // Delete Asset
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asset record?')) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  // Copy Link Helper
  const handleCopyLink = (assetId: string, assetUrl: string) => {
    navigator.clipboard.writeText(assetUrl);
    setCopiedId(assetId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filters and search logic
  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategoryFilter === 'all' || asset.category === selectedCategoryFilter;
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.sizeOrDetails.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Category Icon helper
  const renderCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'b-roll': return <FileVideo size={20} color="#3b82f6" />;
      case 'music': return <Music size={20} color="#10b981" />;
      case 'sfx': return <Volume2 size={20} color="#f59e0b" />;
      case 'graphics': return <ImageIcon size={20} color="#ec4899" />;
      case 'fonts': return <Type size={20} color="#a855f7" />;
      default: return <Folder size={20} />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header controls */}
      <div style={headerStyle}>
        <div>
          <h1>Asset Library</h1>
          <p>Organize digital content assets, branding packages, raw b-roll, and music links.</p>
        </div>
        
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Search & Category Filter Folder Row */}
      <div style={filterAndSearchRowStyle}>
        {/* Search bar */}
        <div style={searchContainer}>
          <Search size={18} color="var(--text-subtle)" style={{ marginLeft: '0.75rem' }} />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
        </div>

        {/* Folders buttons */}
        <div style={foldersRow}>
          {['all', 'b-roll', 'music', 'sfx', 'graphics', 'fonts'].map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedCategoryFilter(folder)}
              style={folderBtnStyle(selectedCategoryFilter === folder)}
            >
              <Folder size={15} color={selectedCategoryFilter === folder ? '#ffffff' : 'var(--text-muted)'} />
              <span style={{ textTransform: 'capitalize' }}>
                {folder === 'sfx' ? 'Sound FX' : folder.replace('-', ' ')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Assets Cards */}
      <div style={assetsGridStyle}>
        {filteredAssets.map(asset => (
          <div key={asset.id} className="glass-panel" style={assetCardStyle}>
            <div style={cardTop}>
              <div style={iconBox}>{renderCategoryIcon(asset.category)}</div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button 
                  onClick={() => handleCopyLink(asset.id, asset.url)} 
                  style={cardActionBtn}
                  title="Copy Asset URL"
                >
                  {copiedId === asset.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
                <button 
                  onClick={() => handleDelete(asset.id)} 
                  style={cardActionBtn}
                  title="Delete Asset"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={assetNameStyle} title={asset.name}>{asset.name}</h3>
              <span style={assetDetailsStyle}>{asset.sizeOrDetails}</span>
            </div>

            <div style={cardFooter}>
              <a 
                href={asset.url} 
                target="_blank" 
                rel="noreferrer"
                style={assetLinkStyle}
              >
                <LinkIcon size={12} />
                <span>Access Source</span>
              </a>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                Added: {asset.dateAdded}
              </span>
            </div>
          </div>
        ))}

        {filteredAssets.length === 0 && (
          <div className="glass-panel" style={emptyPlaceholderStyle}>
            <p>No assets found in this folder or search query.</p>
          </div>
        )}
      </div>

      {/* ADD ASSET MODAL */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>Register Digital Asset</h3>
              <button className="modal-close" onClick={() => { setIsAddModalOpen(false); resetForm(); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="form-group">
                <label>Asset Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. Cyberpunk Transition SFX, Logo Vector Logo"
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Asset Folder</label>
                  <select className="select-field" value={category} onChange={(e) => setCategory(e.target.value as any)}>
                    <option value="b-roll">B-roll Video</option>
                    <option value="music">Background Music</option>
                    <option value="sfx">Sound Effects (SFX)</option>
                    <option value="graphics">Graphics / Overlays</option>
                    <option value="fonts">Fonts & Typography</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Details / File Size</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    value={sizeOrDetails} 
                    onChange={(e) => setSizeOrDetails(e.target.value)} 
                    placeholder="e.g. 24.5 MB, Drive Link"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Asset Source URL (Cloud Drive / Download Link)</label>
                <input 
                  type="url" 
                  className="input-field" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="e.g. https://drive.google.com/..."
                  required 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => { setIsAddModalOpen(false); resetForm(); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Catalog Asset</button>
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

const filterAndSearchRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
};

const searchContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'var(--bg-input)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  width: '300px',
  maxWidth: '100%',
};

const searchInputStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '0.65rem 0.75rem',
  color: 'var(--text-main)',
  fontSize: '0.88rem',
  width: '100%',
};

const foldersRow: React.CSSProperties = {
  display: 'flex',
  gap: '0.35rem',
  flexWrap: 'wrap',
};

const folderBtnStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.5rem 1rem',
  borderRadius: 'var(--radius-sm)',
  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
  border: '1px solid',
  borderColor: isActive ? 'var(--color-primary)' : 'var(--border-color)',
  color: isActive ? '#ffffff' : 'var(--text-muted)',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '0.78rem',
  transition: 'all var(--transition-fast)',
});

const assetsGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '1.25rem',
};

const assetCardStyle: React.CSSProperties = {
  padding: '1rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  minHeight: '145px',
};

const cardTop: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const iconBox: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'rgba(255,255,255,0.02)',
  border: '1px solid rgba(255,255,255,0.05)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const cardActionBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--text-subtle)',
  cursor: 'pointer',
  padding: '4px',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'color var(--transition-fast)',
};

const assetNameStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: '600',
  color: '#ffffff',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginBottom: '2px',
};

const assetDetailsStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
};

const cardFooter: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderTop: '1px solid rgba(255,255,255,0.03)',
  paddingTop: '0.6rem',
  marginTop: '0.25rem',
};

const assetLinkStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '3px',
  fontSize: '0.75rem',
  color: '#6366f1',
  textDecoration: 'none',
  fontWeight: '600',
};

const emptyPlaceholderStyle: React.CSSProperties = {
  gridColumn: '1 / -1',
  padding: '4rem 1rem',
  textAlign: 'center',
  color: 'var(--text-subtle)',
  fontSize: '0.9rem',
};
