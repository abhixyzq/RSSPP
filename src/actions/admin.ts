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
  const guardianNameHi = formData.get('guardianNameHi') as string
  const address = formData.get('address') as string
  const addressHi = formData.get('addressHi') as string
  const aadhaar = formData.get('aadhaar') as string
  const pan = formData.get('pan') as string
  
  if (!aadhaar && !pan) {
    return { error: 'KYC Required: Please provide either Aadhaar or PAN, or both.' }
  }
  
  let kycDocument = ''
  if (aadhaar || pan) {
    kycDocument = `Aadhaar: ${aadhaar || 'N/A'} | PAN: ${(pan || 'N/A').toUpperCase()}`
  }
  
  const nomineeName = formData.get('nomineeName') as string
  const nomineeRelation = formData.get('nomineeRelation') as string
  let nomineeDetails = ''
  if (nomineeName) {
    nomineeDetails = nomineeName
    if (nomineeRelation) {
      nomineeDetails += ` (${nomineeRelation})`
    }
  }
  const guarantorOptional = formData.get('guarantorOptional') as string
  const occupation = formData.get('occupation') as string
  const occupationHi = formData.get('occupationHi') as string
  const fullNameHi = formData.get('fullNameHi') as string

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
      full_name_hi: fullNameHi || null,
      mobile_number: mobile,
      role: 'customer',
      secondary_mobile: secondaryMobile || null,
      guardian_name: guardianName || null,
      guardian_name_hi: guardianNameHi || null,
      address: address || null,
      address_hi: addressHi || null,
      kyc_document: kycDocument || null,
      nominee_details: nomineeDetails || null,
      guarantor_details: guarantorOptional || null,
      occupation: occupation || null,
      occupation_hi: occupationHi || null,
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

  const validTypes = [
    'JAMA_DEPOSIT', 
    'JAMA_WITHDRAWAL', 
    'JAMA_EARNED_INTEREST',
    'NIKASI_LOAN', 
    'NIKASI_REPAY_PRINCIPAL', 
    'NIKASI_REPAY_INTEREST'
  ]
  if (!validTypes.includes(type)) {
    return { error: 'Invalid transaction type.' }
  }

  // 1. Calculate current balances before allowing a withdrawal
  const balances = await getCustomerBalance(userId)
  
  if (type === 'JAMA_WITHDRAWAL' && amount > balances.jamaBal) {
    return { error: `Insufficient Balance. Current Jama Balance is ₹${balances.jamaBal}. You cannot withdraw ₹${amount}.` }
  }

  // Note: NIKASI_LOAN (giving a new loan) might not have a strict mathematical limit in the DB, 
  // but if you want to enforce one later, you can do it here.

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

