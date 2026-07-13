import React, { useState, useEffect } from 'react';
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
  Tv,
  Lock,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';

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
  user?: any;
  onLogout?: () => void;
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
  setActiveTab,
  user,
  onLogout
}: SettingsPanelProps) {
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  // Form states
  const [formName, setFormName] = useState(creatorName);
  const [formNiche, setFormNiche] = useState(creatorNiche);
  const [formKey, setFormKey] = useState(apiKey);
  
  // Profile picture state
  const [profileImage, setProfileImage] = useState<string>(user?.profileImage || '');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sync state with parent props if they change
  useEffect(() => {
    setFormName(creatorName);
    setFormNiche(creatorNiche);
    setFormKey(apiKey);
  }, [creatorName, creatorNiche, apiKey]);

  useEffect(() => {
    if (user?.profileImage) {
      setProfileImage(user.profileImage);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);

    try {
      if (user) {
        // Authenticated fullstack update
        const updated = await api.updateProfile({
          name: formName,
          niche: formNiche,
          apiKey: formKey
        });
        
        // Update local React states
        setCreatorName(updated.name);
        if (updated.niche) setCreatorNiche(updated.niche);
        if (updated.apiKey) setApiKey(updated.apiKey);
      } else {
        // Local-only fallback
        setCreatorName(formName);
        setCreatorNiche(formNiche);
        setApiKey(formKey);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile settings.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploading(true);
    setUploadError(null);

    try {
      if (user) {
        const response = await api.uploadProfileImage(file);
        setProfileImage(response.profileImage);
        // Triggers re-fetch/sync in App.tsx by updating user reference if parent holds it,
        // or just display locally since state updates immediately
        if (user) {
          user.profileImage = response.profileImage;
        }
      } else {
        // Local-only mock using FileReader base64
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setProfileImage(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    try {
      await api.changePassword({ oldPassword, newPassword });
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
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
      setProfileImage('');
      alert('Workspace reset successful.');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('🚨 CRITICAL WARNING: This will permanently DELETE your profile account, API keys, and all related server credentials. This action CANNOT be undone. Do you wish to proceed?')) {
      try {
        await api.deleteAccount();
        alert('Account deleted successfully.');
        if (onLogout) {
          onLogout();
        } else {
          setActiveTab('landing');
        }
      } catch (err: any) {
        alert(err.message || 'Failed to delete account.');
      }
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
          
          {/* Profile Picture Upload Section */}
          <div style={avatarUploadContainerStyle}>
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile Avatar" 
                style={uploadAvatarStyle} 
              />
            ) : (
              <div style={uploadAvatarFallbackStyle}>
                {formName ? formName.charAt(0).toUpperCase() : 'C'}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white' }}>Profile Picture</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginBottom: '4px' }}>
                Supports PNG, JPG (Max 5MB). Direct Cloudinary synchronization.
              </span>
              <label className="btn btn-secondary" style={uploadLabelStyle}>
                <Upload size={13} />
                <span>{uploading ? 'Uploading picture...' : 'Choose image'}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                  disabled={uploading} 
                />
              </label>
              {uploadError && <span style={{ fontSize: '0.72rem', color: '#f87171' }}>{uploadError}</span>}
            </div>
          </div>

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
                Your API key is saved {user ? 'securely in the cloud database' : 'locally in your browser cache'} and is never exposed.
              </span>
            </div>

            {/* Save Profile Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                {saveSuccess ? <Check size={16} /> : null}
                <span>{saveSuccess ? 'Changes saved successfully!' : 'Save Profile & Keys'}</span>
              </button>
              {saveError && <span style={{ fontSize: '0.75rem', color: '#f87171', textAlign: 'center' }}>{saveError}</span>}
            </div>

          </form>
        </div>

        {/* Right Side: Backups & Security & Danger Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minWidth: '300px' }}>
          
          {/* Security Panel (Change Password) - Only if logged in */}
          {user && (
            <div className="glass-panel" style={cardPanel}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={18} color="#8b5cf6" />
                <h2>Security & Password</h2>
              </div>
              
              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '0.2rem' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Current Password</label>
                  <input
                    type="password"
                    className="input-field"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>New Password</label>
                  <input
                    type="password"
                    className="input-field"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-secondary" 
                  disabled={passwordLoading}
                  style={{ justifyContent: 'center', marginTop: '0.4rem' }}
                >
                  {passwordSuccess ? <Check size={14} /> : null}
                  <span>{passwordSuccess ? 'Password Updated!' : passwordLoading ? 'Updating...' : 'Change Password'}</span>
                </button>
                {passwordError && <span style={{ fontSize: '0.72rem', color: '#f87171', textAlign: 'center' }}>{passwordError}</span>}
              </form>
            </div>
          )}

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
              Permanently wipe all local workspace details from browser cache, or completely delete your authenticated cloud profile account.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                className="btn btn-danger-outline" 
                onClick={handleResetData}
                style={{ 
                  justifyContent: 'center', 
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '0.6rem 1rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Trash2 size={15} />
                <span>Clear Local Cache Database</span>
              </button>
              
              {user && (
                <button 
                  className="btn btn-danger" 
                  onClick={handleDeleteAccount}
                  style={{ justifyContent: 'center' }}
                >
                  <AlertCircle size={15} />
                  <span>Delete Profile Account</span>
                </button>
              )}
            </div>
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

const avatarUploadContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.25rem',
  padding: '1rem',
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  marginBottom: '0.5rem'
};

const uploadAvatarStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '2px solid #6366f1',
  boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
};

const uploadAvatarFallbackStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  fontSize: '1.4rem',
  color: 'white',
  boxShadow: '0 0 10px rgba(99, 102, 241, 0.3)'
};

const uploadLabelStyle: React.CSSProperties = {
  padding: '0.4rem 0.8rem',
  fontSize: '0.75rem',
  cursor: 'pointer',
  margin: 0,
  alignSelf: 'flex-start',
  display: 'flex',
  alignItems: 'center',
  gap: '4px'
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
