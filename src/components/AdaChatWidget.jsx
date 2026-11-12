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
  Home,
  Loader2
} from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome',
    role: 'ada',
    content: "Hello! I'm Ada from RentBridge... Your personal housing concierge and anti-agent shield..\n\nHow can I help you today?",
    properties: [],
  },
];

const QUICK_PILLS = [
  { label: '🏡 Houses in Lekki Phase 1', prompt: 'Show me verified houses in Lekki Phase 1 with transparent terms and ₦0 agent fees' },
  { label: '🏢 Offices in Abuja', prompt: 'Find me commercial plaza spaces or offices in Wuse 2 or Maitama Abuja' },
  { label: '🎟️ How Gate Pass Works', prompt: 'How does the free physical inspection and official gate pass code work?' },
  { label: '📝 How to List Direct', prompt: 'I want to list my house directly as a Landlord or Caretaker. What is Phase 1 verification?' },
  { label: '🚨 Report Fee Demand', prompt: 'Someone asked me to send ₦5,000 for gate pass and fuel before inspection' },
];

export default function AdaChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('tenant');
  const [hasUnread, setHasUnread] = useState(true);
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
    <aside aria-label="Ada Virtual Concierge" className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 select-none">
      {/* 1. FLOATING BUBBLE (TRIGGER) */}
      {!isOpen && (
        <div className="relative group animate-bounce-subtle">
          {/* Unread notification hint */}
          {hasUnread && (
            <div className="absolute -top-10 right-0 bg-[#2D5A43] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-[#E8DFC8] flex items-center gap-1.5 whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-[#D97706] animate-pulse" />
              <span>Ask Ada: ₦0 Fee Houses & Advice</span>
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Ada AI Concierge"
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#1E3F2F] text-white p-0.5 shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer border-2 border-[#D97706] relative overflow-hidden">
            <img
              src="/images/ada-avatar.jpg"
              alt="Ada from RentBridge"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            {/* Fallback Icon if image loading */}
            <div className="absolute inset-0 bg-[#2D5A43] flex items-center justify-center text-white font-black text-sm">
              <MessageSquare className="w-6 h-6" />
            </div>

            {/* Pulse Status Indicator */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs"></span>
          </button>
        </div>
      )}

      {/* 2. CHAT DRAWER */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-[#FBF9F5] rounded-3xl shadow-2xl border border-[#E2D7C8] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-[#1E3F2F] text-white flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#D97706] overflow-hidden shrink-0 relative bg-[#2D5A43]">
                <img
                  src="/images/ada-avatar.jpg"
                  alt="Ada"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight text-white">Ada from RentBridge</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D97706]" />
                </div>
                <p className="text-[10px] text-emerald-200 font-medium">AI Housing Concierge & Anti-Agent Shield</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart Chat"
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#2D5A43] transition-all">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#2D5A43] transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Filter Bar */}
          <div className="bg-[#EBF2ED] px-3 py-2 border-b border-[#E2D7C8] flex items-center justify-between text-xs">
            <span className="text-[10px] uppercase font-bold text-[#2D5A43] tracking-wider">I am a:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'tenant', label: 'Tenant' },
                { id: 'landlord', label: 'Landlord' },
                { id: 'caretaker', label: 'Caretaker' },
                { id: 'lawyer', label: 'Lawyer' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                    selectedRole === r.id
                      ? 'bg-[#2D5A43] text-white shadow-xs'
                      : 'bg-white/80 text-[#4B524D] hover:bg-white'
                  }`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                
                {/* Bubble */}
                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#2D5A43] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-[#151816] border border-[#E2D7C8] rounded-bl-none shadow-xs'
                  }`}>
                  {/* Markdown formatted content */}
                  <div className="whitespace-pre-wrap space-y-1.5 font-normal">
                    {msg.content.split('\n').map((paragraph, idx) => {
                      if (!paragraph.trim()) return <br key={idx} />;
                      return <p key={idx}>{paragraph}</p>;
                    })}
                  </div>

                  {/* Anti-Extortion Warning Banner */}
                  {msg.action === 'REPORT_EXTORTION' && (
                    <div className="mt-3 p-3 rounded-xl bg-[#FEF2F2] border border-[#EF4444] text-[#B91C1C] space-y-2">
                      <div className="flex items-center gap-1.5 font-extrabold text-[11px]">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Citadel Anti-Fraud Protocol Triggered</span>
                      </div>
                      <p className="text-[10px] leading-tight text-[#7F1D1D]">
                        RentBridge strictly blacklists any telephone number that demands inspection fees.
                      </p>
                      <Link
                        href="/dashboard/inspections"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#B91C1C] text-white font-bold text-[10px] hover:bg-[#991B1B] transition-all">
                        <span>Open Citadel Fraud Desk</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Optional Property Cards Returned by Ada */}
                {msg.properties && msg.properties.length > 0 && (
                  <div className="mt-2.5 space-y-2 w-full max-w-[90%]">
                    <p className="text-[10px] font-extrabold text-[#2D5A43] uppercase tracking-wider flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      <span>Verified Matches on RentBridge:</span>
                    </p>
                    {msg.properties.map((prop) => (
                      <div
                        key={prop.id}
                        className="p-2.5 rounded-xl bg-white border border-[#E2D7C8] shadow-xs flex items-center gap-3 hover:border-[#2D5A43] transition-all">
                        <img
                          src={prop.image || '/images/hero-lagos-duplex.jpg'}
                          alt={prop.title}
                          className="w-14 h-14 rounded-lg object-cover shrink-0"
                        />
                        <div className="overflow-hidden flex-1">
                          <p className="font-extrabold text-[#151816] truncate text-[11px]">{prop.title}</p>
                          <p className="text-[10px] text-[#4B524D] flex items-center gap-1 truncate">
                            <MapPin className="w-2.5 h-2.5 text-[#2D5A43] shrink-0" />
                            <span>{prop.neighborhood}, {prop.cityName}</span>
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-black text-[#1E3F2F] text-[11px]">
                              ₦{Number(prop.priceYearly).toLocaleString()}/yr
                            </span>
                            <span className="text-[9px] font-extrabold bg-[#EBF2ED] text-[#2D5A43] px-1.5 py-0.2 rounded">
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
              <div className="flex items-center gap-2 text-[#4B524D] text-xs">
                <div className="w-7 h-7 rounded-full bg-[#EBF2ED] flex items-center justify-center border border-[#2D5A43]/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#2D5A43] animate-spin" />
                </div>
                <span className="italic text-[11px]">Ada is typing & cross-referencing listings...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Suggestion Chips */}
          <div className="px-3 py-2 bg-white/70 border-t border-[#E8DFC8] overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {QUICK_PILLS.map((pill, i) => (
              <button
                key={i}
                disabled={loading}
                onClick={() => handleSendMessage(pill.prompt)}
                className="text-[10px] font-semibold bg-[#F5EFEB] hover:bg-[#EAE2D8] text-[#1E3F2F] px-2.5 py-1 rounded-full border border-[#D7CBBB] transition-all shrink-0">
                {pill.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E2D7C8] flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Ask Ada as a ${selectedRole} (e.g. Lekki flood zones, fees)...`}
              className="flex-1 p-2.5 rounded-xl bg-[#FBF9F5] border border-[#E8DFC8] text-xs focus:outline-none focus:border-[#2D5A43]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8AE0B3]" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
            </button>
          </form>

        </div>
      )}
    </aside>
  );
}

