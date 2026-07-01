import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import AdminSidebar from './components/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin-login')
  }

  // Check if user is an admin by querying the users_profile table
  const { data: profile, error } = await supabase
    .from('users_profile')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (error || profile?.role !== 'admin') {
    // If not an admin or error occurs, redirect them.
    // They are authenticated, but lack permissions.
    await supabase.auth.signOut()
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] flex flex-col md:flex-row font-sans text-slate-600 dark:text-gray-300 selection:bg-cyan-500/30 selection:text-cyan-900 dark:selection:text-cyan-100 transition-colors duration-500 relative">
      
      {/* Dynamic Background Effects (Matches Home Page) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/bg-abstract.png')] bg-cover bg-center opacity-20 dark:opacity-30 mix-blend-overlay transition-opacity duration-500"></div>
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-400/20 dark:bg-cyan-900/20 rounded-full blur-[120px] transition-colors duration-500"></div>
        <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-400/10 dark:bg-blue-900/10 rounded-full blur-[150px] transition-colors duration-500"></div>
      </div>

      {/* 
        The AdminSidebar component handles both:
        1. Mobile Top Header + Drawer 
        2. Desktop Persistent Sidebar
      */}
      <AdminSidebar profileName={profile.full_name} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300 relative z-10">
        <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}
