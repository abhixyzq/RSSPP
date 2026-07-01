'use client'

import { Printer } from 'lucide-react'

export default function PrintButton({ 
  label = "Print", 
  className = "flex items-center gap-2 text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-md shadow-sm border border-gray-200 hover:bg-gray-50" 
}: { 
  label?: React.ReactNode, 
  className?: string 
}) {
  return (
    <button 
      type="button" 
      onClick={() => window.print()} 
      className={className}
    >
      <Printer className="w-4 h-4" /> 
      {label}
    </button>
  )
}
