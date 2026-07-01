import Link from 'next/link'
import { ArrowRight, ChevronRight, Coins, ShieldCheck, Activity, Zap, Cpu } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="h-screen bg-[#030712] font-sans text-gray-300 selection:bg-cyan-500/30 selection:text-cyan-100 overflow-hidden relative flex flex-col">
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Central glowing orb */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      {/* Minimalist Navigation */}
      <nav className="relative z-50 w-full pt-6 pb-4 px-6 lg:px-12 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <div className="absolute inset-0 bg-cyan-400/50 blur-md rounded-full -z-10"></div>
          </div>
          <span className="text-lg font-medium tracking-widest text-white">RSSPP<span className="text-cyan-400">.</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-gray-500">
          <a href="#platform" className="hover:text-cyan-400 transition-colors">Platform</a>
          <a href="#security" className="hover:text-cyan-400 transition-colors">Security</a>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            href="/admin-login" 
            className="hidden md:block text-xs uppercase tracking-[0.15em] font-medium text-gray-500 hover:text-white transition-colors"
          >
            Admin
          </Link>
          <Link 
            href="/login" 
            className="group relative inline-flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-[0.15em] text-white transition-all overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
            Platform
            <div className="w-5 h-5 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-cyan-400 transition-colors">
              <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex-1 flex flex-col justify-center min-h-0 w-full">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Typography */}
          <div className="space-y-8 relative">
            {/* Decorative crosshair */}
            <div className="absolute -top-12 -left-8 w-4 h-4 border-t border-l border-cyan-500/50"></div>
            
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/20 backdrop-blur-md">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-cyan-400">Live System</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
              Smart <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Finance</span> <br />
              for Modern Users
            </h1>

            <p className="text-sm sm:text-base text-gray-400 font-light leading-relaxed max-w-md tracking-wide">
              Manage your money with simple, secure, and intelligent financial solutions. Built for fast transactions and reliable management.
            </p>

            <div className="flex items-center gap-6 pt-4">
              <Link 
                href="/login" 
                className="group relative inline-flex items-center justify-center gap-4 bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 px-6 py-3 rounded-full text-xs font-medium uppercase tracking-[0.2em] text-white transition-all"
              >
                Start
                <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-cyan-400 transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
              
              {/* Fake UI Tag */}
              <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-gray-500">
                <div className="w-1 h-1 rounded-full bg-cyan-500/50"></div>
                v2.0.4 Online
              </div>
            </div>
          </div>

          {/* Right: Floating Tech Elements */}
          <div className="relative h-[400px] lg:h-[600px] w-full perspective-1000">
            {/* Central abstract wallet/cards */}
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="relative w-64 h-80 transform-gpu preserve-3d group">
                  {/* Glowing core */}
                  <div className="absolute inset-0 bg-cyan-500/20 blur-3xl rounded-full"></div>
                  
                  {/* Floating glass panel 1 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl backdrop-blur-xl transform-gpu rotate-y-[-20deg] rotate-x-[10deg] translate-x-[-20px] translate-y-[-20px] shadow-[0_0_50px_rgba(34,211,238,0.15)] flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
                    <div className="w-16 h-1 bg-white/20 rounded-full absolute top-6"></div>
                    <Cpu className="w-16 h-16 text-cyan-400/50" />
                  </div>
                  
                  {/* Floating glass panel 2 */}
                  <div className="absolute inset-0 bg-gradient-to-bl from-cyan-900/40 to-black/40 border border-cyan-500/30 rounded-2xl backdrop-blur-md transform-gpu rotate-y-[15deg] rotate-x-[5deg] translate-x-[30px] translate-y-[30px] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-end p-6 animate-[float_8s_ease-in-out_infinite_reverse]">
                    <div className="w-full flex justify-between items-end">
                      <div className="space-y-2">
                        <div className="w-8 h-1 bg-cyan-400/50 rounded-full"></div>
                        <div className="text-xl font-light text-white tracking-widest">**** 4092</div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-cyan-400/50 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-cyan-400" />
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Floating Tags */}
            <div className="absolute top-[20%] right-[10%] bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 animate-[float_5s_ease-in-out_infinite]">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]"></div>
              <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-white">Secure System</span>
            </div>

            <div className="absolute bottom-[30%] left-[5%] bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center gap-4 animate-[float_7s_ease-in-out_infinite_1s]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-gray-400">Performance</span>
                </div>
                <div className="text-xl font-light text-white">135K<span className="text-cyan-400">%</span></div>
              </div>
              <Activity className="w-8 h-8 text-cyan-500/50" />
            </div>
            
            <div className="absolute top-[40%] left-[80%] text-white/20">
               <div className="h-[100px] w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Key Features Minimalist Bar */}
      <section className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-md shrink-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 lg:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_10px_#22d3ee]"></div>
              <div>
                <h4 className="text-sm font-medium text-white tracking-widest uppercase mb-2">Modern Wallet</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">Smart finance solutions built to simplify digital payments and manage assets efficiently.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
              <div>
                <h4 className="text-sm font-medium text-white tracking-widest uppercase mb-2">Seamless Transfer</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">Secure digital payments made simple for modern cooperative society members.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="mt-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]"></div>
              <div>
                <h4 className="text-sm font-medium text-white tracking-widest uppercase mb-2">Total Security</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">Encrypted data vaults and strictly enforced KYC protocols for peace of mind.</p>
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
