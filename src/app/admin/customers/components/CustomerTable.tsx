'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Building, Trash2, BookOpen, AlertTriangle, Loader2, Download, Printer } from 'lucide-react'
import { deleteCustomer } from '@/actions/admin'

type Customer = {
  id: string
  full_name: string
  mobile_number: string
  kyc_document?: string
}

export default function CustomerTable({ customers }: { customers: Customer[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
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

  const handleDelete = async () => {
    if (!customerToDelete) return
    setErrorMsg('')
    
    startTransition(async () => {
       const res = await deleteCustomer(customerToDelete.id)
       if (res?.error) {
         setErrorMsg(res.error)
       } else {
         setCustomerToDelete(null)
         router.refresh()
       }
    })
  }

  return (
    <div className="w-full">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-2xl font-bold text-[#0B2E59] uppercase flex items-center gap-2">
             <span>Account Holders</span>
             <span className="normal-case text-lg text-gray-500">(खाताधारक)</span>
           </h1>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50">
             <Printer className="w-4 h-4" /> <span>Print List <span className="normal-case text-xs opacity-70 ml-1">(सूची प्रिंट करें)</span></span>
           </button>
           <button className="flex items-center gap-2 text-sm font-bold text-white bg-[#0B2E59] px-4 py-2 rounded-md shadow-sm hover:bg-[#071f3e]">
             <Download className="w-4 h-4" /> <span>Export CSV <span className="normal-case text-xs opacity-70 ml-1">(CSV डाउनलोड करें)</span></span>
           </button>
        </div>
      </div>

      <div className="bg-white shadow-md border border-gray-300">
        
        {/* Bank Header */}
        <div className="bg-[#0B2E59] text-white p-6 border-b-4 border-[#0099CC] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0">
                <Building className="w-8 h-8 text-[#0B2E59]" />
             </div>
             <div>
                <h1 className="text-2xl font-bold uppercase tracking-wide flex items-center gap-2">
                  <span>Customer Database</span>
                  <span className="text-lg normal-case font-medium text-blue-200">(ग्राहक डेटाबेस)</span>
                </h1>
                <p className="text-blue-200 text-sm font-medium tracking-wide">Core Banking System • Account Register <span className="opacity-80">(कोर बैंकिंग सिस्टम • खाता रजिस्टर)</span></p>
             </div>
          </div>
          
          <div className="relative w-full sm:w-[320px]">
             <Search className="absolute left-3 top-2.5 w-5 h-5 text-[#0B2E59]" />
             <input
               type="text"
               placeholder="Search by name or Account No (नाम या खाता नंबर से खोजें)..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#082243] rounded-md focus:ring-2 focus:ring-[#0099CC] focus:outline-none text-[14px] font-bold text-[#0B2E59] placeholder-[#0B2E59]/50 shadow-inner"
             />
          </div>
        </div>

        {/* Status Strip */}
        <div className="bg-gray-100 p-3 border-b border-gray-300 flex justify-between items-center px-6">
           <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
             <span>Showing {filteredCustomers.length} Accounts</span>
             <span className="normal-case opacity-70">({filteredCustomers.length} खाते दिखा रहे हैं)</span>
           </span>
           <span className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
             <span>Branch: MAIN</span>
             <span className="normal-case opacity-70">(शाखा: मुख्य)</span>
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
                    <td colSpan={5} className="p-10 text-center text-gray-500 font-bold uppercase border border-gray-200 flex flex-col items-center gap-1">
                      <span>No Records Found.</span>
                      <span className="normal-case text-gray-400 text-sm">(कोई रिकॉर्ड नहीं मिला)</span>
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer, index) => (
                      <tr key={customer.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                         <td className="p-4 text-gray-400 font-bold w-12 text-center group-hover:text-blue-500 transition-colors">
                            {(index + 1).toString().padStart(3, '0')}
                         </td>
                         <td className="p-4 font-bold text-[#0B2E59] uppercase">
                            {customer.full_name}
                         </td>
                         <td className="p-4 font-bold text-gray-700">
                            {customer.mobile_number}
                         </td>
                         <td className="p-4 text-center">
                            <span className="px-3 py-1 rounded-full text-xs font-bold shadow-sm bg-green-100 text-green-700 border border-green-200">
                               Active (सक्रिय)
                            </span>
                         </td>
                         <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button
                                 onClick={() => router.push(`/admin/customers/${customer.id}`)}
                                 className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-[12px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                               >
                                 <BookOpen className="w-3.5 h-3.5" /> 
                                 <div className="flex flex-col text-left leading-tight">
                                   <span>Statement</span>
                                   <span className="text-[9px] font-medium opacity-80">(विवरण)</span>
                                 </div>
                               </button>
                               <button
                                 onClick={() => setCustomerToDelete(customer)}
                                 className="flex items-center gap-1.5 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-[12px] font-bold rounded-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                                 title="Close Account"
                               >
                                 <Trash2 className="w-3.5 h-3.5" /> 
                                 <div className="flex flex-col text-left leading-tight">
                                   <span>Close A/c</span>
                                   <span className="text-[9px] font-medium opacity-80">(खाता बंद करें)</span>
                                 </div>
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))
                 )}
             </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-center flex flex-col items-center gap-1">
           <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wide">
              *** END OF DATABASE ***
           </p>
           <p className="text-[10px] text-gray-400 font-medium tracking-wide">
              (डेटाबेस समाप्त)
           </p>
        </div>

      </div>

      {/* STRICT DELETE CONFIRMATION MODAL */}
      {customerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-md w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 border-t-4 border-red-600">
            
            <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
              <div className="w-16 h-16 bg-white text-red-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-red-900 uppercase tracking-wide mb-1">Account Closure Warning</h3>
            </div>
            
            <div className="p-6 text-center">
              <p className="text-gray-700 text-[14px] font-medium leading-relaxed">
                You have requested to close the account for <strong className="text-gray-900 uppercase">{customerToDelete.full_name}</strong> (A/c No: {customerToDelete.mobile_number}).
              </p>
              <p className="text-amber-600 text-[13px] font-bold mt-4 bg-amber-50 p-3 rounded border border-amber-100">
                This will move the account to the Recycle Bin. Ledgers will remain intact, and the mobile number will be freed for new registration.
              </p>

              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm font-bold border border-red-200 w-full">
                  {errorMsg}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-100 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setCustomerToDelete(null)
                  setErrorMsg('')
                }}
                disabled={isPending}
                className="flex-1 py-2 px-4 bg-white border border-gray-300 text-gray-700 font-bold rounded shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="flex-1 py-2 px-4 bg-red-600 border border-red-700 text-white font-bold rounded shadow-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> PROCESSING...</>
                ) : (
                  <><Trash2 className="w-4 h-4" /> CONFIRM CLOSURE</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
