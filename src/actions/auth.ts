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

  const adminId = (formData.get('adminId') as string)?.trim()?.toLowerCase()
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
    const { createAdminClient } = await import('@/utils/supabase/admin')
    const adminSupabase = createAdminClient()
    
    const { data: profile } = await adminSupabase
      .from('users_profile')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role?.toLowerCase() !== 'admin') {
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

  // --- CUSTOM OTP FLOW via RESEND ---
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = Date.now() + 15 * 60 * 1000 // 15 mins from now
  
  // Save OTP to the user's metadata in Supabase
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
    user_metadata: {
      ...targetUser.user_metadata,
      reset_otp: otp,
      reset_otp_expires_at: expiresAt
    }
  })

  if (updateError) {
    return { error: 'Failed to generate OTP. Please try again.' }
  }

  // Send the OTP via Resend
  const { Resend } = await import('resend')
  const resendApiKey = process.env.RESEND_API_KEY
  
  if (!resendApiKey) {
    return { error: 'RESEND_API_KEY is not configured in the environment.' }
  }

  const resend = new Resend(resendApiKey)

  const { error: resendError } = await resend.emails.send({
    from: 'RSSPP Admin <onboarding@resend.dev>',
    to: email,
    subject: 'Your Admin Password Reset Code',
    html: `
      <div style="font-family: sans-serif; max-w-2xl; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0f172a;">Password Reset Request</h2>
        <p style="color: #475569;">You have requested to reset the password for your RSSPP Administrator account.</p>
        <p style="color: #475569;">Here is your secure 6-digit verification code:</p>
        <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: center;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #0284c7;">${otp}</span>
        </div>
        <p style="color: #475569; font-size: 14px;">This code will expire in 15 minutes.</p>
        <p style="color: #475569; font-size: 14px;">If you did not request this, please ignore this email.</p>
      </div>
    `
  })

  if (resendError) {
    return { error: 'Failed to send OTP email via Resend. ' + resendError.message }
  }

  return { success: true, email }
}

export async function verifyAdminOtp(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string

  if (!email || !otp || otp.length !== 6) {
    return { error: 'Please enter a valid 6-digit OTP.' }
  }

  const { createAdminClient } = await import('@/utils/supabase/admin')
  const supabaseAdmin = createAdminClient()

  // Find user by email
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
  if (usersError) return { error: 'Failed to verify identity.' }

  const targetUser = usersData.users.find((u: any) => u.email === email)
  if (!targetUser) return { error: 'Invalid or expired OTP.' }

  const storedOtp = targetUser.user_metadata?.reset_otp
  const expiresAt = targetUser.user_metadata?.reset_otp_expires_at

  if (!storedOtp || storedOtp !== otp) {
    return { error: 'Invalid OTP.' }
  }

  if (!expiresAt || Date.now() > expiresAt) {
    return { error: 'OTP has expired.' }
  }

  // Success, return true (we do not delete the OTP here, we delete it during password update)
  return { success: true }
}

export async function updateAdminPassword(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const otp = formData.get('otp') as string
  const password = formData.get('password') as string

  if (!email || !otp || !password || password.length < 6) {
    return { error: 'Invalid input. Password must be at least 6 characters long.' }
  }

  const { createAdminClient } = await import('@/utils/supabase/admin')
  const supabaseAdmin = createAdminClient()

  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
  if (usersError) return { error: 'Failed to verify identity.' }

  const targetUser = usersData.users.find((u: any) => u.email === email)
  if (!targetUser) return { error: 'Invalid or expired session.' }

  const storedOtp = targetUser.user_metadata?.reset_otp
  const expiresAt = targetUser.user_metadata?.reset_otp_expires_at

  if (!storedOtp || storedOtp !== otp || !expiresAt || Date.now() > expiresAt) {
    return { error: 'Invalid or expired OTP.' }
  }

  // Update the user's password and clear the OTP
  const { error } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
    password: password,
    user_metadata: {
      ...targetUser.user_metadata,
      reset_otp: null,
      reset_otp_expires_at: null
    }
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/admin-login')
}
