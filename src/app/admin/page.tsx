import { getVillageTotals } from '@/actions/admin'
import { Wallet, Landmark, Users, TrendingUp, Building, BarChart3, Clock, AlertTriangle } from 'lucide-react'

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default async function AdminDashboard() {
  const totals = await getVillageTotals()

  const stats = [
    {
      name: 'Total Deposits (Credits)',
      value: formatCurrency(totals.totalJama),
      icon: Wallet,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-600',
      description: 'Total Jama collected in branch',
    },
    {
      name: 'Total Loans (Debits)',
      value: formatCurrency(totals.totalNikasi),
      icon: Landmark,
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-600',
      description: 'Total Nikasi disbursed by branch',
    },
    {
      name: 'Today\'s Cash Inward',
      value: formatCurrency(totals.todaysCollection),
      icon: TrendingUp,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-600',
      description: 'Total deposits received today',
    },
    {
      name: 'Active Accounts',
      value: totals.activeCustomers.toString(),
      icon: Users,
      color: 'text-[#0B2E59]',
      bgColor: 'bg-[#e6f0fa]',
      borderColor: 'border-[#0B2E59]',
      description: 'Total registered customers',
    },
  ]

  const currentDate = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="bg-[#F4F6F9] min-h-[calc(100vh-60px)] -m-4 sm:-m-8 p-4 sm:p-8 font-sans">
      
      {/* Formal Bank Header */}
      <div className="bg-[#0B2E59] text-white p-6 border-b-4 border-[#0099CC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 shadow-md">
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0">
              <Building className="w-8 h-8 text-[#0B2E59]" />
           </div>
           <div>
              <h1 className="text-2xl font-bold uppercase tracking-wide">Core Banking Dashboard</h1>
              <p className="text-blue-200 text-sm font-medium tracking-wide">Main Branch Overview • System Admin</p>
           </div>
        </div>
        <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded border border-white/20">
           <Clock className="w-5 h-5 text-blue-300" />
           <span className="text-xs font-bold tracking-widest uppercase">{currentDate}</span>
        </div>
      </div>

      {/* Financial Summary Grid */}
      <h2 className="text-[15px] font-bold text-[#0B2E59] uppercase tracking-wider mb-4 border-b-2 border-gray-300 pb-2 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" /> Financial Snapshot
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className={`bg-white border-t-4 ${stat.borderColor} border-x border-b border-gray-200 shadow-sm p-6 flex flex-col`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">{stat.name}</p>
              <div className={`w-10 h-10 rounded flex items-center justify-center ${stat.bgColor} ${stat.color}`}>
                <stat.icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
            
            <h3 className={`text-2xl font-extrabold tracking-tight ${stat.color} mb-2`}>{stat.value}</h3>
            
            <div className="mt-auto pt-4 border-t border-gray-100">
               <p className="text-[11px] text-gray-500 font-bold uppercase">
                  {stat.description}
               </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Corporate Notice Board */}
      <h2 className="text-[15px] font-bold text-[#0B2E59] uppercase tracking-wider mb-4 border-b-2 border-gray-300 pb-2">
        System Bulletins
      </h2>

      <div className="bg-white border border-gray-200 shadow-sm">
         <div className="bg-[#0B2E59] text-white p-3 border-b border-gray-200 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" /> Notice Board
         </div>
         <div className="p-6">
            <ul className="space-y-4">
               <li className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <div>
                     <p className="text-sm font-bold text-[#0B2E59] uppercase">Advanced Analytics Module</p>
                     <p className="text-sm text-gray-700 mt-1">Detailed financial reports, growth charts, and collection trends are currently under development and will be deployed in the next core banking update.</p>
                  </div>
               </li>
               <li className="flex gap-4 p-4 bg-gray-50 border border-gray-200 rounded">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 shrink-0" />
                  <div>
                     <p className="text-sm font-bold text-gray-700 uppercase">System Maintenance</p>
                     <p className="text-sm text-gray-500 mt-1">End of day (EOD) processing should be verified daily to ensure ledger accuracy.</p>
                  </div>
               </li>
            </ul>
         </div>
      </div>

    </div>
  )
}
