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

const TELEGRAM_BOT_URL = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL || 'https://t.me/Oga_Homesbot';
const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'Oga_Homesbot';

const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome',
    role: 'ada',
    content: "Hi, My name is Ada, the AI assistant. Welcome to RentBridge! How may I assist you today?",
    properties: [],
  },
];

const QUICK_PILLS = [
  { label: '🏠 1. Residential', prompt: 'Show me verified residential flats and duplexes in Lagos, Abuja, and PH with ₦0 viewing fees' },
  { label: '🏢 2. Commercial', prompt: 'Find commercial plaza spaces or offices in Abuja and Lagos' },
  { label: '🔨 3. Wanted Board', prompt: 'Tell me about the Wanted Seeker Matchboard and how to post a housing request' },
  { label: '🎟️ 4. Free Pass', prompt: 'How does the free physical inspection and official gate pass code work?' },
  { label: '✈️ Telegram Bot', prompt: 'Tell me about the official Telegram chatbot @Oga_Homesbot', isTelegram: true },
  { label: '💬 WhatsApp (Soon)', prompt: 'What is the status of the WhatsApp chatbot integration?' },
];

export default function AdaChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('tenant');
  const [hasUnread, setHasUnread] = useState(true);
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('ada_session_id');
      if (stored) return stored;
      const created = 'rb-session-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
      sessionStorage.setItem('ada_session_id', created);
      return created;
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

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reach Ada');
      }

      const adaResponse = {
        id: `ada-${Date.now()}`,
        role: 'ada',
        content: data.reply || "I dey here with you! Let me check that for you.",
        properties: data.properties || [],
        action: data.action,
      };

      setMessages((prev) => [...prev, adaResponse]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ada-err-${Date.now()}`,
          role: 'ada',
          content: `Ehya! Network glitch occurred while checking the database. Please try again or ask me about any property in Lagos, Abuja, PH, or Enugu.`,
          properties: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <aside aria-label="Ada Virtual Concierge & Multi-Channel Chat" className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 select-none">
      
      {/* 1. FLOATING ACTION TRIGGER */}
      {!isOpen && (
        <div className="relative group animate-bounce-subtle">
          {/* Notification bubble */}
          {hasUnread && (
            <div className="absolute -top-10 right-0 bg-[#0B1B2B] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xl border border-slate-700 flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Ask AI • Telegram (@{TELEGRAM_BOT_USERNAME})</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open RentBridge AI Concierge"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B1B2B] text-white p-0.5 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-[#0088cc] relative overflow-hidden group">
            
            {/* Robot/Bot Avatar Circle */}
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#0088cc] to-[#2D5A43] flex items-center justify-center text-white relative">
              <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
                <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.72V7h2a5 5 0 015 5v1h1a2 2 0 012 2v3a2 2 0 01-2 2h-1v1a5 5 0 01-5 5H9a5 5 0 01-5-5v-1H3a2 2 0 01-2-2v-3a2 2 0 012-2h1v-1a5 5 0 015-5h2V5.72A2 2 0 0110 4a2 2 0 012-2zm-3 9a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
            </div>

            {/* Online Pulse Indicator */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#0B1B2B] rounded-full shadow-xs"></span>
          </button>
        </div>
      )}

      {/* 2. CHAT DRAWER (HOUSES BOTH WEB CHATBOT & TELEGRAM DIRECT CHANNEL) */}
      {isOpen && (
        <div className={`w-[94vw] sm:w-[400px] ${isExpanded ? 'sm:w-[500px] h-[640px]' : 'h-[580px]'} max-h-[88vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200`}>
          
          {/* Top Header Bar (Matching Reference Screenshot) */}
          <div className="px-4 py-3 bg-[#0B1B2B] text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              {/* Avatar with status dot */}
              <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center text-white shrink-0 relative shadow-sm">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2a2 2 0 012 2c0 .74-.4 1.38-1 1.72V7h2a5 5 0 015 5v1h1a2 2 0 012 2v3a2 2 0 01-2 2h-1v1a5 5 0 01-5 5H9a5 5 0 01-5-5v-1H3a2 2 0 01-2-2v-3a2 2 0 012-2h1v-1a5 5 0 015-5h2V5.72A2 2 0 0110 4a2 2 0 012-2zm-3 9a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4z"/>
                </svg>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0B1B2B]"></span>
              </div>

              <div>
                <h3 className="font-bold text-sm tracking-tight text-white leading-tight">
                  Ada • RentBridge AI
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Online</span>
                  <span className="text-slate-400">•</span>
                  <span>Suite A20 Citadel Desk</span>
                </div>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse View" : "Expand View"}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all flex items-center justify-center cursor-pointer">
                {isExpanded ? (
                  <Minimize2 className="w-3.5 h-3.5" />
                ) : (
                  <ExternalLink className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Concierge"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all flex items-center justify-center cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub-Header Bar (Direct Channel Bar matching screenshot) */}
          <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-center justify-between text-xs shrink-0 shadow-xs">
            <span className="text-slate-600 font-medium text-[11px]">Official Direct Channel</span>
            
            <div className="flex items-center gap-2">
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-[#0088cc] hover:text-[#006699] hover:underline text-xs transition-colors">
                <svg className="w-3.5 h-3.5 fill-[#0088cc]" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
                </svg>
                <span>Telegram (@{TELEGRAM_BOT_USERNAME})</span>
              </a>

              <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 hidden xs:inline-block">
                WhatsApp (Soon)
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-[#F8FAFC]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Bubble / Card */}
                <div
                  className={`p-4 rounded-2xl max-w-[94%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#0B1B2B] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}>
                  
                  {/* Card Header (for Welcome Message matching screenshot) */}
                  {msg.headerTitle && (
                    <div className="mb-3 space-y-1">
                      <h4 className="font-extrabold text-sm text-slate-900 tracking-tight">
                        {msg.headerTitle}
                      </h4>
                      {msg.headerSub && (
                        <p className="text-xs font-bold text-[#D97706]">
                          {msg.headerSub}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Message Paragraphs */}
                  <div className="whitespace-pre-wrap space-y-2 font-normal text-slate-700 leading-relaxed">
                    {msg.content.split('\n').map((paragraph, idx) => {
                      if (!paragraph.trim()) return <br key={idx} />;
                      return <p key={idx}>{paragraph}</p>;
                    })}
                  </div>

                  {/* Anti-Extortion Sentinel Warning */}
                  {msg.action === 'REPORT_EXTORTION' && (
                    <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-300 text-red-700 space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                        <span>Citadel Anti-Fraud Protocol Triggered</span>
                      </div>
                      <p className="text-[11px] leading-tight text-red-600">
                        Physical inspections are 100% free (₦0.00). Report extortion attempts to freeze this account immediately.
                      </p>
                      <Link
                        href="/dashboard/inspections"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 text-white font-bold text-[10px] hover:bg-red-700 transition-all">
                        <span>Report Extortion Desk</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Optional Property Cards Returned by AI */}
                {msg.properties && msg.properties.length > 0 && (
                  <div className="mt-2.5 space-y-2 w-full max-w-[94%]">
                    <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                      <Home className="w-3 h-3 text-emerald-600" />
                      <span>Verified Matches on RentBridge:</span>
                    </p>
                    {msg.properties.map((prop) => (
                      <div
                        key={prop.id}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3 hover:border-emerald-600 transition-all">
                        <img
                          src={prop.image || '/images/hero-lagos-duplex.jpg'}
                          alt={prop.title}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="overflow-hidden flex-1">
                          <p className="font-bold text-slate-900 truncate text-[11px]">{prop.title}</p>
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span>{prop.neighborhood}, {prop.cityName}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-extrabold text-emerald-800 text-[11px]">
                              ₦{Number(prop.priceYearly).toLocaleString()}/yr
                            </span>
                            <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              ₦0 Agent Fee
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-slate-500 text-xs p-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-[#0088cc] animate-spin" />
                </div>
                <span className="italic text-[11px]">AI assistant is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips (Pills Matching Reference Screenshot) */}
          <div className="px-3 py-2 bg-white border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none shrink-0">
            {QUICK_PILLS.map((pill, i) => (
              <button
                key={i}
                disabled={loading}
                onClick={() => {
                  if (pill.isTelegram) {
                    window.open(TELEGRAM_BOT_URL, '_blank');
                  } else {
                    handleSendMessage(pill.prompt);
                  }
                }}
                className="text-xs font-semibold bg-[#E8F4FD] hover:bg-[#D4EBF8] text-[#0A66C2] px-3 py-1.5 rounded-full border border-[#CDE5FA] transition-all shrink-0 cursor-pointer flex items-center gap-1">
                <span>{pill.label}</span>
              </button>
            ))}
          </div>

          {/* Input Footer (Matching Reference Screenshot) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about houses, inspections, or zero fees..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0088cc] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="w-10 h-10 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm">
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
