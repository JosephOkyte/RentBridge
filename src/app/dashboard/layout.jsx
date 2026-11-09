'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { 
  Building2, 
  Calendar, 
  PlusCircle, 
  ShieldCheck, 
  LayoutDashboard, 
  ArrowLeft,
  Lock,
  User,
  Heart,
  Search,
  Sparkles,
  HelpCircle,
  Camera
} from 'lucide-react';
import ProfilePhotoModal from '../../components/ProfilePhotoModal';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      try {
        const res = await fetch('/api/profile');
        const data = await res.json();
        if (data.profile) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.warn('Failed to load profile:', err);
      } finally {
        setLoadingProfile(false);
      }
    }
    fetchProfile();
  }, [user]);

  const userRole = profile?.role || user?.publicMetadata?.role || 'tenant';
  const isAdmin = userRole === 'admin' || user?.primaryEmailAddress?.emailAddress?.endsWith('@rentbridge.ng') || user?.publicMetadata?.role === 'admin';
  const isLister = ['landlord', 'lawyer', 'caretaker', 'admin'].includes(userRole);

  // Strict role-specific navigation menus
  const tenantNavigation = [
    { name: 'Tenant Overview', href: '/dashboard/tenant', icon: LayoutDashboard },
    { name: 'Booked Inspections (₦0 Fee)', href: '/dashboard/inspections', icon: Calendar },
    { name: 'Browse Direct Properties', href: '/#properties', icon: Search },
  ];

  const listerNavigation = [
    { name: 'Portfolio Overview', href: '/dashboard/landlord', icon: LayoutDashboard },
    { name: 'Properties & Staged Drafts', href: '/dashboard/properties', icon: Building2 },
    { name: 'Stage New Listing', href: '/dashboard/properties/new', icon: PlusCircle },
    { name: 'Inspection Dispatcher', href: '/dashboard/inspections', icon: Calendar },
  ];

  const adminNavigation = [
    { name: 'Citadel Operations Hub', href: '/dashboard/admin', icon: ShieldCheck },
    { name: 'Gatekeeper Desk (Phase 1)', href: '/admin/verification', icon: Lock },
    { name: 'Custodian Suite', href: '/dashboard/landlord', icon: Building2 },
    { name: 'Tenant Sanctuary', href: '/dashboard/tenant', icon: Search },
    { name: 'Inspection Dispatcher', href: '/dashboard/inspections', icon: Calendar },
  ];

  const navigation = isAdmin 
    ? adminNavigation 
    : isLister 
    ? listerNavigation 
    : tenantNavigation;

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col md:flex-row text-[#151816]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-white border-r border-[#E8DFC8] flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#E8DFC8] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#2D5A43] flex items-center justify-center text-white font-black text-lg shadow-sm">
                RB
              </div>
              <div>
                <span className="text-xl font-black text-[#151816] tracking-tight">
                  Rent<span className="text-[#2D5A43]">Bridge</span>
                </span>
                <span className="block text-[10px] text-[#8F8372] font-semibold uppercase tracking-wider">
                  {isLister ? 'Custodian Suite' : 'Tenant Portal'}
                </span>
              </div>
            </Link>
          </div>

          {/* User Status Card with Photo Update Action */}
          <div className="p-3.5 mx-4 my-4 rounded-2xl bg-[#F5EFEB] border border-[#E2D7C8] flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative group shrink-0">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10 ring-2 ring-[#2D5A43]/40',
                    },
                  }}
                />
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(true)}
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#2D5A43] text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer"
                  title="Upload Personal Photo">
                  <Camera className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#151816] truncate">
                  {user?.fullName || user?.firstName || 'Verified User'}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full capitalize ${
                    userRole === 'admin'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : isLister 
                      ? 'bg-[#EBF2ED] text-[#2D5A43]' 
                      : 'bg-[#E0F2FE] text-[#0369A1]'
                  }`}>
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>{userRole === 'admin' ? 'Super Admin' : userRole === 'tenant' ? 'Verified Tenant' : `Verified ${userRole}`}</span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPhotoModalOpen(true)}
              className="p-1.5 rounded-lg text-[#8F8372] hover:text-[#2D5A43] hover:bg-white transition-all shrink-0 cursor-pointer"
              title="Upload / Change Photo">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 space-y-1.5">
            <div className="pb-1 px-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8F8372]">
                {isAdmin ? 'Platform Operations' : isLister ? 'Portfolio Management' : 'Renter Sanctuary'}
              </span>
            </div>

            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-[#2D5A43] text-white shadow-md shadow-[#2D5A43]/20'
                      : 'text-[#4B524D] hover:bg-[#F5EFEB] hover:text-[#151816]'
                  }`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#2D5A43]'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Return Action */}
        <div className="p-4 border-t border-[#E8DFC8] space-y-2">
          <div className="px-3 py-2 rounded-xl bg-[#F5EFEB] border border-[#E8DFC8] text-[11px] text-[#4B524D]">
            <p className="font-bold text-[#1E3F2F]">Zero Agent Guarantee</p>
            <p className="text-[10px] text-[#8F8372]">₦0 inspection fees, 0% commissions.</p>
          </div>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-[#4B524D] hover:bg-[#F5EFEB] border border-[#E8DFC8] transition-all">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Marketplace</span>
          </Link>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Universal Back & Context Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-[#E8DFC8]/50">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/');
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#E8DFC8] text-xs font-bold text-[#4B524D] hover:text-[#151816] hover:bg-[#F5EFEB] transition-all shadow-xs group cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5 text-[#2D5A43] group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#8F8372] hover:text-[#151816] hover:bg-white transition-all">
                <span>Marketplace Home</span>
              </Link>
            </div>
          </div>

          {children}
        </div>
      </main>

      {/* Profile Photo Uploader Modal */}
      <ProfilePhotoModal
        isOpen={photoModalOpen}
        onClose={() => setPhotoModalOpen(false)}
        onPhotoUpdated={() => {
          // Trigger refresh of user image
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
      />
    </div>
  );
}
