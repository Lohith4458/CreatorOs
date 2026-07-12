import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  User, 
  Trash2, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  Check, 
  HelpCircle,
  Tv
} from 'lucide-react';

interface SettingsPanelProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  creatorName: string;
  setCreatorName: (name: string) => void;
  creatorNiche: string;
  setCreatorNiche: (niche: string) => void;
  onClearData: () => void;
  onImportData: (jsonData: string) => boolean;
  onExportData: () => string;
  setActiveTab: (tab: string) => void;
}

export default function SettingsPanel({
  apiKey,
  setApiKey,
  creatorName,
  setCreatorName,
  creatorNiche,
  setCreatorNiche,
  onClearData,
  onImportData,
  onExportData,
  setActiveTab
}: SettingsPanelProps) {
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  // Form states
  const [formName, setFormName] = useState(creatorName);
  const [formNiche, setFormNiche] = useState(creatorNiche);
  const [formKey, setFormKey] = useState(apiKey);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCreatorName(formName);
    setCreatorNiche(formNiche);
    setApiKey(formKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExport = () => {
    const dataStr = onExportData();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `creatoros_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    setImportError(null);
    setImportSuccess(false);

    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = event.target?.result as string;
          const ok = onImportData(parsed);
          if (ok) {
            setImportSuccess(true);
            // Refresh form fields
            const dataObj = JSON.parse(parsed);
            if (dataObj.settings) {
              setFormName(dataObj.settings.creatorName || '');
              setFormNiche(dataObj.settings.creatorNiche || '');
              setFormKey(dataObj.settings.apiKey || '');
            }
            setTimeout(() => setImportSuccess(false), 2000);
          } else {
            setImportError('Invalid backup file schema.');
          }
        } catch (err) {
          setImportError('Failed to parse JSON file.');
        }
      };
    }
  };

  const handleResetData = () => {
    if (confirm('WARNING: This will permanently delete all content items, transactions, tasks, assets, and reset settings back to default. Do you want to proceed?')) {
      onClearData();
      setFormName('Creator Pro');
      setFormNiche('Tech & Productivity');
      setFormKey('');
      alert('Workspace reset successful.');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Settings size={24} color="#6366f1" />
          <h1>Settings & Configurations</h1>
        </div>
        <button 
          onClick={() => setActiveTab('landing')}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Tv size={15} color="#8b5cf6" />
          <span>View Landing Page</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div style={splitLayout}>
        
        {/* Left Side: API Key & Profile Form */}
        <div className="glass-panel" style={{ ...cardPanel, flex: 1.5, minWidth: '320px' }}>
          <h2>Creator Configuration</h2>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '0.5rem' }}>
            
            {/* User Profile */}
            <div className="form-group">
              <label style={labelRowStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> Creator Name / Channel Name</span>
              </label>
              <input
                type="text"
                className="input-field"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Marques Brownlee"
                required
              />
            </div>

            {/* Niche / Topic */}
            <div className="form-group">
              <label>Channel Niche / Prime Category</label>
              <input
                type="text"
                className="input-field"
                value={formNiche}
                onChange={(e) => setFormNiche(e.target.value)}
                placeholder="e.g. Tech Reviews & Lifestyle Productivity"
                required
              />
            </div>

            {/* Gemini API Key */}
            <div className="form-group">
              <label style={labelRowStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Key size={14} /> Gemini API Key</span>
                <a 
                  href="https://aistudio.google.com/" 
                  target="_blank" 
                  rel="noreferrer" 
                  style={helpLink}
                >
                  <span>Get Gemini API Key</span>
                  <HelpCircle size={12} />
                </a>
              </label>
              
              <div style={keyInputContainer}>
                <input
                  type={showKey ? 'text' : 'password'}
                  className="input-field"
                  value={formKey}
                  onChange={(e) => setFormKey(e.target.value)}
                  placeholder="Enter AI Studio API Key..."
                  style={{ flex: 1, paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  style={toggleShowKeyBtn}
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                Your API key is saved locally in your browser cache and is never sent to any external server other than Google's secure AI API.
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                {saveSuccess ? <Check size={16} /> : null}
                <span>{saveSuccess ? 'Saved successfully!' : 'Save Profile & Keys'}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Side: Backups & Danger Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minWidth: '300px' }}>
          
          {/* Backups Panel */}
          <div className="glass-panel" style={cardPanel}>
            <h2>Workspace Backup</h2>
            <p style={descriptionText}>
              Export all local schedules, sponsor boards, finances log and asset links to a portable JSON backup file.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={handleExport} style={{ justifyContent: 'center' }}>
                <Download size={15} />
                <span>Export JSON Backup</span>
              </button>
              
              <div style={uploadContainerStyle}>
                <input
                  type="file"
                  id="import-file"
                  accept=".json"
                  onChange={handleImportFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="import-file" className="btn btn-secondary" style={{ justifyContent: 'center', cursor: 'pointer', margin: 0 }}>
                  <Upload size={15} />
                  <span>Import JSON Backup</span>
                </label>
              </div>
              
              {importSuccess && (
                <div style={successMessage}>Backup data imported successfully!</div>
              )}
              {importError && (
                <div style={errorMessage}>{importError}</div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-panel" style={{ ...cardPanel, border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <h2 style={{ color: 'var(--color-danger)' }}>Danger Zone</h2>
            <p style={descriptionText}>
              Permanently wipe all workspace tables (Calendar, sponsor deals, asset files, and local logs) from browser cache storage.
            </p>
            
            <button 
              className="btn btn-danger" 
              onClick={handleResetData}
              style={{ justifyContent: 'center', marginTop: '0.5rem' }}
            >
              <Trash2 size={15} />
              <span>Clear Workspace Database</span>
            </button>
          </div>

        </div>

      </div>

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

const cardPanel: React.CSSProperties = {
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const labelRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
};

const helpLink: React.CSSProperties = {
  fontSize: '0.72rem',
  color: '#6366f1',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
};

const keyInputContainer: React.CSSProperties = {
  display: 'flex',
  position: 'relative',
  alignItems: 'stretch',
};

const toggleShowKeyBtn: React.CSSProperties = {
  position: 'absolute',
  right: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'none',
  border: 'none',
  color: 'var(--text-subtle)',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const descriptionText: React.CSSProperties = {
  fontSize: '0.82rem',
  color: 'var(--text-muted)',
  lineHeight: '1.4',
};

const uploadContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const successMessage: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#10b981',
  fontWeight: '600',
  textAlign: 'center',
};

const errorMessage: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#ef4444',
  fontWeight: '600',
  textAlign: 'center',
};
