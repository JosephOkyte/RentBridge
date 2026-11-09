import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, KeyRound, Building2, Home, Scale, Sparkles } from 'lucide-react';

export default async function SignUpPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const role = resolvedParams?.role || '';

  const roleMeta = {
    tenant: { title: 'Verified Tenant', icon: KeyRound, color: 'text-[#0369A1] bg-[#E0F2FE] border-[#0369A1]/30' },
    landlord: { title: 'Verified Landlord', icon: Building2, color: 'text-[#2D5A43] bg-[#EBF2ED] border-[#2D5A43]/30' },
    caretaker: { title: 'Resident Caretaker', icon: Home, color: 'text-amber-800 bg-amber-100 border-amber-300' },
    lawyer: { title: 'Legal Counsel / Lawyer', icon: Scale, color: 'text-indigo-800 bg-indigo-100 border-indigo-300' },
  }[role] || null;

  const Icon = roleMeta?.icon || ShieldCheck;

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center items-center p-4 py-8">
      <div className="mb-6 text-center space-y-2 max-w-md mx-auto">
        <Link href="/get-started" className="inline-flex items-center gap-1.5 text-xs text-[#2D5A43] font-bold hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change Role / Back to Role Selection</span>
        </Link>

        <div className="flex items-center justify-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center font-black text-lg">
            RB
          </div>
          <span className="text-2xl font-black text-[#151816] tracking-tight">RentBridge</span>
        </div>

        {roleMeta ? (
          <div className="pt-1 flex flex-col items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border ${roleMeta.color}`}>
              <Icon className="w-3.5 h-3.5" />
              <span>Registering as: {roleMeta.title}</span>
            </span>
            <p className="text-[11px] text-[#8F8372]">
              Strictly zero middleman commission • ₦0 inspection fees
            </p>
          </div>
        ) : (
          <div className="pt-1">
            <p className="text-xs text-[#8F8372] font-medium">
              Direct Landlord-Tenant Marketplace • Strictly Zero Street Agents
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-1 text-[11px] text-[#2D5A43] font-bold underline mt-1">
              <span>Choose your role upfront for proper account setup →</span>
            </Link>
          </div>
        )}
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E8DFC8] p-4 flex justify-center">
        <SignUp
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
          unsafeMetadata={role ? { role } : undefined}
          appearance={{
            elements: {
              formButtonPrimary: 'bg-[#2D5A43] hover:bg-[#1E3F2F] text-white font-bold',
              card: 'shadow-none',
            },
          }}
        />
      </div>
    </div>
  );
}
