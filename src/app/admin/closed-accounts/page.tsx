import { getClosedCustomers } from '@/actions/admin'
import ClosedCustomerTable from './components/ClosedCustomerTable'

export const dynamic = 'force-dynamic'

export default async function ClosedAccountsPage() {
  const customers = await getClosedCustomers()

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto">
       <ClosedCustomerTable customers={customers} />
    </div>
  )
}
