import { createClient } from '@/utils/supabase/server'
import AddTransactionForm from '../components/AddTransactionForm'

export default async function LedgerEntryPage() {
  const supabase = await createClient()

  // Fetch all customers for the autocomplete search
  const { data: customers, error } = await supabase
    .from('users_profile')
    .select('id, full_name, mobile_number')
    .eq('role', 'customer')
    .not('full_name', 'ilike', '[CLOSED:%')
    .order('full_name', { ascending: true })

  if (error) {
    console.error('Error fetching customers for ledger:', error)
  }

  return (
    <div className="-m-4 sm:-m-8">
      <AddTransactionForm customers={customers || []} />
    </div>
  )
}
