'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, UserPlus, ArrowRightLeft, BookOpen, Menu, X, LogOut, Archive } from 'lucide-react'
import { useState } from 'react'

export default function AdminSidebar({ profileName }: { profileName: string }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const links = [
    { name: 'Dashboard (डैशबोर्ड)', href: '/admin', icon: LayoutDashboard },
    { name: 'Customers (ग्राहक)', href: '/admin/customers', icon: Users },
    { name: 'Ledger Entry (खाता बही)', href: '/admin/ledger', icon: ArrowRightLeft },
    { name: 'Interest Payout (ब्याज वितरण)', href: '/admin/bulk-interest', icon: BookOpen },
    { name: 'Register (नया खाता)', href: '/admin/register', icon: UserPlus },
    { name: 'Recycle Bin (बंद खाते)', href: '/admin/closed-accounts', icon: Archive },
  ]

  return (
    <>
      {/* Mobile Top Header (Visible only on small screens) */}
      <div className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-[14px] font-bold tracking-tight text-gray-900 leading-tight">Apna Sang<br/>Sahayata Samuh</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl md:shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
        
        {/* Desktop Brand Area */}
        <div className="hidden md:flex h-[72px] items-center gap-3 px-6 border-b border-gray-100 shrink-0">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
          <div className="flex flex-col justify-center">
            <span className="text-[14px] font-bold tracking-tight text-gray-900 leading-tight">Apna Sang Sahayata</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mt-0.5">Control Panel (नियंत्रण कक्ष)</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-0 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-600 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-600' : 'group-hover:scale-110'}`} />
                <span className="text-[13px] font-bold tracking-wide">{link.name}</span>
              </Link>
            )
          })}
        </div>

        {/* User Info / Logout Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[13px] font-bold text-gray-900 truncate">{profileName}</span>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Administrator</span>
            </div>
            <form action="/auth/signout" method="post" className="shrink-0">
              <button
                type="submit"
                className="p-2.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors group"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}
