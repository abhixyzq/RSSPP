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
    redirect('/')
  }

  // 2. Fetch their name and details
  const { data: profile, error: profileError } = await supabase
    .from('users_profile')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    redirect('/')
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
  let totalInterestPaid = 0
  let totalEarnedInterest = 0

  // To calculate earned interest properly, we need to process chronologically
  const chronologicalTx = [...validTransactions].reverse()
  let runningJamaBalance = 0

  chronologicalTx.forEach((tx) => {
    const amt = Number(tx.amount)
    
    // Jama Calculations
    if (tx.transaction_type.startsWith('JAMA')) {
      if (tx.transaction_type === 'JAMA_DEPOSIT' || tx.transaction_type === 'JAMA_PRINCIPAL') {
        runningJamaBalance += amt
      } else if (tx.transaction_type === 'JAMA_WITHDRAWAL') {
        runningJamaBalance -= amt
      } else if (tx.transaction_type === 'JAMA_EARNED_INTEREST') {
        totalEarnedInterest += amt
      }
    }
    
    // Nikasi Calculations
    else if (tx.transaction_type === 'NIKASI_LOAN' || tx.transaction_type === 'NIKASI_PRINCIPAL') {
      totalNikasi += amt
    } else if (tx.transaction_type === 'NIKASI_REPAY_PRINCIPAL') {
      totalNikasi -= amt
    } else if (tx.transaction_type === 'NIKASI_REPAY_INTEREST') {
      totalInterestPaid += amt
    }
  })
  
  // Update totalJama from the final running balance
  totalJama = runningJamaBalance

  return (
    <DashboardClientUI
      profile={profile}
      transactions={validTransactions}
      totalJama={totalJama}
      totalNikasi={totalNikasi}
      totalInterestPaid={totalInterestPaid}
      totalEarnedInterest={totalEarnedInterest}
    />
  )
}
