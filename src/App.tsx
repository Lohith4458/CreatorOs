import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CalendarApp from './components/CalendarApp';
import AISuite from './components/AISuite';
import BrandTracker from './components/BrandTracker';
import FinanceTracker from './components/FinanceTracker';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import CompetitorTracker from './components/CompetitorTracker';
import AssetManager from './components/AssetManager';
import CommentAnalyzer from './components/CommentAnalyzer';
import ChatAssistant from './components/ChatAssistant';
import TaskManager from './components/TaskManager';
import SettingsPanel from './components/SettingsPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import LandingPage from './components/LandingPage';
import TeamManager from './components/TeamManager';
import AuthModal from './components/AuthModal';
import { api } from './services/api';
import type { UserProfile } from './services/api';

// ----------------------------------------------------
// Default Starter Data (For Instant User Wow Factor)
// ----------------------------------------------------

const DEFAULT_EVENTS = [
  {
    id: 'e1',
    title: 'Ultimate 2026 Desk Setup Tour',
    platform: 'youtube',
    date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0], // 2 days from now
    time: '18:00',
    status: 'editing',
    notes: 'Include NordVPN sponsor spot. Show detailed cable management hacks.'
  },
  {
    id: 'e2',
    title: 'Day in the Life of a Creator (Vlog)',
    platform: 'linkedin',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0], // yesterday
    time: '12:00',
    status: 'published',
    notes: 'Short fast-paced transition edits.'
  },
  {
    id: 'e3',
    title: '5 Desk Accessories I Can’t Live Without',
    platform: 'instagram',
    date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], // 5 days from now
    time: '15:00',
    status: 'scripting',
    notes: 'Reel style overview. Link each asset in bio.'
  }
];

const DEFAULT_DEALS = [
  {
    id: 'd1',
    brand: 'NordVPN',
    value: 2500,
    deliverable: '60s integrated mid-roll spot',
    platform: 'youtube',
    status: 'in-progress',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
    contactEmail: 'sponsorships@nordvpn.com',
    notes: 'Key talking points: 30-day money-back guarantee, special creator link.'
  },
  {
    id: 'd2',
    brand: 'Squarespace',
    value: 1800,
    deliverable: '1x Instagram Reel placement',
    platform: 'instagram',
    status: 'signed',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
    contactEmail: 'sponsors@squarespace.com',
    notes: 'Provide website creation tutorial in reel.'
  },
  {
    id: 'd3',
    brand: 'Logitech G',
    value: 1200,
    deliverable: '1x TikTok product showcase',
    platform: 'tiktok',
    status: 'lead',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split('T')[0],
    contactEmail: 'collabs@logitech.com',
    notes: 'Pitch new keyboard and mouse line.'
  }
];

const DEFAULT_FINANCES = [
  {
    id: 'f1',
    description: 'YouTube AdSense Payout (June)',
    amount: 3420.50,
    type: 'income',
    category: 'AdSense',
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().split('T')[0]
  },
  {
    id: 'f2',
    description: 'NordVPN Campaign #4 Payout',
    amount: 2500.00,
    type: 'income',
    category: 'Sponsor',
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0]
  },
  {
    id: 'f3',
    description: 'Shure SM7B Mic Upgrade',
    amount: 399.00,
    type: 'expense',
    category: 'Gear',
    date: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString().split('T')[0]
  },
  {
    id: 'f4',
    description: 'Adobe Creative Cloud Subscription',
    amount: 54.99,
    type: 'expense',
    category: 'Software',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0]
  }
];

const DEFAULT_TASKS = [
  {
    id: 't1',
    title: 'Record voiceover for Desk Setup Video',
    priority: 'high',
    status: 'todo',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
  },
  {
    id: 't2',
    title: 'Edit NordVPN sponsor integration',
    priority: 'high',
    status: 'in-progress',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
  },
  {
    id: 't3',
    title: 'Design thumbnail concepts for Desk Setup',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0]
  },
  {
    id: 't4',
    title: 'Respond to Logitech sponsor pitch email',
    priority: 'low',
    status: 'todo',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString().split('T')[0]
  }
];

