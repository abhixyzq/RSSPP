'use client'

import { useState, useTransition } from 'react'
import { CheckCircle2, AlertCircle, ArrowRight, BookOpen, Search, IndianRupee, HandCoins } from 'lucide-react'
import { bulkCreditInterest } from '@/actions/admin'

type EligibleCustomer = {
  id: string
  name: string
  mobile: string
  currentJamaBalance: number
  kyc_document?: string
}

export default function BulkInterestUI({ customers }: { customers: EligibleCustomer[] }) {
  const [globalRate, setGlobalRate] = useState<number>(2) // Default 2%
  const [searchTerm, setSearchTerm] = useState('')
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success?: string, error?: string } | null>(null)

  // Local state to track specific overrides for each customer
  // if amountOverrides[id] is set, we use that instead of the auto-calculated rate
  const [amountOverrides, setAmountOverrides] = useState<Record<string, number | null>>({})
  
  // Track selected customers for payout
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(customers.map(c => c.id)))

  // Filter
  const filteredCustomers = customers.filter(c => {
    const searchLower = searchTerm.toLowerCase()
    return (
      c.name.toLowerCase().includes(searchLower) || 
      c.mobile.includes(searchTerm) ||
      (c.kyc_document && c.kyc_document.toLowerCase().includes(searchLower))
    )
  })

  // Handlers
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelectedIds(newSet)
  }

  const toggleAll = () => {
    if (selectedIds.size === filteredCustomers.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredCustomers.map(c => c.id)))
    }
  }

  const handleOverrideChange = (id: string, value: string) => {
    const num = parseFloat(value)
    if (isNaN(num)) {
      setAmountOverrides(prev => ({ ...prev, [id]: null }))
    } else {
      setAmountOverrides(prev => ({ ...prev, [id]: num }))
    }
  }

  // Calculate the payout amount for a given customer
  const getPayoutAmount = (c: EligibleCustomer) => {
    if (amountOverrides[c.id] !== undefined && amountOverrides[c.id] !== null) {
      return amountOverrides[c.id]!
    }
    return Math.floor(c.currentJamaBalance * (globalRate / 100))
  }

  const totalCalculatedPayout = Array.from(selectedIds).reduce((sum, id) => {
    const cust = customers.find(c => c.id === id)
    if (cust) sum += getPayoutAmount(cust)
    return sum
  }, 0)

  const handleSubmit = () => {
    if (selectedIds.size === 0) return

    if (!confirm(`Are you sure you want to credit ₹${totalCalculatedPayout} across ${selectedIds.size} accounts?`)) {
      return
    }

    setResult(null)
    
    startTransition(async () => {
      const payouts = Array.from(selectedIds).map(id => {
        const cust = customers.find(c => c.id === id)!
        return {
          userId: cust.id,
          amount: getPayoutAmount(cust)
        }
      })

      const res = await bulkCreditInterest(payouts)
      setResult(res)
      if (res.success) {
        // Clear selection to prevent double payment
        setSelectedIds(new Set())
      }
    })
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 pb-32">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B2E59] dark:text-blue-400 uppercase tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600" /> 
            Interest Payout Dashboard (ब्याज वितरण डैशबोर्ड)
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Credit monthly savings interest to multiple accounts at once.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div>
             <label className="block text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Global Interest Rate (ब्याज दर)</label>
             <div className="relative">
                <input 
                  type="number" 
                  value={globalRate} 
                  onChange={(e) => setGlobalRate(Number(e.target.value))}
                  className="w-24 px-3 py-2 border-2 border-purple-200 rounded-lg focus:border-purple-600 focus:ring-0 font-black text-purple-900 text-lg"
                  step="0.1"
                  min="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-purple-600">%</span>
             </div>
          </div>
        </div>
      </div>

      {result?.error && (
        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 rounded flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <h4 className="text-red-800 font-bold uppercase text-sm">Action Failed</h4>
            <p className="text-red-700 text-sm font-medium mt-1">{result.error}</p>
          </div>
        </div>
      )}

      {result?.success && (
        <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-600 rounded flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          <div>
            <h4 className="text-green-800 font-bold uppercase text-sm">Payout Successful</h4>
            <p className="text-green-700 text-sm font-medium mt-1">{result.success}</p>
          </div>
        </div>
      )}

      {/* Global Actions */}
      <div className="bg-white dark:bg-slate-900 border-2 border-[#0B2E59] rounded-2xl shadow-xl overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search customers (खोजें)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-sm"
              />
           </div>
           <div className="text-sm font-bold text-gray-600 dark:text-gray-400">
             {selectedIds.size} selected of {filteredCustomers.length}
           </div>
        </div>

        {/* Desktop Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
                <tr className="bg-[#0B2E59] dark:bg-blue-900 text-white text-[12px] uppercase tracking-wider">
                   <th className="p-4 w-16 text-center">
                     <input 
                       type="checkbox" 
                       checked={selectedIds.size === filteredCustomers.length && filteredCustomers.length > 0}
                       onChange={toggleAll}
                       className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                     />
                   </th>
                   <th className="p-4 font-bold border-r border-white/10">Customer Details (ग्राहक का विवरण)</th>
                   <th className="p-4 font-bold border-r border-white/10 text-right">Current Deposit (वर्तमान बचत)</th>
                   <th className="p-4 font-bold border-r border-white/10 text-right">Calculated Interest (ब्याज)</th>
                   <th className="p-4 font-bold text-right w-48 bg-purple-900/50">Manual Override (बदलें)</th>
                </tr>
             </thead>
             <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400 font-medium">
                      No eligible customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((cust) => {
                    const isSelected = selectedIds.has(cust.id)
                    const autoPayout = Math.floor(cust.currentJamaBalance * (globalRate / 100))
                    const override = amountOverrides[cust.id]
                    const finalPayout = override !== undefined && override !== null ? override : autoPayout
                    const hasOverride = override !== undefined && override !== null
                    
                    return (
                      <tr key={cust.id} className={`transition-colors ${isSelected ? 'bg-blue-50/30' : 'hover:bg-gray-50 dark:bg-slate-800/50'}`}>
                         <td className="p-4 text-center">
                            <input 
                               type="checkbox" 
                               checked={isSelected}
                               onChange={() => toggleSelection(cust.id)}
                               className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                         </td>
                         <td className="p-4 border-r border-gray-100">
                            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{cust.name}</p>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">{cust.mobile}</p>
                         </td>
                         <td className="p-4 border-r border-gray-100 text-right">
                            <p className="font-black text-gray-900 dark:text-gray-100">
                               ₹{cust.currentJamaBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                         </td>
                         <td className="p-4 border-r border-gray-100 text-right">
                            {hasOverride ? (
                               <p className="font-bold text-gray-400 line-through text-sm">
                                 ₹{autoPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                               </p>
                            ) : (
                               <p className={`font-black text-sm ${isSelected ? 'text-purple-700' : 'text-gray-400'}`}>
                                 ₹{autoPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                               </p>
                            )}
                         </td>
                         <td className="p-3 bg-purple-50/30">
                            <input 
                              type="number"
                              placeholder="Override"
                              value={override === null || override === undefined ? '' : override}
                              onChange={(e) => handleOverrideChange(cust.id, e.target.value)}
                              disabled={!isSelected}
                              className={`w-full text-right p-2 border rounded-md text-sm font-bold focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                                hasOverride ? 'border-purple-400 bg-purple-50 text-purple-900' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100'
                              } disabled:opacity-50 disabled:bg-gray-100 dark:bg-slate-800`}
                            />
                         </td>
                      </tr>
                    )
                  })
                )}
             </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] flex flex-col sm:flex-row justify-between items-center gap-4 z-40">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
               <HandCoins className="w-6 h-6 text-purple-600" />
            </div>
            <div>
               <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total Payout Amount (कुल भुगतान राशि)</p>
               <p className="text-2xl font-black text-purple-700">₹{totalCalculatedPayout.toLocaleString('en-IN')}</p>
            </div>
         </div>
         <button 
           onClick={handleSubmit}
           disabled={selectedIds.size === 0 || isPending}
           className="w-full sm:w-auto bg-[#0B2E59] dark:bg-blue-900 hover:bg-[#071f3e] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-widest uppercase text-sm"
         >
           {isPending ? 'Processing...' : `Credit ${selectedIds.size} Accounts (ब्याज जमा करें)`}
           <ArrowRight className="w-5 h-5" />
         </button>
      </div>

    </div>
  )
}
