import Link from 'next/link'
import { ArrowRight, ChevronRight, Coins, ShieldCheck, Activity, Zap, Cpu } from 'lucide-react'
import CustomerLogin from './components/CustomerLogin'
import { ThemeToggle } from '@/components/ThemeToggle'

export default function LandingPage() {
  return (
    <div className="min-h-screen lg:h-screen bg-slate-50 dark:bg-[#030712] font-sans text-slate-600 dark:text-gray-300 selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-100 overflow-x-hidden lg:overflow-hidden relative flex flex-col transition-colors duration-500">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] transition-colors duration-500"></div>
        
        {/* Central glowing orb */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen transition-colors duration-500"></div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-400/10 dark:bg-blue-900/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen transition-colors duration-500"></div>
      </div>

      {/* Minimalist Navigation */}
      <nav className="relative z-50 w-full pt-6 pb-4 px-6 lg:px-12 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShieldCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400 transition-colors" />
            <div className="absolute inset-0 bg-cyan-400/50 blur-md rounded-full -z-10"></div>
          </div>
          <span className="text-lg font-medium tracking-widest text-slate-900 dark:text-white transition-colors">RSSPP<span className="text-cyan-600 dark:text-cyan-400">.</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-slate-500 dark:text-gray-500">
          <a href="#platform" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Platform</a>
          <a href="#security" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Security</a>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/admin-login" 
            className="hidden md:block text-xs uppercase tracking-[0.15em] font-medium text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Admin
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
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-cyan-600 dark:text-cyan-400">Live System</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-slate-900 dark:text-white leading-[1.1] transition-colors">
              Smart <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">Finance</span> <br />
              for Modern Users
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-gray-400 font-light leading-relaxed max-w-md tracking-wide transition-colors">
              Manage your money with simple, secure, and intelligent financial solutions. Built for fast transactions and reliable management.
            </p>

            <div className="flex items-center gap-6 pt-4">
              {/* Fake UI Tag */}
              <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-slate-500 dark:text-gray-500 transition-colors">
                <div className="w-1 h-1 rounded-full bg-cyan-500/50"></div>
                v2.0.4 Online
              </div>
            </div>
          </div>

          {/* Right: Customer Login Component */}
          <div className="relative w-full flex items-center justify-center">
             <CustomerLogin />
          </div>
        </div>
      </main>

      {/* Key Features Minimalist Bar (Hidden on mobile) */}
      <section className="hidden lg:block relative z-10 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md shrink-0 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white tracking-widest uppercase mb-2 transition-colors">Modern Wallet</h4>
                <p className="text-xs text-slate-600 dark:text-gray-500 font-light leading-relaxed transition-colors">Smart finance solutions built to simplify digital payments and manage assets efficiently.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white tracking-widest uppercase mb-2 transition-colors">Seamless Transfer</h4>
                <p className="text-xs text-slate-600 dark:text-gray-500 font-light leading-relaxed transition-colors">Secure digital payments made simple for modern cooperative society members.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-white shadow-[0_0_10px_#94a3b8] dark:shadow-[0_0_10px_#ffffff]"></div>
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white tracking-widest uppercase mb-2 transition-colors">Total Security</h4>
                <p className="text-xs text-slate-600 dark:text-gray-500 font-light leading-relaxed transition-colors">Encrypted data vaults and strictly enforced KYC protocols for peace of mind.</p>
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
