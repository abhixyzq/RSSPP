'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon, LogOut, ArrowDownToLine, ArrowUpFromLine, Search, Filter, CheckCircle2, TrendingUp, IndianRupee } from 'lucide-react'
import { useTheme } from 'next-themes'

// Define the shape of our props
type Profile = {
  id: string
  full_name: string
  mobile_number: string
  role: string
}

type Transaction = {
  id: string
  amount: number
  transaction_type: string
  description: string | null
  transaction_date: string
}

type DashboardProps = {
  profile: Profile
  transactions: Transaction[]
  totalJama: number
  totalNikasi: number
  totalInterestPaid: number
  totalEarnedInterest: number
}

// Helpers
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export default function DashboardClientUI({
  profile,
  transactions,
  totalJama,
  totalNikasi,
  totalInterestPaid,
  totalEarnedInterest,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'JAMA' | 'NIKASI'>('JAMA')
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calculate Running Balances and Earned Interest
  let currentJamaBal = 0;
  let currentNikasiBal = 0;
  
  const transactionsWithBalance = [...transactions].reverse().map(tx => {
     let runningBalance = 0;
     let earnedInterest = 0;
     const amt = Number(tx.amount);
     
     if (tx.transaction_type.startsWith('JAMA')) {
        if (tx.transaction_type === 'JAMA_DEPOSIT' || tx.transaction_type === 'JAMA_PRINCIPAL') {
           currentJamaBal += amt;
        } else if (tx.transaction_type === 'JAMA_WITHDRAWAL') {
           currentJamaBal -= amt;
        } else if (tx.transaction_type === 'JAMA_EARNED_INTEREST') {
           earnedInterest = amt;
        }
        runningBalance = currentJamaBal;
     } else {
        if (tx.transaction_type === 'NIKASI_LOAN' || tx.transaction_type === 'NIKASI_PRINCIPAL') {
           currentNikasiBal += amt;
        } else if (tx.transaction_type === 'NIKASI_REPAY_PRINCIPAL') {
           currentNikasiBal -= amt;
        }
        runningBalance = currentNikasiBal;
     }
     
     return { ...tx, runningBalance, earnedInterest };
  }).reverse();

  // Filter logic
  const filteredTransactions = transactionsWithBalance.filter((tx) => {
    if (activeTab === 'JAMA') return tx.transaction_type.startsWith('JAMA')
    if (activeTab === 'NIKASI') return tx.transaction_type.startsWith('NIKASI')
    return true
  })

  // Get initials for avatar
  const initials = profile.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const isDarkMode = mounted && resolvedTheme === 'dark'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] font-sans flex flex-col transition-colors duration-500 text-slate-600 dark:text-gray-300">
      
      {/* 1. Header (Clean, Corporate Navbar) */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#030712]/80 border-b border-slate-200 dark:border-white/5 transition-colors duration-500 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
            <span className="text-md font-semibold tracking-wider text-slate-900 dark:text-white transition-colors uppercase">
              अपना स्वयं सहायता समूह<span className="text-cyan-600 dark:text-cyan-400">.</span>
            </span>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-5">
            
            <div className="hidden md:flex items-center gap-3 mr-2">
              <div className="text-right">
                <div className="text-[14px] font-semibold tracking-tight text-slate-900 dark:text-white transition-colors">{profile.full_name}</div>
                <div className="text-[10px] font-medium tracking-widest text-slate-500 dark:text-gray-400 uppercase transition-colors">{profile.role === 'admin' ? 'एडमिन' : 'सदस्य'}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{initials}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block transition-colors"></div>

            <button
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-cyan-400"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="p-2.5 rounded-full bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 transition-colors"
                aria-label="Sign Out"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* 2. Main Content Layout */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-10">
        
        {/* Left Column: Account Overview */}
        <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-8">
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light tracking-tight text-slate-900 dark:text-white transition-colors">मेरा पासबुक</h1>
            <span className="text-[10px] font-bold tracking-widest px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20">LIVE SYSTEM</span>
          </div>

          {/* Solid Professional Tabs */}
          <div className="flex p-1.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
            <button 
              onClick={() => setActiveTab('JAMA')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-[13px] font-medium uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'JAMA' 
                  ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Deposit (जमा)
            </button>
            <button 
              onClick={() => setActiveTab('NIKASI')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-[13px] font-medium uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'NIKASI' 
                  ? 'bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Loan (निकासी)
            </button>
          </div>

          {/* Premium Glassmorphic Card */}
          <div className={`w-full rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 border border-slate-200 dark:border-white/10 group ${
            activeTab === 'JAMA' 
              ? 'bg-gradient-to-br from-cyan-600 to-blue-600 dark:from-cyan-900/40 dark:to-blue-950/40' 
              : 'bg-gradient-to-br from-rose-600 to-red-600 dark:from-rose-950/40 dark:to-red-950/40'
          }`}>
            
            {/* Animated Glow Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-700 group-hover:opacity-10 group-hover:scale-110"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-20 rounded-full blur-2xl -ml-10 -mb-10"></div>
            
            {/* Card Content */}
            <div className="relative z-10 flex flex-col h-full text-white">
              
              {/* Card Top */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20">
                    {activeTab === 'JAMA' ? <ArrowDownToLine className="w-5 h-5 text-cyan-200" /> : <ArrowUpFromLine className="w-5 h-5 text-red-200" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/60 text-[10px] font-black tracking-widest uppercase">
                      {activeTab === 'JAMA' ? 'Current Deposit' : 'Outstanding Loan'}
                    </span>
                    <span className="text-white/90 text-[13px] font-semibold">
                      {activeTab === 'JAMA' ? 'कुल जमा राशि' : 'कुल निकासी (उधार)'}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                  <span className="text-white/80 text-[10px] font-bold tracking-widest">INR</span>
                </div>
              </div>

              {/* Balance (Middle) */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-white/60 text-2xl font-light">₹</span>
                  <h2 className="text-[42px] font-black tracking-tighter text-white leading-none drop-shadow-md">
                    {formatCurrency(activeTab === 'JAMA' ? totalJama : totalNikasi).replace('₹', '')}
                  </h2>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-white/50 text-[10px] font-black tracking-widest uppercase mb-1">Account Holder</p>
                  <p className="text-white text-[14px] font-semibold tracking-wide uppercase drop-shadow-sm">{profile.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[10px] font-black tracking-widest uppercase mb-1">Mobile No</p>
                  <p className="text-white text-[14px] font-semibold tracking-widest drop-shadow-sm">
                    {profile.mobile_number.slice(0, 5)} {profile.mobile_number.slice(5)}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Extra Info Cards for NIKASI (Interest Display) */}
          {activeTab === 'NIKASI' && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 flex items-center justify-between transition-all duration-300 hover:shadow-md">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-50 dark:bg-rose-950/20">
                     <TrendingUp className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black tracking-widest uppercase mb-0.5 text-slate-400 dark:text-gray-500">Total Interest Paid</p>
                     <p className="text-[12px] font-bold text-slate-800 dark:text-white">कुल भरा गया ब्याज</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[20px] font-black tracking-tight text-rose-600 dark:text-rose-400">
                     {formatCurrency(totalInterestPaid)}
                  </p>
               </div>
            </div>
          )}

          {/* Extra Info Cards for JAMA (Earned Interest Display) */}
          {activeTab === 'JAMA' && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 flex items-center justify-between transition-all duration-300 hover:shadow-md">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-50 dark:bg-cyan-950/20">
                     <TrendingUp className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black tracking-widest uppercase mb-0.5 text-slate-400 dark:text-gray-500">Interest Earned (2%)</p>
                     <p className="text-[12px] font-bold text-slate-800 dark:text-white">कुल मिला ब्याज</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className="text-[20px] font-black tracking-tight text-cyan-600 dark:text-cyan-400">
                     +{formatCurrency(totalEarnedInterest)}
                  </p>
               </div>
            </div>
          )}

        </div>

        {/* Right Column: Transactions */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 mt-4 lg:mt-0">
          
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-light tracking-tight text-slate-900 dark:text-white">लेनदेन का इतिहास (Statement History)</h2>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400 text-[12px] font-semibold uppercase tracking-wider transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-gray-400 text-[12px] font-semibold uppercase tracking-wider transition-colors">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Transactions Table Container */}
          <div className="w-full rounded-[1.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-black/40 shadow-lg overflow-hidden flex flex-col transition-all">
            
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                     <tr className="text-[11px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-[#151515]/30">
                        <th className="px-6 py-4">Transaction Details</th>
                        <th className="px-6 py-4">Date & Time</th>
                        {activeTab === 'NIKASI' && (
                           <th className="px-6 py-4 text-right">Interest Paid</th>
                        )}
                        {activeTab === 'JAMA' && (
                           <th className="px-6 py-4 text-right text-purple-500 dark:text-purple-400">Earned Interest</th>
                        )}
                        <th className="px-6 py-4 text-right">Amount (+/-)</th>
                        <th className="px-6 py-4 text-right bg-blue-50/30 dark:bg-blue-900/5">Running Balance</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                     {filteredTransactions.length === 0 ? (
                        <tr>
                           <td colSpan={activeTab === 'NIKASI' ? 5 : 4} className="p-16 text-center">
                              <div className="flex flex-col items-center justify-center">
                                 <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-slate-100 dark:bg-white/5">
                                    <Search className="w-8 h-8 text-slate-400 dark:text-gray-500 opacity-50" />
                                 </div>
                                 <p className="text-slate-400 dark:text-gray-500 text-[15px] font-medium">No transaction history available.</p>
                              </div>
                           </td>
                        </tr>
                     ) : (
                        filteredTransactions.map((tx, index) => {
                           const type = tx.transaction_type;
                           const isDepositAccount = type.startsWith('JAMA');
                           const amtString = formatCurrency(Number(tx.amount));
                           const balString = formatCurrency(tx.runningBalance);
                           
                           let actionText = '';
                           let actionTextHi = '';
                           let isPositiveEffect = false;
                           let iconBg = '';
                           let iconText = '';
                           const isInterest = type === 'NIKASI_REPAY_INTEREST';
                           
                           if (type === 'JAMA_DEPOSIT' || type === 'JAMA_PRINCIPAL') {
                              actionText = 'Deposit';
                              actionTextHi = 'जमा';
                              isPositiveEffect = true;
                              iconBg = 'bg-emerald-50 dark:bg-emerald-950/20';
                              iconText = 'text-emerald-600 dark:text-emerald-400';
                           } else if (type === 'JAMA_WITHDRAWAL') {
                              actionText = 'Withdrawal';
                              actionTextHi = 'निकासी';
                              isPositiveEffect = false;
                              iconBg = 'bg-orange-50 dark:bg-orange-950/20';
                              iconText = 'text-orange-600 dark:text-orange-400';
                           } else if (type === 'NIKASI_LOAN' || type === 'NIKASI_PRINCIPAL') {
                              actionText = 'Loan Issued';
                              actionTextHi = 'उधार दिया';
                              isPositiveEffect = false;
                              iconBg = 'bg-red-50 dark:bg-red-950/20';
                              iconText = 'text-red-600 dark:text-red-400';
                           } else if (type === 'NIKASI_REPAY_PRINCIPAL') {
                              actionText = 'Principal Repayment';
                              actionTextHi = 'मूल वापसी';
                              isPositiveEffect = true;
                              iconBg = 'bg-blue-50 dark:bg-blue-950/20';
                              iconText = 'text-blue-600 dark:text-blue-400';
                           } else if (type === 'NIKASI_REPAY_INTEREST') {
                              actionText = 'Interest Paid';
                              actionTextHi = 'ब्याज भरा';
                              isPositiveEffect = false;
                              iconBg = 'bg-purple-50 dark:bg-purple-950/20';
                              iconText = 'text-purple-600 dark:text-purple-400';
                           } else if (type === 'JAMA_EARNED_INTEREST') {
                              actionText = 'Interest Earned';
                              actionTextHi = 'ब्याज मिला';
                              isPositiveEffect = true;
                              iconBg = 'bg-purple-50 dark:bg-purple-950/20';
                              iconText = 'text-purple-600 dark:text-purple-400';
                           }

                           return (
                              <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors duration-200 group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg} ${iconText}`}>
                                          {isPositiveEffect ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                                       </div>
                                       {/* Description */}
                                       <div className="flex flex-col">
                                          <span className="text-[14px] font-semibold text-slate-900 dark:text-white transition-colors">
                                             {actionText} <span className="font-normal text-xs opacity-75">({actionTextHi})</span>
                                          </span>
                                          <span className="text-[11px] font-medium tracking-wider text-slate-400 dark:text-gray-500 mt-0.5 uppercase transition-colors">
                                             {tx.description ? (tx.description.toUpperCase() === 'MONTHLY BULK INTEREST CREDIT' ? 'MONTHLY INTEREST' : tx.description) : (isDepositAccount ? 'DEPOSIT ACCOUNT' : 'LOAN ACCOUNT')}
                                          </span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex flex-col justify-center">
                                       <span className="text-[13px] font-semibold text-slate-800 dark:text-white transition-colors">{formatDate(tx.transaction_date)}</span>
                                       <span className="text-[11px] font-normal text-slate-400 dark:text-gray-500 mt-0.5 transition-colors">{formatTime(tx.transaction_date)}</span>
                                    </div>
                                 </td>
                                 {activeTab === 'NIKASI' && (
                                    <td className="px-6 py-4 text-right">
                                       <span className={`text-[14px] font-bold tabular-nums tracking-tight ${isInterest ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-gray-500'}`}>
                                          {isInterest ? amtString : '-'}
                                       </span>
                                    </td>
                                 )}
                                 {activeTab === 'JAMA' && (
                                    <td className="px-6 py-4 text-right">
                                       <span className={`text-[14px] font-bold tabular-nums tracking-tight ${tx.transaction_type === 'JAMA_EARNED_INTEREST' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-gray-500'}`}>
                                          {tx.transaction_type === 'JAMA_EARNED_INTEREST' ? `+${formatCurrency(tx.earnedInterest)}` : '-'}
                                       </span>
                                    </td>
                                 )}
                                 <td className="px-6 py-4 text-right">
                                    <span className={`text-[15px] font-bold tabular-nums tracking-tight ${(isInterest || tx.transaction_type === 'JAMA_EARNED_INTEREST') ? 'text-slate-400 dark:text-gray-500' : isPositiveEffect ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                       {(isInterest || tx.transaction_type === 'JAMA_EARNED_INTEREST') ? '-' : `${isPositiveEffect ? '+' : '-'} ${amtString}`}
                                    </span>
                                 </td>
                                 <td className="px-6 py-4 text-right bg-blue-50/10 dark:bg-blue-900/5">
                                    <span className="text-[16px] font-bold tabular-nums tracking-tight text-slate-900 dark:text-white">
                                       {balString}
                                    </span>
                                 </td>
                              </tr>
                           )
                        })
                     )}
                  </tbody>
               </table>
            </div>

          </div>
        </div>

      </main>
    </div>
  )
}
