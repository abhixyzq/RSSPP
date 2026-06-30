import { getAllCustomers } from '@/actions/admin'
import CustomerTable from './components/CustomerTable'

export default async function CustomersPage() {
  const customers = await getAllCustomers()

  return (
    <div className="w-full">
      <CustomerTable customers={customers || []} />
    </div>
  )
}
