import React from 'react'

export default function PrintPassbook({ 
  profile, 
  jamaTransactions, 
  nikasiTransactions, 
  currentJamaBalance, 
  currentNikasiBalance, 
  totalJamaInterest 
}: any) {
  const printDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const printTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(n)

  return (
    <div className="hidden print:block w-full bg-white text-gray-900" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ borderBottom: '4px double #0B2E59', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', background: '#0B2E59', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '22px' }}>AS</span>
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0B2E59', letterSpacing: '1px', margin: 0, textTransform: 'uppercase' }}>
                Apna Sang Sahayata Samuh
              </h1>
              <p style={{ fontSize: '11px', color: '#555', margin: '3px 0 0 0', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Registered Savings &amp; Credit Society — Main Branch (मुख्य शाखा)
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 300, color: '#bbb', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
              Account Statement
            </h2>
            <p style={{ fontSize: '11px', color: '#555', margin: '2px 0' }}><strong>Printed:</strong> {printDate} at {printTime}</p>
            <p style={{ fontSize: '11px', color: '#555', margin: '2px 0' }}><strong>Page:</strong> 1 of 1</p>
          </div>
        </div>
      </div>

      {/* ── CUSTOMER SECTION ── */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px' }}>
        {/* Left: Customer Address Block */}
        <div style={{ flex: '1.2', paddingRight: '20px', borderRight: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Account Holder</p>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1a1a2e', textTransform: 'uppercase', margin: '0 0 6px 0' }}>
            {profile.full_name}
          </h3>
          {profile.full_name_hi && (
            <p style={{ fontSize: '14px', color: '#555', margin: '0 0 8px 0' }}>{profile.full_name_hi}</p>
          )}
          <p style={{ fontSize: '12px', color: '#666', margin: '2px 0' }}>
            <strong>Address:</strong> {profile.address || 'Not Provided'}
          </p>
          {profile.address_hi && (
            <p style={{ fontSize: '12px', color: '#666', margin: '2px 0' }}>{profile.address_hi}</p>
          )}
          <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
            <strong>Occupation:</strong> {profile.occupation || 'Not Specified'}
          </p>
        </div>

        {/* Right: Account Details */}
        <div style={{ flex: '1', paddingLeft: '24px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px' }}>Account Details</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <tbody>
              {[
                ['Account No.', profile.mobile_number],
                ['Account Status', profile.isClosed ? 'CLOSED' : 'ACTIVE'],
                ['KYC Status', profile.kyc_document || 'PENDING'],
                ['Branch', 'Main (मुख्य शाखा)'],
                ['Currency', 'INR (₹)'],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '5px 4px 5px 0', color: '#888', fontWeight: 600, width: '45%' }}>{label}</td>
                  <td style={{ padding: '5px 0', fontWeight: 700, color: label === 'Account Status' ? (profile.isClosed ? '#991b1b' : '#166534') : '#1a1a2e' }}>
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── FINANCIAL SUMMARY STRIP ── */}
      <div style={{ display: 'flex', marginBottom: '28px', border: '1px solid #e0e7f0', borderLeft: '4px solid #0B2E59' }}>
        <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #e0e7f0' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Deposit Balance</p>
          <p style={{ fontSize: '20px', fontWeight: 900, color: '#1d4ed8', margin: 0 }}>{fmt(currentJamaBalance)}</p>
        </div>
        <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #e0e7f0' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Loan Balance</p>
          <p style={{ fontSize: '20px', fontWeight: 900, color: '#dc2626', margin: 0 }}>{fmt(currentNikasiBalance)}</p>
        </div>
        <div style={{ flex: 1, padding: '12px 16px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Interest Earned</p>
          <p style={{ fontSize: '20px', fontWeight: 900, color: '#16a34a', margin: 0 }}>{fmt(totalJamaInterest)}</p>
        </div>
      </div>

      {/* ── DEPOSIT LEDGER ── */}
      <div style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ background: '#0B2E59', color: 'white', padding: '5px 14px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Deposit Ledger (बचत खाता)
          </span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb', marginLeft: '12px' }}></div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#555', letterSpacing: '0.5px', width: '90px', borderRight: '1px solid #e2e8f0' }}>Date</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#555', letterSpacing: '0.5px', borderRight: '1px solid #e2e8f0' }}>Particulars</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#555', letterSpacing: '0.5px', width: '100px', borderRight: '1px solid #e2e8f0' }}>Interest</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#555', letterSpacing: '0.5px', width: '110px', borderRight: '1px solid #e2e8f0' }}>Amount</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#555', letterSpacing: '0.5px', width: '110px' }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {(!jamaTransactions || jamaTransactions.length === 0) ? (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center', fontStyle: 'italic', color: '#aaa', borderBottom: '1px solid #e5e7eb' }}>
                  No deposit transactions for this account.
                </td>
              </tr>
            ) : (
              jamaTransactions.map((tx: any, i: number) => {
                const isWithdrawal = tx.transaction_type.includes('WITHDRAWAL')
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa', pageBreakInside: 'avoid' }}>
                    <td style={{ padding: '7px 6px', color: '#444', borderRight: '1px solid #f0f0f0' }}>
                      {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '7px 6px', borderRight: '1px solid #f0f0f0' }}>
                      <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', color: '#1a1a2e' }}>
                        {tx.transaction_type.replace('JAMA_', '').replace(/_/g, ' ')}
                      </span>
                      {tx.description && (
                        <span style={{ display: 'block', fontSize: '10px', color: '#888', marginTop: '2px', fontStyle: 'italic' }}>
                          {tx.description}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '7px 6px', textAlign: 'right', color: '#16a34a', fontWeight: 600, borderRight: '1px solid #f0f0f0' }}>
                      {tx.earnedInterest ? fmt(tx.earnedInterest) : '—'}
                    </td>
                    <td style={{ padding: '7px 6px', textAlign: 'right', fontWeight: 700, color: isWithdrawal ? '#dc2626' : '#166534', borderRight: '1px solid #f0f0f0', fontFamily: 'monospace' }}>
                      {isWithdrawal ? '-' : '+'}{fmt(Number(tx.amount))}
                    </td>
                    <td style={{ padding: '7px 6px', textAlign: 'right', fontWeight: 800, color: '#0B2E59', fontFamily: 'monospace' }}>
                      {fmt(tx.runningBalance)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          <tfoot>
            <tr style={{ background: '#f0f4f8', borderTop: '2px solid #0B2E59' }}>
              <td colSpan={4} style={{ padding: '8px 6px', fontWeight: 700, fontSize: '11px', color: '#0B2E59', textTransform: 'uppercase' }}>
                Current Deposit Balance
              </td>
              <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 900, fontSize: '13px', color: '#0B2E59', fontFamily: 'monospace' }}>
                {fmt(currentJamaBalance)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── LOAN LEDGER ── */}
      <div style={{ marginBottom: '32px', pageBreakInside: 'avoid' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ background: '#7c2d12', color: 'white', padding: '5px 14px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>
            Loan Ledger (ऋण खाता)
          </span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb', marginLeft: '12px' }}></div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#555', letterSpacing: '0.5px', width: '90px', borderRight: '1px solid #e2e8f0' }}>Date</th>
              <th style={{ padding: '8px 6px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#555', letterSpacing: '0.5px', borderRight: '1px solid #e2e8f0' }}>Particulars</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#555', letterSpacing: '0.5px', width: '110px', borderRight: '1px solid #e2e8f0' }}>Amount</th>
              <th style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#555', letterSpacing: '0.5px', width: '110px' }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {(!nikasiTransactions || nikasiTransactions.length === 0) ? (
              <tr>
                <td colSpan={4} style={{ padding: '20px', textAlign: 'center', fontStyle: 'italic', color: '#aaa', borderBottom: '1px solid #e5e7eb' }}>
                  No loan transactions for this account.
                </td>
              </tr>
            ) : (
              nikasiTransactions.map((tx: any, i: number) => {
                const isRepay = tx.transaction_type.includes('REPAY')
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f0f0', background: i % 2 === 0 ? '#fff' : '#fafafa', pageBreakInside: 'avoid' }}>
                    <td style={{ padding: '7px 6px', color: '#444', borderRight: '1px solid #f0f0f0' }}>
                      {new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '7px 6px', borderRight: '1px solid #f0f0f0' }}>
                      <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', color: '#1a1a2e' }}>
                        {tx.transaction_type.replace('NIKASI_', '').replace(/_/g, ' ')}
                      </span>
                      {tx.description && (
                        <span style={{ display: 'block', fontSize: '10px', color: '#888', marginTop: '2px', fontStyle: 'italic' }}>
                          {tx.description}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '7px 6px', textAlign: 'right', fontWeight: 700, color: isRepay ? '#16a34a' : '#dc2626', borderRight: '1px solid #f0f0f0', fontFamily: 'monospace' }}>
                      {isRepay ? '-' : '+'}{fmt(Number(tx.amount))}
                    </td>
                    <td style={{ padding: '7px 6px', textAlign: 'right', fontWeight: 800, color: '#7c2d12', fontFamily: 'monospace' }}>
                      {fmt(tx.runningBalance)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
          <tfoot>
            <tr style={{ background: '#fef2f2', borderTop: '2px solid #7c2d12' }}>
              <td colSpan={3} style={{ padding: '8px 6px', fontWeight: 700, fontSize: '11px', color: '#7c2d12', textTransform: 'uppercase' }}>
                Current Loan Balance Outstanding
              </td>
              <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 900, fontSize: '13px', color: '#7c2d12', fontFamily: 'monospace' }}>
                {fmt(currentNikasiBalance)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── PROFESSIONAL FOOTER ── */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '9px', color: '#aaa', maxWidth: '55%' }}>
          <p style={{ margin: '0 0 3px 0', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>— End of Account Statement —</p>
          <p style={{ margin: 0 }}>This is a computer-generated statement and does not require a physical signature or stamp.</p>
          <p style={{ margin: '3px 0 0 0' }}>Please examine this statement immediately. If no discrepancy is reported within 7 days, it will be deemed correct and accepted.</p>
        </div>
        <div style={{ display: 'flex', gap: '60px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '130px', borderBottom: '1px solid #555', marginBottom: '6px', height: '36px' }}></div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', textTransform: 'uppercase', margin: 0 }}>Customer Signature</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '130px', borderBottom: '1px solid #555', marginBottom: '6px', height: '36px' }}></div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', textTransform: 'uppercase', margin: 0 }}>Authorised Signatory</p>
          </div>
        </div>
      </div>

    </div>
  )
}
