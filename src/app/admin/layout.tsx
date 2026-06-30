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
    redirect('/login')
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
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col md:flex-row font-sans">
      
      {/* 
        The AdminSidebar component handles both:
        1. Mobile Top Header + Drawer 
        2. Desktop Persistent Sidebar
      */}
      <AdminSidebar profileName={profile.full_name} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

    </div>
  )
}
