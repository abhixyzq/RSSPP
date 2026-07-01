import { createAdminClient } from '@/utils/supabase/admin'
import BulkInterestUI from './components/BulkInterestUI'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BulkInterestPage() {
  const supabase = createAdminClient()

  const { data: profiles, error: profileError } = await supabase
    .from('users_profile')
    .select('*')
    .eq('role', 'customer')
    .not('full_name', 'ilike', '[CLOSED:%')
    .order('created_at', { ascending: false })

  if (profileError) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-bold">Failed to load profiles</h2>
        <p>{profileError.message}</p>
      </div>
    )
  }

  // Fetch all JAMA transactions
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select('*')
    .like('transaction_type', 'JAMA_%')

  if (txError) {
    return (
      <div className="p-8 text-center text-red-600">
        <h2 className="text-xl font-bold">Failed to load transactions</h2>
        <p>{txError.message}</p>
      </div>
    )
  }

  // Pre-calculate running balances for everyone
  const customerData = (profiles || []).map(profile => {
    const userTxs = (transactions || []).filter(tx => tx.user_id === profile.id)
    let currentJamaBal = 0

    // Calculate balance by sorting chronologically
    const sortedTxs = [...userTxs].sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime())
    
    sortedTxs.forEach(tx => {
      const amt = Number(tx.amount)
      if (tx.transaction_type === 'JAMA_DEPOSIT' || tx.transaction_type === 'JAMA_PRINCIPAL') {
        currentJamaBal += amt
      } else if (tx.transaction_type === 'JAMA_WITHDRAWAL') {
        currentJamaBal -= amt
      }
    })

    return {
      id: profile.id,
      name: profile.full_name,
      mobile: profile.mobile_number,
      currentJamaBalance: currentJamaBal,
      kyc_document: profile.kyc_document
    }
  })

  // Filter out people with zero or negative balance (they don't get interest)
  const eligibleCustomers = customerData.filter(c => c.currentJamaBalance > 0)

  return (
    <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <BulkInterestUI customers={eligibleCustomers} />
    </div>
  )
}
