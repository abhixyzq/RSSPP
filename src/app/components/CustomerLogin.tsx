'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from '@/actions/auth'
import { Phone, Lock, AlertCircle, ArrowRight } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-cyan-500/20 border border-slate-700 dark:border-white/20 dark:hover:border-cyan-500/50 text-white py-3.5 px-4 rounded-xl font-medium uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 overflow-hidden shadow-lg dark:shadow-[0_0_20px_rgba(34,211,238,0.1)] dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      {pending ? 'Verifying...' : 'Access Passbook'}
      {!pending && <ArrowRight className="w-3 h-3 ml-1" />}
    </button>
  )
}

export default function CustomerLogin() {
  const [state, formAction] = useActionState(login, null)

  return (
    <div className="relative w-full max-w-[380px] mx-auto transform-gpu preserve-3d group">
      
      {/* Background glow */}
      <div className="absolute inset-0 bg-blue-100 dark:bg-cyan-500/20 blur-[80px] rounded-full transition-colors duration-500"></div>
      
      {/* Login Card */}
      <div className="relative bg-white/70 dark:bg-gradient-to-bl dark:from-white/10 dark:to-black/40 border border-slate-200 dark:border-white/20 rounded-3xl backdrop-blur-xl p-8 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] transform-gpu hover:rotate-y-[5deg] hover:rotate-x-[2deg] transition-all duration-700">
        
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4 transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_#06b6d4] dark:shadow-[0_0_8px_#22d3ee]"></div>
            <span className="text-[10px] uppercase tracking-[0.1em] font-medium text-slate-500 dark:text-gray-300 transition-colors">Member Portal</span>
          </div>
          <h2 className="text-2xl font-light text-slate-900 dark:text-white tracking-wide transition-colors">Sign In</h2>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-6">
          
          {/* Error Message */}
          {state?.error && (
            <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-200 p-3.5 rounded-xl text-xs font-medium border border-red-200 dark:border-red-500/30 flex items-start gap-2.5 backdrop-blur-md transition-colors">
              <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
              <p>{state.error}</p>
            </div>
          )}

          {/* Mobile Input */}
          <div className="space-y-2">
            <label htmlFor="mobile" className="block text-[10px] uppercase tracking-[0.15em] font-medium text-slate-500 dark:text-gray-400 transition-colors">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-4 w-4 text-slate-400 dark:text-cyan-500/70 transition-colors" />
              </div>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                pattern="[0-9]{10}"
                maxLength={10}
                required
                placeholder="10-digit number"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-cyan-500/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors font-medium text-sm tracking-widest"
              />
            </div>
          </div>

          {/* PIN Input */}
          <div className="space-y-2">
            <label htmlFor="pin" className="block text-[10px] uppercase tracking-[0.15em] font-medium text-slate-500 dark:text-gray-400 transition-colors">
              4-Digit PIN
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400 dark:text-cyan-500/70 transition-colors" />
              </div>
              <input
                type="password"
                id="pin"
                name="pin"
                pattern="[0-9]{4}"
                maxLength={4}
                required
                placeholder="••••"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-cyan-500/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-colors font-bold tracking-[0.5em] text-lg"
              />
            </div>
          </div>

          <SubmitButton />
          
        </form>
      </div>

    </div>
  )
}
