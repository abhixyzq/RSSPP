'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogOut, ArrowDownToLine, ArrowUpFromLine, Search, Filter, CheckCircle2, TrendingUp, IndianRupee } from 'lucide-react'

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
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted && resolvedTheme === 'dark'

  // Calculate Running Balances and Earned Interest
  let currentJamaBal = 0;
  let currentNikasiBal = 0;
  
  const transactionsWithBalance = [...transactions].reverse().map(tx => {
     let runningBalance = 0;
     let earnedInterest = 0;
     const amt = Number(tx.amount);
     
     if (tx.transaction_type.startsWith('JAMA')) {
        if (tx.transaction_type === 'JAMA_DEPOSIT' || tx.transaction_type === 'JAMA_PRINCIPAL') {
           // eslint-disable-next-line react-hooks/immutability
           currentJamaBal += amt;
        } else if (tx.transaction_type === 'JAMA_WITHDRAWAL') {
           // eslint-disable-next-line react-hooks/immutability
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

  // Professional Theme configuration (Premium Aesthetics)
  const theme = {
    bg: isDarkMode ? 'bg-[#050505]' : 'bg-slate-50',
    surface: isDarkMode ? 'bg-[#111111]/80 border-[#222222]/80 backdrop-blur-md' : 'bg-white border-slate-200/80 backdrop-blur-md shadow-sm',
    surfaceHover: isDarkMode ? 'hover:bg-[#1a1a1a]' : 'hover:bg-slate-50/50',
    textMain: isDarkMode ? 'text-gray-100' : 'text-slate-900',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-slate-500',
    border: isDarkMode ? 'border-[#222222]' : 'border-slate-200',
    divider: isDarkMode ? 'divide-[#222222]' : 'divide-slate-100',
  }

  return (
    <div className={`min-h-screen ${theme.bg} font-sans flex flex-col transition-colors duration-500 relative overflow-x-hidden`}>
      
      {/* Background abstract images and gradients to match homepage */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/bg-abstract.png')] bg-cover bg-center opacity-[0.04] dark:opacity-[0.08] transition-opacity duration-500 mix-blend-overlay"></div>
        <div className="absolute top-[10%] left-[10%] w-[350px] h-[350px] bg-cyan-400/5 dark:bg-cyan-900/10 rounded-full blur-[100px] transition-colors duration-500"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[450px] h-[450px] bg-blue-400/5 dark:bg-blue-900/5 rounded-full blur-[120px] transition-colors duration-500"></div>
      </div>

      {/* 1. Header (Clean, Corporate Navbar) */}
      <header className={`${isDarkMode ? 'bg-[#0a0a0a]/90 border-b-[#222222]' : 'bg-white/90 border-b border-slate-200/80'} sticky top-0 z-50 transition-colors duration-500 backdrop-blur-md`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain drop-shadow-sm" />
            <div className="flex flex-col">
              <span className={`text-[15px] font-extrabold tracking-tight leading-tight ${theme.textMain} uppercase`}>Apna Sang</span>
              <span className={`text-[12px] font-semibold tracking-widest text-[#e85d04] uppercase`}>Sahayata</span>
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-5">
            
            <div className="hidden md:flex items-center gap-3 mr-2">
              <div className="text-right">
                <div className={`text-[14px] font-bold tracking-tight ${theme.textMain}`}>{profile.full_name}</div>
                <div className={`text-[11px] font-semibold tracking-widest ${theme.textMuted}`}>{profile.role.toUpperCase()}</div>
              </div>
              <div className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-900' : 'bg-gradient-to-br from-blue-100 to-blue-50'} flex items-center justify-center shadow-sm`}>
                <span className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>{initials}</span>
              </div>
            </div>

            <div className={`h-8 w-px ${theme.border} hidden md:block`}></div>

            <button
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className={`p-2.5 rounded-full ${isDarkMode ? 'bg-[#1a1a1a] hover:bg-[#252525]' : 'bg-slate-100 hover:bg-slate-200'} transition-all`}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-gray-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className={`p-2.5 rounded-full ${isDarkMode ? 'bg-red-950/30 hover:bg-red-900/40 text-red-400' : 'bg-red-50 hover:bg-red-100 text-red-600'} transition-all`}
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
            <h1 className={`text-2xl font-black tracking-tight ${theme.textMain}`}>My Passbook</h1>
            <span className={`text-[12px] font-bold px-3 py-1 rounded-full ${isDarkMode ? 'bg-[#1a1a1a] text-gray-400' : 'bg-white text-gray-500 shadow-sm border border-gray-100'}`}>Live</span>
          </div>

          {/* Solid Professional Tabs */}
          <div className={`flex p-1.5 rounded-xl ${isDarkMode ? 'bg-[#111] border border-[#222]' : 'bg-white shadow-sm border border-gray-200'}`}>
            <button 
              onClick={() => setActiveTab('JAMA')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'JAMA' 
                  ? `${isDarkMode ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30' : 'bg-gradient-to-r from-emerald-50 to-white text-emerald-700 shadow-sm border-emerald-100'} border` 
                  : `${theme.textMuted} hover:${theme.textMain}`
              }`}
            >
              Deposit (जमा)
            </button>
            <button 
              onClick={() => setActiveTab('NIKASI')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === 'NIKASI' 
                  ? `${isDarkMode ? 'bg-gradient-to-r from-red-500/20 to-red-500/5 text-red-400 border-red-500/30' : 'bg-gradient-to-r from-red-50 to-white text-red-700 shadow-sm border-red-100'} border` 
                  : `${theme.textMuted} hover:${theme.textMain}`
              }`}
            >
              Loan (निकासी)
            </button>
          </div>

          {/* Premium Glassmorphic Card */}
          <div className={`w-full rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-all duration-500 group ${
            activeTab === 'JAMA' 
              ? 'bg-gradient-to-br from-[#0B2E59] via-[#0D3B73] to-[#124B8C]' 
              : 'bg-gradient-to-br from-[#310A14] via-[#4A0E1E] to-[#631227]'
          }`}>
            
            {/* Animated Glow Elements */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-700 group-hover:opacity-10 group-hover:scale-110`}></div>
            <div className={`absolute bottom-0 left-0 w-48 h-48 bg-black opacity-20 rounded-full blur-2xl -ml-10 -mb-10`}></div>
            
            {/* Card Content */}
            <div className="relative z-10 flex flex-col h-full">
              
              {/* Card Top */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20`}>
                    {activeTab === 'JAMA' ? <ArrowDownToLine className="w-5 h-5 text-emerald-300" /> : <ArrowUpFromLine className="w-5 h-5 text-red-300" />}
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
                  <span className="text-white/60 text-2xl font-medium">₹</span>
                  <h2 className="text-[42px] font-black tracking-tighter text-white leading-none drop-shadow-md">
                    {formatCurrency(activeTab === 'JAMA' ? totalJama : totalNikasi).replace('₹', '')}
                  </h2>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-white/50 text-[10px] font-black tracking-widest uppercase mb-1">Account Holder</p>
                  <p className="text-white text-[14px] font-bold tracking-wide uppercase drop-shadow-sm">{profile.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[10px] font-black tracking-widest uppercase mb-1">Mobile No</p>
                  <p className="text-white text-[14px] font-bold tracking-widest drop-shadow-sm">
                    {profile.mobile_number.slice(0, 5)} {profile.mobile_number.slice(5)}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Extra Info Cards for NIKASI (Interest Display) */}
          {activeTab === 'NIKASI' && (
            <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${isDarkMode ? 'bg-[#111] border-[#222] hover:bg-[#151515]' : 'bg-white border-purple-100 hover:border-purple-200 shadow-sm hover:shadow-md'}`}>
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                     <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div>
                     <p className={`text-[11px] font-black tracking-widest uppercase mb-0.5 ${theme.textMuted}`}>Total Interest Paid</p>
                     <p className={`text-[12px] font-bold ${theme.textMuted}`}>कुल भरा गया ब्याज</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className={`text-[20px] font-black tracking-tight ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                     {formatCurrency(totalInterestPaid)}
                  </p>
               </div>
            </div>
          )}

          {/* Extra Info Cards for JAMA (Earned Interest Display) */}
          {activeTab === 'JAMA' && (
            <div className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-300 ${isDarkMode ? 'bg-[#111] border-[#222] hover:bg-[#151515]' : 'bg-white border-green-100 hover:border-green-200 shadow-sm hover:shadow-md'}`}>
               <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                     <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div>
                     <p className={`text-[11px] font-black tracking-widest uppercase mb-0.5 ${theme.textMuted}`}>Interest Earned (2%)</p>
                     <p className={`text-[12px] font-bold ${theme.textMuted}`}>कुल मिला ब्याज</p>
                  </div>
               </div>
               <div className="text-right">
                  <p className={`text-[20px] font-black tracking-tight ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                     +{formatCurrency(totalEarnedInterest)}
                  </p>
               </div>
            </div>
          )}

        </div>

        {/* Right Column: Transactions */}
        <div className="flex-1 flex flex-col gap-6 min-w-0 mt-4 lg:mt-0">
          
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-xl font-bold tracking-tight ${theme.textMain}`}>Statement History</h2>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex gap-3">
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.border} ${theme.surface} ${theme.surfaceHover} ${theme.textMuted} text-[12px] font-bold uppercase tracking-wider transition-colors`}>
                <Filter className="w-4 h-4" />
                Filter
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${theme.border} ${theme.surface} ${theme.surfaceHover} ${theme.textMuted} text-[12px] font-bold uppercase tracking-wider transition-colors`}>
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Transactions Table Container */}
          <div className={`w-full rounded-[1.5rem] border ${theme.border} ${theme.surface} shadow-lg overflow-hidden flex flex-col transition-all`}>
            
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                     <tr className={`text-[11px] font-black ${theme.textMuted} uppercase tracking-widest border-b ${theme.border} ${isDarkMode ? 'bg-[#151515]' : 'bg-gray-50/80'}`}>
                        <th className="px-6 py-4">Transaction Details</th>
                        <th className="px-6 py-4">Date & Time</th>
                        {activeTab === 'NIKASI' && (
                           <th className="px-6 py-4 text-right">Interest Paid</th>
                        )}
                        {activeTab === 'JAMA' && (
                           <th className="px-6 py-4 text-right text-purple-600">Earned Interest</th>
                        )}
                        <th className="px-6 py-4 text-right">Amount (+/-)</th>
                        <th className={`px-6 py-4 text-right ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50/50'}`}>Running Balance</th>
                     </tr>
                  </thead>
                  <tbody className={theme.divider}>
                     {filteredTransactions.length === 0 ? (
                        <tr>
                           <td colSpan={activeTab === 'NIKASI' ? 5 : 4} className="p-16 text-center">
                              <div className="flex flex-col items-center justify-center">
                                 <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-[#222]' : 'bg-gray-100'}`}>
                                    <Search className={`w-8 h-8 ${theme.textMuted} opacity-50`} />
                                 </div>
                                 <p className={`${theme.textMuted} text-[15px] font-medium`}>No transaction history available.</p>
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
                              iconBg = isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50';
                              iconText = isDarkMode ? 'text-emerald-400' : 'text-emerald-600';
                           } else if (type === 'JAMA_WITHDRAWAL') {
                              actionText = 'Withdrawal';
                              actionTextHi = 'निकासी';
                              isPositiveEffect = false;
                              iconBg = isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50';
                              iconText = isDarkMode ? 'text-orange-400' : 'text-orange-600';
                           } else if (type === 'NIKASI_LOAN' || type === 'NIKASI_PRINCIPAL') {
                              actionText = 'Loan Issued';
                              actionTextHi = 'उधार दिया';
                              isPositiveEffect = false;
                              iconBg = isDarkMode ? 'bg-red-500/10' : 'bg-red-50';
                              iconText = isDarkMode ? 'text-red-400' : 'text-red-600';
                           } else if (type === 'NIKASI_REPAY_PRINCIPAL') {
                              actionText = 'Principal Repayment';
                              actionTextHi = 'मूल वापसी';
                              isPositiveEffect = true;
                              iconBg = isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50';
                              iconText = isDarkMode ? 'text-blue-400' : 'text-blue-600';
                           } else if (type === 'NIKASI_REPAY_INTEREST') {
                              actionText = 'Interest Paid';
                              actionTextHi = 'ब्याज भरा';
                              isPositiveEffect = false;
                              iconBg = isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50';
                              iconText = isDarkMode ? 'text-purple-400' : 'text-purple-600';
                           } else if (type === 'JAMA_EARNED_INTEREST') {
                              actionText = 'Interest Earned';
                              actionTextHi = 'ब्याज मिला';
                              isPositiveEffect = true;
                              iconBg = isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50';
                              iconText = isDarkMode ? 'text-purple-400' : 'text-purple-600';
                           }

                           return (
                              <tr key={tx.id} className={`${theme.surfaceHover} transition-colors duration-200 group`}>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                       <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBg} ${iconText}`}>
                                          {isPositiveEffect ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                                       </div>
                                       {/* Description */}
                                       <div className="flex flex-col">
                                          <span className={`text-[14px] font-bold ${theme.textMain}`}>
                                             {actionText} <span className="font-medium text-xs opacity-70">({actionTextHi})</span>
                                          </span>
                                          <span className={`text-[11px] font-semibold tracking-wider ${theme.textMuted} mt-0.5 uppercase`}>
                                             {tx.description ? (tx.description.toUpperCase() === 'MONTHLY BULK INTEREST CREDIT' ? 'MONTHLY INTEREST' : tx.description) : (isDepositAccount ? 'DEPOSIT ACCOUNT' : 'LOAN ACCOUNT')}
                                          </span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex flex-col justify-center">
                                       <span className={`text-[13px] font-bold ${theme.textMain}`}>{formatDate(tx.transaction_date)}</span>
                                       <span className={`text-[11px] font-medium ${theme.textMuted} mt-0.5`}>{formatTime(tx.transaction_date)}</span>
                                    </div>
                                 </td>
                                 {activeTab === 'NIKASI' && (
                                    <td className="px-6 py-4 text-right">
                                       <span className={`text-[14px] font-black tabular-nums tracking-tight ${isInterest ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') : theme.textMuted}`}>
                                          {isInterest ? amtString : '-'}
                                       </span>
                                    </td>
                                 )}
                                 {activeTab === 'JAMA' && (
                                    <td className="px-6 py-4 text-right">
                                       <span className={`text-[14px] font-black tabular-nums tracking-tight ${tx.transaction_type === 'JAMA_EARNED_INTEREST' ? (isDarkMode ? 'text-purple-400' : 'text-purple-600') : theme.textMuted}`}>
                                          {tx.transaction_type === 'JAMA_EARNED_INTEREST' ? `+${formatCurrency(tx.earnedInterest)}` : '-'}
                                       </span>
                                    </td>
                                 )}
                                 <td className="px-6 py-4 text-right">
                                    <span className={`text-[15px] font-black tabular-nums tracking-tight ${(isInterest || tx.transaction_type === 'JAMA_EARNED_INTEREST') ? theme.textMuted : isPositiveEffect ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : (isDarkMode ? theme.textMain : 'text-gray-900')}`}>
                                       {(isInterest || tx.transaction_type === 'JAMA_EARNED_INTEREST') ? '-' : `${isPositiveEffect ? '+' : '-'} ${amtString}`}
                                    </span>
                                 </td>
                                 <td className={`px-6 py-4 text-right ${isDarkMode ? 'bg-blue-900/5' : 'bg-blue-50/30'}`}>
                                    <span className={`text-[16px] font-black tabular-nums tracking-tight ${isDarkMode ? theme.textMain : 'text-gray-900'}`}>
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
