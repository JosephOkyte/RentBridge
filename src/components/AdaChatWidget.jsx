'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  RotateCcw,
  Maximize2,
  Minimize2,
  ArrowRight,
  ExternalLink,
  Home,
  Loader2
} from 'lucide-react';
import { WHATSAPP_DIRECT_URL, WhatsAppIcon } from '../utils/whatsapp';

const N8N_DIRECT_CHAT_URL = process.env.NEXT_PUBLIC_N8N_ADA_DIRECT_URL || 'https://prime-tech-hub.duckdns.org/webhook/d3f23217-8418-4818-8f4f-78b5e96eccf1/chat';

const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome',
    role: 'ada',
    content: "Hi, My name is Ada, the AI assistant. Welcome to RentBridge! How may I assist you today?",
    properties: [],
  },
];

const QUICK_PILLS = [
  { label: '🏠 1. Residential', prompt: 'I am looking for residential apartments to rent in Lagos, Abuja, or Port Harcourt' },
  { label: '🏢 2. Commercial', prompt: 'I need a commercial office or shop space' },
  { label: '🔨 3. Wanted Board', prompt: 'Tell me about the Wanted Seeker Matchboard and how to post a housing request' },
  { label: '🎟️ 4. Free Pass', prompt: 'How does the free physical inspection and official gate pass code work on RentBridge?' },
  { label: '💬 WhatsApp Concierge', isWhatsApp: true },
];

