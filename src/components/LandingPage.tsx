import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  X, 
  Tv, 
  Check,
  PenTool, 
  Video, 
  Calendar, 
  Briefcase, 
  TrendingUp,
  ShieldCheck,
  Bot
} from 'lucide-react';
import './LandingPage.css';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [showDemo, setShowDemo] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [demoLogs, setDemoLogs] = useState<string[]>([]);

  // Simulation logs for the "Watch Demo" player
  const demoLogSteps = [
    "🚀 Booting CreatorOS Core...",
    "🔑 Reading Local Database...",
    "🧠 Initializing Gemini-2.5-Flash Core...",
    "📡 Establishing secure workspace link...",
    "✨ Generating CTR-optimized YouTube titles...",
    "📝 Crafting 10-minute video script outline...",
    "📅 Syncing Content Calendar (3 active videos)...",
    "💼 Fetching brand deals pipeline (₹1,50,000 active)...",
    "📈 Compiling competitor gap analysis...",
    "✅ CreatorOS fully synchronized. Ready to create!"
  ];

  // Effect to simulate demo video progression and console logs
  useEffect(() => {
    let interval: any;
    if (isPlayingDemo) {
      setDemoProgress(0);
      setDemoLogs([demoLogSteps[0]]);
      
      interval = setInterval(() => {
        setDemoProgress((prev) => {
          const next = prev + 1;
          
          // Add logs dynamically as progress goes
          const logIndex = Math.floor((next / 100) * demoLogSteps.length);
          if (logIndex < demoLogSteps.length && next % 10 === 0) {
            setDemoLogs((prevLogs) => {
              if (!prevLogs.includes(demoLogSteps[logIndex])) {
                return [...prevLogs, demoLogSteps[logIndex]];
              }
              return prevLogs;
            });
          }

          if (next >= 100) {
            clearInterval(interval);
            setIsPlayingDemo(false);
            return 100;
          }
          return next;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlayingDemo]);

  const handleStartDemo = () => {
    setIsPlayingDemo(true);
    setDemoProgress(0);
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
    setIsPlayingDemo(false);
    setDemoProgress(0);
    setDemoLogs([]);
  };

  const features = [
    {
      icon: PenTool,
      title: "Create Posts",
      desc: "Generate high-engaging, optimized captions, tweets, and descriptions tailored for YouTube, TikTok, and Instagram.",
      color: "#3b82f6"
    },
    {
      icon: Video,
      title: "Generate Scripts",
      desc: "Co-write scripts with Gemini. Brainstorm hooks, visual cues, outlines, and B-roll callouts based on video niche.",
      color: "#8b5cf6"
    },
    {
      icon: Calendar,
      title: "Schedule Content",
      desc: "Visually organize your content schedule, sponsor deadlines, and film days on a calendar interface.",
      color: "#10b981"
    },
    {
      icon: Briefcase,
      title: "Manage Brand Deals",
      desc: "Track active sponsors, manage rates, log contract statuses, and monitor pending deliverables in one clean CRM.",
      color: "#f59e0b"
    },
    {
      icon: TrendingUp,
      title: "Analyze Growth",
      desc: "Spy on niche competitors, log key statistics, and run AI Content Gap Analysis to identify untapped content topics.",
      color: "#ec4899"
    }
  ];

  return (
    <div className="landing-container">
      {/* Animated gradient blobs in the background */}
      <div className="gradient-bg">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Header/Navbar */}
      <header className="landing-header-nav">
        <div className="landing-logo">
          <Tv size={28} color="#6366f1" style={{ filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.6))' }} />
          <span className="landing-logo-text">CreatorOS</span>
        </div>
        <div>
          <button onClick={onGetStarted} className="btn-landing-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
            Enter Workspace
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        {/* Left Column: Heading, Highlights, and CTAs */}
        <div className="hero-left">
          <div className="hero-badge animate-fade-in">
            <Sparkles size={14} color="#8b5cf6" />
            <span>Next-Gen Creator Suite</span>
          </div>
          
          <h1 className="hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Your AI Operating System <br />
            <span>for Content Creators</span>
          </h1>
          
          <p className="hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Ditch the scattered spreadsheets and fragmented apps. CreatorOS consolidates script writing, social scheduling, brand deal negotiation, financial tracking, and channel analysis into a single beautiful glassmorphic home.
          </p>

          <div className="hero-highlights animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="highlight-item">
              <div className="highlight-icon-wrapper">
                <PenTool size={14} color="#a5b4fc" />
              </div>
              <span>Create Posts</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon-wrapper">
                <Video size={14} color="#a5b4fc" />
              </div>
              <span>Generate Scripts</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon-wrapper">
                <Calendar size={14} color="#a5b4fc" />
              </div>
              <span>Schedule Content</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon-wrapper">
                <Briefcase size={14} color="#a5b4fc" />
              </div>
              <span>Manage Brand</span>
            </div>
            <div className="highlight-item" style={{ gridColumn: 'span 2' }}>
              <div className="highlight-icon-wrapper">
                <TrendingUp size={14} color="#a5b4fc" />
              </div>
              <span>Analyze Growth</span>
            </div>
          </div>

          <div className="hero-cta animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <button onClick={onGetStarted} className="btn-landing-primary">
              <span>Get Started</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => setShowDemo(true)} className="btn-landing-secondary">
              <Play size={16} />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Right Column: Floating 3D Dashboard Mockup */}
        <div className="hero-right">
          <div className="mockup-scene">
            <div className="mockup-card">
              <div className="mockup-topbar">
                <div className="mockup-dots">
                  <div className="mockup-dot" style={{ backgroundColor: '#ef4444' }}></div>
                  <div className="mockup-dot" style={{ backgroundColor: '#f59e0b' }}></div>
                  <div className="mockup-dot" style={{ backgroundColor: '#10b981' }}></div>
                </div>
                <div className="mockup-line-short" style={{ opacity: 0.3 }}></div>
              </div>
              
              <div className="mockup-grid">
                {/* Sidebar Mockup Skeleton */}
                <div className="mockup-sidebar-skel">
                  <div className="mockup-line-long" style={{ background: '#6366f1', opacity: 0.4 }}></div>
                  <div className="mockup-line-short" style={{ marginTop: '5px' }}></div>
                  <div className="mockup-line-long"></div>
                  <div className="mockup-line-short"></div>
                  <div className="mockup-line-long"></div>
                  <div className="mockup-line-short"></div>
                </div>
                
                {/* Main Dashboard Mockup Skeleton */}
                <div className="mockup-main-skel">
                  <div className="mockup-illustration-container">
                    <img 
                      src="/hero_illustration.png" 
                      alt="CreatorOS UI Artwork" 
                      className="mockup-illustration"
                    />
                  </div>
                  
                  <div className="mockup-stats-skel">
                    <div className="mockup-stat-box">
                      <div className="mockup-line-short" style={{ width: '40%' }}></div>
                      <div className="mockup-line-long" style={{ background: '#10b981', opacity: 0.7 }}></div>
                    </div>
                    <div className="mockup-stat-box">
                      <div className="mockup-line-short" style={{ width: '50%' }}></div>
                      <div className="mockup-line-long" style={{ background: '#8b5cf6', opacity: 0.7 }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating widget 1: AI Prompt badge */}
            <div className="floating-badge badge-ai">
              <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '5px', borderRadius: '50%', display: 'flex' }}>
                <Bot size={16} color="#c084fc" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>AI Assistant</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Script Outlined!</span>
              </div>
            </div>

            {/* Floating widget 2: Revenue tracker badge */}
            <div className="floating-badge badge-finance">
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '5px', borderRadius: '50%', display: 'flex' }}>
                <TrendingUp size={16} color="#34d399" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Revenue Growth</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>+14.2% Monthly</span>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Features Showcase Section */}
      <section className="features-section">
        <div className="features-header">
          <h2>Unified Creator Workflow</h2>
          <p>Everything you need to streamline content production, optimize SEO metadata, and monetize sponsorships in a single dashboard.</p>
        </div>

        <div className="features-grid">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="feature-card glass-panel" onClick={onGetStarted}>
                <div className="feature-icon-box" style={{ 
                  backgroundColor: `${feat.color}15`, 
                  borderColor: `${feat.color}40` 
                }}>
                  <Icon size={22} color={feat.color} />
                </div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#8b5cf6', fontWeight: '600', marginTop: 'auto' }}>
                  <span>Launch Tool</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <Tv size={18} color="#6366f1" />
          <span style={{ fontWeight: '700', color: 'white', fontSize: '0.9rem' }}>CreatorOS</span>
        </div>
        <div>
          <span>&copy; {new Date().getFullYear()} CreatorOS. Powered by Google Gemini. Local client storage enabled.</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.75rem' }}>
            <ShieldCheck size={14} />
            <span>Secure Encryption</span>
          </div>
        </div>
      </footer>

      {/* Watch Demo Modal */}
      {showDemo && (
        <div className="demo-overlay" onClick={handleCloseDemo}>
          <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="demo-modal-header">
              <div className="demo-modal-title">CreatorOS Live System Demo</div>
              <button className="demo-modal-close" onClick={handleCloseDemo}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="demo-modal-body">
              <div className="demo-video-wrapper">
                {/* Background Artwork */}
                <img 
                  src="/hero_illustration.png" 
                  alt="System Artwork" 
                  className="demo-video-placeholder-img"
                />

                {!isPlayingDemo && demoProgress === 0 && (
                  <button onClick={handleStartDemo} className="demo-play-btn">
                    <Play size={28} color="white" style={{ marginLeft: '4px' }} />
                  </button>
                )}

                {isPlayingDemo && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    left: '20px', 
                    right: '20px', 
                    bottom: '20px',
                    backgroundColor: 'rgba(3, 5, 10, 0.9)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#60a5fa',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'left'
                  }}>
                    {/* Console Logger Simulation */}
                    <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, paddingBottom: '10px' }}>
                      {demoLogs.map((log, i) => (
                        <div key={i} className="animate-fade-in" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ color: '#c084fc' }}>&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span>Simulating System Compile...</span>
                        <span>{demoProgress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: `${demoProgress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #c084fc)', transition: 'width 0.15s ease' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {!isPlayingDemo && demoProgress === 100 && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '0', 
                    left: '0', 
                    width: '100%', 
                    height: '100%',
                    backgroundColor: 'rgba(5, 8, 16, 0.95)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Check size={26} color="#10b981" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Simulation Completed!</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
                      The local compilation is finished. Start managing your calendar, running script generators, and organizing your income streams now.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <button onClick={onGetStarted} className="btn-landing-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                        <span>Launch App</span>
                        <ArrowRight size={14} />
                      </button>
                      <button onClick={handleStartDemo} className="btn-landing-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
                        Run Again
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Demo features cards in modal */}
              <div className="demo-features-overview">
                <div className="demo-feature-bullet">
                  <h4>100% Local Storage</h4>
                  <p>Your sponsors, contracts, checklists, and calendar details remain safely inside your web browser storage.</p>
                </div>
                <div className="demo-feature-bullet">
                  <h4>Gemini AI Infused</h4>
                  <p>Write video titles, outlines, script prompts, description tags, and competitor gaps instantly.</p>
                </div>
                <div className="demo-feature-bullet">
                  <h4>Responsive Workspace</h4>
                  <p>A beautiful dashboard customized for dual desktop viewports and production schedules.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
