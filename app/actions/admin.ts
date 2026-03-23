'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient, createPureAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getAdminQueries() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const role = user.app_metadata.role as string

  let queryBuilder = supabase
    .from('queries')
    .select('*')
    .order('created_at', { ascending: false })

  // If not superadmin, restrict to their specific category
  if (role !== 'superadmin') {
    if (!['registration', 'renewal', 'observation', 'misc'].includes(role)) {
      return { error: 'Invalid admin role' }
    }
    queryBuilder = queryBuilder.eq('query_category', role)
  }

  const { data, error } = await queryBuilder

  if (error) {
    return { error: error.message }
  }

  return { success: true, queries: data, role }
}

export async function getAdminQuery(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const role = user.app_metadata.role as string

  let queryBuilder = supabase
    .from('queries')
    .select('*')
    .eq('id', id)
    .single()

  const { data, error } = await queryBuilder

  if (error || !data) {
    return { error: 'Query not found' }
  }

  // Ensure category admins can't load queries from other categories
  if (role !== 'superadmin' && data.query_category !== role) {
    return { error: 'Unauthorized role for this category' }
  }

  return { success: true, query: data, role }
}

export async function submitAdminReply(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Unauthorized' }

  const role = user.app_metadata.role as string
  const admin_reply = formData.get('admin_reply') as string
  const status = formData.get('status') as string

  // First fetch to verify role permission
  const { data: queryData } = await supabase.from('queries').select('query_category').eq('id', id).single()
  
  if (!queryData) return { error: 'Query not found' }
  if (role !== 'superadmin' && queryData.query_category !== role) {
    return { error: 'Unauthorized to reply to this category' }
  }

  const { error } = await supabase
    .from('queries')
    .update({
      admin_reply,
      status,
      replied_at: new Date().toISOString()
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/admin/query/${id}`)
  revalidatePath('/admin/dashboard')
  
  return { success: true }
}

export async function deleteAdminQueriesAction(ids: string[]) {
  // Use admin client to bypass RLS for deletions
  const adminAuth = await createAdminClient()
  const { data: { user } } = await adminAuth.auth.getUser()

  if (!user || user.app_metadata.role !== 'superadmin') {
    return { error: 'Unauthorized. Only Super Admins can delete queries.' }
  }

  if (!ids || ids.length === 0) {
    return { error: 'No queries selected.' }
  }

  // Use the pure Supabase client to truly bypass RLS (ignores session cookies)
  const pureAdminClient = createPureAdminClient()

  // First, fetch the queries to get their attachment/voice URLs for Storage cleanup
  const { data: queries } = await pureAdminClient
    .from('queries')
    .select('id, attachment_urls, voice_url')
    .in('id', ids)

  // Clean up Storage files for each query
  if (queries && queries.length > 0) {
    for (const q of queries) {
      const filesToDelete: string[] = []

      // Extract storage paths from public URLs
      if (q.attachment_urls && q.attachment_urls.length > 0) {
        for (let i = 0; i < q.attachment_urls.length; i++) {
          filesToDelete.push(`images/${q.id}/${i}.jpg`)
          filesToDelete.push(`images/${q.id}/${i}.jpeg`)
          filesToDelete.push(`images/${q.id}/${i}.png`)
          filesToDelete.push(`images/${q.id}/${i}.webp`)
        }
      }

      if (q.voice_url) {
        filesToDelete.push(`voice/${q.id}/recording.webm`)
        filesToDelete.push(`voice/${q.id}/recording.ogg`)
        filesToDelete.push(`voice/${q.id}/recording.mp4`)
      }

      if (filesToDelete.length > 0) {
        // Supabase Storage silently ignores files that don't exist, so this is safe
        await pureAdminClient.storage.from('query-attachments').remove(filesToDelete)
      }
    }
  }

  // Now delete the database rows
  const { error } = await pureAdminClient
    .from('queries')
    .delete()
    .in('id', ids)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