function renderFormattedText(content) {
  if (!content) return null;
  const lines = content.split('\n');
  return lines.map((line, lineIdx) => {
    if (!line.trim()) {
      return <div key={lineIdx} className="h-1.5" />;
    }

    const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let keyCounter = 0;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      if (match[2] && match[3]) {
        parts.push(
          <a
            key={`l-${lineIdx}-${keyCounter++}`}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#15803D] font-bold underline hover:text-[#166534] transition-colors">
            {match[2]}
          </a>
        );
      } else if (match[4]) {
        parts.push(
          <strong key={`b-${lineIdx}-${keyCounter++}`} className="font-semibold text-[#163324]">
            {match[4]}
          </strong>
        );
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return (
      <p key={lineIdx} className="leading-relaxed">
        {parts}
      </p>
    );
  });
}

export default function AdaChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('tenant');
  const [hasUnread, setHasUnread] = useState(true);
  
  // Persistent UUID session for n8n multi-turn conversation memory
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('n8n-chat-session-id') || sessionStorage.getItem('ada_session_id');
      if (!sid) {
        sid = (typeof crypto !== 'undefined' && crypto.randomUUID) 
          ? crypto.randomUUID() 
          : 'rb-session-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
        localStorage.setItem('n8n-chat-session-id', sid);
        sessionStorage.setItem('ada_session_id', sid);
      }
      return sid;
    }
    return 'rb-session-default';
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (customPrompt) => {
    const textToSend = customPrompt || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    let replyText = null;

    // 1. Direct browser fetch to live n8n webhook (CORS enabled on prime-tech-hub Caddy)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40000);

      const n8nRes = await fetch(N8N_DIRECT_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sendMessage',
          sessionId: sessionId,
          chatInput: textToSend.trim(),
          metadata: {
            role: selectedRole,
          },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (n8nRes.ok) {
        const n8nData = await n8nRes.json();
        replyText = n8nData.output || n8nData.text || n8nData.reply || (typeof n8nData === 'string' ? n8nData : null);
      }
    } catch (directErr) {
      console.warn('[Ada Widget] Direct n8n fetch skipped, trying server proxy:', directErr.message);
    }

    // 2. Fallback to local server proxy if direct call didn't yield a reply
    if (!replyText) {
      try {
        const history = [...messages, userMessage].map((m) => ({
          role: m.role === 'ada' ? 'assistant' : 'user',
          content: m.content,
        }));

        const res = await fetch('/api/chat/ada', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: history,
            userRole: selectedRole,
            sessionId: sessionId,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          replyText = data.reply;
        }
      } catch (proxyErr) {
        console.warn('[Ada Widget] Server proxy error:', proxyErr.message);
      }
    }

    if (replyText) {
      const adaResponse = {
        id: `ada-${Date.now()}`,
        role: 'ada',
        content: replyText,
      };
      setMessages((prev) => [...prev, adaResponse]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `ada-err-${Date.now()}`,
          role: 'ada',
          content: "I'm having a brief connection delay reaching our n8n AI engine. Please give it a few seconds and send your message again, or feel free to message our verified WhatsApp Concierge directly!",
        },
      ]);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <aside aria-label="Ada Virtual Concierge & Multi-Channel Chat" className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 select-none">
      
      {/* 1. FLOATING ACTION TRIGGER (Using n8n #15803D Green Theme) */}
      {!isOpen && (
        <div className="relative group animate-bounce-subtle">
          {/* Notification bubble */}
          {hasUnread && (
            <div className="absolute -top-10 right-0 bg-[#15803D] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xl border border-emerald-400 flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse"></span>
              <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
              <span>Ask AI • WhatsApp Concierge</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open RentBridge AI Concierge"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#15803D] hover:bg-[#166534] text-white p-0.5 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-white relative overflow-hidden group">
            
            {/* Robot/Bot Avatar Circle */}
            <div className="w-full h-full rounded-full bg-[#15803D] flex items-center justify-center text-white relative">
              <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.72V7h2a5 5 0 015 5v1h1a2 2 0 012 2v3a2 2 0 01-2 2h-1v1a5 5 0 01-5 5H9a5 5 0 01-5-5v-1H3a2 2 0 01-2-2v-3a2 2 0 012-2h1v-1a5 5 0 015-5h2V5.72A2 2 0 0110 4a2 2 0 012-2zm-3 9a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
            </div>

            {/* Online Pulse Indicator */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-[#15803D] rounded-full shadow-xs"></span>
          </button>
        </div>
      )}

      {/* 2. CHAT DRAWER (HOUSES BOTH LIVE CHATBOT & WHATSAPP DIRECT CHANNEL IN N8N THEME) */}
      {isOpen && (
        <div className={`w-[94vw] sm:w-[410px] ${isExpanded ? 'sm:w-[520px] h-[660px]' : 'h-[600px]'} max-h-[88vh] bg-[#F7FCF8] rounded-2xl sm:rounded-3xl shadow-2xl border border-[#DCEBDF] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200`}>
          
          {/* Top Header Bar (Using n8n --chat--header--background: #15803D) */}
          <div className="px-4 py-3.5 bg-[#15803D] text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              {/* Avatar with status dot */}
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 relative shadow-sm border border-white/30">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.72V7h2a5 5 0 015 5v1h1a2 2 0 012 2v3a2 2 0 01-2 2h-1v1a5 5 0 01-5 5H9a5 5 0 01-5-5v-1H3a2 2 0 01-2-2v-3a2 2 0 012-2h1v-1a5 5 0 015-5h2V5.72A2 2 0 0110 4a2 2 0 012-2zm-3 9a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z"/>
                </svg>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-200 rounded-full border-2 border-[#15803D]"></span>
              </div>

              <div>
                <h3 className="font-bold text-sm tracking-tight text-white leading-tight">
                  Ada • RentBridge AI
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-100 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-200"></span>
                  <span>Online</span>
                  <span className="text-emerald-200/60">•</span>
                  <span>Citadel Verified Desk</span>
                </div>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse View" : "Expand View"}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center cursor-pointer">
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5" />
                )}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Concierge"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Header Bar (Direct Channel Bar housing WhatsApp direct channel) */}
          <div className="px-4 py-2 bg-white border-b border-[#DCEBDF] flex items-center justify-between text-xs shrink-0 shadow-xs">
            <span className="text-[#163324]/70 font-semibold text-[11px]">Official Direct Channel</span>
            
            <div className="flex items-center gap-2">
              <a
                href={WHATSAPP_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-[#15803D] hover:text-[#166534] hover:underline text-xs transition-colors">
                <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                <span>WhatsApp Concierge</span>
              </a>

              <span className="text-[10px] font-bold text-[#15803D] bg-[#E8F3EB] px-2 py-0.5 rounded-full border border-[#BBE7C8] hidden xs:inline-block">
                Active 24/7
              </span>
            </div>
          </div>

          {/* CHAT MESSAGES SCROLL AREA (Using n8n Palette & Typography) */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-[#F7FCF8]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Bubble (Using exact n8n user & bot colors) */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl max-w-[92%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#DCFCE7] text-[#14532D] border border-[#BBE7C8] rounded-br-xs shadow-xs'
                      : 'bg-white text-[#163324] border border-[#E4EFE6] rounded-bl-xs shadow-xs'
                  }`}>

                  {/* Message Paragraphs with Clickable Markdown Links and Bold Highlights */}
                  <div className="space-y-1.5 font-normal leading-relaxed text-xs">
                    {renderFormattedText(msg.content)}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[#15803D] text-xs p-2">
                <div className="w-6 h-6 rounded-full bg-[#E8F3EB] flex items-center justify-center border border-[#BBE7C8]">
                  <Sparkles className="w-3.5 h-3.5 text-[#15803D] animate-spin" />
                </div>
                <span className="italic text-[11px] font-medium">Ada is typing from n8n knowledge engine...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips (Styled in n8n light green) */}
          <div className="px-3 py-2 bg-white border-t border-[#DCEBDF] overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none shrink-0">
            {QUICK_PILLS.map((pill, i) => (
              <button
                key={i}
                disabled={loading}
                onClick={() => {
                  if (pill.isWhatsApp) {
                    window.open(WHATSAPP_DIRECT_URL, '_blank');
                  } else {
                    handleSendMessage(pill.prompt);
                  }
                }}
                className="text-xs font-semibold bg-[#E8F3EB] hover:bg-[#DCFCE7] text-[#15803D] px-3 py-1.5 rounded-full border border-[#BBE7C8] transition-all shrink-0 cursor-pointer flex items-center gap-1">
                <span>{pill.label}</span>
              </button>
            ))}
          </div>

          {/* Input Footer (Using n8n #15803D Send Button) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#DCEBDF] flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about houses, inspections, or zero fees..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F7FCF8] border border-[#DCEBDF] text-xs text-[#163324] placeholder-slate-400 focus:outline-none focus:border-[#15803D] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="w-10 h-10 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm">
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Send className="w-4 h-4 ml-0.5" />
              )}
            </button>
          </form>

        </div>
      )}
    </aside>
  );
}
