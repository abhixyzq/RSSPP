'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { addTransaction, getCustomerBalance } from '@/actions/admin'
import { ArrowDownToLine, ArrowUpFromLine, FileText, AlertCircle, CheckCircle2, Search, Check, Building, ShieldCheck, IndianRupee, ArrowRight, Loader2, Wallet, Landmark } from 'lucide-react'

type Customer = {
  id: string
  full_name: string
  mobile_number: string
  kyc_document?: string
}

function SubmitBtn({ typeSelected, customerId, amount }: { typeSelected: string, customerId: string, amount: string }) {
  const { pending } = useFormStatus()
  
  const isReady = typeSelected && customerId && amount && Number(amount) > 0;
  
  let btnClass = "bg-blue-600 hover:bg-blue-700 text-white"
  
  if (isReady && typeSelected.startsWith('JAMA_')) {
    btnClass = "bg-green-700 hover:bg-green-800 text-white shadow-lg shadow-green-700/30 ring-4 ring-green-700/20"
  } else if (isReady && typeSelected.startsWith('NIKASI_')) {
    btnClass = "bg-red-700 hover:bg-red-800 text-white shadow-lg shadow-red-700/30 ring-4 ring-red-700/20"
  }
  
  return (
    <button 
      type="submit" 
      disabled={pending || !isReady} 
      className={`w-full font-bold uppercase tracking-widest text-[13px] py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        pending ? 'bg-gray-400' : btnClass
      }`}
    >
      {pending ? 'Processing... (प्रोसेस हो रहा है)' : (
        <>
          {typeSelected.startsWith('JAMA_') ? (
            <>Save to Passbook (पासबुक में लिखें) <ArrowRight className="w-5 h-5" /></>
          ) : typeSelected.startsWith('NIKASI_') ? (
            <>Record in Loan Ledger (खाता बही में लिखें) <ArrowRight className="w-5 h-5" /></>
          ) : (
            'Save Transaction (लेन-देन सेव करें)'
          )}
        </>
      )}
    </button>
  )
}

