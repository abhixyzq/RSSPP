'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon, LogOut, ArrowDownToLine, ArrowUpFromLine, Search, Filter, TrendingUp, User, ShieldCheck } from 'lucide-react'

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

  // Calculate Running Balances
  let currentJamaBal = 0
  let currentNikasiBal = 0
  let currentEarnedInterestBal = 0
  
  const transactionsWithBalance = [...transactions].reverse().map(tx => {
     let runningBalance = 0
     let earnedInterest = 0
     const amt = Number(tx.amount)
     
     if (tx.transaction_type.startsWith('JAMA')) {
        if (tx.transaction_type === 'JAMA_DEPOSIT' || tx.transaction_type === 'JAMA_PRINCIPAL') {
           currentJamaBal += amt
        } else if (tx.transaction_type === 'JAMA_EARNED_INTEREST') {
           earnedInterest = amt
           currentEarnedInterestBal += amt
        } else if (tx.transaction_type === 'JAMA_WITHDRAWAL') {
           if (currentEarnedInterestBal > 0) {
             if (amt <= currentEarnedInterestBal) {
               currentEarnedInterestBal -= amt
             } else {
               const remainder = amt - currentEarnedInterestBal
               currentEarnedInterestBal = 0
               currentJamaBal -= remainder
             }
           } else {
             currentJamaBal -= amt
           }
        }
        runningBalance = currentJamaBal
     } else {
        if (tx.transaction_type === 'NIKASI_LOAN' || tx.transaction_type === 'NIKASI_PRINCIPAL') {
           currentNikasiBal += amt
        } else if (tx.transaction_type === 'NIKASI_REPAY_PRINCIPAL') {
           currentNikasiBal -= amt
        }
        runningBalance = currentNikasiBal
     }
     
     return { ...tx, runningBalance, earnedInterest }
  }).reverse()

  const filteredTransactions = transactionsWithBalance.filter((tx) => {
    if (activeTab === 'JAMA') return tx.transaction_type.startsWith('JAMA')
    if (activeTab === 'NIKASI') return tx.transaction_type.startsWith('NIKASI')
    return true
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] font-sans text-slate-600 dark:text-gray-300 selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-100 overflow-x-hidden relative flex flex-col transition-colors duration-500">
      
      {/* Dynamic Background Effects (Matches Home Page) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/bg-abstract.png')] bg-cover bg-center opacity-20 dark:opacity-30 mix-blend-overlay transition-opacity duration-500"></div>
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full blur-[120px] transition-colors duration-500"></div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-400/10 dark:bg-blue-900/10 rounded-full blur-[150px] transition-colors duration-500"></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-50 w-full pt-6 pb-4 px-6 lg:px-12 flex justify-between items-center shrink-0 border-b border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md transition-colors duration-500">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
          <span className="text-lg font-medium tracking-widest text-slate-900 dark:text-white transition-colors">अपना स्वयं सहायता समूह<span className="text-cyan-600 dark:text-cyan-400">.</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-cyan-400"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </nav>

      {/* Main Dashboard Panel */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-10 flex-1 flex flex-col lg:flex-row gap-10 lg:gap-16 w-full items-start">
        
        {/* Left Side: Account Info & Passbook Card */}
        <div className="w-full lg:w-[380px] space-y-8 flex-shrink-0">
          
          {/* Header Typography */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/20 backdrop-blur-md transition-colors">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-cyan-600 dark:text-cyan-400">Live System</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white transition-colors">
                My <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">Passbook</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold">
                {profile.full_name} • Member Account
              </p>
            </div>
          </div>

          {/* Account Category Switcher (Sleek Glassmorphic style) */}
          <div className="flex p-1 rounded-2xl bg-white/70 dark:bg-gradient-to-bl dark:from-white/10 dark:to-black/40 border border-slate-200 dark:border-white/20 shadow-md backdrop-blur-xl">
            <button 
              onClick={() => setActiveTab('JAMA')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-medium uppercase tracking-[0.15em] transition-all ${
                activeTab === 'JAMA' 
                  ? 'bg-slate-900 dark:bg-white/10 text-white dark:text-cyan-400 shadow-lg' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Deposit (जमा)
            </button>
            <button 
              onClick={() => setActiveTab('NIKASI')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-medium uppercase tracking-[0.15em] transition-all ${
                activeTab === 'NIKASI' 
                  ? 'bg-slate-900 dark:bg-white/10 text-white dark:text-red-400 shadow-lg' 
                  : 'text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Loan (निकासी)
            </button>
          </div>

          {/* Premium Glassmorphism Card */}
          <div className="relative w-full group">
            {/* Ambient Background glow under card */}
            <div className={`absolute inset-0 blur-[60px] rounded-3xl transition-all duration-500 ${
              activeTab === 'JAMA' ? 'bg-cyan-500/10 dark:bg-cyan-500/20' : 'bg-red-500/10 dark:bg-red-500/20'
            }`}></div>
            
            {/* Main Card */}
            <div className="relative bg-white/70 dark:bg-gradient-to-bl dark:from-white/10 dark:to-black/40 border border-slate-200 dark:border-white/20 rounded-3xl backdrop-blur-xl p-8 shadow-2xl transition-all duration-300">
              
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10`}>
                    {activeTab === 'JAMA' ? (
                      <ArrowDownToLine className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    ) : (
                      <ArrowUpFromLine className="w-5 h-5 text-red-500 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-slate-400 dark:text-gray-400 leading-none">
                      {activeTab === 'JAMA' ? 'Current Deposit' : 'Outstanding Loan'}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-800 dark:text-white mt-1">
                      {activeTab === 'JAMA' ? 'कुल जमा राशि' : 'कुल निकासी (उधार)'}
                    </p>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 text-[9px] font-bold tracking-widest text-slate-500 dark:text-gray-400">
                  INR
                </div>
              </div>

              {/* Amount Display */}
              <div className="mb-10">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-slate-400 dark:text-gray-500 text-2xl font-light">₹</span>
                  <h2 className="text-4xl font-light tracking-tight text-slate-950 dark:text-white leading-none">
                    {formatCurrency(activeTab === 'JAMA' ? totalJama : totalNikasi).replace('₹', '')}
                  </h2>
                </div>
              </div>

              {/* Holder Details */}
              <div className="pt-6 border-t border-slate-200/60 dark:border-white/10 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] font-medium text-slate-400 dark:text-gray-400 mb-1">Account Holder</p>
                  <p className="text-slate-900 dark:text-white text-xs font-semibold uppercase truncate">{profile.full_name}</p>
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.2em] font-medium text-slate-400 dark:text-gray-400 mb-1">Mobile No</p>
                  <p className="text-slate-900 dark:text-white text-xs font-semibold tracking-wider">
                    {profile.mobile_number}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Side: Statement History Table */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light text-slate-900 dark:text-white tracking-wide">
              Statement <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500">History</span>
            </h2>
          </div>

          {/* Transactions Table Container */}
          <div className="w-full rounded-3xl bg-white/70 dark:bg-gradient-to-bl dark:from-white/10 dark:to-black/40 border border-slate-200 dark:border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col transition-all">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-[9px] font-bold text-slate-400 dark:text-gray-400 uppercase tracking-[0.2em] border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20">
                    <th className="px-6 py-4">Transaction Details</th>
                    <th className="px-6 py-4">Date & Time</th>
                    {activeTab === 'NIKASI' && <th className="px-6 py-4 text-right">Interest Paid</th>}
                    {activeTab === 'JAMA' && <th className="px-6 py-4 text-right text-cyan-600 dark:text-cyan-400">Earned Interest</th>}
                    <th className="px-6 py-4 text-right">Amount (+/-)</th>
                    <th className="px-6 py-4 text-right bg-slate-500/5 dark:bg-white/5">Running Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'NIKASI' ? 5 : 5} className="p-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 mb-4 border border-slate-200/50 dark:border-white/10">
                            <Search className="w-5 h-5 text-slate-400 dark:text-gray-500" />
                          </div>
                          <p className="text-slate-500 dark:text-gray-400 text-xs">No transaction history available.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const type = tx.transaction_type
                      const isDepositAccount = type.startsWith('JAMA')
                      const amtString = formatCurrency(Number(tx.amount))
                      const balString = formatCurrency(tx.runningBalance)
                      
                      let actionText = ''
                      let actionTextHi = ''
                      let isPositiveEffect = false
                      let iconBg = ''
                      let iconText = ''
                      const isInterest = type === 'NIKASI_REPAY_INTEREST'
                      
                      if (type === 'JAMA_DEPOSIT' || type === 'JAMA_PRINCIPAL') {
                        actionText = 'Deposit'
                        actionTextHi = 'जमा'
                        isPositiveEffect = true
                        iconBg = 'bg-cyan-50 dark:bg-cyan-950/30'
                        iconText = 'text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30'
                      } else if (type === 'JAMA_WITHDRAWAL') {
                        actionText = 'Withdrawal'
                        actionTextHi = 'निकासी'
                        isPositiveEffect = false
                        iconBg = 'bg-amber-50 dark:bg-amber-950/30'
                        iconText = 'text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30'
                      } else if (type === 'NIKASI_LOAN' || type === 'NIKASI_PRINCIPAL') {
                        actionText = 'Loan Issued'
                        actionTextHi = 'उधार दिया'
                        isPositiveEffect = false
                        iconBg = 'bg-red-50 dark:bg-red-950/30'
                        iconText = 'text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                      } else if (type === 'NIKASI_REPAY_PRINCIPAL') {
                        actionText = 'Principal Repayment'
                        actionTextHi = 'मूल वापसी'
                        isPositiveEffect = true
                        iconBg = 'bg-cyan-50 dark:bg-cyan-950/30'
                        iconText = 'text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30'
                      } else if (type === 'NIKASI_REPAY_INTEREST') {
                        actionText = 'Interest Paid'
                        actionTextHi = 'ब्याज भरा'
                        isPositiveEffect = false
                        iconBg = 'bg-red-50 dark:bg-red-950/30'
                        iconText = 'text-red-500 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                      } else if (type === 'JAMA_EARNED_INTEREST') {
                        actionText = 'Interest Earned'
                        actionTextHi = 'ब्याज मिला'
                        isPositiveEffect = true
                        iconBg = 'bg-cyan-50 dark:bg-cyan-950/30'
                        iconText = 'text-cyan-600 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30'
                      }

                      return (
                        <tr key={tx.id} className="hover:bg-slate-100/30 dark:hover:bg-white/5 transition-colors duration-200 group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg} ${iconText}`}>
                                {isPositiveEffect ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-medium text-slate-900 dark:text-white">
                                  {actionText} <span className="text-[10px] text-slate-400 dark:text-gray-400 font-light">({actionTextHi})</span>
                                </span>
                                <span className="text-[9px] font-semibold tracking-wider text-slate-400 dark:text-gray-500 mt-0.5 uppercase">
                                  {tx.description ? (tx.description.toUpperCase() === 'MONTHLY BULK INTEREST CREDIT' ? 'MONTHLY INTEREST' : tx.description) : (isDepositAccount ? 'DEPOSIT ACCOUNT' : 'LOAN ACCOUNT')}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col justify-center">
                              <span className="text-xs font-semibold text-slate-900 dark:text-white">{formatDate(tx.transaction_date)}</span>
                              <span className="text-[10px] text-slate-400 dark:text-gray-400 mt-0.5">{formatTime(tx.transaction_date)}</span>
                            </div>
                          </td>
                          {activeTab === 'NIKASI' && (
                            <td className="px-6 py-4 text-right">
                              <span className={`text-xs font-bold tabular-nums tracking-tight ${isInterest ? 'text-red-500 dark:text-red-400' : 'text-slate-400 dark:text-gray-500'}`}>
                                {isInterest ? amtString : '-'}
                              </span>
                            </td>
                          )}
                          {activeTab === 'JAMA' && (
                            <td className="px-6 py-4 text-right">
                              <span className={`text-xs font-bold tabular-nums tracking-tight ${tx.transaction_type === 'JAMA_EARNED_INTEREST' ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-gray-500'}`}>
                                {tx.transaction_type === 'JAMA_EARNED_INTEREST' ? `+${formatCurrency(tx.earnedInterest)}` : '-'}
                              </span>
                            </td>
                          )}
                          <td className="px-6 py-4 text-right">
                            <span className={`text-xs font-bold tabular-nums tracking-tight ${(isInterest || tx.transaction_type === 'JAMA_EARNED_INTEREST') ? 'text-slate-400 dark:text-gray-500' : isPositiveEffect ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-900 dark:text-white'}`}>
                              {(isInterest || tx.transaction_type === 'JAMA_EARNED_INTEREST') ? '-' : `${isPositiveEffect ? '+' : '-'} ${amtString}`}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right bg-slate-500/5 dark:bg-white/5">
                            <span className="text-[14px] font-bold tabular-nums tracking-tight text-slate-950 dark:text-white">
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
