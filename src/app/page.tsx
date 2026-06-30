import Link from 'next/link'
import { Building, ShieldCheck, Smartphone, LineChart, ChevronRight, CheckCircle2, Lock } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0099CC] selection:text-white">
      
      {/* Navigation Bar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0B2E59] rounded flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-[#0B2E59] tracking-tight">RSSPP</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-sm font-bold text-gray-600 hover:text-[#0099CC] uppercase tracking-wide transition-colors">Features</a>
              <a href="#security" className="text-sm font-bold text-gray-600 hover:text-[#0099CC] uppercase tracking-wide transition-colors">Security</a>
              <a href="#about" className="text-sm font-bold text-gray-600 hover:text-[#0099CC] uppercase tracking-wide transition-colors">About Us</a>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="hidden md:flex text-sm font-bold text-[#0B2E59] uppercase tracking-wide hover:text-[#0099CC] transition-colors"
              >
                Admin Portal
              </Link>
              <Link 
                href="/login" 
                className="bg-[#0099CC] hover:bg-[#007ba6] text-white px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wide shadow-lg shadow-[#0099CC]/30 transition-all hover:-translate-y-0.5"
              >
                Passbook Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#0B2E59] z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          {/* Decorative gradients */}
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#0099CC] opacity-20 blur-[120px]"></div>
          <div className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#004d80] opacity-30 blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8">
            <span className="flex w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-xs font-bold text-white uppercase tracking-widest">Core Banking System Live</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-8 leading-tight">
            The Digital Foundation for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0099CC] to-[#66ccff]">Cooperative Banking</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-blue-100 font-medium mb-10 leading-relaxed">
            Welcome to the Rashtriya Sahara Sahkarita Prabandhan Pranali (RSSPP). A secure, transparent, and next-generation ledger platform for managing deposits and loans.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-[#0099CC] hover:bg-[#007ba6] text-white px-8 py-4 rounded font-bold uppercase tracking-wide transition-all shadow-[0_0_40px_rgba(0,153,204,0.4)] hover:shadow-[0_0_60px_rgba(0,153,204,0.6)] flex items-center justify-center gap-2"
            >
              Access Digital Passbook <ChevronRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded font-bold uppercase tracking-wide transition-all backdrop-blur-sm flex items-center justify-center"
            >
              System Admin Login
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
            <div className="flex items-center gap-3 text-gray-600 font-bold uppercase text-sm tracking-wider">
              <ShieldCheck className="w-6 h-6 text-[#0099CC]" /> Bank Grade Security
            </div>
            <div className="flex items-center gap-3 text-gray-600 font-bold uppercase text-sm tracking-wider">
              <Lock className="w-6 h-6 text-[#0099CC]" /> End-to-End Encrypted
            </div>
            <div className="flex items-center gap-3 text-gray-600 font-bold uppercase text-sm tracking-wider">
              <CheckCircle2 className="w-6 h-6 text-[#0099CC]" /> 100% Transparent Ledgers
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-[#0099CC] font-bold tracking-wide uppercase text-sm mb-2">Core Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#0B2E59]">Built for Modern Financial Societies</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F4F6F9] rounded-xl p-8 border border-gray-100 hover:border-[#0099CC]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm mb-6 text-[#0B2E59]">
                <Smartphone className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-[#0B2E59] mb-3">Digital Passbook</h4>
              <p className="text-gray-600 leading-relaxed font-medium">
                Customers can view their deposit and loan accounts instantly via a secure, mobile-friendly interface anytime, anywhere.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F4F6F9] rounded-xl p-8 border border-gray-100 hover:border-[#0099CC]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm mb-6 text-[#0B2E59]">
                <LineChart className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-[#0B2E59] mb-3">Dual Account Ledgers</h4>
              <p className="text-gray-600 leading-relaxed font-medium">
                Strict separation of Credit (Deposit) and Debit (Loan) ledgers ensures accurate accounting and 100% financial transparency.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F4F6F9] rounded-xl p-8 border border-gray-100 hover:border-[#0099CC]/30 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-sm mb-6 text-[#0B2E59]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-[#0B2E59] mb-3">Secure Core Processing</h4>
              <p className="text-gray-600 leading-relaxed font-medium">
                A highly secure transaction gateway for administrators with role-based access, automated receipts, and haptic validations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#0B2E59] border-t-8 border-[#0099CC]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">Ready to manage your account?</h2>
          <p className="text-blue-200 text-lg mb-10 font-medium">
            Login with your registered mobile number and 4-digit PIN to access your real-time financial statements.
          </p>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 bg-white text-[#0B2E59] px-8 py-4 rounded font-extrabold uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-xl"
          >
            LOGIN SECURELY <Lock className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-gray-500" />
            <span className="text-xl font-bold text-gray-400 tracking-widest">RSSPP</span>
          </div>
          <p className="text-gray-500 text-sm font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} Rashtriya Sahara Sahkarita Prabandhan Pranali. All rights reserved. <br className="hidden sm:block" />
            Core Banking Software Infrastructure.
          </p>
        </div>
      </footer>

    </div>
  )
}
