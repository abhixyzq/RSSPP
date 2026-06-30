import { getCustomerDetails } from '@/actions/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Printer, Download, Building, CheckCircle, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'
import EditCustomerModal from '../components/EditCustomerModal'

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const { profile, transactions, error } = await getCustomerDetails(resolvedParams.id)

  if (error || !profile) {
    notFound()
  }

  // Separate transactions into Deposit and Loan
  const allTx = [...(transactions || [])].reverse(); // Oldest first
  
  let totalJama = 0;
  let currentJamaBalance = 0;
  const jamaTransactions = allTx
    .filter(tx => tx.transaction_type.startsWith('JAMA'))
    .map(tx => {
       const amt = Number(tx.amount);
       totalJama += amt;
       currentJamaBalance += amt;
       return { ...tx, runningBalance: currentJamaBalance };
    })
    .reverse(); // Newest first for display

  let totalNikasi = 0;
  let currentNikasiBalance = 0;
  const nikasiTransactions = allTx
    .filter(tx => tx.transaction_type.startsWith('NIKASI'))
    .map(tx => {
       const amt = Number(tx.amount);
       totalNikasi += amt;
       currentNikasiBalance += amt;
       return { ...tx, runningBalance: currentNikasiBalance };
    })
    .reverse();

  return (
    <div className="max-w-[1200px] mx-auto pb-20 bg-[#F4F6F9] min-h-screen -m-4 sm:-m-8 p-4 sm:p-8 font-sans">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/admin/customers" 
          className="inline-flex items-center gap-2 text-sm font-bold text-[#0B2E59] hover:text-blue-700 transition-colors bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Branch
        </Link>
        <div className="flex gap-3">
           <EditCustomerModal profile={profile} />
           <button className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50">
             <Printer className="w-4 h-4" /> Print
           </button>
           <button className="flex items-center gap-2 text-sm font-bold text-white bg-[#0B2E59] px-4 py-2 rounded-md shadow-sm hover:bg-[#071f3e]">
             <Download className="w-4 h-4" /> Download Statement
           </button>
        </div>
      </div>

      <div className="bg-white shadow-md border border-gray-300">
         
         {/* Bank Header (SBI/BOI Style) */}
         <div className="bg-[#0B2E59] text-white p-6 border-b-4 border-[#0099CC] flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0">
               <Building className="w-8 h-8 text-[#0B2E59]" />
            </div>
            <div>
               <h1 className="text-2xl font-bold uppercase tracking-wide">Dual Account Statement</h1>
               <p className="text-blue-200 text-sm font-medium tracking-wide">Deposit A/c & Loan A/c (Strictly Separated)</p>
            </div>
         </div>

         {/* Account Details Block */}
         <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-b border-gray-200 bg-gray-50/50">
            <div className="space-y-3">
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 font-bold uppercase col-span-1">Account Name</span>
                  <span className="text-sm font-bold text-[#0B2E59] col-span-2 uppercase">{profile.full_name}</span>
               </div>
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 font-bold uppercase col-span-1">Account No.</span>
                  <span className="text-sm font-bold text-gray-900 col-span-2">{profile.mobile_number}</span>
               </div>
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 font-bold uppercase col-span-1">Address</span>
                  <span className="text-sm font-bold text-gray-900 col-span-2 uppercase">{profile.address || 'N/A'}</span>
               </div>
            </div>

            <div className="space-y-3">
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 font-bold uppercase col-span-1">Status</span>
                  <span className="text-sm font-bold text-green-700 col-span-2 flex items-center gap-1">
                     <CheckCircle className="w-4 h-4" /> ACTIVE
                  </span>
               </div>
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 font-bold uppercase col-span-1">KYC Status</span>
                  <span className="text-sm font-bold text-gray-900 col-span-2 uppercase">{profile.kyc_document || 'PENDING'}</span>
               </div>
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 font-bold uppercase col-span-1">Occupation</span>
                  <span className="text-sm font-bold text-gray-900 col-span-2 uppercase">{profile.occupation || 'N/A'}</span>
               </div>
            </div>
         </div>

         {/* Financial Summary Strip */}
         <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-b-4 border-[#0B2E59] bg-white">
            <div className="p-8 flex flex-col justify-center items-center bg-green-50/30">
               <div className="flex items-center gap-2 text-green-700 mb-2">
                  <ArrowDownToLine className="w-5 h-5" />
                  <p className="text-sm font-bold uppercase tracking-wider">Total Deposit Balance</p>
               </div>
               <p className="text-4xl font-extrabold text-green-700">₹{totalJama.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="p-8 flex flex-col justify-center items-center bg-red-50/30">
               <div className="flex items-center gap-2 text-red-700 mb-2">
                  <ArrowUpFromLine className="w-5 h-5" />
                  <p className="text-sm font-bold uppercase tracking-wider">Total Loan Balance</p>
               </div>
               <p className="text-4xl font-extrabold text-red-700">₹{totalNikasi.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            </div>
         </div>

         {/* DEPOSIT LEDGER */}
         <div className="p-0 sm:p-6 overflow-x-auto border-b-4 border-gray-300">
            <div className="bg-green-700 text-white px-4 py-3 font-bold uppercase tracking-wide flex items-center gap-2">
               <ArrowDownToLine className="w-5 h-5" /> Deposit Account Ledger (Jama)
            </div>
            <table className="w-full text-left border-collapse min-w-[700px]">
               <thead>
                  <tr className="bg-gray-100 text-gray-700 text-[12px] uppercase tracking-wider border-b-2 border-gray-300">
                     <th className="p-3 font-bold border-r border-gray-300 w-32">Date</th>
                     <th className="p-3 font-bold border-r border-gray-300">Particulars</th>
                     <th className="p-3 font-bold border-r border-gray-300 w-40 text-right">Credit Amount</th>
                     <th className="p-3 font-bold w-48 text-right bg-green-50">Running Balance</th>
                  </tr>
               </thead>
               <tbody className="bg-white">
                  {(!jamaTransactions || jamaTransactions.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">
                        No deposits found for this account.
                      </td>
                    </tr>
                  ) : (
                    jamaTransactions.map((tx, index) => {
                      const amtString = Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                      const balString = tx.runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                      const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

                      return (
                        <tr key={tx.id} className={`${bgClass} hover:bg-green-50/50 text-[13px] text-gray-900 border-b border-gray-200`}>
                           <td className="p-3 border-r border-gray-200 font-medium">
                              {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </td>
                           <td className="p-3 border-r border-gray-200 font-medium">
                              BY DEPOSIT {tx.description ? ` - ${tx.description.toUpperCase()}` : ''}
                           </td>
                           <td className="p-3 border-r border-gray-200 text-right font-bold text-green-700">
                              + {amtString}
                           </td>
                           <td className="p-3 text-right font-extrabold text-gray-900 bg-green-50/30">
                              {balString}
                           </td>
                        </tr>
                      )
                    })
                  )}
               </tbody>
            </table>
         </div>

         {/* LOAN LEDGER */}
         <div className="p-0 sm:p-6 overflow-x-auto">
            <div className="bg-red-700 text-white px-4 py-3 font-bold uppercase tracking-wide flex items-center gap-2 mt-4 sm:mt-0">
               <ArrowUpFromLine className="w-5 h-5" /> Loan Account Ledger (Nikasi)
            </div>
            <table className="w-full text-left border-collapse min-w-[700px]">
               <thead>
                  <tr className="bg-gray-100 text-gray-700 text-[12px] uppercase tracking-wider border-b-2 border-gray-300">
                     <th className="p-3 font-bold border-r border-gray-300 w-32">Date</th>
                     <th className="p-3 font-bold border-r border-gray-300">Particulars</th>
                     <th className="p-3 font-bold border-r border-gray-300 w-40 text-right">Debit Amount</th>
                     <th className="p-3 font-bold w-48 text-right bg-red-50">Running Balance</th>
                  </tr>
               </thead>
               <tbody className="bg-white">
                  {(!nikasiTransactions || nikasiTransactions.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">
                        No loans issued to this account.
                      </td>
                    </tr>
                  ) : (
                    nikasiTransactions.map((tx, index) => {
                      const amtString = Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                      const balString = tx.runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                      const bgClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

                      return (
                        <tr key={tx.id} className={`${bgClass} hover:bg-red-50/50 text-[13px] text-gray-900 border-b border-gray-200`}>
                           <td className="p-3 border-r border-gray-200 font-medium">
                              {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </td>
                           <td className="p-3 border-r border-gray-200 font-medium">
                              TO LOAN OUT {tx.description ? ` - ${tx.description.toUpperCase()}` : ''}
                           </td>
                           <td className="p-3 border-r border-gray-200 text-right font-bold text-red-700">
                              - {amtString}
                           </td>
                           <td className="p-3 text-right font-extrabold text-gray-900 bg-red-50/30">
                              {balString}
                           </td>
                        </tr>
                      )
                    })
                  )}
               </tbody>
            </table>
         </div>
         
         <div className="p-4 border-t border-gray-300 bg-gray-100 text-center mt-4">
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">
               *** END OF DUAL STATEMENT ***
            </p>
         </div>

      </div>
    </div>
  )
}
