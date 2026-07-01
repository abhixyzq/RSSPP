'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Trash2, RotateCcw, AlertTriangle, Loader2, Archive, Eye } from 'lucide-react'
import { permanentDeleteCustomer, restoreCustomer } from '@/actions/admin'

type Customer = {
  id: string
  full_name: string
  mobile_number: string
  kyc_document?: string
}

export default function ClosedCustomerTable({ customers }: { customers: Customer[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [customerToRestore, setCustomerToRestore] = useState<Customer | null>(null)
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const filteredCustomers = customers.filter(c => {
    const searchLower = searchTerm.toLowerCase()
    return (
      c.full_name.toLowerCase().includes(searchLower) || 
      c.mobile_number.includes(searchTerm) ||
      (c.kyc_document && c.kyc_document.toLowerCase().includes(searchLower))
    )
  })

  const handlePermanentDelete = async () => {
    if (!customerToDelete) return
    setErrorMsg('')
    
    startTransition(async () => {
       const res = await permanentDeleteCustomer(customerToDelete.id)
       if (res?.error) {
         setErrorMsg(res.error)
       } else {
         setCustomerToDelete(null)
         router.refresh()
       }
    })
  }

  const handleRestore = async () => {
    if (!customerToRestore) return
    setErrorMsg('')
    
    startTransition(async () => {
       const res = await restoreCustomer(customerToRestore.id)
       if (res?.error) {
         setErrorMsg(res.error)
       } else {
         setCustomerToRestore(null)
         router.refresh()
       }
    })
  }

  return (
    <div className="bg-[#F4F6F9] min-h-[calc(100vh-60px)] -m-4 sm:-m-8 p-4 sm:p-8 font-sans">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-2xl font-bold text-gray-800 uppercase">Closed Accounts (बंद खाते)</h1>
        </div>
      </div>

      <div className="bg-white shadow-md border border-gray-300">
        
        {/* Bank Header */}
        <div className="bg-gray-800 text-white p-6 border-b-4 border-gray-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0">
                <Archive className="w-8 h-8 text-gray-800" />
             </div>
             <div>
                <h1 className="text-2xl font-bold uppercase tracking-wide">Recycle Bin</h1>
                <p className="text-gray-300 text-sm font-medium tracking-wide">Accounts in the bin can be restored or permanently deleted.</p>
             </div>
          </div>
          
          <div className="relative w-full sm:w-[320px]">
             <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-800" />
             <input
               type="text"
               placeholder="Search by name or Account No..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-600 rounded-md focus:ring-2 focus:ring-gray-400 focus:outline-none text-[14px] font-bold text-gray-800 placeholder-gray-500 shadow-inner"
             />
          </div>
        </div>

        {/* Status Strip */}
        <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center px-6">
           <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
             Showing {filteredCustomers.length} Closed Accounts
           </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
             <thead className="bg-gray-50/80 border-b border-gray-100 uppercase text-[11px] font-extrabold tracking-wider text-gray-500">
                <tr>
                   <th className="p-4">Sl No. (क्रम संख्या)</th>
                   <th className="p-4">Account Name (खाता नाम)</th>
                   <th className="p-4">Account No. (मोबाइल संख्या)</th>
                   <th className="p-4 text-center">Status (स्थिति)</th>
                   <th className="p-4 text-right">Actions (कार्रवाई)</th>
                </tr>
             </thead>
             <tbody className="bg-white">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-gray-500 font-bold uppercase border border-gray-200">
                      No Records Found.
                    </td>
                  </tr>
                ) : (
                   filteredCustomers.map((customer, index) => {
                      const match = customer.full_name.match(/\[CLOSED: (\d+)\] (.*)/)
                      const displayName = match ? match[2] : customer.full_name
                      const displayMobile = match ? match[1] : customer.mobile_number

                      return (
                      <tr key={customer.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors group">
                         <td className="p-4 text-gray-400 font-bold w-12 text-center group-hover:text-gray-600 transition-colors">
                            {(index + 1).toString().padStart(3, '0')}
                         </td>
                         <td className="p-4 font-bold text-gray-600 uppercase">
                            {displayName}
                         </td>
                         <td className="p-4 font-bold text-gray-600">
                            {displayMobile}
                         </td>
                         <td className="p-4 text-center">
                            <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-gray-100 text-gray-600 border border-gray-200">
                               Closed (बंद)
                            </span>
                         </td>
                         <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button
                                 onClick={() => router.push(`/admin/customers/${customer.id}`)}
                                 className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[12px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                 title="View Account Details"
                               >
                                 <Eye className="w-3.5 h-3.5" /> Details
                               </button>
                               <button
                                 onClick={() => setCustomerToRestore(customer)}
                                 className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-[12px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                               >
                                 <RotateCcw className="w-3.5 h-3.5" /> Restore
                               </button>
                               <button
                                 onClick={() => setCustomerToDelete(customer)}
                                 className="flex items-center gap-1.5 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-[12px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                 title="Permanent Delete"
                               >
                                 <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                               </button>
                            </div>
                         </td>
                      </tr>
                   )
                   })
                 )}
             </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
           <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
              *** END OF DATABASE ***
           </p>
        </div>

      </div>

      {/* PERMANENT DELETE CONFIRMATION MODAL */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-md w-full max-w-md overflow-hidden shadow-2xl border-t-4 border-red-600">
            <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
              <div className="w-16 h-16 bg-white text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-red-900 uppercase tracking-wide mb-1">Permanent Deletion</h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-700 text-[14px] font-medium leading-relaxed">
                Are you sure you want to PERMANENTLY delete the account for <strong className="text-gray-900 uppercase">{customerToDelete.full_name}</strong>?
              </p>
              <p className="text-red-600 text-[13px] font-bold mt-4 bg-red-50 p-3 rounded border border-red-100">
                This action CANNOT be undone. All ledgers will be erased forever.
              </p>
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm font-bold border border-red-200 w-full">
                  {errorMsg}
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-100 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => { setCustomerToDelete(null); setErrorMsg(''); }}
                disabled={isPending}
                className="flex-1 py-2 px-4 bg-white border border-gray-300 text-gray-700 font-bold rounded shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                onClick={handlePermanentDelete}
                disabled={isPending}
                className="flex-1 py-2 px-4 bg-red-600 border border-red-700 text-white font-bold rounded shadow-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> DELETING...</> : <><Trash2 className="w-4 h-4" /> DELETE FOREVER</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESTORE CONFIRMATION MODAL */}
      {customerToRestore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-md w-full max-w-md overflow-hidden shadow-2xl border-t-4 border-emerald-600">
            <div className="bg-emerald-50 p-6 flex flex-col items-center text-center border-b border-emerald-100">
              <div className="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <RotateCcw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-emerald-900 uppercase tracking-wide mb-1">Restore Account</h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-700 text-[14px] font-medium leading-relaxed">
                Are you sure you want to restore the account for <strong className="text-gray-900 uppercase">{customerToRestore.full_name}</strong>?
              </p>
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm font-bold border border-red-200 w-full">
                  {errorMsg}
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-100 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => { setCustomerToRestore(null); setErrorMsg(''); }}
                disabled={isPending}
                className="flex-1 py-2 px-4 bg-white border border-gray-300 text-gray-700 font-bold rounded shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                onClick={handleRestore}
                disabled={isPending}
                className="flex-1 py-2 px-4 bg-emerald-600 border border-emerald-700 text-white font-bold rounded shadow-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> RESTORING...</> : <><RotateCcw className="w-4 h-4" /> CONFIRM RESTORE</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
