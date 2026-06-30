import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import DashboardClientUI from './components/DashboardClientUI'

export default async function CustomerDashboard() {
  const supabase = await createClient()

  // 1. Get the authenticated user's session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 2. Fetch their name and details
  const { data: profile, error: profileError } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    redirect('/login')
  }

  if (profile.role === 'admin') {
    redirect('/admin')
  }

  // 3. Fetch all their records ordered by date descending
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  // 4. Calculate separate totals mathematically
  const validTransactions = transactions || []
  let totalJama = 0
  let totalNikasi = 0

  validTransactions.forEach((tx) => {
    if (tx.transaction_type.startsWith('JAMA')) {
      totalJama += Number(tx.amount)
    } else if (tx.transaction_type.startsWith('NIKASI')) {
      totalNikasi += Number(tx.amount)
    }
  })

  return (
    <DashboardClientUI
      profile={profile}
      transactions={validTransactions}
      totalJama={totalJama}
      totalNikasi={totalNikasi}
    />
  )
}
