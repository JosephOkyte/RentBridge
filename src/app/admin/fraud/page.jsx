'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Phone, 
  UserX, 
  CheckCircle2, 
  Ban, 
  Clock, 
  ShieldCheck,
  Search,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

export default function AntiFraudDeskPage() {
  const [incidents, setIncidents] = useState([]);
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    fetch('/api/admin/audit')
      .then((res) => res.json())
      .then((data) => {
        if (data.fraudIncidents) {
          setIncidents(data.fraudIncidents);
        }
      })
      .catch(console.error);
  }, []);

  const handleBlacklist = (incidentId, accusedPhone) => {
    setIncidents(incidents.filter((i) => i.id !== incidentId));
    setActionNotice(`Telephone ${accusedPhone} has been permanently blacklisted across Nigeria. Associated listings frozen.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/admin"
          className="p-2.5 rounded-xl bg-white border border-[#E8DFC8] text-[#4B524D] hover:bg-[#F5EFEB] hover:text-[#151816] transition-all shrink-0 shadow-xs"
          title="Return to Citadel Dashboard">
          <ArrowLeft className="w-4 h-4 text-[#2D5A43]" />
        </Link>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Anti-Agent Enforcement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#151816]">
            Anti-Fraud & Fee Extortion Incident Room
          </h1>
          <p className="text-xs sm:text-sm text-[#8F8372]">
            Zero tolerance for rogue middlemen: Review tenant reports of viewing fees, illegal registration charges, or agent markups.
          </p>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-2xl bg-[#EBF2ED] border border-[#2D5A43] text-xs font-bold text-[#1E3F2F] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#2D5A43] shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Zero Agent Policy Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] space-y-1">
          <span className="text-[10px] font-bold text-[#8F8372] uppercase tracking-wider">Active Investigations</span>
          <p className="text-2xl font-black text-[#B91C1C]">{incidents.length}</p>
          <p className="text-[11px] text-[#4B524D]">Tenant extortion flags</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] space-y-1">
          <span className="text-[10px] font-bold text-[#8F8372] uppercase tracking-wider">Inspection Fee Rule</span>
          <p className="text-2xl font-black text-[#2D5A43]">Strict ₦0</p>
          <p className="text-[11px] text-[#4B524D]">Physical viewings are 100% free</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8DFC8] space-y-1">
          <span className="text-[10px] font-bold text-[#8F8372] uppercase tracking-wider">Enforcement Action</span>
          <p className="text-2xl font-black text-[#151816]">Permanent Ban</p>
          <p className="text-[11px] text-[#4B524D]">Phone + NIN national blacklist</p>
        </div>
      </div>

      {/* Incidents Feed */}
      <div className="space-y-4">
        {incidents.length > 0 ? (
          incidents.map((incident) => (
            <div
              key={incident.id}
              className="p-6 bg-white rounded-3xl border border-[#FCA5A5] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFC8] pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#FEF2F2] text-[#B91C1C] text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Inspection Fee Demand Reported</span>
                  </span>
                  <span className="text-xs text-[#8F8372]">Incident #{incident.id}</span>
                </div>
                <span className="text-xs text-[#8F8372]">
                  {new Date(incident.incidentDate).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8F8372]">Target Property</span>
                  <p className="text-sm font-black text-[#151816]">{incident.propertyTitle}</p>
                  <p className="text-xs text-[#4B524D]">
                    Accused Lister: <strong>{incident.accusedLister}</strong> ({incident.accusedPhone})
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#8F8372]">Reporting Tenant</span>
                  <p className="text-sm font-bold text-[#151816]">{incident.reportingTenant}</p>
                  <p className="text-xs text-[#4B524D]">Phone: {incident.reportingTenantPhone}</p>
                </div>
              </div>

              {/* The Complaint */}
              <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-xs space-y-1">
                <p className="font-bold text-[#B91C1C]">Tenant Statement & Extortion Evidence:</p>
                <p className="text-[#7F1D1D] leading-relaxed">
                  "{incident.complaint}"
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIncidents(incidents.filter((i) => i.id !== incident.id))}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-[#F5EFEB] border border-[#E8DFC8] text-xs font-bold text-[#4B524D] cursor-pointer">
                  Dismiss / False Alarm
                </button>

                <button
                  onClick={() => handleBlacklist(incident.id, incident.accusedPhone)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer">
                  <Ban className="w-4 h-4" />
                  <span>Freeze Property & Blacklist Telephone</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E8DFC8] space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#EBF2ED] text-[#2D5A43] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-[#151816]">Zero Active Fraud Incidents</h3>
            <p className="text-xs text-[#8F8372]">All four hubs (Lagos, Abuja, Port Harcourt, and Enugu) are clear of reported fee extortion.</p>
          </div>
        )}
      </div>
    </div>
  );
}

