import React from 'react'
import { Building } from 'lucide-react'

export default function PrintPassbook({ 
  profile, 
  jamaTransactions, 
  nikasiTransactions, 
  currentJamaBalance, 
  currentNikasiBalance, 
  totalJamaInterest 
}: any) {
  return (
    <div className="hidden print:block w-full bg-white text-gray-900 font-sans p-4">
      
      {/* Premium Bank Header */}
      <div className="flex justify-between items-start border-b-[3px] border-[#0B2E59] pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#0B2E59] rounded-lg flex items-center justify-center text-white shrink-0">
             <Building className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#0B2E59] uppercase tracking-wide mb-1">Apna Sang Sahayata Samuh</h1>
            <p className="text-gray-600 font-semibold text-sm uppercase tracking-widest">Main Branch (मुख्य शाखा)</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-light text-gray-400 uppercase tracking-widest mb-2">Account Statement</h2>
          <p className="text-sm text-gray-500"><span className="font-semibold text-gray-700">Date:</span> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          <p className="text-sm text-gray-500 mt-1"><span className="font-semibold text-gray-700">Page:</span> 1 of 1</p>
        </div>
      </div>

      {/* Customer & Account Details (Two Column Modern Card) */}
      <div className="flex justify-between mb-10">
        
        {/* Customer Address Block */}
        <div className="w-[55%]">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Details</p>
          <h3 className="text-xl font-bold text-gray-800 uppercase mb-1">
            {profile.full_name} {profile.full_name_hi ? `(${profile.full_name_hi})` : ''}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
            {profile.address || 'Address not provided'}
            {profile.address_hi ? `\n${profile.address_hi}` : ''}
          </p>
        </div>

        {/* Account Info Block */}
        <div className="w-[40%] bg-gray-50 rounded-lg p-5 border border-gray-200">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <p className="text-gray-500">Account No:</p>
            <p className="font-bold text-gray-900 text-right">{profile.mobile_number}</p>
            
            <p className="text-gray-500">Account Status:</p>
            <p className={`font-bold text-right ${profile.isClosed ? 'text-red-600' : 'text-green-600'}`}>
              {profile.isClosed ? 'CLOSED' : 'ACTIVE'}
            </p>
            
            <p className="text-gray-500">KYC Status:</p>
            <p className="font-bold text-gray-900 text-right">{profile.kyc_document || 'PENDING'}</p>
            
            <p className="text-gray-500">Currency:</p>
            <p className="font-bold text-gray-900 text-right">INR (₹)</p>
          </div>
        </div>
      </div>

      {/* Financial Dashboard Highlights */}
      <div className="flex gap-4 mb-10">
        <div className="flex-1 bg-white border-l-4 border-blue-600 shadow-sm border-y border-r border-gray-100 p-4">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Deposit Balance</p>
          <p className="text-2xl font-bold text-gray-900">₹{currentJamaBalance.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex-1 bg-white border-l-4 border-orange-500 shadow-sm border-y border-r border-gray-100 p-4">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Loan Balance</p>
          <p className="text-2xl font-bold text-gray-900">₹{currentNikasiBalance.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex-1 bg-white border-l-4 border-green-500 shadow-sm border-y border-r border-gray-100 p-4">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">Interest Earned</p>
          <p className="text-2xl font-bold text-gray-900">₹{totalJamaInterest.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Deposit Ledger */}
      <div className="mb-12 break-inside-avoid">
        <h3 className="text-sm font-bold text-[#0B2E59] uppercase tracking-wider mb-4 flex items-center gap-2">
          Deposit Statement (बचत खाता)
          <div className="h-px bg-gray-200 flex-1 ml-2"></div>
        </h3>
        
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-y-2 border-gray-300">
              <th className="py-3 px-2 font-semibold text-gray-600 uppercase tracking-wider w-28">Date</th>
              <th className="py-3 px-2 font-semibold text-gray-600 uppercase tracking-wider">Transaction Details</th>
              <th className="py-3 px-2 font-semibold text-gray-600 uppercase tracking-wider text-right w-32">Interest</th>
              <th className="py-3 px-2 font-semibold text-gray-600 uppercase tracking-wider text-right w-32">Amount</th>
              <th className="py-3 px-2 font-semibold text-gray-600 uppercase tracking-wider text-right w-32">Balance</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {(!jamaTransactions || jamaTransactions.length === 0) ? (
              <tr>
                <td colSpan={5} className="py-6 text-center italic text-gray-500 border-b border-gray-100">No deposit transactions available for this period.</td>
              </tr>
            ) : (
              jamaTransactions.map((tx: any, i: number) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-2">{new Date(tx.transaction_date).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-2">
                    <span className="font-semibold">{tx.transaction_type.replace('JAMA_', '')}</span>
                    {tx.description && <span className="block text-[11px] text-gray-500 mt-0.5">{tx.description}</span>}
                  </td>
                  <td className="py-3 px-2 text-right text-gray-500">{tx.earnedInterest ? `₹${tx.earnedInterest.toLocaleString('en-IN')}` : '-'}</td>
                  <td className={`py-3 px-2 text-right font-semibold ${tx.transaction_type.includes('WITHDRAWAL') ? 'text-red-600' : 'text-gray-900'}`}>
                    {tx.transaction_type.includes('WITHDRAWAL') ? '-' : '+'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-2 text-right font-bold">₹{tx.runningBalance.toLocaleString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Loan Ledger */}
      <div className="mb-12 break-inside-avoid">
        <h3 className="text-sm font-bold text-[#0B2E59] uppercase tracking-wider mb-4 flex items-center gap-2">
          Loan Statement (ऋण खाता)
          <div className="h-px bg-gray-200 flex-1 ml-2"></div>
        </h3>
        
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-y-2 border-gray-300">
              <th className="py-3 px-2 font-semibold text-gray-600 uppercase tracking-wider w-28">Date</th>
              <th className="py-3 px-2 font-semibold text-gray-600 uppercase tracking-wider">Transaction Details</th>
              <th className="py-3 px-2 font-semibold text-gray-600 uppercase tracking-wider text-right w-32">Amount</th>
              <th className="py-3 px-2 font-semibold text-gray-600 uppercase tracking-wider text-right w-32">Balance</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {(!nikasiTransactions || nikasiTransactions.length === 0) ? (
              <tr>
                <td colSpan={4} className="py-6 text-center italic text-gray-500 border-b border-gray-100">No loan transactions available for this period.</td>
              </tr>
            ) : (
              nikasiTransactions.map((tx: any, i: number) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-2">{new Date(tx.transaction_date).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 px-2">
                    <span className="font-semibold">{tx.transaction_type.replace('NIKASI_', '').replace(/_/g, ' ')}</span>
                    {tx.description && <span className="block text-[11px] text-gray-500 mt-0.5">{tx.description}</span>}
                  </td>
                  <td className={`py-3 px-2 text-right font-semibold ${tx.transaction_type.includes('REPAY') ? 'text-green-600' : 'text-gray-900'}`}>
                    {tx.transaction_type.includes('REPAY') ? '-' : '+'}₹{Number(tx.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-2 text-right font-bold">₹{tx.runningBalance.toLocaleString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Professional Footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 break-inside-avoid">
        <div className="flex justify-between items-end">
          <div className="text-[10px] text-gray-400">
            <p className="mb-1 uppercase font-bold text-gray-500">** End of Statement **</p>
            <p>This is a computer generated statement and does not require a signature or physical stamp.</p>
            <p>Please examine this statement immediately. If no error is reported, it will be considered approved.</p>
          </div>
          
          <div className="flex gap-16">
            <div className="text-center">
              <div className="w-40 border-b border-gray-400 mb-2 h-10"></div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Customer Signature</p>
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-gray-400 mb-2 h-10"></div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
