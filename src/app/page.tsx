import Link from 'next/link'
import { ArrowRight, ChevronRight, Coins, ShieldCheck, Activity, Zap, Cpu, User } from 'lucide-react'
import CustomerLogin from './components/CustomerLogin'

export default function LandingPage() {
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
            href="/admin-login" 
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-cyan-400"
            title="Admin Portal"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex-1 flex flex-col justify-center py-8 lg:py-0 lg:min-h-0 w-full">
        
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Typography (Hidden on mobile) */}
          <div className="hidden lg:block space-y-8 relative">
            {/* Decorative crosshair */}
            <div className="absolute -top-12 -left-8 w-4 h-4 border-t border-l border-cyan-500/50"></div>
            
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/20 backdrop-blur-md transition-colors">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-cyan-600 dark:text-cyan-400">Digital Ledger</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-slate-900 dark:text-white leading-[1.1] transition-colors">
              Smart <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">Passbook</span> <br />
              for Cooperative Societies
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 font-light leading-relaxed max-w-md tracking-wide transition-colors">
              Track savings (Jama), loans (Udhaar), and dynamic interest payouts with complete mathematical transparency. Built for modern cooperative societies.
            </p>
          </div>

          {/* Right: Customer Login Component */}
          <div className="relative w-full flex items-center justify-center">
             <CustomerLogin />
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  )
}
