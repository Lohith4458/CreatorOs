import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  User, 
  Mail, 
  Lightbulb, 
  ChevronRight,
  Code,
  MessageSquareCode
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import CommentAnalyzer from './CommentAnalyzer';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface ChatAssistantProps {
  apiKey: string;
  creatorNiche: string;
  creatorName: string;
}

const PRESET_PROMPTS = [
  { text: 'Draft a sponsor pitch email', icon: Mail },
  { text: 'Help me write an engaging hook for my next video', icon: Lightbulb },
  { text: 'Suggest 5 video ideas for my niche', icon: Sparkles },
  { text: 'What is a good negotiation response to low sponsor rates?', icon: ChevronRight }
];

export default function ChatAssistant({ apiKey, creatorNiche, creatorName }: ChatAssistantProps) {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'comments'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: `Hi ${creatorName || 'there'}! I am your CreatorOS AI Creative Coach. I'm aware of your profile context (${creatorNiche || 'General Creative'}).\n\nHow can I help you brainstorm, outline scripts, refine hooks, or review brand sponsorships today?` }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Send message
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const historyForAPI = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const contextStr = `Name: ${creatorName}, Niche: ${creatorNiche}`;
      const responseText = await geminiService.chat(historyForAPI, textToSend, contextStr, apiKey);
      
      setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'model', content: `Oops, I encountered an error: ${err.message || 'Check your Gemini key in settings.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputMessage);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      
      {/* Sub-tab Selector */}
      <div style={subTabsStyle}>
        <button onClick={() => setActiveSubTab('chat')} style={subTabButtonStyle(activeSubTab === 'chat')}>
          <Bot size={15} />
          <span>Creative Coach</span>
        </button>
        <button onClick={() => setActiveSubTab('comments')} style={subTabButtonStyle(activeSubTab === 'comments')}>
          <MessageSquareCode size={15} />
          <span>Comment Analyzer</span>
        </button>
      </div>

      {activeSubTab === 'chat' && (
        <div style={chatLayout}>
          {/* Header */}
          <div style={chatHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Bot size={24} color="#8b5cf6" style={{ filter: 'drop-shadow(0 0 6px rgba(139, 92, 246, 0.4))' }} />
              <div>
                <h2 style={{ fontSize: '1.2rem', color: 'white' }}>AI Creative Coach</h2>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Connected to Gemini 2.5 Flash</span>
              </div>
            </div>
          </div>

          {/* Chat Messages Box */}
          <div className="glass-panel" style={chatWindow}>
            <div style={messagesList}>
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  style={msg.role === 'user' ? userRowStyle : botRowStyle}
                >
                  {/* Avatar */}
                  <div style={msg.role === 'user' ? userAvatarStyle : botAvatarStyle}>
                    {msg.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                  </div>

                  {/* Bubble */}
                  <div style={msg.role === 'user' ? userBubbleStyle : botBubbleStyle}>
                    <div 
                      className="markdown-render" 
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} 
                      style={{ fontSize: '0.9rem', lineHeight: '1.5' }}
                    />
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {loading && (
                <div style={botRowStyle}>
                  <div style={botAvatarStyle}>
                    <RefreshCw size={12} className="animate-spin" />
                  </div>
                  <div style={{ ...botBubbleStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="dot-pulse" style={dotStyle(1)} />
                    <span className="dot-pulse" style={dotStyle(2)} />
                    <span className="dot-pulse" style={dotStyle(3)} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggestions Row */}
          {messages.length === 1 && (
            <div style={suggestionsContainer}>
              {PRESET_PROMPTS.map((prompt, idx) => {
                const Icon = prompt.icon;
                return (
                  <button 
                    key={idx} 
                    onClick={() => handleSendMessage(prompt.text)}
                    style={suggestionBtnStyle}
                  >
                    <Icon size={14} color="#8b5cf6" />
                    <span>{prompt.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Input Form Bar */}
          <form onSubmit={handleFormSubmit} style={inputFormStyle}>
            <input 
              type="text" 
              className="input-field"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask your Creative Coach for advice, drafts, script ideas..."
              disabled={loading}
              style={{ flex: 1, borderRadius: 'var(--radius-sm)' }}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !inputMessage.trim()}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {activeSubTab === 'comments' && (
        <CommentAnalyzer apiKey={apiKey} />
      )}

    </div>
  );
}

// Basic markdown-like regex formatter for rendering inside the web app
function renderMarkdown(md: string): string {
  if (!md) return '';
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.25rem; color:#fff; margin-top:1rem; margin-bottom:0.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 4px;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.1rem; color:#ffffff; margin-top:0.75rem; margin-bottom:0.4rem;">$1</h2>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:#ffffff;">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em style="color:#9ca3af; font-style:italic;">$1</em>')
    .replace(/`([^`]+)`/gim, '<code style="background:rgba(255,255,255,0.1); padding:2px 4px; border-radius:4px; font-family: monospace; font-size:0.8rem; color:#f43f5e;">$1</code>')
    .replace(/^\* (.*$)/gim, '<li style="margin-left: 1.25rem; list-style-type: disc; margin-bottom: 0.2rem; color: #d1d5db; font-size:0.85rem;">$1</li>')
    .replace(/^\- (.*$)/gim, '<li style="margin-left: 1.25rem; list-style-type: circle; margin-bottom: 0.2rem; color: #d1d5db; font-size:0.85rem;">$1</li>')
    .replace(/^(?!<h|<li|<ul|<ol|<div|<code)(.*$)/gim, '<p style="margin-bottom: 0.5rem; line-height: 1.45; color: #d1d5db; font-size:0.88rem;">$1</p>');
  
  return html;
}