export async function getCustomerBalance(userId: string) {
  const supabaseAdmin = createAdminClient()
  
  const { data: transactions } = await supabaseAdmin
    .from('transactions')
    .select('amount, transaction_type, transaction_date')
    .eq('user_id', userId)
    .order('transaction_date', { ascending: true }) // Chronological order is critical for bucketing

  let jamaBal = 0
  let earnedInterest = 0
  let nikasiBal = 0

  transactions?.forEach(tx => {
    const amt = Number(tx.amount)
    
    // Jama Calculations
    if (tx.transaction_type === 'JAMA_DEPOSIT' || tx.transaction_type === 'JAMA_PRINCIPAL') {
      jamaBal += amt
    } else if (tx.transaction_type === 'JAMA_EARNED_INTEREST') {
      earnedInterest += amt
    } else if (tx.transaction_type === 'JAMA_WITHDRAWAL') {
      // Prioritize deducting from Earned Interest first
      if (earnedInterest > 0) {
        if (amt <= earnedInterest) {
          earnedInterest -= amt
        } else {
          const remainder = amt - earnedInterest
          earnedInterest = 0
          jamaBal -= remainder
        }
      } else {
        jamaBal -= amt
      }
    } 
    // Nikasi Calculations
    else if (tx.transaction_type === 'NIKASI_LOAN' || tx.transaction_type === 'NIKASI_PRINCIPAL') {
      nikasiBal += amt
    } else if (tx.transaction_type === 'NIKASI_REPAY_PRINCIPAL') {
      nikasiBal -= amt
    }
  })

  // Return the combined withdrawable total for validation
  return { jamaBal: jamaBal + earnedInterest, nikasiBal }
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
    
    // Deposit Account (JAMA)
    if (tx.transaction_type === 'JAMA_DEPOSIT' || tx.transaction_type === 'JAMA_EARNED_INTEREST' || tx.transaction_type === 'JAMA_PRINCIPAL') {
      totalJama += amount
      const txDate = new Date(tx.transaction_date)
      if (txDate >= today && tx.transaction_type === 'JAMA_DEPOSIT') todaysCollection += amount
    } else if (tx.transaction_type === 'JAMA_WITHDRAWAL') {
      totalJama -= amount
      const txDate = new Date(tx.transaction_date)
      if (txDate >= today) todaysCollection -= amount
    }
    // Loan Account (NIKASI)
    else if (tx.transaction_type === 'NIKASI_LOAN') {
      totalNikasi += amount
    } else if (tx.transaction_type === 'NIKASI_REPAY_PRINCIPAL') {
      totalNikasi -= amount
    }
    // Note: NIKASI_REPAY_INTEREST does not affect totalNikasi (Principal)
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
    .select('id, full_name, full_name_hi, mobile_number, kyc_document')
    .eq('role', 'customer')
    .not('full_name', 'ilike', '[CLOSED:%')
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
  
  if (profile.full_name && profile.full_name.startsWith('[CLOSED:')) {
    const match = profile.full_name.match(/\[CLOSED: (\d+)\] (.*)/)
    if (match) {
      profile.mobile_number = match[1]
      profile.full_name = match[2]
      profile.isClosed = true
    }
  }
  
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
    // 1. Fetch current profile to get mobile number
    const { data: profile } = await supabaseAdmin
      .from('users_profile')
      .select('mobile_number, full_name')
      .eq('id', customerId)
      .single()
      
    if (!profile) return { error: 'Customer not found.' }

    // 2. Scramble Email in Auth
    const newEmail = `${profile.mobile_number}_closed_${Date.now()}@rsspp.local`
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(customerId, {
      email: newEmail
    })
    
    if (authError) {
      console.error('Error updating auth email:', authError)
      return { error: 'Failed to update authentication record.' }
    }
    
    // 3. Soft Delete Profile (Fake 10-digit mobile, store real one in name)
    const fakeMobile = '000' + Math.floor(1000000 + Math.random() * 9000000).toString()
    const closedName = `[CLOSED: ${profile.mobile_number}] ${profile.full_name}`
    
    const { error: profileError } = await supabaseAdmin
      .from('users_profile')
      .update({ 
        mobile_number: fakeMobile,
        full_name: closedName
      })
      .eq('id', customerId)
      
    if (profileError) {
      console.error('Error soft deleting profile:', profileError)
      return { error: `DB Error: ${profileError.message}` }
    }
    
    revalidatePath('/admin', 'layout')
    return { success: 'Customer account closed successfully.' }

    
  } catch (err: any) {
    console.error('Delete Exception:', err)
    return { error: 'An unexpected error occurred while deleting the customer.' }
  }
}

