import { createAdminClient } from '@/utils/supabase/admin'
import { History, Printer } from 'lucide-react'
import PrintTransactionLedger from './PrintTransactionLedger'
import PrintButton from '../components/PrintButton'

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const revalidate = 0 // always fetch fresh data

export default async function TransactionsPage() {
  const supabase = createAdminClient()
  
  // Fetch up to 100 recent transactions for the history page
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*, users_profile(full_name)')
    .order('transaction_date', { ascending: false })
    .limit(100)

  return (
    <>
    <div className="w-full font-sans relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 print:hidden">
      
      {/* Header */}
      <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/40 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shadow-lg">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
              <History className="w-8 h-8 text-white" />
           </div>
           <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">Ledger History</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold tracking-wide">
                 View all recent transactions across the branch
              </p>
           </div>
        </div>
        <PrintButton label={<><Printer className="w-4 h-4" /> Print Ledger</>} />
      </div>

      {/* Transactions Table */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl shadow-lg p-6 relative overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-white/10">
                <th className="p-4 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th className="p-4 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer Name</th>
                <th className="p-4 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="p-4 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Amount</th>
                <th className="p-4 text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {transactions && transactions.length > 0 ? (
                transactions.map((tx: any) => {
                  const isCredit = tx.transaction_type.startsWith('JAMA')
                  return (
                    <tr key={tx.id} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors group">
                      <td className="p-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900 dark:text-gray-200">
                          {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {new Date(tx.transaction_date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {tx.users_profile?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                          ID: {tx.user_id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCredit ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                            {isCredit ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                          </div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md tracking-wider ${isCredit ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                            {tx.transaction_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className={`text-base font-black tracking-wide ${isCredit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {isCredit ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          {tx.description || <span className="text-gray-400 italic">No description</span>}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400 font-semibold">
                    No transactions found in the ledger.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <PrintTransactionLedger transactions={transactions || []} />
    </>
  )
}
