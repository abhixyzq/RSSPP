'use client'

import { Download } from 'lucide-react'

export default function ExportCSVButton({ 
  data, 
  filename = "export.csv", 
  label = "Export CSV",
  className = "flex items-center gap-2 text-sm font-bold text-white bg-[#0B2E59] px-4 py-2 rounded-md shadow-sm hover:bg-[#071f3e]"
}: { 
  data: any[], 
  filename?: string, 
  label?: React.ReactNode,
  className?: string
}) {

  const handleExport = () => {
    if (!data || data.length === 0) {
      alert("No data available to export")
      return
    }

    // Get headers
    const headers = Object.keys(data[0])
    
    // Convert data to CSV format
    const csvRows = []
    csvRows.push(headers.join(',')) // Add header row

    for (const row of data) {
      const values = headers.map(header => {
        let val = row[header]
        // Handle nested objects or arrays if necessary
        if (typeof val === 'object' && val !== null) {
          val = JSON.stringify(val)
        }
        // Escape quotes and wrap in quotes to handle commas in values
        const escaped = ('' + (val ?? '')).replace(/"/g, '""')
        return `"${escaped}"`
      })
      csvRows.push(values.join(','))
    }

    const csvString = csvRows.join('\n')
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <button onClick={handleExport} className={className}>
      {label}
    </button>
  )
}