export async function updateCustomerDetails(prevState: any, formData: FormData) {
  const supabaseAdmin = createAdminClient()
  
  const customerId = formData.get('customerId') as string
  const fullName = formData.get('fullName') as string
  const fullNameHi = formData.get('fullNameHi') as string
  const secondaryMobile = formData.get('secondaryMobile') as string
  const guardianName = formData.get('guardianName') as string
  const guardianNameHi = formData.get('guardianNameHi') as string
  const address = formData.get('address') as string
  const addressHi = formData.get('addressHi') as string
  
  const aadhaar = formData.get('aadhaar') as string
  const pan = formData.get('pan') as string
  
  if (!aadhaar && !pan) {
    return { error: 'KYC Required: Please provide either Aadhaar or PAN, or both.' }
  }

  let kycDocument = ''
  if (aadhaar || pan) {
    kycDocument = `Aadhaar: ${aadhaar || 'N/A'} | PAN: ${(pan || 'N/A').toUpperCase()}`
  }
  const nomineeDetails = formData.get('nomineeDetails') as string
  const guarantorOptional = formData.get('guarantorOptional') as string
  const occupation = formData.get('occupation') as string
  const occupationHi = formData.get('occupationHi') as string
  
  if (!customerId || !fullName) {
    return { error: 'Customer ID and Full Name are required.' }
  }
  
  const { error } = await supabaseAdmin
    .from('users_profile')
    .update({
      full_name: fullName,
      full_name_hi: fullNameHi || null,
      secondary_mobile: secondaryMobile || null,
      guardian_name: guardianName || null,
      guardian_name_hi: guardianNameHi || null,
      address: address || null,
      address_hi: addressHi || null,
      kyc_document: kycDocument || null,
      nominee_details: nomineeDetails || null,
      guarantor_details: guarantorOptional || null,
      occupation: occupation || null,
      occupation_hi: occupationHi || null,
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

export async function bulkCreditInterest(payouts: { userId: string, amount: number, description?: string }[]) {
  const supabaseAdmin = createAdminClient()

  if (!payouts || payouts.length === 0) {
    return { error: 'No payouts provided.' }
  }

  // Validate all amounts
  for (const p of payouts) {
    if (isNaN(p.amount) || p.amount <= 0) {
      return { error: `Invalid amount for user ${p.userId}. Must be greater than zero.` }
    }
  }

  // Insert all transactions at once
  const { error: txError } = await supabaseAdmin
    .from('transactions')
    .insert(
      payouts.map(p => ({
        user_id: p.userId,
        transaction_type: 'JAMA_EARNED_INTEREST',
        amount: p.amount,
        description: p.description || 'Monthly Interest',
        transaction_date: new Date().toISOString()
      }))
    )

  if (txError) {
    console.error('Bulk Interest Error:', txError)
    return { error: `Failed to credit interest: ${txError.message}` }
  }

  revalidatePath('/admin', 'layout')
  return { success: `Successfully credited interest to ${payouts.length} accounts!` }
}

export async function getClosedCustomers() {
  const supabaseAdmin = createAdminClient()
  
  const { data, error } = await supabaseAdmin
    .from('users_profile')
    .select('id, full_name, mobile_number, kyc_document')
    .ilike('full_name', '[CLOSED:%')
    .order('full_name', { ascending: true })
    
  if (error) {
    console.error('Error fetching closed customers', error)
    return []
  }
  
  return data || []
}

export async function restoreCustomer(customerId: string) {
  const supabaseAdmin = createAdminClient()
  
  try {
    const { data: profile } = await supabaseAdmin
      .from('users_profile')
      .select('mobile_number, full_name')
      .eq('id', customerId)
      .single()
      
    if (!profile) return { error: 'Customer not found.' }

    // Restore original mobile from full_name "[CLOSED: 1234567890] Original Name"
    const match = profile.full_name.match(/\[CLOSED: (\d+)\] (.*)/)
    if (!match) return { error: 'Invalid closed account format.' }
    
    const originalMobile = match[1]
    const originalName = match[2]
    const originalEmail = `${originalMobile}@rsspp.local`
    
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(customerId, {
      email: originalEmail
    })
    
    if (authError) {
      console.error('Error restoring auth email:', authError)
      return { error: 'Failed to restore authentication record. The mobile number might be in use by another account.' }
    }
    
    const { error: profileError } = await supabaseAdmin
      .from('users_profile')
      .update({ 
        mobile_number: originalMobile,
        full_name: originalName
      })
      .eq('id', customerId)
      
    if (profileError) {
      console.error('Error restoring profile:', profileError)
      return { error: 'Failed to restore customer account.' }
    }
    
    revalidatePath('/admin', 'layout')
    return { success: 'Customer restored successfully.' }
  } catch (err: any) {
    console.error('Restore Exception:', err)
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

export async function permanentDeleteCustomer(customerId: string) {
  const supabaseAdmin = createAdminClient()
  
  try {
    const { error: txError } = await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('user_id', customerId)
      
    if (txError) {
      console.error('Error deleting transactions:', txError)
      return { error: 'Failed to delete customer transactions.' }
    }
    
    const { error: profileError } = await supabaseAdmin
      .from('users_profile')
      .delete()
      .eq('id', customerId)
      
    if (profileError) {
      console.error('Error deleting profile:', profileError)
      return { error: 'Failed to delete customer profile.' }
    }
    
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(customerId)
    
    if (authError) {
      console.error('Error deleting auth user:', authError)
      return { error: 'Failed to delete authentication record.' }
    }
    
    revalidatePath('/admin', 'layout')
    return { success: 'Customer permanently deleted.' }
  } catch (err: any) {
    console.error('Permanent Delete Exception:', err)
    return { error: err.message || 'An unexpected error occurred.' }
  }
}

