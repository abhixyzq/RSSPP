'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'

export async function createCustomer(prevState: any, formData: FormData) {
  const supabaseAdmin = createAdminClient()

  const mobile = formData.get('mobile') as string
  const pin = formData.get('pin') as string
  const fullName = formData.get('fullName') as string
  
  // New fields
  const secondaryMobile = formData.get('secondaryMobile') as string
  const guardianName = formData.get('guardianName') as string
  const address = formData.get('address') as string
  const kycDocument = formData.get('kycDocument') as string
  const nomineeDetails = formData.get('nomineeDetails') as string
  const guarantorOptional = formData.get('guarantorOptional') as string
  const occupation = formData.get('occupation') as string

  if (!mobile || mobile.length !== 10 || !pin || pin.length !== 4 || !fullName) {
    return { error: 'Please provide a valid 10-digit mobile, 4-digit PIN, and full name.' }
  }

  const email = `${mobile}@rsspp.local`
  // Supabase requires 6 character password minimum, so we pad the 4-digit PIN
  const password = pin + '00'

  // 1. Create user in auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    console.error('Auth User Creation Error:', authError)
    const errorMsg = authError?.message || ''
    if (errorMsg.includes('already registered') || errorMsg.includes('already been registered') || errorMsg.includes('User already exists')) {
        return { error: 'A user with this primary mobile number already exists in the system.' }
    }
    return { error: `Auth Error: ${errorMsg || 'Failed to create authentication record'}` }
  }

  // 2. Insert into users_profile
  const { error: profileError } = await supabaseAdmin
    .from('users_profile')
    .insert({
      id: authData.user.id,
      full_name: fullName,
      mobile_number: mobile,
      role: 'customer',
      secondary_mobile: secondaryMobile || null,
      guardian_name: guardianName || null,
      address: address || null,
      kyc_document: kycDocument || null,
      nominee_details: nomineeDetails || null,
      guarantor_details: guarantorOptional || null,
      occupation: occupation || null,
    })

  if (profileError) {
    console.error('Profile Creation Error:', profileError)
    // To help debug if it fails again
    return { error: `Database Error: ${profileError.message || 'Failed to create user profile'}` }
  }

  revalidatePath('/admin', 'layout')
  return { success: 'Customer successfully created!' }
}

export async function addTransaction(prevState: any, formData: FormData) {
  const supabaseAdmin = createAdminClient()

  const userId = formData.get('userId') as string
  const amountStr = formData.get('amount') as string
  const type = formData.get('type') as string
  const description = formData.get('description') as string

  if (!userId || !amountStr || !type) {
    return { error: 'Missing required fields. Customer, Amount, and Type are required.' }
  }

  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) {
    return { error: 'Amount must be a positive number.' }
  }

  if (type !== 'JAMA_PRINCIPAL' && type !== 'NIKASI_PRINCIPAL') {
    return { error: 'Invalid transaction type.' }
  }

  const { error } = await supabaseAdmin
    .from('transactions')
    .insert({
      user_id: userId,
      amount: amount,
      transaction_type: type,
      description: description || null,
    })

  if (error) {
    console.error('Transaction Insert Error:', error)
    return { error: 'Failed to record transaction.' }
  }

  revalidatePath('/admin', 'layout')
  return { success: 'Transaction recorded successfully!' }
}

