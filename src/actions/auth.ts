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

    if (profile?.role === 'admin') {
      redirectPath = '/admin'
    }
  }

  // 6. On success, revalidate the layout and redirect
  revalidatePath('/', 'layout')
  redirect(redirectPath)
}
