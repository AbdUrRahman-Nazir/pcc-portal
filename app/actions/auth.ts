'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAdminAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Next.js redirect needs to happen outside try/catch or after returning if we handle on client.
  // Because we return errors, and redirect throws, we should not return a redirect here if we want client redirect.
  // Wait, Server Actions can call `redirect()` directly.
  return { success: true }
}

export async function logoutAdminAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