export async function getVillageTotals() {
  const supabaseAdmin = createAdminClient()

  // 1. Get all transactions to compute sums
  const { data: transactions, error: txError } = await supabaseAdmin
    .from('transactions')
    .select('amount, transaction_type, transaction_date')

  // 2. Get customer count
  const { count: customerCount, error: countError } = await supabaseAdmin
    .from('users_profile')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'customer')

  if (txError || countError) {
    console.error('Error fetching totals', txError, countError)
    return {
      totalJama: 0,
      totalNikasi: 0,
      activeCustomers: 0,
      todaysCollection: 0
    }
  }

  let totalJama = 0
  let totalNikasi = 0
  let todaysCollection = 0
  
  // Get start of today in local time for comparison
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  transactions?.forEach(tx => {
    const amount = Number(tx.amount)
    if (tx.transaction_type.startsWith('JAMA')) {
      totalJama += amount
      
      // Check if it was deposited today
      const txDate = new Date(tx.transaction_date)
      if (txDate >= today) {
        todaysCollection += amount
      }
    } else if (tx.transaction_type.startsWith('NIKASI')) {
      totalNikasi += amount
    }
  })

  return {
    totalJama,
    totalNikasi,
    activeCustomers: customerCount || 0,
    todaysCollection
  }
}

export async function getAllCustomers() {
  const supabaseAdmin = createAdminClient()
  
  const { data, error } = await supabaseAdmin
    .from('users_profile')
    .select('id, full_name, mobile_number')
    .eq('role', 'customer')
    .order('full_name', { ascending: true })
    
  if (error) {
    console.error('Error fetching customers', error)
    return []
  }
  
  return data
}

export async function getCustomerDetails(customerId: string) {
  const supabaseAdmin = createAdminClient()
  
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users_profile')
    .select('*')
    .eq('id', customerId)
    .single()
    
  if (profileError) return { error: 'Customer not found' }
  
  const { data: transactions, error: txError } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .eq('user_id', customerId)
    .order('transaction_date', { ascending: false })
    
  if (txError) return { error: 'Failed to fetch transactions' }
  
  return { profile, transactions }
}

export async function deleteCustomer(customerId: string) {
  const supabaseAdmin = createAdminClient()
  
  try {
    // 1. Delete Transactions
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('user_id', customerId)
      
    if (txError) {
      console.error('Error deleting transactions:', txError)
      return { error: 'Failed to delete customer transactions.' }
    }
    
    // 2. Delete Profile
    const { error: profileError } = await supabaseAdmin
      .from('users_profile')
      .delete()
      .eq('id', customerId)
      
    if (profileError) {
      console.error('Error deleting profile:', profileError)
      return { error: 'Failed to delete customer profile.' }
    }
    
    // 3. Delete Auth User
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(customerId)
    
    if (authError) {
      console.error('Error deleting auth user:', authError)
      return { error: 'Failed to delete authentication record.' }
    }
    
    revalidatePath('/admin', 'layout')
    return { success: 'Customer deleted successfully.' }
    
  } catch (err: any) {
    console.error('Delete Exception:', err)
    return { error: 'An unexpected error occurred while deleting the customer.' }
  }
}

export async function updateCustomerDetails(prevState: any, formData: FormData) {
  const supabaseAdmin = createAdminClient()
  
  const customerId = formData.get('customerId') as string
  const fullName = formData.get('fullName') as string
  const secondaryMobile = formData.get('secondaryMobile') as string
  const guardianName = formData.get('guardianName') as string
  const address = formData.get('address') as string
  const kycDocument = formData.get('kycDocument') as string
  const nomineeDetails = formData.get('nomineeDetails') as string
  const guarantorOptional = formData.get('guarantorOptional') as string
  const occupation = formData.get('occupation') as string
  
  if (!customerId || !fullName) {
    return { error: 'Customer ID and Full Name are required.' }
  }
  
  const { error } = await supabaseAdmin
    .from('users_profile')
    .update({
      full_name: fullName,
      secondary_mobile: secondaryMobile || null,
      guardian_name: guardianName || null,
      address: address || null,
      kyc_document: kycDocument || null,
      nominee_details: nomineeDetails || null,
      guarantor_details: guarantorOptional || null,
      occupation: occupation || null,
    })
    .eq('id', customerId)
    
  if (error) {
    console.error('Update Profile Error:', error)
    return { error: 'Failed to update customer details. Please try again.' }
  }
  
  revalidatePath('/admin', 'layout')
  revalidatePath(`/admin/customers/${customerId}`)
  return { success: 'Customer details updated successfully!' }
}

