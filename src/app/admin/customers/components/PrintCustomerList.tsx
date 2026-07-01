import React from 'react'

type Customer = {
  id: string
  full_name: string
  mobile_number: string
  kyc_document?: string
}

export default function PrintCustomerList({ customers }: { customers: Customer[] }) {
  const printDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  const printTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  return (
    <div className="hidden print:block w-full bg-white text-gray-900 font-sans" style={{ fontFamily: 'Arial, sans-serif' }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ borderBottom: '4px double #0B2E59', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          {/* Left: Org Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{ width: '48px', height: '48px', background: '#0B2E59', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
          </div>

          {/* Right: Report Meta */}
          <div style={{ textAlign: 'right' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 300, color: '#999', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
              Account Register
            </h2>
            <p style={{ fontSize: '11px', color: '#555', margin: '2px 0' }}><strong>Printed:</strong> {printDate} at {printTime}</p>
            <p style={{ fontSize: '11px', color: '#555', margin: '2px 0' }}><strong>Branch:</strong> Main (मुख्य शाखा)</p>
            <p style={{ fontSize: '11px', color: '#555', margin: '2px 0' }}><strong>Total Accounts:</strong> {customers.length}</p>
          </div>
        </div>
      </div>

      {/* ── REPORT TITLE BAR ── */}
      <div style={{ background: '#0B2E59', color: 'white', padding: '10px 16px', marginBottom: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
          Active Account Holders Directory (खाताधारक निर्देशिका)
        </span>
        <span style={{ fontSize: '11px', opacity: 0.8 }}>Financial Year: 2024–25</span>
      </div>

      {/* ── TABLE ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr style={{ background: '#f0f4f8', borderBottom: '2px solid #0B2E59' }}>
            <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px', color: '#444', width: '50px', borderRight: '1px solid #ddd' }}>Sl No.</th>
            <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px', color: '#444', borderRight: '1px solid #ddd' }}>Account Holder Name (नाम)</th>
            <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px', color: '#444', borderRight: '1px solid #ddd' }}>Account No. (खाता संख्या)</th>
            <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px', color: '#444', borderRight: '1px solid #ddd' }}>KYC Status</th>
            <th style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '10px', color: '#444' }}>A/c Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr
              key={customer.id}
              style={{
                borderBottom: '1px solid #e5e7eb',
                background: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                pageBreakInside: 'avoid',
              }}
            >
              <td style={{ padding: '9px 8px', color: '#888', fontWeight: 700, textAlign: 'center', borderRight: '1px solid #e5e7eb', fontSize: '11px' }}>
                {(index + 1).toString().padStart(3, '0')}
              </td>
              <td style={{ padding: '9px 8px', fontWeight: 700, color: '#1a1a2e', textTransform: 'uppercase', borderRight: '1px solid #e5e7eb' }}>
                {customer.full_name}
              </td>
              <td style={{ padding: '9px 8px', fontFamily: 'monospace', fontWeight: 600, color: '#374151', borderRight: '1px solid #e5e7eb', letterSpacing: '0.5px' }}>
                {customer.mobile_number}
              </td>
              <td style={{ padding: '9px 8px', textAlign: 'center', borderRight: '1px solid #e5e7eb', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: customer.kyc_document ? '#166534' : '#92400e' }}>
                {customer.kyc_document || 'PENDING'}
              </td>
              <td style={{ padding: '9px 8px', textAlign: 'center', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#166534' }}>
                ACTIVE
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: '#f0f4f8', borderTop: '2px solid #0B2E59' }}>
            <td colSpan={4} style={{ padding: '10px 8px', fontSize: '11px', fontWeight: 700, color: '#0B2E59', textTransform: 'uppercase' }}>
              Total Active Accounts (कुल सक्रिय खाते)
            </td>
            <td style={{ padding: '10px 8px', textAlign: 'center', fontSize: '13px', fontWeight: 900, color: '#0B2E59' }}>
              {customers.length}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* ── FOOTER ── */}
      <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '9px', color: '#999', maxWidth: '60%' }}>
          <p style={{ margin: '0 0 3px 0', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '1px' }}>— End of Report —</p>
          <p style={{ margin: 0 }}>This document is system-generated and is confidential. Unauthorized reproduction or distribution is prohibited.</p>
          <p style={{ margin: '3px 0 0 0' }}>If discrepancies are found, report immediately to the branch manager.</p>
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
