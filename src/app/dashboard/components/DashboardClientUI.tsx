'use client'

import { useState } from 'react'
import { Sun, Moon, LogOut, ArrowDownToLine, ArrowUpFromLine, Search, Filter } from 'lucide-react'

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
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'JAMA' | 'NIKASI'>('JAMA')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Filter logic
  const filteredTransactions = transactions.filter((tx) => {
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

  // Professional Theme configuration (Enterprise/Stripe aesthetic)
  const theme = {
    bg: isDarkMode ? 'bg-[#0A0A0A]' : 'bg-[#F7F9FC]',
    surface: isDarkMode ? 'bg-[#141414] border-[#2A2A2A]' : 'bg-white border-gray-200',
    surfaceHover: isDarkMode ? 'hover:bg-[#1A1A1A]' : 'hover:bg-gray-50',
    textMain: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-[#2A2A2A]' : 'border-gray-200',
    divider: isDarkMode ? 'divide-[#2A2A2A]' : 'divide-gray-100',
    card: activeTab === 'JAMA' 
      ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-white' 
      : 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white',
  }

  return (
    <div className={`min-h-screen ${theme.bg} font-sans flex flex-col transition-colors duration-200`}>
      
      {/* 1. Header (Clean, Corporate Navbar) */}
      <header className={`${isDarkMode ? 'bg-[#141414] border-b-[#2A2A2A]' : 'bg-white border-b border-gray-200'} sticky top-0 z-50 transition-colors duration-200`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${isDarkMode ? 'bg-white text-black' : 'bg-gray-900 text-white'} rounded-md flex items-center justify-center font-bold text-sm tracking-tighter`}>
              RS
            </div>
            <div className="flex flex-col">
              <span className={`text-[15px] font-bold tracking-tight leading-none ${theme.textMain}`}>RSSPP</span>
              <span className={`text-[11px] font-medium uppercase tracking-wider ${theme.textMuted}`}>Micro-Finance</span>
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            
            <div className="hidden md:flex items-center gap-3 mr-4">
              <div className="text-right">
                <div className={`text-[13px] font-semibold ${theme.textMain}`}>{profile.full_name}</div>
                <div className={`text-[11px] ${theme.textMuted}`}>{profile.role.toUpperCase()}</div>
              </div>
              <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-gray-100'} flex items-center justify-center border ${theme.border}`}>
                <span className={`text-xs font-bold ${theme.textMain}`}>{initials}</span>
              </div>
            </div>

            <div className={`h-6 w-px ${theme.border} hidden md:block`}></div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-md ${theme.surfaceHover} transition-colors`}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-gray-400 hover:text-white" /> : <Moon className="w-4 h-4 text-gray-500 hover:text-gray-900" />}
            </button>
            
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className={`p-2 rounded-md ${theme.surfaceHover} transition-colors text-red-500 hover:text-red-600`}
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
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Account Overview */}
        <div className="w-full lg:w-[360px] flex-shrink-0 flex flex-col gap-6">
          
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h1 className={`text-xl font-semibold tracking-tight ${theme.textMain}`}>Passbook (पासबुक)</h1>
          </div>

          {/* Solid Professional Tabs */}
          <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100/80'} border ${theme.border}`}>
            <button 
              onClick={() => setActiveTab('JAMA')}
              className={`flex-1 py-1.5 px-3 rounded-md text-[13px] font-medium transition-all ${
                activeTab === 'JAMA' 
                  ? `${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-white text-gray-900 shadow-sm'} border ${isDarkMode ? 'border-[#3A3A3A]' : 'border-gray-200/50'}` 
                  : `${theme.textMuted} hover:${theme.textMain}`
              }`}
            >
              Deposit (जमा)
            </button>
            <button 
              onClick={() => setActiveTab('NIKASI')}
              className={`flex-1 py-1.5 px-3 rounded-md text-[13px] font-medium transition-all ${
                activeTab === 'NIKASI' 
                  ? `${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-white text-gray-900 shadow-sm'} border ${isDarkMode ? 'border-[#3A3A3A]' : 'border-gray-200/50'}` 
                  : `${theme.textMuted} hover:${theme.textMain}`
              }`}
            >
              Loan (निकासी)
            </button>
          </div>

          {/* Premium Solid Card */}
          <div className={`w-full rounded-2xl p-7 ${theme.card} shadow-xl relative overflow-hidden`}>
            {/* Very subtle noise/gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50"></div>
            
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${activeTab === 'JAMA' ? 'bg-emerald-400' : 'bg-orange-400'}`}></div>
                  <span className="text-gray-300 text-[11px] font-semibold tracking-wider uppercase">
                    {activeTab === 'JAMA' ? 'Current Deposit (कुल जमा)' : 'Outstanding Loan (कुल निकासी)'}
                  </span>
                </div>
                <span className="text-gray-400 text-xs font-medium opacity-50">INR</span>
              </div>

              <div>
                <h2 className="text-[36px] font-semibold tracking-tighter leading-none mb-1">
                  {formatCurrency(activeTab === 'JAMA' ? totalJama : totalNikasi).replace('₹', '')}
                </h2>
                <p className="text-gray-400 text-[13px]">
                  Total {activeTab === 'JAMA' ? 'accumulated (जमा राशि)' : 'borrowed (उधार राशि)'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-1">Account Holder (खाताधारक)</p>
                  <p className="text-white text-[13px] font-medium">{profile.full_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-[11px] uppercase tracking-wider mb-1">Mobile (मोबाइल)</p>
                  <p className="text-white text-[13px] font-medium tracking-wide">
                    {profile.mobile_number.slice(0, 5)} {profile.mobile_number.slice(5)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Transactions */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-semibold tracking-tight ${theme.textMain}`}>Recent Transactions (हाल के लेनदेन)</h2>
            
            {/* Desktop Actions */}
            <div className="hidden sm:flex gap-2">
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${theme.border} ${theme.surface} ${theme.surfaceHover} ${theme.textMuted} text-[13px] font-medium transition-colors`}>
                <Filter className="w-3.5 h-3.5" />
                Filter
              </button>
              <button className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${theme.border} ${theme.surface} ${theme.surfaceHover} ${theme.textMuted} text-[13px] font-medium transition-colors`}>
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
            </div>
          </div>

          {/* Transactions Data Container */}
          <div className={`w-full rounded-xl border ${theme.border} ${theme.surface} shadow-sm overflow-hidden flex flex-col`}>
            
            {/* Table Header (Desktop Only) */}
            <div className={`hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b ${theme.border} ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50/50'}`}>
              <div className={`col-span-5 text-[12px] font-semibold ${theme.textMuted} uppercase tracking-wider`}>Description (विवरण)</div>
              <div className={`col-span-3 text-[12px] font-semibold ${theme.textMuted} uppercase tracking-wider`}>Date (तारीख)</div>
              <div className={`col-span-2 text-[12px] font-semibold ${theme.textMuted} uppercase tracking-wider text-right`}>Type (प्रकार)</div>
              <div className={`col-span-2 text-[12px] font-semibold ${theme.textMuted} uppercase tracking-wider text-right`}>Amount (राशि)</div>
            </div>

            {/* List Body */}
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <p className={`${theme.textMuted} text-[14px]`}>No transactions recorded yet.</p>
              </div>
            ) : (
              <div className={`flex flex-col ${theme.divider}`}>
                {filteredTransactions.map((tx) => {
                  const isJama = tx.transaction_type.startsWith('JAMA')
                  return (
                    // Row Layout: Flex on mobile, Grid on desktop
                    <div key={tx.id} className={`flex justify-between md:grid md:grid-cols-12 gap-4 px-4 md:px-6 py-4 items-center ${theme.surfaceHover} transition-colors group`}>
                      
                      {/* Mobile View: Flex child. Desktop View: Grid Column 1 */}
                      <div className="md:col-span-5 flex items-center gap-3 overflow-hidden">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isJama 
                            ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600') 
                            : (isDarkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600')
                        }`}>
                          {isJama ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className={`text-[14px] font-medium truncate ${theme.textMain}`}>
                            {tx.description || (isJama ? 'Deposit (जमा)' : 'Withdrawal (निकासी)')}
                          </span>
                          <span className={`text-[12px] md:hidden ${theme.textMuted}`}>
                            {formatDate(tx.transaction_date)} • {formatTime(tx.transaction_date)}
                          </span>
                        </div>
                      </div>

                      {/* Desktop Only Columns */}
                      <div className="hidden md:flex flex-col col-span-3">
                        <span className={`text-[13px] ${theme.textMain}`}>{formatDate(tx.transaction_date)}</span>
                        <span className={`text-[12px] ${theme.textMuted}`}>{formatTime(tx.transaction_date)}</span>
                      </div>
                      
                      <div className="hidden md:flex justify-end col-span-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          isJama 
                            ? (isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700')
                            : (isDarkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-700')
                        }`}>
                          {isJama ? 'CREDIT' : 'DEBIT'}
                        </span>
                      </div>

                      {/* Amount */}
                      <div className="md:col-span-2 flex justify-end shrink-0 pl-2">
                        <span className={`text-[15px] font-semibold tabular-nums tracking-tight ${
                          isDarkMode ? theme.textMain : 'text-gray-900'
                        }`}>
                          {isJama ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                        </span>
                      </div>

                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  )
}
