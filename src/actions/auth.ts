'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// The initial state is passed when using React 19's useActionState
export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()

  // 1. Extract inputs
  const mobile = formData.get('mobile') as string
  const pin = formData.get('pin') as string

  // 2. Validate inputs
  if (!mobile || mobile.length !== 10 || !pin || pin.length !== 4) {
    return { error: 'Please enter a valid 10-digit mobile number and 4-digit PIN.' }
  }

  // 3. The Core Strategy: Map to Email/Password
  const email = `${mobile}@rsspp.local`

  // 4. Authenticate via Supabase Auth
  // We try TWO passwords to ensure backward compatibility:
  // - First, the raw 4-digit PIN (for accounts created before the 6-char rule)
  // - Second, the padded PIN (pin + '00') (for accounts created after the 6-char rule)
  
  let { error } = await supabase.auth.signInWithPassword({
    email,
    password: pin,
  })

  // If the raw PIN fails, try the padded PIN
  if (error) {
    const { error: paddedError } = await supabase.auth.signInWithPassword({
      email,
      password: pin + '00',
    })
    
    // If BOTH fail, then it's a real invalid login
    if (paddedError) {
      return { error: 'Invalid Mobile Number or PIN. Please try again.' }
    }
  }

  // 5. Fetch user role to determine redirect destination
  const { data: { user } } = await supabase.auth.getUser()
  let redirectPath = '/dashboard'

  if (user) {
    const { data: profile } = await supabase
      .from('users_profile')
      .select('role')
      .eq('id', user.id)
      .single()

    // STRICT ADMIN CHECK: If they are admin, they MUST use the admin portal
    // We show a generic error to hide the fact that this is an admin account
    if (profile?.role === 'admin') {
      await supabase.auth.signOut()
      return { error: 'Invalid Mobile Number or PIN. Please try again.' }
    }
  }

  // 6. On success, revalidate the layout and redirect
  revalidatePath('/', 'layout')
  redirect(redirectPath)
}

export async function adminLogin(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const adminId = formData.get('adminId') as string
  const password = formData.get('password') as string

  if (!adminId || !password) {
    return { error: 'Please enter both Admin ID and Password.' }
  }

  // Map Admin ID to email format for Supabase Auth
  // We can just append @rsspp.local if it's not already an email
  const email = adminId.includes('@') ? adminId : `${adminId}@rsspp.local`

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Invalid Administrator ID or Password.' }
  }

  // Verify if the user is actually an admin
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: profile } = await supabase
      .from('users_profile')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      return { error: 'Access Denied: You do not have administrator privileges.' }
    }
  }

  revalidatePath('/admin', 'layout')
  redirect('/admin')
}

export async function requestAdminPasswordReset(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const adminId = formData.get('adminId') as string

  if (!adminId) {
    return { error: 'Please enter your Admin ID (Email).' }
  }

  const email = adminId.includes('@') ? adminId : `${adminId}@rsspp.local`

  const { createAdminClient } = await import('@/utils/supabase/admin')
  const supabaseAdmin = createAdminClient()

  // Find user by email
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
  if (usersError) return { error: 'Failed to verify administrator identity.' }

  const targetUser = usersData.users.find(u => u.email === email)
  
  if (!targetUser) {
    // Show generic error to avoid email enumeration, but wait, this is admin login so it's fine
    return { error: 'Admin account not found for this ID.' }
  }

  // Check role in users_profile
  const { data: profile } = await supabaseAdmin
    .from('users_profile')
    .select('role')
    .eq('id', targetUser.id)
    .single()

  if (profile?.role !== 'admin') {
    return { error: 'Access Denied: This ID does not have administrator privileges.' }
  }

  const { headers } = await import('next/headers')
  const headersList = await headers()
  // Determine origin from headers. If not available, fallback to a sensible default.
  // Next.js headers might have 'origin' or 'host'
  const host = headersList.get('host')
  const protocol = host?.includes('localhost') ? 'http' : 'https'
  const origin = headersList.get('origin') || (host ? `${protocol}://${host}` : '')

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin ? `${origin}/admin-login/forgot-password` : undefined
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, email }
}

export async function verifyAdminOtp(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string

  if (!email || !otp || otp.length !== 6) {
    return { error: 'Please enter a valid 6-digit OTP.' }
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'recovery',
  })

  if (error) {
    return { error: 'Invalid or expired OTP.' }
  }

  return { success: true, token_hash: data.session?.access_token }
}

export async function updateAdminPassword(prevState: any, formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/admin-login')
}
