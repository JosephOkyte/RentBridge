'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Eye, 
  Lock, 
  UserCheck, 
  Building2, 
  Calendar, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  X
} from 'lucide-react';

export default function StealthAccountsMonitorPage() {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [auditLogNotice, setAuditLogNotice] = useState('');

  useEffect(() => {
    fetch('/api/admin/audit')
      .then((res) => res.json())
      .then((data) => {
        if (data.registeredAccounts) {
          setAccounts(data.registeredAccounts);
        }
      })
      .catch(console.error);
  }, []);

  const handleInspect = async (account) => {
    setSelectedAccount(account);
    setAuditLogNotice('');

    // Trigger silent server-side audit log without notifying account owner
    try {
      const res = await fetch('/api/admin/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stealth_inspect_account',
          targetUserId: account.id,
          reason: 'Routine Compliance & Anti-Fraud Inspection',
        }),
      });
      const data = await res.json();
      setAuditLogNotice(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = accounts.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151816] text-[#8AE0B3] text-xs font-bold uppercase tracking-wider mb-1">
          <Eye className="w-3.5 h-3.5" />
          <span>Stealth Account Oversight</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#151816]">
          Stealth User Account Monitoring Desk
        </h1>
        <p className="text-xs sm:text-sm text-[#8F8372]">
          Super Admin oversight across Tenants, Landlords, Lawyers, and Caretakers. Inspected silently with zero notifications, emails, or session alerts triggered to account owners.
        </p>
      </div>

      {/* Security Isolation Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#151816]">
          <Lock className="w-4 h-4 text-[#2D5A43] shrink-0" />
          <span>
            <strong>Multi-Tenant Isolation Enforced:</strong> Tenants cannot access other tenant accounts. Listers cannot see competitor drafts or metrics. Every account is strictly sandboxed.
          </span>
        </div>
        <span className="text-[10px] font-extrabold uppercase bg-[#2D5A43] text-white px-2.5 py-1 rounded-lg shrink-0">
          Zero-Alert Audit
        </span>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#8F8372] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8DFC8] text-xs sm:text-sm focus:outline-none focus:border-[#2D5A43]"
        />
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-3xl border border-[#E8DFC8] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F5EFEB] border-b border-[#E8DFC8] text-[#8F8372] uppercase tracking-wider font-extrabold">
              <tr>
                <th className="p-4">Account Holder</th>
                <th className="p-4">Role</th>
                <th className="p-4">Hub City</th>
                <th className="p-4">Listings / Drafts</th>
                <th className="p-4">Inspections</th>
                <th className="p-4">Verification</th>
                <th className="p-4 text-right">Oversight Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DFC8]">
              {filtered.map((acc) => (
                <tr key={acc.id} className="hover:bg-[#FBF9F5] transition-colors">
                  <td className="p-4">
                    <p className="font-extrabold text-[#151816] text-sm">{acc.fullName}</p>
                    <p className="text-[11px] text-[#4B524D]">{acc.email}</p>
                    <p className="text-[10px] text-[#8F8372] font-mono">{acc.phone}</p>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg bg-[#EBF2ED] text-[#2D5A43] font-bold text-[11px] uppercase">
                      {acc.role}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-[#151816]">
                    {acc.cityHub}
                  </td>

                  <td className="p-4 font-bold text-[#151816]">
                    {acc.propertiesCount}
                  </td>

                  <td className="p-4 font-bold text-[#151816]">
                    {acc.activeInspections}
                  </td>

                  <td className="p-4">
                    {acc.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[#2D5A43] font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[#D97706] font-bold text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleInspect(acc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2D5A43] hover:bg-[#1E3F2F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Stealth Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stealth Account Inspection Detail Drawer / Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E2D7C8] space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F8372]">
                  Stealth Shadow Inspection
                </span>
                <h3 className="text-xl font-black text-[#151816] mt-0.5">
                  {selectedAccount.fullName} ({selectedAccount.role.toUpperCase()})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="p-2 rounded-full hover:bg-[#F5EFEB]">
                <X className="w-5 h-5 text-[#8F8372]" />
              </button>
            </div>

            {/* Silent Audit Guarantee */}
            <div className="p-3.5 rounded-xl bg-[#EBF2ED] border border-[#2D5A43]/20 text-xs text-[#1E3F2F] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D5A43] shrink-0" />
              <span>
                <strong>Stealth Protocol Active:</strong> This audit is strictly internal. The account owner has not received any email, push notification, or security prompt.
              </span>
            </div>

            {/* Account Metadata */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] text-xs">
              <div>
                <span className="text-[#8F8372] block text-[10px] uppercase font-bold">Email (Unique)</span>
                <span className="font-bold text-[#151816]">{selectedAccount.email}</span>
              </div>
              <div>
                <span className="text-[#8F8372] block text-[10px] uppercase font-bold">Telephone</span>
                <span className="font-bold text-[#151816]">{selectedAccount.phone}</span>
              </div>
              <div>
                <span className="text-[#8F8372] block text-[10px] uppercase font-bold">Clerk Identity ID</span>
                <span className="font-mono text-[10px] text-[#2D5A43] truncate block">{selectedAccount.clerkId}</span>
              </div>
            </div>

            {/* Associated Properties & Inspections */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#151816]">
                Account Inventory & Activity
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-[#E8DFC8] text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#2D5A43]" />
                    <span>Listed Properties in Lagos Hub (Lekki / Ikoyi)</span>
                  </div>
                  <span className="font-bold text-[#2D5A43]">{selectedAccount.propertiesCount} Active</span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-[#E8DFC8] text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#2D5A43]" />
                    <span>Physical Inspections Scheduled</span>
                  </div>
                  <span className="font-bold text-[#2D5A43]">{selectedAccount.activeInspections} Viewings</span>
                </div>
              </div>
            </div>

            {/* Audit Log Result */}
            {auditLogNotice && (
              <p className="text-[11px] text-[#8F8372] font-mono text-center">
                {auditLogNotice}
              </p>
            )}

            <button
              onClick={() => setSelectedAccount(null)}
              className="w-full py-2.5 rounded-xl bg-[#2D5A43] text-white text-xs font-bold shadow-sm">
              Close Shadow Inspection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

