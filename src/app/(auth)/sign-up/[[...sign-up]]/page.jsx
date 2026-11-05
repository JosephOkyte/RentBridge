import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center items-center p-4">
      <div className="mb-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#2D5A43] font-bold hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to RentBridge Home</span>
        </Link>
        <div className="flex items-center justify-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#2D5A43] text-white flex items-center justify-center font-black text-lg">
            RB
          </div>
          <span className="text-2xl font-black text-[#151816] tracking-tight">RentBridge</span>
        </div>
        <p className="text-xs text-[#8F8372] mt-1 font-medium">
          Create Account • ₦0 Inspection Fees • Verified Custodians Only
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E8DFC8] p-4 flex justify-center">
        <SignUp
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

