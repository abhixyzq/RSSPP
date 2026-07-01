import { getAllCustomers } from '@/actions/admin'
import CustomerTable from './components/CustomerTable'
import { Users, Search, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default async function CustomersPage() {
  const customers = await getAllCustomers()

  return (
    <div className="w-full font-sans relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B2E59] dark:text-blue-400 tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            Customer Directory (ग्राहक सूची)
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage all registered accounts securely. <span className="text-sm opacity-80">(सभी पंजीकृत खातों का सुरक्षित प्रबंधन करें)</span></p>
        </div>
        
        {/* Actions */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search name or mobile (नाम या मोबाइल खोजें)..." 
              className="w-full pl-9 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-[#0B2E59] focus:ring-0 transition-colors text-sm font-medium"
            />
          </div>
          <Link href="/admin/register" className="shrink-0 bg-[#0B2E59] hover:bg-blue-900 text-white p-2.5 rounded-xl shadow-md transition-all flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </Link>
        </div>
      </div>
      
      <CustomerTable customers={customers || []} />
    </div>
  )
}
