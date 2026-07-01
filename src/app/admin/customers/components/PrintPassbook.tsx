import React from 'react'

export default function PrintPassbook({ 
  profile, 
  jamaTransactions, 
  nikasiTransactions, 
  currentJamaBalance, 
  currentNikasiBalance, 
  totalJamaInterest 
}: any) {
  return (
    <div className="hidden print:block w-full bg-white text-black font-sans">
      
      {/* Formal Letterhead */}
      <div className="text-center border-b-[3px] border-black pb-4 mb-6">
        <h1 className="text-3xl font-black uppercase tracking-widest mb-1">Apna Sang Sahayata Samuh</h1>
        <p className="text-lg font-bold">Branch: MAIN (मुख्य शाखा)</p>
        <p className="text-sm uppercase font-semibold mt-2">Customer Passbook / Account Ledger (खाता विवरण)</p>
      </div>

      {/* Customer Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8 text-sm border-b border-black pb-6">
        <div className="space-y-1">
          <p><span className="font-bold">Account Name (नाम):</span> {profile.full_name} {profile.full_name_hi ? `/ ${profile.full_name_hi}` : ''}</p>
          <p><span className="font-bold">Account No (खाता संख्या):</span> {profile.mobile_number}</p>
          <p><span className="font-bold">Address (पता):</span> {profile.address || 'N/A'} {profile.address_hi ? `/ ${profile.address_hi}` : ''}</p>
          <p><span className="font-bold">Occupation (पेशा):</span> {profile.occupation || 'N/A'}</p>
        </div>
        <div className="space-y-1 text-right">
          <p><span className="font-bold">Status:</span> {profile.isClosed ? 'CLOSED' : 'ACTIVE'}</p>
          <p><span className="font-bold">KYC Status:</span> {profile.kyc_document || 'PENDING'}</p>
          <p><span className="font-bold">Print Date (दिनांक):</span> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Summary Balances */}
      <div className="grid grid-cols-3 gap-4 mb-8 text-center border-[2px] border-black p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">Total Deposit Balance</p>
          <p className="text-xl font-black">₹{currentJamaBalance.toLocaleString('en-IN')}</p>
        </div>
        <div className="border-l border-r border-gray-400">
          <p className="text-xs font-bold uppercase tracking-wider">Total Loan Balance</p>
          <p className="text-xl font-black">₹{currentNikasiBalance.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider">Total Interest Earned</p>
          <p className="text-xl font-black">₹{totalJamaInterest.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Deposit Ledger */}
      <div className="mb-10">
        <h3 className="font-bold uppercase border-b-2 border-black mb-3 pb-1">Deposit Ledger (बचत खाता)</h3>
        <table className="w-full text-left text-sm border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-black w-24">Date</th>
              <th className="p-2 border border-black">Particulars</th>
              <th className="p-2 border border-black text-right w-28">Interest</th>
              <th className="p-2 border border-black text-right w-32">Amount</th>
              <th className="p-2 border border-black text-right w-32">Balance</th>
            </tr>
          </thead>
          <tbody>
            {(!jamaTransactions || jamaTransactions.length === 0) ? (
              <tr>
                <td colSpan={5} className="p-4 text-center italic border border-black">No deposits found.</td>
              </tr>
            ) : (
              jamaTransactions.map((tx: any, i: number) => (
                <tr key={i}>
                  <td className="p-2 border border-black">{new Date(tx.transaction_date).toLocaleDateString('en-IN')}</td>
                  <td className="p-2 border border-black uppercase text-xs font-semibold">
                    {tx.transaction_type.replace('JAMA_', '')}
                    {tx.description && <span className="block text-[10px] text-gray-600 normal-case">{tx.description}</span>}
                  </td>
                  <td className="p-2 border border-black text-right">{tx.earnedInterest ? tx.earnedInterest.toLocaleString('en-IN') : '-'}</td>
                  <td className="p-2 border border-black text-right font-bold">
                    {tx.transaction_type.includes('WITHDRAWAL') ? '-' : '+'}{Number(tx.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="p-2 border border-black text-right font-black">{tx.runningBalance.toLocaleString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Loan Ledger */}
      <div className="mb-10">
        <h3 className="font-bold uppercase border-b-2 border-black mb-3 pb-1">Loan Ledger (ऋण खाता)</h3>
        <table className="w-full text-left text-sm border-collapse border border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border border-black w-24">Date</th>
              <th className="p-2 border border-black">Particulars</th>
              <th className="p-2 border border-black text-right w-32">Amount</th>
              <th className="p-2 border border-black text-right w-32">Balance</th>
            </tr>
          </thead>
          <tbody>
            {(!nikasiTransactions || nikasiTransactions.length === 0) ? (
              <tr>
                <td colSpan={4} className="p-4 text-center italic border border-black">No loans found.</td>
              </tr>
            ) : (
              nikasiTransactions.map((tx: any, i: number) => (
                <tr key={i}>
                  <td className="p-2 border border-black">{new Date(tx.transaction_date).toLocaleDateString('en-IN')}</td>
                  <td className="p-2 border border-black uppercase text-xs font-semibold">
                    {tx.transaction_type.replace('NIKASI_', '').replace(/_/g, ' ')}
                    {tx.description && <span className="block text-[10px] text-gray-600 normal-case">{tx.description}</span>}
                  </td>
                  <td className="p-2 border border-black text-right font-bold">
                    {tx.transaction_type.includes('REPAY') ? '-' : '+'}{Number(tx.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="p-2 border border-black text-right font-black">{tx.runningBalance.toLocaleString('en-IN')}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Signatures */}
      <div className="flex justify-between mt-24 px-8">
        <div className="text-center border-t-2 border-black w-48 pt-2">
          <p className="font-bold text-xs uppercase">Customer Signature</p>
        </div>
        <div className="text-center border-t-2 border-black w-48 pt-2">
          <p className="font-bold text-xs uppercase">Authorized Signatory</p>
        </div>
      </div>
    </div>
  )
}