// Inline Styles
const chatLayout: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '75vh',
  maxHeight: '600px',
  gap: '0.75rem',
};

const chatHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '0.25rem',
};

const chatWindow: React.CSSProperties = {
  flex: 1,
  padding: '1.25rem',
  background: 'rgba(7, 10, 18, 0.65)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
};

const messagesList: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  paddingRight: '6px',
};

const userRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'flex-start',
  gap: '0.75rem',
};

const botRowStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '0.75rem',
};

const userAvatarStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.08)',
  border: '1px solid var(--border-color)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  flexShrink: 0,
};

const botAvatarStyle: React.CSSProperties = {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  flexShrink: 0,
  boxShadow: '0 0 6px rgba(99,102,241,0.4)',
};

const userBubbleStyle: React.CSSProperties = {
  background: 'rgba(99, 102, 241, 0.18)',
  border: '1px solid rgba(99, 102, 241, 0.3)',
  borderRadius: '12px 2px 12px 12px',
  padding: '0.75rem 1rem',
  maxWidth: '80%',
};

const botBubbleStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.02)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '2px 12px 12px 12px',
  padding: '0.75rem 1rem',
  maxWidth: '80%',
};

const suggestionsContainer: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const suggestionBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  padding: '0.45rem 0.85rem',
  background: 'rgba(255,255,255,0.02)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.75rem',
  fontWeight: '500',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  transition: 'all var(--transition-fast)',
};

const inputFormStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};

const dotStyle = (index: number): React.CSSProperties => {
  return {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#8b5cf6',
    display: 'inline-block',
    animationDelay: `${index * 0.15}s`,
  };
};

const subTabsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  padding: '6px',
  borderRadius: 'var(--radius-md)',
  background: 'rgba(0, 0, 0, 0.25)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  alignSelf: 'flex-start',
  marginBottom: '0.5rem',
};

const subTabButtonStyle = (isActive: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.6rem 1.2rem',
  fontSize: '0.85rem',
  fontWeight: '600',
  borderRadius: '6px',
  border: '1px solid transparent',
  cursor: 'pointer',
  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'none',
  borderColor: isActive ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
  color: isActive ? '#ffffff' : 'var(--text-muted)',
  transition: 'all var(--transition-fast)',
});