export default function AddTransactionForm({ customers }: { customers: Customer[] }) {
  const [state, formAction] = useActionState(addTransaction, null)
  const formRef = useRef<HTMLFormElement>(null)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [txType, setTxType] = useState('JAMA_DEPOSIT') 
  const [amountInput, setAmountInput] = useState('')
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false)
  
  // Balance States
  const [jamaBal, setJamaBal] = useState<number | null>(null)
  const [nikasiBal, setNikasiBal] = useState<number | null>(null)
  const [isFetchingBal, setIsFetchingBal] = useState(false)

  // Fetch balance when customer changes
  useEffect(() => {
    if (selectedCustomerId) {
      setIsFetchingBal(true)
      getCustomerBalance(selectedCustomerId).then((balances) => {
        setJamaBal(balances.jamaBal)
        setNikasiBal(balances.nikasiBal)
        setIsFetchingBal(false)
      }).catch(err => {
        console.error('Failed to fetch balance', err)
        setIsFetchingBal(false)
      })
    } else {
      setJamaBal(null)
      setNikasiBal(null)
    }
  }, [selectedCustomerId])

  useEffect(() => {
    if (state?.success) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
          
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
        }
        
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } catch (e) {
        console.error('Audio/Haptic failed', e);
      }

      formRef.current?.reset()
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchQuery('')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedCustomerId('')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTxType('JAMA_DEPOSIT')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAmountInput('')
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowSuccessOverlay(true)
      setTimeout(() => setShowSuccessOverlay(false), 3500)
    }
  }, [state])
  
  const filteredCustomers = customers.filter(c => {
    const searchLower = searchQuery.toLowerCase()
    return (
      c.full_name.toLowerCase().includes(searchLower) || 
      c.mobile_number.includes(searchQuery) ||
      (c.kyc_document && c.kyc_document.toLowerCase().includes(searchLower))
    )
  })

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId)

  const isDepositAccount = txType.startsWith('JAMA')
  const isCredit = ['JAMA_DEPOSIT', 'JAMA_EARNED_INTEREST', 'NIKASI_REPAY_PRINCIPAL', 'NIKASI_REPAY_INTEREST'].includes(txType)


  return (
    <div className="w-full font-sans pb-20 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="max-w-4xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-[#0B2E59] dark:text-blue-400 uppercase">Ledger Entry (खाता बही)</h1>
      </div>

      <div className="max-w-4xl mx-auto bg-white dark:bg-[#0B1120] shadow-xl border border-gray-300 dark:border-slate-600">
        
        <div className={`p-6 border-b-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-500 ${isDepositAccount ? 'bg-[#0B2E59] dark:bg-slate-800 border-green-500' : 'bg-[#310A14] border-red-500'}`}>
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-white dark:bg-[#0B1120] rounded-full flex items-center justify-center shrink-0">
                <Building className={`w-8 h-8 ${isDepositAccount ? 'text-[#0B2E59] dark:text-blue-400' : 'text-[#310A14]'}`} />
             </div>
             <div>
                <h1 className="text-2xl font-bold uppercase tracking-wide text-white">Transaction Gateway <span className="text-lg normal-case font-medium">(लेन-देन गेटवे)</span></h1>
                <p className="text-gray-300 text-sm font-medium tracking-wide">Core Banking System • Secure Processing Node <span className="opacity-80">(कोर बैंकिंग सिस्टम • सुरक्षित नोड)</span></p>
             </div>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded">
             <ShieldCheck className="w-5 h-5 text-green-400" />
             <span className="text-xs font-bold tracking-widest uppercase">Encrypted (सुरक्षित)</span>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          
          {state?.error && (
            <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-600 rounded flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h4 className="text-red-800 font-bold uppercase text-sm">Transaction Failed</h4>
                <p className="text-red-700 text-sm font-medium mt-1">{state.error}</p>
              </div>
            </div>
          )}

          {state?.success && (
            <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-600 rounded flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <h4 className="text-green-800 font-bold uppercase text-sm">Transaction Authorized</h4>
                <p className="text-green-700 text-sm font-medium mt-1">{state.success}</p>
              </div>
            </div>
          )}

          <form ref={formRef} action={formAction} className="space-y-10">
            
            <div>
               <h3 className="text-[13px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-slate-600 pb-2 flex justify-between">
                 <span>1. Select Transaction Type</span>
                 <span className="text-gray-400 normal-case">(लेन-देन का प्रकार चुनें)</span>
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-green-200 rounded p-4 bg-green-50/20">
                     <h4 className="text-green-800 font-bold uppercase tracking-wider mb-4 border-b border-green-200 pb-2 text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <ArrowDownToLine className="w-4 h-4" /> Deposit Account
                        </div>
                        <span className="text-green-600/80 normal-case text-xs">(जमा खाता)</span>
                     </h4>
                     <div className="space-y-3">
                        <label className={`relative flex items-center p-3 cursor-pointer border rounded transition-all ${txType === 'JAMA_DEPOSIT' ? 'bg-green-100 border-green-600 shadow' : 'bg-white dark:bg-[#0B1120] border-gray-200 dark:border-slate-600 hover:border-green-300'}`}>
                           <input type="radio" name="type" value="JAMA_DEPOSIT" checked={txType === 'JAMA_DEPOSIT'} onChange={() => setTxType('JAMA_DEPOSIT')} className="mr-3 w-4 h-4 text-green-600 focus:ring-green-500" />
                           <div>
                              <span className="block font-bold text-green-900 uppercase text-sm">Deposit Funds <span className="normal-case text-xs text-green-700/80 ml-1">(पैसे जमा करें)</span></span>
                           </div>
                        </label>
                        <label className={`relative flex items-center p-3 cursor-pointer border rounded transition-all ${txType === 'JAMA_WITHDRAWAL' ? 'bg-orange-100 border-orange-600 shadow' : 'bg-white dark:bg-[#0B1120] border-gray-200 dark:border-slate-600 hover:border-orange-300'}`}>
                           <input type="radio" name="type" value="JAMA_WITHDRAWAL" checked={txType === 'JAMA_WITHDRAWAL'} onChange={() => setTxType('JAMA_WITHDRAWAL')} className="mr-3 w-4 h-4 text-orange-600 focus:ring-orange-500" />
                           <div>
                              <span className="block font-bold text-orange-900 uppercase text-sm">Withdraw Funds <span className="normal-case text-xs text-orange-700/80 ml-1">(पैसे निकालें)</span></span>
                           </div>
                        </label>
                     </div>
                  </div>

                  <div className="border-2 border-red-200 rounded p-4 bg-red-50/20">
                     <h4 className="text-red-800 font-bold uppercase tracking-wider mb-4 border-b border-red-200 pb-2 text-sm flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <ArrowUpFromLine className="w-4 h-4" /> Loan Account
                        </div>
                        <span className="text-red-600/80 normal-case text-xs">(उधार खाता)</span>
                     </h4>
                     <div className="space-y-3">
                        <label className={`relative flex items-center p-3 cursor-pointer border rounded transition-all ${txType === 'NIKASI_LOAN' ? 'bg-red-100 border-red-600 shadow' : 'bg-white dark:bg-[#0B1120] border-gray-200 dark:border-slate-600 hover:border-red-300'}`}>
                           <input type="radio" name="type" value="NIKASI_LOAN" checked={txType === 'NIKASI_LOAN'} onChange={() => setTxType('NIKASI_LOAN')} className="mr-3 w-4 h-4 text-red-600 focus:ring-red-500" />
                           <div>
                              <span className="block font-bold text-red-900 uppercase text-sm">Issue New Loan <span className="normal-case text-xs text-red-700/80 ml-1">(नया उधार दें)</span></span>
                           </div>
                        </label>
                        <label className={`relative flex items-center p-3 cursor-pointer border rounded transition-all ${txType === 'NIKASI_REPAY_PRINCIPAL' ? 'bg-blue-100 border-blue-600 shadow' : 'bg-white dark:bg-[#0B1120] border-gray-200 dark:border-slate-600 hover:border-blue-300'}`}>
                           <input type="radio" name="type" value="NIKASI_REPAY_PRINCIPAL" checked={txType === 'NIKASI_REPAY_PRINCIPAL'} onChange={() => setTxType('NIKASI_REPAY_PRINCIPAL')} className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500" />
                           <div>
                              <span className="block font-bold text-blue-900 uppercase text-sm">Repay Principal <span className="normal-case text-xs text-blue-700/80 ml-1">(मूल वापसी करें)</span></span>
                           </div>
                        </label>
                        <label className={`relative flex items-center p-3 cursor-pointer border rounded transition-all ${txType === 'NIKASI_REPAY_INTEREST' ? 'bg-purple-100 border-purple-600 shadow' : 'bg-white dark:bg-[#0B1120] border-gray-200 dark:border-slate-600 hover:border-purple-300'}`}>
                           <input type="radio" name="type" value="NIKASI_REPAY_INTEREST" checked={txType === 'NIKASI_REPAY_INTEREST'} onChange={() => setTxType('NIKASI_REPAY_INTEREST')} className="mr-3 w-4 h-4 text-purple-600 focus:ring-purple-500" />
                           <div>
                              <span className="block font-bold text-purple-900 uppercase text-sm">Pay Interest <span className="normal-case text-xs text-purple-700/80 ml-1">(ब्याज भरें)</span></span>
                           </div>
                        </label>
                     </div>
                  </div>
               </div>
            </div>

            <div>
               <h3 className="text-[13px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-slate-600 pb-2 flex justify-between">
                 <span>2. Select Target Account</span>
                 <span className="text-gray-400 normal-case">(खाता चुनें)</span>
               </h3>
               
               <div className="relative">
                 <input type="hidden" name="userId" value={selectedCustomerId} required />
                 
                 {selectedCustomer ? (
                   <div className={`flex items-center justify-between p-4 border-2 rounded bg-white dark:bg-[#0B1120] ${isDepositAccount ? 'border-green-500' : 'border-red-500'}`}>
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${isDepositAccount ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                           {selectedCustomer.full_name.charAt(0)}
                        </div>
                        <div>
                           <p className="font-extrabold text-gray-900 dark:text-slate-100 uppercase text-lg">{selectedCustomer.full_name}</p>
                           <p className="text-sm font-bold text-gray-500 dark:text-gray-300">A/C No: {selectedCustomer.mobile_number}</p>
                           
                           {/* Balance Display */}
                           <div className="mt-2 flex items-center gap-3">
                             {isFetchingBal ? (
                               <div className="flex items-center gap-2 text-blue-600">
                                 <Loader2 className="w-3 h-3 animate-spin" />
                                 <span className="text-xs font-bold uppercase tracking-wider">Fetching...</span>
                               </div>
                             ) : jamaBal !== null ? (
                               <>
                                 <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 border border-green-200 shadow-sm">
                                   <Wallet className="w-3 h-3" /> JAMA: ₹{new Intl.NumberFormat('en-IN').format(jamaBal)}
                                 </span>
                                 <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1 border border-red-200 shadow-sm">
                                   <Landmark className="w-3 h-3" /> NIKASI: ₹{new Intl.NumberFormat('en-IN').format(nikasiBal || 0)}
                                 </span>
                               </>
                             ) : null}
                           </div>
                        </div>
                     </div>
                     <button 
                       type="button" 
                       onClick={() => setSelectedCustomerId('')}
                       className="text-xs font-bold text-blue-600 uppercase hover:underline bg-blue-50 px-3 py-1.5 rounded flex flex-col items-center"
                     >
                       <span>Change Account</span>
                       <span className="text-[10px] normal-case opacity-80">(खाता बदलें)</span>
                     </button>
                   </div>
                 ) : (
                   <div className="relative">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <Search className="h-5 w-5 text-gray-400" />
                     </div>
                     <input
                       type="text"
                       placeholder="Search by Name or Account No / नाम या खाता नंबर से खोजें..."
                       value={searchQuery}
                       onChange={(e) => {
                         setSearchQuery(e.target.value)
                         setIsDropdownOpen(true)
                       }}
                       onFocus={() => setIsDropdownOpen(true)}
                       className="w-full pl-11 pr-4 py-4 bg-white dark:bg-[#0B1120] border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-slate-100 font-bold focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                     />
                     
                     {isDropdownOpen && searchQuery && (
                       <div className="absolute z-10 w-full mt-1 bg-white dark:bg-[#0B1120] border border-gray-200 dark:border-slate-600 rounded shadow-xl max-h-60 overflow-auto">
                         {filteredCustomers.length === 0 ? (
                           <div className="p-4 text-sm text-gray-500 dark:text-gray-300 font-bold uppercase flex flex-col gap-1">
                             <span>No matching accounts found</span>
                             <span className="normal-case text-gray-400 font-medium">(कोई खाता नहीं मिला)</span>
                           </div>
                         ) : (
                           filteredCustomers.map(customer => (
                             <div
                               key={customer.id}
                               onClick={() => {
                                 setSelectedCustomerId(customer.id)
                                 setSearchQuery('')
                                 setIsDropdownOpen(false)
                               }}
                               className="p-4 hover:bg-gray-50 dark:bg-slate-700/50 cursor-pointer border-b border-gray-100 flex items-center justify-between"
                             >
                               <div>
                                 <p className="font-bold text-gray-900 dark:text-slate-100 uppercase">{customer.full_name}</p>
                                 <p className="text-xs font-bold text-gray-500 dark:text-gray-300">A/C: {customer.mobile_number}</p>
                               </div>
                               <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">Select</div>
                             </div>
                           ))
                         )}
                       </div>
                     )}
                   </div>
                 )}
               </div>
            </div>

            {/* Step 3: Transaction Details */}
            <div className={`p-6 border-2 rounded ${isDepositAccount ? 'bg-green-50/30 border-green-200' : 'bg-red-50/30 border-red-200'}`}>
               <h3 className="text-[13px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-6 border-b border-gray-200 dark:border-slate-600 pb-2 flex justify-between">
                 <span>3. Transaction Details</span>
                 <span className="text-gray-400 normal-case">(लेन-देन का विवरण)</span>
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Amount Input (MASSIVE) */}
                  <div className="md:col-span-2">
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-3 flex items-center justify-between ${isCredit ? 'text-green-800' : 'text-red-800'}`}>
                      <span>Transaction Amount (₹) <span className="text-red-500">*</span></span>
                      <span className="normal-case text-[11px] opacity-80">(लेन-देन की राशि)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <IndianRupee className={`h-8 w-8 ${isCredit ? 'text-green-400' : 'text-red-400'}`} />
                      </div>
                      <input 
                        type="number" 
                        name="amount" 
                        required 
                        min="1"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        placeholder="0.00"
                        className={`w-full pl-16 pr-6 py-6 border-2 rounded focus:outline-none text-4xl font-extrabold tracking-wider [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isCredit ? 'bg-white dark:bg-[#0B1120] border-green-300 focus:ring-2 focus:ring-green-500 text-green-900 placeholder-green-200' : 'bg-white dark:bg-[#0B1120] border-red-300 focus:ring-2 focus:ring-red-500 text-red-900 placeholder-red-200'}`}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-2 flex justify-between items-center">
                       <span>Particulars (Remarks)</span>
                       <span className="normal-case text-[11px] opacity-80">(विवरण / टिप्पणी)</span>
                    </label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <input 
                        type="text" 
                        name="description" 
                        placeholder="e.g. Cash Deposit, Bank Transfer, Loan Installment... (नकद जमा, ऑनलाइन ट्रांसफर...)"
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-[#0B1120] border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-[15px] font-bold text-gray-900 dark:text-slate-100 uppercase transition-all shadow-sm"
                      />
                    </div>
                  </div>
               </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
               <SubmitBtn typeSelected={txType} customerId={selectedCustomerId} amount={amountInput} />
            </div>

          </form>
        </div>
      </div>

      {/* PAYTM STYLE FULL-SCREEN SUCCESS OVERLAY */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-blue-600 animate-in fade-in duration-300">
           <div className="flex flex-col items-center justify-center animate-in zoom-in-50 slide-in-from-bottom-10 duration-500 delay-150">
              <div className="w-32 h-32 bg-white dark:bg-[#0B1120] rounded-full flex items-center justify-center shadow-2xl mb-8 ring-[16px] ring-white/30">
                 <Check className="w-16 h-16 text-blue-600" strokeWidth={3} />
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-2 text-center">Transaction Successful <br/><span className="text-2xl font-medium block mt-2 text-blue-200">(लेन-देन सफल)</span></h2>
              <p className="text-blue-100 text-lg font-bold text-center bg-blue-700/50 px-6 py-2 rounded-full mt-4 flex flex-col items-center gap-1">
                 <span>Entry Saved in Ledger</span>
                 <span className="text-sm font-medium text-blue-200">(खाता बही में दर्ज हो गया)</span>
              </p>
           </div>
        </div>
      )}
    </div>
  )
}
