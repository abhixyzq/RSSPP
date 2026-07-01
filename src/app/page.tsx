import Link from 'next/link'
import { ShieldCheck, LineChart, Lock, ChevronRight, Fingerprint, Banknote, Users, Activity } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] font-sans selection:bg-[#10B981] selection:text-white overflow-x-hidden">
      
      {/* Navigation Bar - Glassmorphism */}
      <nav className="fixed w-full z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0B2E59] to-[#14427c] rounded-xl flex items-center justify-center shadow-lg shadow-[#0B2E59]/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl md:text-2xl font-extrabold text-[#0B2E59] tracking-tight leading-tight">Apna Sang</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-sm font-bold text-gray-500 hover:text-[#0B2E59] uppercase tracking-widest transition-colors">Features</a>
              <a href="#security" className="text-sm font-bold text-gray-500 hover:text-[#0B2E59] uppercase tracking-widest transition-colors">Security</a>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link 
                href="/admin-login" 
                className="hidden md:flex text-sm font-bold text-gray-500 hover:text-[#0B2E59] uppercase tracking-widest transition-colors"
              >
                Admin Portal
              </Link>
              <Link 
                href="/login" 
                className="bg-[#0B2E59] hover:bg-[#071f3e] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-widest shadow-xl shadow-[#0B2E59]/20 transition-all hover:-translate-y-0.5 border border-[#0B2E59]/50"
              >
                Open Passbook
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#10B981]/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-xs font-bold text-[#0B2E59] uppercase tracking-widest">Digital Ledger is Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-[#0B2E59] tracking-tighter mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Empowering Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B2E59] to-[#10B981]">Financial Future.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-medium mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            A secure, transparent, and next-generation digital passbook for Apna Sang Sahayata Samuh. Experience instant ledger access and bank-grade security.
          </p>
          
          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-[#0B2E59] hover:bg-[#071f3e] text-white px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest shadow-xl shadow-[#0B2E59]/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Access Passbook
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link 
              href="#features" 
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#0B2E59] px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest shadow-sm border border-gray-200 transition-all flex items-center justify-center"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Floating Mockup Preview */}
        <div className="max-w-5xl mx-auto mt-20 px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="relative rounded-2xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-[#0B2E59]/10 p-2 sm:p-4 rotate-x-12 transform-gpu">
            {/* Header bar of fake app */}
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            {/* Fake Dashboard Content */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-inner p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="flex-1 space-y-6 w-full">
                <div className="h-4 bg-gray-100 rounded-full w-1/3"></div>
                <div className="h-10 bg-gray-100 rounded-xl w-3/4"></div>
                <div className="h-32 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-gray-300" />
                </div>
              </div>
              <div className="w-full md:w-72 bg-[#0B2E59] rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Total Balance</p>
                <h3 className="text-3xl font-black tracking-tight mb-6">₹45,200</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">Interest</span>
                    <span className="font-bold text-[#10B981]">+₹1,200</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/10 pt-3">
                    <span className="text-blue-200">Status</span>
                    <span className="font-bold">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-gray-200/50 bg-white/50 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-3">
            <Users className="w-4 h-4" />
            Trusted by 1000+ members across communities
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#0B2E59] tracking-tight mb-4">
              Modern Micro-Finance.
            </h2>
            <p className="text-lg text-gray-500 font-medium">
              We've digitized the traditional cooperative model, bringing transparency, speed, and security to your fingertips.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F7F9FC] border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-[#0B2E59]/5 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="w-7 h-7 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2E59] mb-3">100% Transparent Ledger</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Track every deposit, withdrawal, and interest credit in real-time. No more waiting for manual passbook updates.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F7F9FC] border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-[#0B2E59]/5 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Banknote className="w-7 h-7 text-[#0B2E59]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2E59] mb-3">Instant Calculations</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Our automated systems calculate monthly interest and loan EMIs instantly with zero margin for human error.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F7F9FC] border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-[#0B2E59]/5 transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Fingerprint className="w-7 h-7 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2E59] mb-3">Bank-Grade Security</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                Your financial data is protected with state-of-the-art encryption and strictly enforced KYC protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-[#0B2E59] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#10B981] blur-[150px] rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
              <Lock className="w-8 h-8 text-[#10B981]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
              Your data, strictly <br/> protected.
            </h2>
            <p className="text-lg text-blue-100/80 mb-8 font-medium leading-relaxed max-w-lg">
              We employ the same security infrastructure used by major financial institutions. Multi-factor authentication, regular backups, and end-to-end encryption.
            </p>
            <ul className="space-y-4">
              {['Secure PIN Authentication', 'KYC Verification (Aadhaar/PAN)', 'Automated Cloud Backups'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white font-medium">
                  <ShieldCheck className="w-5 h-5 text-[#10B981]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex-1 w-full relative">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
               <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="bg-white/10 h-12 rounded-xl flex items-center px-4 gap-4 animate-pulse" style={{ animationDelay: `${i * 150}ms` }}>
                     <div className="w-6 h-6 rounded-full bg-white/20"></div>
                     <div className="h-2 bg-white/20 rounded w-1/2"></div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F7F9FC] border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#0B2E59]" />
            <span className="text-lg font-black text-[#0B2E59] tracking-tight">Apna Sang Sahayata Samuh</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Lock className="w-3 h-3" />
            <span>Secure 256-bit SSL</span>
          </div>

          <p className="text-sm font-medium text-gray-500">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
