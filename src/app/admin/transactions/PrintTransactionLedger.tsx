import React from 'react'

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount)

export default function PrintTransactionLedger({ transactions }: { transactions: any[] }) {
  const printDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const printTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  const totalCredits = transactions
    .filter(tx => tx.transaction_type.startsWith('JAMA'))
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  const totalDebits = transactions
    .filter(tx => tx.transaction_type.startsWith('NIKASI'))
    .reduce((sum, tx) => sum + Number(tx.amount), 0)

  return (
    <div className="hidden print:block w-full bg-white text-gray-900 font-sans" style={{ fontFamily: 'Arial, sans-serif' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ borderBottom: '4px double #0B2E59', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', background: '#0B2E59', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: '20px' }}>AS</span>
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0B2E59', letterSpacing: '1px', margin: 0, textTransform: 'uppercase' }}>
                Apna Sang Sahayata Samuh
              </h1>
              <p style={{ fontSize: '11px', color: '#555', margin: 0, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                Registered Savings &amp; Credit Society — Main Branch
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 300, color: '#999', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
              Ledger History
            </h2>
            <p style={{ fontSize: '11px', color: '#555', margin: '2px 0' }}><strong>Printed:</strong> {printDate} at {printTime}</p>
            <p style={{ fontSize: '11px', color: '#555', margin: '2px 0' }}><strong>Records:</strong> {transactions.length} transactions</p>
          </div>
        </div>
      </div>

      {/* ── FINANCIAL SUMMARY STRIP ── */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '24px', border: '1px solid #ddd' }}>
        <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #ddd' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Total Credits (जमा)</p>
          <p style={{ fontSize: '18px', fontWeight: 900, color: '#166534', margin: 0 }}>+{formatCurrency(totalCredits)}</p>
        </div>
        <div style={{ flex: 1, padding: '12px 16px', borderRight: '1px solid #ddd' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Total Debits (निकासी)</p>
          <p style={{ fontSize: '18px', fontWeight: 900, color: '#991b1b', margin: 0 }}>-{formatCurrency(totalDebits)}</p>
        </div>
        <div style={{ flex: 1, padding: '12px 16px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0' }}>Net Balance (शुद्ध शेष)</p>
          <p style={{ fontSize: '18px', fontWeight: 900, color: '#0B2E59', margin: 0 }}>{formatCurrency(totalCredits - totalDebits)}</p>
        </div>
      </div>

      {/* ── REPORT TITLE BAR ── */}
      <div style={{ background: '#0B2E59', color: 'white', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
          Transaction Register — Last {transactions.length} Entries
        </span>
        <span style={{ fontSize: '11px', opacity: 0.8 }}>Sorted by Date (Newest First)</span>
      </div>

      {/* ── TABLE ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#f0f4f8', borderBottom: '2px solid #cbd5e1' }}>
            <th style={{ padding: '9px 8px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#444', letterSpacing: '0.5px', borderRight: '1px solid #ddd', width: '38px' }}>No.</th>
            <th style={{ padding: '9px 8px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#444', letterSpacing: '0.5px', borderRight: '1px solid #ddd', width: '90px' }}>Date</th>
            <th style={{ padding: '9px 8px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#444', letterSpacing: '0.5px', borderRight: '1px solid #ddd' }}>Account Holder</th>
            <th style={{ padding: '9px 8px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#444', letterSpacing: '0.5px', borderRight: '1px solid #ddd' }}>Transaction Type</th>
            <th style={{ padding: '9px 8px', textAlign: 'right', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#444', letterSpacing: '0.5px', borderRight: '1px solid #ddd', width: '110px' }}>Amount</th>
            <th style={{ padding: '9px 8px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', fontSize: '10px', color: '#444', letterSpacing: '0.5px' }}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx: any, index: number) => {
            const isCredit = tx.transaction_type.startsWith('JAMA')
            return (
              <tr
                key={tx.id}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  background: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                  pageBreakInside: 'avoid',
                }}
              >
                <td style={{ padding: '8px', textAlign: 'center', color: '#aaa', fontWeight: 700, fontSize: '10px', borderRight: '1px solid #e5e7eb' }}>
                  {(index + 1).toString().padStart(3, '0')}
                </td>
                <td style={{ padding: '8px', color: '#374151', fontWeight: 600, borderRight: '1px solid #e5e7eb', fontSize: '11px' }}>
                  <div>{new Date(tx.transaction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </td>
                <td style={{ padding: '8px', fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', borderRight: '1px solid #e5e7eb' }}>
                  {tx.users_profile?.full_name || 'Unknown'}
                </td>
                <td style={{ padding: '8px', borderRight: '1px solid #e5e7eb' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    background: isCredit ? '#dcfce7' : '#fee2e2',
                    color: isCredit ? '#166534' : '#991b1b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                  }}>
                    {tx.transaction_type.replace(/_/g, ' ')}
                  </span>
                </td>
                <td style={{
                  padding: '8px',
                  textAlign: 'right',
                  fontWeight: 800,
                  color: isCredit ? '#166534' : '#991b1b',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  borderRight: '1px solid #e5e7eb',
                }}>
                  {isCredit ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                </td>
                <td style={{ padding: '8px', fontSize: '11px', color: '#6b7280', fontStyle: tx.description ? 'normal' : 'italic' }}>
                  {tx.description || '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr style={{ background: '#f0f4f8', borderTop: '2px solid #0B2E59' }}>
            <td colSpan={4} style={{ padding: '10px 8px', fontSize: '11px', fontWeight: 700, color: '#0B2E59', textTransform: 'uppercase' }}>
              Period Total
            </td>
            <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: '13px', fontWeight: 900, color: '#0B2E59', fontFamily: 'monospace' }}>
              {formatCurrency(totalCredits - totalDebits)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      {/* ── FOOTER ── */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '9px', color: '#999', maxWidth: '60%' }}>
          <p style={{ margin: '0 0 3px 0', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>— End of Ledger Report —</p>
          <p style={{ margin: 0 }}>This document is system-generated and confidential. Unauthorized reproduction is prohibited.</p>
        </div>
        <div style={{ display: 'flex', gap: '60px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '120px', borderBottom: '1px solid #444', marginBottom: '6px', height: '30px' }}></div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', textTransform: 'uppercase', margin: 0 }}>Prepared By</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '120px', borderBottom: '1px solid #444', marginBottom: '6px', height: '30px' }}></div>
            <p style={{ fontSize: '10px', fontWeight: 700, color: '#555', textTransform: 'uppercase', margin: 0 }}>Authorised By</p>
          </div>
        </div>
      </div>

    </div>
  )
}
