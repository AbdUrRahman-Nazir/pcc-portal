import { createPureAdminClient } from '@/utils/supabase/admin'

const BUCKET = 'query-attachments'

/**
 * Upload an image attachment to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadAttachment(file: File, queryId: string, index: number): Promise<string> {
  const supabase = createPureAdminClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `images/${queryId}/${index}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) throw new Error(`Failed to upload image: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Upload a voice recording to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadVoice(file: File, queryId: string): Promise<string> {
  const supabase = createPureAdminClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'webm'
  const path = `voice/${queryId}/recording.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })

  if (error) throw new Error(`Failed to upload voice: ${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Delete all attachments for a query from Storage.
 */
export async function deleteQueryAttachments(queryId: string): Promise<void> {
  const supabase = createPureAdminClient()

  // List and delete image files
  const { data: imageFiles } = await supabase.storage.from(BUCKET).list(`images/${queryId}`)
  if (imageFiles && imageFiles.length > 0) {
    await supabase.storage.from(BUCKET).remove(imageFiles.map(f => `images/${queryId}/${f.name}`))
  }

  // List and delete voice files
  const { data: voiceFiles } = await supabase.storage.from(BUCKET).list(`voice/${queryId}`)
  if (voiceFiles && voiceFiles.length > 0) {
    await supabase.storage.from(BUCKET).remove(voiceFiles.map(f => `voice/${queryId}/${f.name}`))
  }
}
