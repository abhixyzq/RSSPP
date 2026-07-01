'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, UserPlus, ArrowRightLeft, BookOpen, Menu, X, LogOut, Archive, Sun, Moon, History } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function AdminSidebar({ profileName }: { profileName: string }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = mounted && resolvedTheme === 'dark'

  const links = [
    { name: 'Dashboard (डैशबोर्ड)', href: '/admin', icon: LayoutDashboard },
    { name: 'Customers (ग्राहक)', href: '/admin/customers', icon: Users },
    { name: 'Ledger Entry (खाता बही)', href: '/admin/ledger', icon: ArrowRightLeft },
    { name: 'Ledger History (इतिहास)', href: '/admin/transactions', icon: History },
    { name: 'Interest Payout (ब्याज वितरण)', href: '/admin/bulk-interest', icon: BookOpen },
    { name: 'Register (नया खाता)', href: '/admin/register', icon: UserPlus },
    { name: 'Recycle Bin (बंद खाते)', href: '/admin/closed-accounts', icon: Archive },
  ]

  return (
    <>
      {/* Mobile Top Header (Visible only on small screens) */}
      <div className="md:hidden bg-white/50 dark:bg-black/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/5 h-16 flex items-center justify-between px-4 sticky top-0 z-40 w-full transition-colors duration-500">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-cover rounded-full border border-gray-200 dark:border-white/15 shadow-sm" />
          <span className="text-[14px] font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Apna Sang<br/>Sahayata Samuh</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/70 dark:bg-black/40 backdrop-blur-2xl border-r border-gray-200/50 dark:border-white/10 transform transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl md:shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
        
        {/* Desktop Brand Area */}
        <div className="hidden md:flex h-[72px] items-center gap-3 px-6 border-b border-gray-200/50 dark:border-white/5 shrink-0">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-cover rounded-full border border-gray-200 dark:border-white/15 shadow-sm" />
          <div className="flex flex-col justify-center">
            <span className="text-[14px] font-bold tracking-tight text-gray-900 dark:text-white leading-tight">Apna Sang Sahayata</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 mt-0.5">Control Panel</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide">
          {links.map((link) => {
            const isActive = pathname === link.href
            const Icon = link.icon
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-cyan-50/50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 shadow-sm border border-cyan-100 dark:border-cyan-500/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200 border border-transparent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {isActive && (
                   <span className="absolute left-0 w-1 h-6 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.6)]"></span>
                )}
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-cyan-600 dark:text-cyan-400 drop-shadow-md' : 'group-hover:scale-110'}`} />
                <span className="text-[13px] font-bold tracking-wide">{link.name}</span>
              </Link>
            )
          })}
        </div>

        {/* User Info / Logout Footer */}
        <div className="p-4 border-t border-gray-200/50 dark:border-white/5 bg-white/30 dark:bg-black/20 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{profileName}</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Administrator</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors group"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-4 h-4 group-hover:scale-110 transition-transform" /> : <Moon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
              </button>
              <form action="/auth/signout" method="post" className="shrink-0">
                <button
                  type="submit"
                  className="p-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400 transition-colors group"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
