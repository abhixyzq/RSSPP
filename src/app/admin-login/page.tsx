'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { adminLogin } from '@/actions/auth'
import { Shield, Key, AlertCircle, ArrowRight, Lock } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-[#0B2E59] hover:bg-[#071f3e] text-white py-3.5 px-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 shadow-lg shadow-blue-900/30"
    >
      {pending ? 'Authenticating...' : 'Access Portal'}
      {!pending && <ArrowRight className="w-5 h-5 ml-1" />}
    </button>
  )
}

export default function AdminLoginPage() {
  const [state, formAction] = useActionState(adminLogin, null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2E59] via-[#0A2040] to-black flex flex-col justify-center items-center p-4 font-sans selection:bg-blue-900 selection:text-white">
      
      {/* Container */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Top Accent Bar */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-[#0B2E59] to-purple-600"></div>

        <div className="p-8 sm:p-10">
          {/* Brand / Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#0B2E59] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-900/30 rotate-3 transition-transform hover:rotate-6">
               <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 text-center uppercase">Admin Portal</h1>
            <p className="text-gray-500 text-sm mt-1.5 font-bold uppercase tracking-widest">Restricted Access</p>
          </div>

          {/* Login Form */}
          <form action={formAction} className="space-y-5">
            
            {/* Error Message */}
            {state?.error && (
              <div className="bg-red-50 text-red-700 p-3.5 rounded-xl text-sm font-bold border border-red-200 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p>{state.error}</p>
              </div>
            )}

            {/* Admin ID Input */}
            <div className="space-y-1.5">
              <label htmlFor="adminId" className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                Administrator ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="adminId"
                  name="adminId"
                  type="text"
                  required
                  autoComplete="off"
                  placeholder="Enter Admin ID"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#0B2E59] transition-colors outline-none text-[15px] font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter Password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-[#0B2E59] transition-colors outline-none text-[15px] font-black tracking-widest text-gray-900 placeholder:font-medium placeholder:text-gray-400 placeholder:tracking-normal"
                />
              </div>
            </div>

            <div className="flex justify-end mt-2">
              <a href="/admin-login/forgot-password" className="text-[#0B2E59] text-xs font-bold hover:underline">
                Forgot Password?
              </a>
            </div>

            <SubmitButton />
            
          </form>
        </div>
      </div>
      
      {/* Footer info */}
      <div className="mt-8 text-center text-white/50 text-xs font-medium uppercase tracking-widest">
        <p>Apna Sang Sahayata Samuh &copy; {new Date().getFullYear()}</p>
        <p className="mt-1">Unauthorized access is strictly prohibited</p>
      </div>

    </div>
  )
}
