'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { adminLogin } from '@/actions/auth'
import Link from 'next/link'
import { Shield, Key, AlertCircle, ArrowRight, Lock, Home } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:hover:bg-cyan-500/20 border border-slate-700 dark:border-white/20 dark:hover:border-cyan-500/50 text-white py-3.5 px-4 rounded-xl font-medium uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 overflow-hidden shadow-lg dark:shadow-[0_0_20px_rgba(34,211,238,0.1)] dark:hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]"
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
      {pending ? 'Authenticating...' : 'Access Portal'}
      {!pending && <ArrowRight className="w-3 h-3 ml-1" />}
    </button>
  )
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(adminLogin, null)

  return (
    <div className="min-h-screen lg:h-screen bg-slate-50 dark:bg-[#030712] font-sans text-slate-600 dark:text-gray-300 selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-100 overflow-x-hidden lg:overflow-hidden relative flex flex-col transition-colors duration-500">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Abstract Background Image */}
        <div className="absolute inset-0 bg-[url('/bg-abstract.png')] bg-cover bg-center opacity-20 dark:opacity-30 mix-blend-overlay transition-opacity duration-500"></div>
        
        {/* Central glowing orb */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen transition-colors duration-500"></div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-400/10 dark:bg-blue-900/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen transition-colors duration-500"></div>
      </div>

      {/* Minimalist Navigation */}
      <nav className="relative z-50 w-full pt-6 pb-4 px-6 lg:px-12 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
          <span className="text-lg font-medium tracking-widest text-slate-900 dark:text-white transition-colors">अपना स्वयं सहायता समूह<span className="text-cyan-600 dark:text-cyan-400">.</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-cyan-400"
            title="Home Page"
          >
            <Home className="w-5 h-5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex-1 flex flex-col justify-center py-8 lg:py-0 lg:min-h-0 w-full">
        
        {/* Centered Admin Login Component */}
        <div className="relative w-full flex items-center justify-center">
          <div className="relative w-full max-w-[380px] mx-auto group">
            {/* Background glow */}
            <div className="absolute inset-0 bg-red-100 dark:bg-red-500/10 blur-[80px] rounded-full transition-colors duration-500"></div>
            
            {/* Login Card */}
            <div className="relative bg-white/70 dark:bg-gradient-to-bl dark:from-white/10 dark:to-black/40 border border-slate-200 dark:border-white/20 rounded-3xl backdrop-blur-xl p-8 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300">
              
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4 transition-colors">
                  <Shield className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                  <span className="text-[10px] uppercase tracking-[0.1em] font-medium text-slate-500 dark:text-gray-300 transition-colors">System Admin</span>
                </div>
                <h2 className="text-2xl font-light text-slate-900 dark:text-white tracking-wide transition-colors">Sign In</h2>
              </div>

              {/* Form */}
              <form action={formAction} className="space-y-6">
                
                {/* Error Message */}
                {state?.error && (
                  <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-200 p-3.5 rounded-xl text-xs font-medium border border-red-200 dark:border-red-500/30 flex items-start gap-2.5 backdrop-blur-md transition-colors animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                    <p>{state.error}</p>
                  </div>
                )}

                {/* Admin ID Input */}
                <div className="space-y-2">
                  <label htmlFor="adminId" className="block text-[10px] uppercase tracking-[0.15em] font-medium text-slate-500 dark:text-gray-400 transition-colors">
                    Administrator ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400 dark:text-red-500/70 transition-colors" />
                    </div>
                    <input
                      id="adminId"
                      name="adminId"
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="Enter Admin ID"
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-red-500/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-colors font-medium text-sm tracking-wide"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.15em] font-medium text-slate-500 dark:text-gray-400 transition-colors">
                    Security Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Key className="h-4 w-4 text-slate-400 dark:text-red-500/70 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="Enter Password"
                      className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-red-500/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-colors font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-2">
                  <Link href="/admin-login/forgot-password" className="text-red-600 dark:text-red-400 text-xs font-bold hover:underline transition-colors">
                    Forgot Password?
                  </Link>
                </div>

                <SubmitButton />
                
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Key Features Bar */}
      <section className="relative z-10 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md shrink-0 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white tracking-widest uppercase mb-2 transition-colors">Member Control</h4>
                <p className="text-xs text-slate-600 dark:text-gray-500 font-light leading-relaxed transition-colors">Register new members, manage status, and oversee society parameters effortlessly.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"></div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white tracking-widest uppercase mb-2 transition-colors">Bulk Interest</h4>
                <p className="text-xs text-slate-600 dark:text-gray-500 font-light leading-relaxed transition-colors">Calculate and deposit monthly interest in bulk across all member ledger accounts dynamically.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white shadow-[0_0_10px_#94a3b8] dark:shadow-[0_0_10px_#ffffff]"></div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white tracking-widest uppercase mb-2 transition-colors">Audit Ledger</h4>
                <p className="text-xs text-slate-600 dark:text-gray-500 font-light leading-relaxed transition-colors">Full society ledger audits, jama-nikasi tracking, and exportable financial reports.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  )
}
