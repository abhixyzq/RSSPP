import { getVillageTotals } from '@/actions/admin'
import { Wallet, Landmark, Users, TrendingUp, Building, BarChart3, Clock, AlertTriangle, ArrowRight, UserPlus, BookOpen, Activity, Zap, History, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'
import { createAdminClient } from '@/utils/supabase/admin'

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default async function AdminDashboard() {
  const totals = await getVillageTotals()
  const supabase = createAdminClient()
  
  // Fetch 5 most recent transactions
  const { data: recentTxs } = await supabase
    .from('transactions')
    .select('*, users_profile(full_name)')
    .order('transaction_date', { ascending: false })
    .limit(5)

  const stats = [
    {
      name: 'Total Deposits (Credits)',
      value: formatCurrency(totals.totalJama),
      icon: Wallet,
      gradient: 'from-emerald-400 to-green-600',
      bgGlow: 'group-hover:bg-green-500/20 bg-green-500/10',
      iconColor: 'text-emerald-500',
      borderGlow: 'group-hover:border-green-500/50',
      description: 'Total Jama collected in branch',
    },
    {
      name: 'Total Loans (Debits)',
      value: formatCurrency(totals.totalNikasi),
      icon: Landmark,
      gradient: 'from-rose-400 to-red-600',
      bgGlow: 'group-hover:bg-red-500/20 bg-red-500/10',
      iconColor: 'text-rose-500',
      borderGlow: 'group-hover:border-red-500/50',
      description: 'Total Nikasi disbursed by branch',
    },
    {
      name: "Today's Cash Inward",
      value: formatCurrency(totals.todaysCollection),
      icon: TrendingUp,
      gradient: 'from-blue-400 to-indigo-600',
      bgGlow: 'group-hover:bg-blue-500/20 bg-blue-500/10',
      iconColor: 'text-blue-500',
      borderGlow: 'group-hover:border-blue-500/50',
      description: 'Total deposits received today',
    },
    {
      name: 'Active Accounts',
      value: totals.activeCustomers.toString(),
      icon: Users,
      gradient: 'from-cyan-400 to-blue-500',
      bgGlow: 'group-hover:bg-cyan-500/20 bg-cyan-500/10',
      iconColor: 'text-cyan-500',
      borderGlow: 'group-hover:border-cyan-500/50',
      description: 'Total registered customers',
    },
  ]

  const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="w-full font-sans relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Premium Glassmorphic Header */}
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/40 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30">
              <Building className="w-8 h-8 text-white" />
           </div>
           <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">Control Panel</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold tracking-wide uppercase flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                 System Admin • Main Branch
              </p>
           </div>
        </div>
        <div className="flex items-center gap-3 bg-white/50 dark:bg-black/50 backdrop-blur-md px-5 py-3 rounded-xl border border-white/50 dark:border-white/10">
           <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
           <span className="text-sm font-bold tracking-widest uppercase text-gray-700 dark:text-gray-300">{currentDate}</span>
        </div>
      </div>

      {/* Financial Summary Grid */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-cyan-500/20">
           <BarChart3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
          Financial Snapshot
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`group bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 p-6 flex flex-col relative overflow-hidden ${stat.borderGlow}`}
          >
            {/* Subtle background glow effect on hover */}
            <div className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.bgGlow}`}></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
               <p className="text-[12px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{stat.name}</p>
               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 shadow-inner ${stat.bgGlow}`}>
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={2} />
               </div>
            </div>
            
            <h3 className={`text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient} mb-3 relative z-10`}>
              {stat.value}
            </h3>
            
            <div className="mt-auto pt-4 border-t border-gray-200/50 dark:border-white/10 relative z-10">
               <p className="text-[11px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">
                  {stat.description}
               </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Quick Actions Panel */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
               <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Quick Actions
            </h2>
          </div>
          
          <div className="flex flex-col gap-4">
             <Link href="/admin/transaction" className="group flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-1 transition-all duration-300">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold tracking-wide">New Ledger Entry</h4>
                    <p className="text-cyan-100 text-xs font-medium">Record a transaction</p>
                  </div>
               </div>
               <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
             </Link>

             <Link href="/admin/register" className="group flex items-center justify-between p-5 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 hover:border-blue-500/30">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-bold tracking-wide">Open Account</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Register new customer</p>
                  </div>
               </div>
               <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
             </Link>

             <Link href="/admin/bulk-interest" className="group flex items-center justify-between p-5 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 hover:border-purple-500/30">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-bold tracking-wide">Interest Payout</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Distribute monthly interest</p>
                  </div>
               </div>
               <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
             </Link>
          </div>
        </div>

        {/* Recent Transactions Module */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-indigo-500/20">
               <History className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
              Recent Transactions
            </h2>
          </div>

          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-lg p-6 relative overflow-hidden h-[330px] flex flex-col">
             {/* Decorative background element */}
             <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-400/5 dark:bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
             
             <div className="flex-1 overflow-y-auto scrollbar-hide relative z-10 pr-2">
               <div className="space-y-3">
                  {recentTxs && recentTxs.length > 0 ? (
                    recentTxs.map((tx: any) => {
                      const isCredit = tx.transaction_type.startsWith('JAMA')
                      return (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-100 dark:border-white/5 rounded-2xl hover:border-indigo-500/30 transition-colors group">
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${isCredit ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                {isCredit ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-gray-900 dark:text-white">{tx.users_profile?.full_name || 'Unknown User'}</span>
                                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
                                  {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                           </div>
                           <div className="text-right">
                              <span className={`text-sm font-black tracking-wide ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {isCredit ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                              </span>
                              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-1 tracking-wider">
                                {tx.transaction_type.replace(/_/g, ' ')}
                              </div>
                           </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 mt-4 bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-gray-100 dark:border-white/5 rounded-2xl">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-3">
                         <History className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-bold text-sm">No recent transactions</p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs font-medium mt-1 text-center px-4">When new ledger entries are recorded, they will appear here.</p>
                    </div>
                  )}
               </div>
             </div>
             
             <div className="pt-4 mt-2 border-t border-gray-100 dark:border-white/10 text-center relative z-10 shrink-0">
               <Link href="/admin/transactions" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 uppercase tracking-wider transition-colors inline-flex items-center gap-1">
                 View All Ledger Entries <ArrowRight className="w-4 h-4" />
               </Link>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
