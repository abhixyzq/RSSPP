import { getVillageTotals } from '@/actions/admin'
import { Wallet, Landmark, Users, TrendingUp, Building, Clock, ArrowRight, UserPlus, BookOpen, Activity, History, ArrowUpRight, ArrowDownRight } from 'lucide-react'
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
      name: 'Total Deposits',
      value: formatCurrency(totals.totalJama),
      icon: Wallet,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Total Jama collected in branch',
    },
    {
      name: 'Total Loans',
      value: formatCurrency(totals.totalNikasi),
      icon: Landmark,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: 'Total Nikasi disbursed by branch',
    },
    {
      name: 'Active Accounts',
      value: totals.activeCustomers.toString(),
      icon: Users,
      color: 'text-[#0B2E59] dark:text-slate-300',
      bgColor: 'bg-[#0B2E59]/10 dark:bg-slate-700/50',
      description: 'Total registered customers',
    },
  ]

  const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="w-full font-sans relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-7xl mx-auto">
      
      {/* Professional Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-[#0B2E59] dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 border border-[#0B2E59]/10 dark:border-slate-700">
              <Building className="w-7 h-7 text-white dark:text-blue-400" />
           </div>
           <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0B2E59] dark:text-white mb-1 uppercase">Control Panel</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-green-500"></span>
                 System Admin • Main Branch
              </p>
           </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-100 dark:border-slate-700/50">
           <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
           <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{currentDate}</span>
        </div>
      </div>

      {/* Financial Snapshot Grid */}
      <div className="mb-6 border-b border-gray-200 dark:border-slate-800 pb-2">
        <h2 className="text-lg font-bold text-[#0B2E59] dark:text-white uppercase tracking-wider">
          Financial Snapshot
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm p-6 flex flex-col hover:border-[#0B2E59]/30 dark:hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
               <p className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">{stat.name}</p>
               <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2.5} />
               </div>
            </div>
            
            <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              {stat.value}
            </h3>
            
            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-slate-800/50">
               <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                  {stat.description}
               </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Quick Actions Panel */}
        <div className="lg:col-span-1">
          <div className="mb-6 border-b border-gray-200 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-bold text-[#0B2E59] dark:text-white uppercase tracking-wider">
              Quick Actions
            </h2>
          </div>
          
          <div className="flex flex-col gap-3">
             <Link href="/admin/transaction" className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-[#0B2E59] dark:hover:border-blue-500 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-bold text-sm">New Ledger Entry</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Record a transaction</p>
                  </div>
               </div>
               <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0B2E59] dark:group-hover:text-blue-400 transition-colors" />
             </Link>

             <Link href="/admin/register" className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-[#0B2E59] dark:hover:border-blue-500 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-bold text-sm">Open Account</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Register new customer</p>
                  </div>
               </div>
               <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0B2E59] dark:group-hover:text-blue-400 transition-colors" />
             </Link>

             <Link href="/admin/bulk-interest" className="group flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-[#0B2E59] dark:hover:border-blue-500 transition-colors">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-bold text-sm">Interest Payout</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">Distribute monthly interest</p>
                  </div>
               </div>
               <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0B2E59] dark:group-hover:text-blue-400 transition-colors" />
             </Link>
          </div>
        </div>

        {/* Recent Transactions Module */}
        <div className="lg:col-span-2">
          <div className="mb-6 border-b border-gray-200 dark:border-slate-800 pb-2 flex justify-between items-end">
            <h2 className="text-lg font-bold text-[#0B2E59] dark:text-white uppercase tracking-wider">
              Recent Transactions
            </h2>
            <Link href="/admin/transactions" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              View Ledger
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
             
             <div className="flex-1 overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-800">
                        <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Customer</th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</th>
                        <th className="px-4 py-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                    {recentTxs && recentTxs.length > 0 ? (
                      recentTxs.map((tx: any) => {
                        const isCredit = tx.transaction_type.startsWith('JAMA')
                        return (
                          <tr key={tx.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                             <td className="px-4 py-3 whitespace-nowrap">
                               <div className="text-[13px] font-semibold text-gray-900 dark:text-slate-300">
                                 {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                               </div>
                               <div className="text-[11px] text-gray-500 dark:text-gray-500">
                                 {new Date(tx.transaction_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                               </div>
                             </td>
                             <td className="px-4 py-3">
                               <div className="text-[13px] font-bold text-[#0B2E59] dark:text-blue-400">{tx.users_profile?.full_name || 'Unknown User'}</div>
                               <div className="text-[10px] text-gray-400 font-mono mt-0.5">ID: {tx.user_id.substring(0, 8)}</div>
                             </td>
                             <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${isCredit ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                  {isCredit ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                                  {tx.transaction_type.replace(/_/g, ' ')}
                                </span>
                             </td>
                             <td className="px-4 py-3 text-right">
                                <span className={`text-[13px] font-bold ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {isCredit ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                                </span>
                             </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                          <History className="w-6 h-6 mx-auto mb-2 opacity-50" />
                          No recent transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
             </div>
             
          </div>
        </div>
      </div>
    </div>
  )
}