const DEFAULT_ASSETS = [
  {
    id: 'a1',
    name: 'Main Brand Watermark SVG Logo',
    category: 'graphics',
    url: 'https://drive.google.com/file/d/example-logo',
    sizeOrDetails: 'Vector Graphic',
    dateAdded: '2026-06-01'
  },
  {
    id: 'a2',
    name: 'Upbeat Aesthetic Lo-Fi Background',
    category: 'music',
    url: 'https://drive.google.com/file/d/example-music',
    sizeOrDetails: '4.2 MB MP3',
    dateAdded: '2026-06-15'
  },
  {
    id: 'a3',
    name: 'B-roll: Keyboard Typing close-up (4k)',
    category: 'b-roll',
    url: 'https://drive.google.com/file/d/example-video',
    sizeOrDetails: '145 MB MP4',
    dateAdded: '2026-06-20'
  }
];

const DEFAULT_COMPETITORS = [
  {
    id: 'c1',
    name: 'Ali Abdaal',
    subscribers: '5.2M',
    focusArea: 'Productivity & Growth',
    lastVideoTitle: 'How to build a ₹1,00,000/month side hustle',
    lastVideoViews: '450K',
    channelUrl: 'https://youtube.com/c/aliabdaal'
  },
  {
    id: 'c2',
    name: 'Matthew Encina',
    subscribers: '950K',
    focusArea: 'Desk Setups & Studio DIY',
    lastVideoTitle: 'Wiping my desk setup clean: The rebuild',
    lastVideoViews: '210K',
    channelUrl: 'https://youtube.com/c/matthewencina'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  
  // Cross-App selected item redirect state
  const [selectedEventForAI, setSelectedEventForAI] = useState<any | null>(null);

  // Authentication & Profile states
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('creatoros_token'));
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const handleLogout = () => {
    localStorage.removeItem('creatoros_token');
    setToken(null);
    setUser(null);
    setActiveTab('landing');
  };

  // Sync user profile from backend when token is present
  useEffect(() => {
    if (token) {
      api.getProfile()
        .then((profile) => {
          setUser(profile);
          setCreatorName(profile.name);
          if (profile.niche) setCreatorNiche(profile.niche);
          if (profile.apiKey) setApiKey(profile.apiKey);
        })
        .catch((err) => {
          console.error('Session expired or invalid token:', err);
          handleLogout();
        });
    } else {
      setUser(null);
    }
  }, [token]);

  const handleAuthSuccess = (newToken: string, authenticatedUser: UserProfile) => {
    localStorage.setItem('creatoros_token', newToken);
    setToken(newToken);
    setUser(authenticatedUser);
    setCreatorName(authenticatedUser.name);
    if (authenticatedUser.niche) setCreatorNiche(authenticatedUser.niche);
    if (authenticatedUser.apiKey) setApiKey(authenticatedUser.apiKey);
    setShowAuthModal(false);
    setActiveTab('dashboard');
  };

  // Local Storage States
  const [apiKey, setApiKey] = useLocalStorage<string>('creatoros_api_key', '');
  const [creatorName, setCreatorName] = useLocalStorage<string>('creatoros_name', 'Abdul');
  const [creatorNiche, setCreatorNiche] = useLocalStorage<string>('creatoros_niche', 'Tech & Productivity');
  
  const [events, setEvents] = useLocalStorage<any[]>('creatoros_events', DEFAULT_EVENTS);
  const [brandDeals, setBrandDeals] = useLocalStorage<any[]>('creatoros_brand_deals', DEFAULT_DEALS);
  const [finances, setFinances] = useLocalStorage<any[]>('creatoros_finances', DEFAULT_FINANCES);
  const [tasks, setTasks] = useLocalStorage<any[]>('creatoros_tasks', DEFAULT_TASKS);
  const [assets, setAssets] = useLocalStorage<any[]>('creatoros_assets', DEFAULT_ASSETS);
  const [competitors, setCompetitors] = useLocalStorage<any[]>('creatoros_competitors', DEFAULT_COMPETITORS);

  // Clear workspace data helper
  const handleClearWorkspace = () => {
    window.localStorage.removeItem('creatoros_api_key');
    window.localStorage.removeItem('creatoros_name');
    window.localStorage.removeItem('creatoros_niche');
    window.localStorage.removeItem('creatoros_events');
    window.localStorage.removeItem('creatoros_brand_deals');
    window.localStorage.removeItem('creatoros_finances');
    window.localStorage.removeItem('creatoros_tasks');
    window.localStorage.removeItem('creatoros_assets');
    window.localStorage.removeItem('creatoros_competitors');

    setApiKey('');
    setCreatorName('Creator Pro');
    setCreatorNiche('Tech & Productivity');
    setEvents(DEFAULT_EVENTS);
    setBrandDeals(DEFAULT_DEALS);
    setFinances(DEFAULT_FINANCES);
    setTasks(DEFAULT_TASKS);
    setAssets(DEFAULT_ASSETS);
    setCompetitors(DEFAULT_COMPETITORS);
  };

  // Export JSON Backup
  const handleExportBackup = (): string => {
    const backupObj = {
      version: '1.0.0',
      settings: { apiKey, creatorName, creatorNiche },
      events,
      brandDeals,
      finances,
      tasks,
      assets,
      competitors
    };
    return JSON.stringify(backupObj, null, 2);
  };

  // Import JSON Backup
  const handleImportBackup = (jsonData: string): boolean => {
    try {
      const dataObj = JSON.parse(jsonData);
      
      if (dataObj.settings) {
        if (dataObj.settings.apiKey !== undefined) setApiKey(dataObj.settings.apiKey);
        if (dataObj.settings.creatorName !== undefined) setCreatorName(dataObj.settings.creatorName);
        if (dataObj.settings.creatorNiche !== undefined) setCreatorNiche(dataObj.settings.creatorNiche);
      }
      if (dataObj.events) setEvents(dataObj.events);
      if (dataObj.brandDeals) setBrandDeals(dataObj.brandDeals);
      if (dataObj.finances) setFinances(dataObj.finances);
      if (dataObj.tasks) setTasks(dataObj.tasks);
      if (dataObj.assets) setAssets(dataObj.assets);
      if (dataObj.competitors) setCompetitors(dataObj.competitors);
      
      return true;
    } catch (e) {
      console.error('Backup import error:', e);
      return false;
    }
  };

  return (
    <div className="app-container">
      
      {/* Sidebar Navigation */}
      {activeTab !== 'landing' && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          creatorName={creatorName}
          creatorNiche={creatorNiche}
          profileImage={user?.profileImage || ''}
          onLogout={handleLogout}
        />
      )}

      {/* Main Panel Viewport */}
      <div className={activeTab === 'landing' ? "landing-viewport" : "main-content"}>
        <div className={activeTab === 'landing' ? "landing-body" : "content-body"}>
          {activeTab === 'landing' && (
            <LandingPage 
              onGetStarted={() => {
                if (token) {
                  setActiveTab('dashboard');
                } else {
                  setShowAuthModal(true);
                }
              }}
            />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard 
              events={events}
              brandDeals={brandDeals}
              finances={finances}
              tasks={tasks}
              setActiveTab={setActiveTab}
              creatorName={creatorName}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarApp 
              events={events}
              setEvents={setEvents}
              setActiveTab={setActiveTab}
              setSelectedEventForAI={setSelectedEventForAI}
            />
          )}

          {activeTab === 'content-generator' && (
            <AISuite 
              apiKey={apiKey}
              selectedEventForAI={selectedEventForAI}
              setSelectedEventForAI={setSelectedEventForAI}
              setActiveTab={setActiveTab}
              creatorNiche={creatorNiche}
            />
          )}

          {activeTab === 'brand-kit' && (
            <BrandTracker 
              brandDeals={brandDeals}
              setBrandDeals={setBrandDeals}
              setTransactions={setFinances}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard 
              finances={finances}
              setFinances={setFinances}
              competitors={competitors}
              setCompetitors={setCompetitors}
              apiKey={apiKey}
            />
          )}

          {activeTab === 'media-library' && (
            <AssetManager 
              assets={assets}
              setAssets={setAssets}
            />
          )}

          {activeTab === 'ai-studio' && (
            <ChatAssistant 
              apiKey={apiKey}
              creatorNiche={creatorNiche}
              creatorName={creatorName}
            />
          )}

          {activeTab === 'team' && (
            <TeamManager 
              tasks={tasks}
              setTasks={setTasks}
              creatorName={creatorName}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel 
              apiKey={apiKey}
              setApiKey={setApiKey}
              creatorName={creatorName}
              setCreatorName={setCreatorName}
              creatorNiche={creatorNiche}
              setCreatorNiche={setCreatorNiche}
              onClearData={handleClearWorkspace}
              onImportData={handleImportBackup}
              onExportData={handleExportBackup}
              setActiveTab={setActiveTab}
              user={user}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>

      {showAuthModal && (
        <AuthModal 
          onSuccess={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}

    </div>
  );
}
