'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from '@/actions/auth'
import { Phone, Lock, BookOpen, AlertCircle, ArrowRight } from 'lucide-react'

// Extracted submit button to utilize useFormStatus hook
function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3.5 px-4 rounded-xl font-semibold text-[15px] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
    >
      {pending ? 'Verifying...' : 'Sign In'}
      {!pending && <ArrowRight className="w-4 h-4 ml-1" />}
    </button>
  )
}

export default function LoginPage() {
  // Using useActionState (Next.js 15 / React 19 standard)
  const [state, formAction] = useActionState(login, null)

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center items-center p-4 font-sans selection:bg-gray-200">
      
      {/* Container */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-200 p-8 sm:p-10">
        
        {/* Brand / Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center shadow-md mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Sign in to RSSPP</h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">Micro-Finance Digital Ledger</p>
        </div>

        {/* Login Form */}
        <form action={formAction} className="space-y-5">
          
          {/* Error Message */}
          {state?.error && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p>{state.error}</p>
            </div>
          )}

          {/* Mobile Number Input */}
          <div className="space-y-1.5">
            <label htmlFor="mobile" className="block text-[13px] font-semibold text-gray-700">
              Mobile Number (मोबाइल नंबर)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                placeholder="10-digit number"
                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-medium text-[15px]"
              />
            </div>
          </div>

          {/* PIN Input */}
          <div className="space-y-1.5">
            <label htmlFor="pin" className="block text-[13px] font-semibold text-gray-700">
              4-Digit PIN (पिन)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="password"
                id="pin"
                name="pin"
                pattern="[0-9]{4}"
                maxLength={4}
                required
                placeholder="••••"
                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-bold tracking-widest text-lg"
              />
            </div>
          </div>

          {/* Submit Button */}
          <SubmitButton />
        </form>
        
        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-[13px] text-gray-500 font-medium">
            Forgot PIN? Contact the branch administrator.
          </p>
        </div>
        
      </div>
      
      {/* Brand Watermark Footer */}
      <div className="mt-8 text-center">
        <p className="text-[12px] text-gray-400 font-semibold tracking-wider uppercase">
          RSSPP Micro-Finance
        </p>
      </div>

    </div>
  )
}
