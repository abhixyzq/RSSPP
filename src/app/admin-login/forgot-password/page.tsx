'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { requestAdminPasswordReset, verifyAdminOtp, updateAdminPassword } from '@/actions/auth'
import Link from 'next/link'
import { Shield, Key, AlertCircle, ArrowRight, Lock, Mail, ArrowLeft, CheckCircle2, Home } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRequestOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await requestAdminPasswordReset(null, formData)
      if (res.error) {
        setErrorMsg(res.error)
      } else if (res.success) {
        setEmail(res.email)
        setStep(2)
      }
    })
  }

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)
    formData.append('email', email)
    
    startTransition(async () => {
      const res = await verifyAdminOtp(null, formData)
      if (res.error) {
        setErrorMsg(res.error)
      } else if (res.success) {
        setStep(3)
      }
    })
  }

  const handleUpdatePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      const res = await updateAdminPassword(null, formData)
      if (res?.error) {
        setErrorMsg(res.error)
      }
    })
  }

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
        
        {/* Centered Recovery Component */}
        <div className="relative w-full flex items-center justify-center">
          <div className="relative w-full max-w-[380px] mx-auto group">
            {/* Background glow */}
            <div className="absolute inset-0 bg-red-100 dark:bg-red-500/10 blur-[80px] rounded-full transition-colors duration-500"></div>
            
            {/* Recovery Card */}
            <div className="relative bg-white/70 dark:bg-gradient-to-bl dark:from-white/10 dark:to-black/40 border border-slate-200 dark:border-white/20 rounded-3xl backdrop-blur-xl p-8 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300">
              
              {/* Back to Login Button */}
              <button 
                onClick={() => router.push('/admin-login')}
                className="absolute top-6 left-6 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                title="Back to Login"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-8 mt-4 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-4 transition-colors">
                  <Shield className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                  <span className="text-[10px] uppercase tracking-[0.1em] font-medium text-slate-500 dark:text-gray-300 transition-colors">
                    {step === 1 ? 'Recovery' : step === 2 ? 'Verification' : 'Update Password'}
                  </span>
                </div>
                <h2 className="text-xl font-light text-slate-900 dark:text-white tracking-wide transition-colors text-center">
                  {step === 1 ? 'Password Recovery' : step === 2 ? 'Verify OTP' : 'Set Password'}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-2 text-center leading-relaxed">
                  {step === 1 ? 'Enter your Admin ID to receive a reset code' : step === 2 ? 'Check your email for the code' : 'Set a new secure password'}
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-200 p-3.5 rounded-xl text-xs font-medium border border-red-200 dark:border-red-500/30 flex items-start gap-2.5 backdrop-blur-md transition-colors animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
                  <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* STEP 1: Request OTP */}
              {step === 1 && (
                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="adminId" className="block text-[10px] uppercase tracking-[0.15em] font-medium text-slate-500 dark:text-gray-400 transition-colors">
                      Administrator ID (Email)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400 dark:text-red-500/70 transition-colors" />
                      </div>
                      <input
                        id="adminId"
                        name="adminId"
                        type="email"
                        required
                        autoComplete="off"
                        placeholder="admin@example.com"
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-red-500/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-colors font-medium text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="group relative w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 dark:bg-white/10 dark:hover:bg-cyan-500/20 border border-slate-700 dark:border-white/20 dark:hover:border-cyan-500/50 text-white py-3.5 px-4 rounded-xl font-medium uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 overflow-hidden shadow-lg dark:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    {isPending ? 'Sending...' : 'Send OTP'}
                    {!isPending && <ArrowRight className="w-3 h-3 ml-1" />}
                  </button>
                </form>
              )}

              {/* STEP 2: Verify OTP */}
              {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 p-3.5 rounded-xl text-xs text-center border border-blue-100 dark:border-blue-900/30 mb-4 transition-colors">
                    OTP sent to: <span className="font-semibold block mt-1 text-slate-900 dark:text-white">{email}</span>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="otp" className="block text-[10px] uppercase tracking-[0.15em] font-medium text-slate-500 dark:text-gray-400 transition-colors">
                      Enter 6-Digit OTP
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Key className="h-4 w-4 text-slate-400 dark:text-red-500/70 transition-colors" />
                      </div>
                      <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        maxLength={6}
                        placeholder="••••••"
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-red-500/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-colors font-bold tracking-[0.5em] text-lg text-center"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="group relative w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 dark:bg-white/10 dark:hover:bg-cyan-500/20 border border-slate-700 dark:border-white/20 dark:hover:border-cyan-500/50 text-white py-3.5 px-4 rounded-xl font-medium uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 overflow-hidden shadow-lg dark:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 dark:via-cyan-400/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    {isPending ? 'Verifying...' : 'Verify OTP'}
                    {!isPending && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('')
                      const fd = new FormData()
                      fd.append('adminId', email)
                      startTransition(async () => {
                        const res = await requestAdminPasswordReset(null, fd)
                        if (res?.error) {
                          setErrorMsg(res.error)
                        } else {
                          setErrorMsg('A new OTP has been sent to your email.')
                        }
                      })
                    }}
                    disabled={isPending}
                    className="w-full mt-3 flex items-center justify-center text-[10px] uppercase tracking-[0.15em] font-medium text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-cyan-400 transition-colors disabled:opacity-50"
                  >
                    Didn't receive code? Resend OTP
                  </button>
                </form>
              )}

              {/* STEP 3: Set New Password */}
              {step === 3 && (
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.15em] font-medium text-slate-500 dark:text-gray-400 transition-colors">
                      New Security Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400 dark:text-red-500/70 transition-colors" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        minLength={6}
                        placeholder="Enter New Password"
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:border-red-500/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-colors font-medium text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="group relative w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 px-4 rounded-xl font-medium uppercase tracking-[0.2em] text-xs transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 overflow-hidden shadow-lg"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    {isPending ? 'Updating...' : 'Save & Login'}
                    {!isPending && <CheckCircle2 className="w-3.5 h-3.5 ml-1" />}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Key Features Bar */}
      <section className="relative z-10 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md shrink-0 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white tracking-widest uppercase mb-2 transition-colors">Digital Passbook</h4>
                <p className="text-xs text-slate-600 dark:text-gray-500 font-light leading-relaxed transition-colors">Members can view their Jama & Udhaar balances, transaction logs, and accrued interest in real-time.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white tracking-widest uppercase mb-2 transition-colors">Interest Payouts</h4>
                <p className="text-xs text-slate-600 dark:text-gray-500 font-light leading-relaxed transition-colors">Admin-controlled dynamic interest calculations for deposits and loan statements.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white shadow-[0_0_10px_#94a3b8] dark:shadow-[0_0_10px_#ffffff]"></div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white tracking-widest uppercase mb-2 transition-colors">Secure & Trustworthy</h4>
                <p className="text-xs text-slate-600 dark:text-gray-500 font-light leading-relaxed transition-colors">Secure password-protected member logins and a dedicated admin panel to build community trust.</p>
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
