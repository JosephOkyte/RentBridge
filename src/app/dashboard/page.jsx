'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { ShieldCheck, ArrowLeft, KeyRound, Building2, Home, Scale, Lock } from 'lucide-react';

export default function DashboardIndexRouter() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    async function evaluateRoute() {
      if (!isLoaded) return;
      if (!user) {
        router.replace('/sign-in');
        return;
      }

      try {
        const res = await fetch('/api/profile');
        const data = await res.json();

        // 1. If user already has an active profile
        if (data.profile) {
          const role = data.profile.role;
          if (data.isAdmin || role === 'admin') {
            router.replace('/dashboard/admin');
            return;
          }
          if (['landlord', 'lawyer', 'caretaker'].includes(role)) {
            router.replace('/dashboard/landlord');
            return;
          }
          router.replace('/dashboard/tenant');
          return;
        }

        // 2. Check if admin by clerk metadata or primary email
        const email = user.primaryEmailAddress?.emailAddress;
        if (user.publicMetadata?.role === 'admin' || email?.endsWith('@rentbridge.ng') || email === 'josephokyte@gmail.com') {
          router.replace('/dashboard/admin');
          return;
        }

        // 3. Check if role was pre-selected at /get-started (stored in Clerk metadata or cookie)
        let intendedRole = user.unsafeMetadata?.role || user.publicMetadata?.role;
        if (!intendedRole && typeof document !== 'undefined') {
          const cookieMatch = document.cookie.match(/rentbridge_intended_role=([^;]+)/);
          if (cookieMatch) intendedRole = cookieMatch[1];
          if (!intendedRole && typeof localStorage !== 'undefined') {
            intendedRole = localStorage.getItem('rentbridge_role');
          }
        }

        if (intendedRole && ['tenant', 'landlord', 'caretaker', 'lawyer'].includes(intendedRole)) {
          const commitRes = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: intendedRole }),
          });
          const commitData = await commitRes.json();
          if (commitRes.ok) {
            if (intendedRole === 'tenant') {
              router.replace('/dashboard/tenant');
            } else {
              router.replace('/dashboard/landlord');
            }
            return;
          }
        }

        // 4. If no role was committed yet, redirect to 4-card /get-started
        router.replace('/get-started');
      } catch (err) {
        console.warn('Dashboard routing check error:', err);
        router.replace('/get-started');
      } finally {
        setLoading(false);
      }
    }

    evaluateRoute();
  }, [user, isLoaded, router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 rounded-full border-4 border-[#2D5A43] border-t-transparent animate-spin"></div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-[#151816]">Routing to your dedicated RentBridge portal...</p>
        <p className="text-xs text-[#8F8372]">Direct Nigerian real estate • Strictly ₦0 middleman fees</p>
      </div>
    </div>
  );
}
