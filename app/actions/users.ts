'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getUsersAction() {
  const supabase = await createAdminClient()
  
  // Only superadmins should be able to do this, verify session first
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata.role !== 'superadmin') {
    return { error: 'Unauthorized' }
  }

  // Fetch users via admin API
  const { data: usersData, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    return { error: error.message }
  }

  return { success: true, users: usersData.users }
}

export async function createUserAction(formData: FormData) {
  const supabase = await createAdminClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata.role !== 'superadmin') {
    return { error: 'Unauthorized' }
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  if (!email || !password || !role) {
    return { error: 'All fields are required.' }
  }

  if (!['registration', 'renewal', 'observation', 'misc', 'superadmin'].includes(role)) {
    return { error: 'Invalid role.' }
  }

  const { data: newUser, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role }
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true, user: newUser }
}

export async function updateAdminUserAction(userId: string, formData: FormData) {
  const supabase = await createAdminClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata.role !== 'superadmin') {
    return { error: 'Unauthorized' }
  }

  const role = formData.get('role') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!['registration', 'renewal', 'observation', 'misc', 'superadmin'].includes(role)) {
    return { error: 'Invalid role.' }
  }

  if (userId === user.id && role !== 'superadmin') {
    return { error: 'You cannot remove your own superadmin privileges.' }
  }

  const updateData: any = {
    app_metadata: { role }
  }

  if (email) {
    updateData.email = email
    updateData.email_confirm = true
  }

  if (password) {
    updateData.password = password
  }

  const { error } = await supabase.auth.admin.updateUserById(userId, updateData)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUserAction(userId: string) {
  const supabase = await createAdminClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata.role !== 'superadmin') {
    return { error: 'Unauthorized' }
  }

  if (userId === user.id) {
    return { error: 'You cannot delete yourself.' }
  }

  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
