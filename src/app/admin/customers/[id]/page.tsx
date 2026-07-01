import { getCustomerDetails } from '@/actions/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Building, CheckCircle, ArrowDownToLine, ArrowUpFromLine, Wallet, CreditCard, Activity, X } from 'lucide-react'
import EditCustomerModal from '../components/EditCustomerModal'
import ExportCSVButton from '../../components/ExportCSVButton'

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
  
  let currentJamaBalance = 0;
  let totalJamaInterest = 0; // Total Interest Earned on Deposits
  let currentJamaInterestBal = 0; // The actual unwithdrawn interest bucket

  const jamaTransactions = allTx.filter(t => t.transaction_type.startsWith('JAMA')).map(tx => {
    let earnedInterest = 0;
    const amt = Number(tx.amount);

    if (tx.transaction_type === 'JAMA_DEPOSIT' || tx.transaction_type === 'JAMA_PRINCIPAL') {
      currentJamaBalance += amt;
    } else if (tx.transaction_type === 'JAMA_EARNED_INTEREST') {
      earnedInterest = amt;
      totalJamaInterest += earnedInterest;
      currentJamaInterestBal += earnedInterest;
    } else if (tx.transaction_type === 'JAMA_WITHDRAWAL') {
      if (currentJamaInterestBal > 0) {
        if (amt <= currentJamaInterestBal) {
          currentJamaInterestBal -= amt;
        } else {
          const remainder = amt - currentJamaInterestBal;
          currentJamaInterestBal = 0;
          currentJamaBalance -= remainder;
        }
      } else {
        currentJamaBalance -= amt;
      }
    }
    
    return { ...tx, runningBalance: currentJamaBalance, earnedInterest };
  }).reverse(); // Re-reverse to display newest first for display

  let totalNikasi = 0;
  let currentNikasiBalance = 0;
  let totalInterestPaid = 0;
  const nikasiTransactions = allTx
    .filter(tx => tx.transaction_type.startsWith('NIKASI'))
    .map(tx => {
       const amt = Number(tx.amount);
       if (tx.transaction_type === 'NIKASI_LOAN' || tx.transaction_type === 'NIKASI_PRINCIPAL') { // Keep NIKASI_PRINCIPAL for legacy compat (it was disbursed loan)
         totalNikasi += amt;
         currentNikasiBalance += amt;
       } else if (tx.transaction_type === 'NIKASI_REPAY_PRINCIPAL') {
         currentNikasiBalance -= amt;
       } else if (tx.transaction_type === 'NIKASI_REPAY_INTEREST') {
         totalInterestPaid += amt;
       }
       return { ...tx, runningBalance: currentNikasiBalance };
    })
    .reverse();

    const exportData = allTx.map((tx: any) => ({
      Date: new Date(tx.transaction_date).toLocaleDateString('en-IN'),
      Type: tx.transaction_type.replace(/_/g, ' '),
      Amount: tx.amount,
      Description: tx.description || ''
    }))

  return (
    <div className="max-w-[1200px] mx-auto pb-20 p-4 sm:p-8 font-sans">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
         <Link href="/admin/customers" className="flex items-center gap-2 text-gray-500 dark:text-gray-300 hover:text-blue-600 transition-colors font-semibold bg-white dark:bg-[#0B1120] px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 shadow-sm">
            <ArrowLeft className="w-5 h-5" />
            Back to Directory (वापस जाएँ)
         </Link>
         
         <div className="flex gap-3 w-full sm:w-auto">
            {!profile.isClosed && <EditCustomerModal profile={profile} />}
            <ExportCSVButton data={exportData} filename={`${profile.full_name}_passbook.csv`} label={<><Download className="w-4 h-4" /> Export CSV</>} />
         </div>
      </div>

      <div className="bg-white dark:bg-[#0B1120] shadow-md border border-gray-300 dark:border-slate-600">
         
         {/* Bank Header (SBI/BOI Style) */}
         <div className="bg-[#0B2E59] dark:bg-slate-800 text-white p-6 border-b-4 border-[#0099CC] flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 bg-white dark:bg-[#0B1120] rounded-full flex items-center justify-center shrink-0">
               <Building className="w-8 h-8 text-[#0B2E59] dark:text-blue-400" />
            </div>
            <div>
               <h1 className="text-2xl font-bold uppercase tracking-wide">Customer Passbook</h1>
               <p className="text-blue-200 text-sm font-medium tracking-wide">खाता विवरण एवं लेनदेन (Account Summary & Ledger)</p>
            </div>
         </div>

         {/* Account Details Block */}
         <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 border-b border-gray-200 dark:border-slate-600 bg-gray-50/50 dark:bg-white/5">
            <div className="space-y-3">
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-bold uppercase col-span-1">Account Name</span>
                  <span className="text-sm font-bold text-[#0B2E59] dark:text-blue-400 col-span-2 uppercase">
                    {profile.full_name}
                    {profile.full_name_hi ? ` / ${profile.full_name_hi}` : ''}
                  </span>
               </div>
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-bold uppercase col-span-1">Account No.</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-slate-100 col-span-2">{profile.mobile_number}</span>
               </div>
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-bold uppercase col-span-1">Address</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-slate-100 col-span-2 uppercase">
                    {profile.address || 'N/A'}
                    {profile.address_hi ? ` / ${profile.address_hi}` : ''}
                  </span>
               </div>
            </div>

            <div className="space-y-3">
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-bold uppercase col-span-1">Status</span>
                  <span className="text-sm font-bold col-span-2 flex items-center gap-1">
                     {profile.isClosed ? (
                       <span className="text-red-700 flex items-center gap-1"><X className="w-4 h-4" /> CLOSED (बंद)</span>
                     ) : (
                       <span className="text-green-700 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> ACTIVE</span>
                     )}
                  </span>
               </div>
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-bold uppercase col-span-1">KYC Status</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-slate-100 col-span-2 uppercase">{profile.kyc_document || 'PENDING'}</span>
               </div>
               <div className="grid grid-cols-3">
                  <span className="text-sm text-gray-500 dark:text-gray-300 font-bold uppercase col-span-1">Occupation</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-slate-100 col-span-2 uppercase">
                    {profile.occupation || 'N/A'}
                    {profile.occupation_hi ? ` / ${profile.occupation_hi}` : ''}
                  </span>
               </div>
            </div>
         </div>

         {/* Financial Summary Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-transparent">
            <div className="bg-white dark:bg-[#0B1120] p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
               <div className="p-3.5 bg-gradient-to-br from-green-50 to-green-100 text-green-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Wallet className="w-7 h-7" />
               </div>
               <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider group-hover:text-green-600 transition-colors">Deposit Balance (कुल बचत)</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-0.5">₹{currentJamaBalance.toLocaleString('en-IN')}</p>
               </div>
            </div>
            
            <div className="bg-white dark:bg-[#0B1120] p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
               <div className="p-3.5 bg-gradient-to-br from-red-50 to-red-100 text-red-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <CreditCard className="w-7 h-7" />
               </div>
               <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider group-hover:text-red-600 transition-colors">Loan Balance (कुल ऋण)</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-0.5">₹{currentNikasiBalance.toLocaleString('en-IN')}</p>
               </div>
            </div>

            <div className="bg-white dark:bg-[#0B1120] p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group">
               <div className="p-3.5 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Activity className="w-7 h-7" />
               </div>
               <div>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider group-hover:text-purple-600 transition-colors">Interest Earned (कुल ब्याज मिला)</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-slate-100 mt-0.5">₹{totalJamaInterest.toLocaleString('en-IN')}</p>
               </div>
            </div>
         </div>

         {/* DEPOSIT LEDGER */}
         <div className="p-0 sm:p-6 overflow-x-auto border-b-4 border-gray-300 dark:border-slate-600">
            <div className="bg-green-700 text-white px-4 py-3 font-bold uppercase tracking-wide flex items-center gap-2">
               <ArrowDownToLine className="w-5 h-5" /> Deposit Account Ledger (बचत खाता विवरण)
            </div>
            <table className="w-full text-left border-collapse min-w-[700px]">
               <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 text-[12px] uppercase tracking-wider border-b-2 border-gray-300 dark:border-slate-600">
                     <th className="p-3 font-bold border-r border-gray-300 dark:border-slate-600 w-32">Date (दिनांक)</th>
                     <th className="p-3 font-bold border-r border-gray-300 dark:border-slate-600">Particulars (विवरण)</th>
                     <th className="p-3 font-bold border-r border-gray-300 dark:border-slate-600 w-32 text-right text-purple-800 bg-purple-50">Interest Earned (ब्याज मिला)</th>
                     <th className="p-3 font-bold border-r border-gray-300 dark:border-slate-600 w-40 text-right">Amount (राशि) (+ / -)</th>
                     <th className="p-3 font-bold w-48 text-right bg-green-50">Running Balance (शेष राशि)</th>
                  </tr>
               </thead>
               <tbody className="bg-white dark:bg-[#0B1120]">
                  {(!jamaTransactions || jamaTransactions.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-300 font-medium">
                        No deposits found for this account.
                      </td>
                    </tr>
                  ) : (
                    jamaTransactions.map((tx, index) => {
                      const amtString = Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                      const balString = tx.runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                      const interestString = tx.earnedInterest ? tx.earnedInterest.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00';
                      const bgClass = index % 2 === 0 ? 'bg-white dark:bg-[#0B1120]' : 'bg-gray-50 dark:bg-slate-700/50';
                      const isDeposit = tx.transaction_type === 'JAMA_DEPOSIT' || tx.transaction_type === 'JAMA_PRINCIPAL';
                      const isInterest = tx.transaction_type === 'JAMA_EARNED_INTEREST';

                      return (
                        <tr key={tx.id} className={`${bgClass} hover:bg-green-50/50 text-[13px] text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-600`}>
                           <td className="p-3 border-r border-gray-200 dark:border-slate-600 font-medium">
                              {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </td>
                           <td className="p-3 border-r border-gray-200 dark:border-slate-600 font-medium">
                              {isInterest ? 'BY INTEREST (ब्याज)' : isDeposit ? 'BY DEPOSIT' : 'TO WITHDRAWAL'} {tx.description ? ` - ${tx.description.toUpperCase() === 'MONTHLY BULK INTEREST CREDIT' ? 'MONTHLY INTEREST' : tx.description.toUpperCase()}` : ''}
                           </td>
                           <td className="p-3 border-r border-gray-200 dark:border-slate-600 text-right font-extrabold text-purple-700 bg-purple-50/30">
                              {isInterest ? `+${interestString}` : '-'}
                           </td>
                           <td className={`p-3 border-r border-gray-200 dark:border-slate-600 text-right font-bold ${isInterest ? 'text-gray-400' : isDeposit ? 'text-green-700' : 'text-red-600'}`}>
                              {isInterest ? '-' : isDeposit ? `+ ${amtString}` : `- ${amtString}`}
                           </td>
                           <td className="p-3 text-right font-extrabold text-gray-900 dark:text-slate-100 bg-green-50/30">
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
               <ArrowUpFromLine className="w-5 h-5" /> Loan Account Ledger (ऋण खाता विवरण)
            </div>
            <table className="w-full text-left border-collapse min-w-[700px]">
               <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 text-[12px] uppercase tracking-wider border-b-2 border-gray-300 dark:border-slate-600">
                     <th className="p-3 font-bold border-r border-gray-300 dark:border-slate-600 w-32">Date (दिनांक)</th>
                     <th className="p-3 font-bold border-r border-gray-300 dark:border-slate-600">Particulars (विवरण)</th>
                     <th className="p-3 font-bold border-r border-gray-300 dark:border-slate-600 w-32 text-right">Principal (मूलधन) (+/-)</th>
                     <th className="p-3 font-bold border-r border-gray-300 dark:border-slate-600 w-32 text-right">Interest Paid (ब्याज दिया)</th>
                     <th className="p-3 font-bold w-40 text-right bg-red-50">Running Balance (शेष राशि)</th>
                  </tr>
               </thead>
               <tbody className="bg-white dark:bg-[#0B1120]">
                  {(!nikasiTransactions || nikasiTransactions.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-300 font-medium">
                        No loans issued to this account.
                      </td>
                    </tr>
                  ) : (
                    nikasiTransactions.map((tx, index) => {
                      const amtString = Number(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
                      const balString = tx.runningBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                      const bgClass = index % 2 === 0 ? 'bg-white dark:bg-[#0B1120]' : 'bg-gray-50 dark:bg-slate-700/50';
                      
                      const isLoanGiven = tx.transaction_type === 'NIKASI_LOAN' || tx.transaction_type === 'NIKASI_PRINCIPAL';
                      const isPrincipalRepay = tx.transaction_type === 'NIKASI_REPAY_PRINCIPAL';
                      const isInterest = tx.transaction_type === 'NIKASI_REPAY_INTEREST';

                      return (
                        <tr key={tx.id} className={`${bgClass} hover:bg-red-50/50 text-[13px] text-gray-900 dark:text-slate-100 border-b border-gray-200 dark:border-slate-600`}>
                           <td className="p-3 border-r border-gray-200 dark:border-slate-600 font-medium">
                              {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                           </td>
                           <td className="p-3 border-r border-gray-200 dark:border-slate-600 font-medium">
                              {isLoanGiven && 'TO LOAN OUT'}
                              {isPrincipalRepay && 'BY REPAYMENT (MOOL)'}
                              {isInterest && 'BY INTEREST (BYAJ)'}
                              {tx.description ? ` - ${tx.description.toUpperCase()}` : ''}
                           </td>
                           <td className={`p-3 border-r border-gray-200 dark:border-slate-600 text-right font-bold ${isLoanGiven ? 'text-red-700' : isPrincipalRepay ? 'text-green-700' : 'text-gray-400'}`}>
                              {isLoanGiven ? `+ ${amtString}` : isPrincipalRepay ? `- ${amtString}` : '-'}
                           </td>
                           <td className={`p-3 border-r border-gray-200 dark:border-slate-600 text-right font-bold ${isInterest ? 'text-purple-700' : 'text-gray-400'}`}>
                              {isInterest ? amtString : '-'}
                           </td>
                           <td className="p-3 text-right font-extrabold text-gray-900 dark:text-slate-100 bg-red-50/30">
                              {balString}
                           </td>
                        </tr>
                      )
                    })
                  )}
               </tbody>
            </table>
         </div>
         
         <div className="p-4 border-t border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700/50 text-center mt-4">
            <p className="text-[11px] text-gray-500 dark:text-gray-300 font-bold uppercase tracking-wide">
               *** END OF DUAL STATEMENT ***
            </p>
         </div>

      </div>
    </div>
  )
}
