'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { requestAdminPasswordReset, verifyAdminOtp, updateAdminPassword } from '@/actions/auth'
import { Shield, Key, AlertCircle, ArrowRight, Lock, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'

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
      // If successful, it redirects automatically via the server action
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E59] via-[#0A2040] to-black flex flex-col justify-center items-center p-4 font-sans selection:bg-blue-900 selection:text-white">
      
      {/* Container */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Back Button */}
        <button 
          onClick={() => router.push('/admin-login')}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-[#0B2E59] to-purple-600"></div>

        <div className="p-8 sm:p-10">
          {/* Brand / Header */}
          <div className="flex flex-col items-center mb-8 mt-2">
            <div className="w-16 h-16 bg-[#0B2E59] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/30">
               <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-gray-900 text-center uppercase">
              {step === 1 ? 'Password Recovery' : step === 2 ? 'Verify OTP' : 'Set New Password'}
            </h1>
            <p className="text-gray-500 text-xs mt-1.5 font-bold uppercase tracking-widest text-center">
              {step === 1 ? 'Enter your Admin ID to receive an OTP' : step === 2 ? 'Check your email for the 6-digit code' : 'Secure your account'}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-sm font-bold border border-red-200 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300 mb-5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          {/* STEP 1: Request OTP */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="adminId" className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                  Administrator ID (Email)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="adminId"
                    name="adminId"
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="Enter Admin ID"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#0B2E59] transition-colors outline-none text-[15px] font-bold text-gray-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-[#0B2E59] hover:bg-[#071f3e] text-white py-3.5 px-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-lg shadow-blue-900/30"
              >
                {isPending ? 'Sending...' : 'Send OTP'}
                {!isPending && <ArrowRight className="w-5 h-5 ml-1" />}
              </button>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs font-bold text-center border border-blue-100 mb-4">
                OTP sent to: <span className="text-[#0B2E59]">{email}</span>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="otp" className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                  Enter 6-Digit OTP
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    placeholder="• • • • • •"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#0B2E59] transition-colors outline-none text-[18px] font-black tracking-[0.5em] text-center text-gray-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-[#0B2E59] hover:bg-[#071f3e] text-white py-3.5 px-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-lg shadow-blue-900/30"
              >
                {isPending ? 'Verifying...' : 'Verify OTP'}
                {!isPending && <CheckCircle2 className="w-5 h-5 ml-1" />}
              </button>
            </form>
          )}

          {/* STEP 3: Set New Password */}
          {step === 3 && (
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                  New Security Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="Enter New Password"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#0B2E59] transition-colors outline-none text-[15px] font-black tracking-widest text-gray-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 px-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-lg shadow-green-900/30"
              >
                {isPending ? 'Updating...' : 'Save & Login'}
                {!isPending && <CheckCircle2 className="w-5 h-5 ml-1" />}
              </button>
            </form>
          )}

        </div>
      </div>
      
    </div>
  )
}
