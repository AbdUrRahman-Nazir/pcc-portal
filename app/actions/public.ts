'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { uploadAttachment, uploadVoice } from '@/utils/supabase/storage'
import { revalidatePath } from 'next/cache'

const MAX_IMAGES = 3
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VOICE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VOICE_TYPES = ['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/mpeg']

export async function submitQueryAction(formData: FormData) {
  const supabase = await createAdminClient()
  
  const query_category = formData.get('query_category') as string
  const charity_name = formData.get('charity_name') as string
  const charity_reg_no = formData.get('charity_reg_no') as string
  const user_name = formData.get('user_name') as string
  const phone_number = formData.get('phone_number') as string
  const message = formData.get('message') as string

  // Validation
  const phoneRegex = /^03\d{9}$/
  if (!phoneRegex.test(phone_number)) {
    return { error: 'Invalid phone number format. Use 03XXXXXXXXX / فون نمبر کا درست فارمیٹ استعمال کریں' }
  }

  if (!charity_name || !user_name || !message || !query_category) {
    return { error: 'Please fill in all required fields / براہ کرم تمام ضروری خانے پر کریں' }
  }

  // Check for existing pending query
  const { data: existingQuery } = await supabase
    .from('queries')
    .select('id')
    .eq('phone_number', phone_number)
    .eq('status', 'pending')
    .single()

  if (existingQuery) {
    return { error: 'You already have a pending complaint. Please wait for a response or check its status. / آپ کی ایک شکایت پہلے ہی زیر التواء ہے۔' }
  }

  // Insert the query first to get the ID
  const { data, error } = await supabase
    .from('queries')
    .insert([{
      query_category,
      charity_name,
      charity_reg_no: charity_reg_no || null,
      user_name,
      phone_number,
      message,
      status: 'pending'
    }])
    .select('id')
    .single()

  if (error) {
    console.error('Supabase Insert Error:', error)
    return { error: 'An error occurred while submitting your complaint. / شکایت جمع کراتے وقت ایک خرابی پیش آ گئی۔' }
  }

  const queryId = data.id

  // Upload image attachments
  const imageFiles = formData.getAll('attachments') as File[]
  const validImages = imageFiles.filter(f => f instanceof File && f.size > 0)
  let attachmentUrls: string[] = []

  if (validImages.length > MAX_IMAGES) {
    return { error: `Maximum ${MAX_IMAGES} images allowed. / زیادہ سے زیادہ ${MAX_IMAGES} تصاویر کی اجازت ہے۔` }
  }

  for (const img of validImages) {
    if (img.size > MAX_IMAGE_SIZE) {
      return { error: `Image "${img.name}" exceeds 5MB limit. / تصویر 5MB سے بڑی ہے۔` }
    }
    if (!ALLOWED_IMAGE_TYPES.includes(img.type)) {
      return { error: `Invalid image type: ${img.type}. Only JPG, PNG, WEBP allowed. / صرف JPG، PNG، WEBP فارمیٹ کی اجازت ہے۔` }
    }
  }

  try {
    for (let i = 0; i < validImages.length; i++) {
      const url = await uploadAttachment(validImages[i], queryId, i)
      attachmentUrls.push(url)
    }
  } catch (err: any) {
    console.error('Attachment upload error:', err)
    // Query is already created, just log the error
  }

  // Upload voice recording
  const voiceFile = formData.get('voice_recording') as File | null
  let voiceUrl: string | null = null

  if (voiceFile && voiceFile instanceof File && voiceFile.size > 0) {
    if (voiceFile.size > MAX_VOICE_SIZE) {
      return { error: 'Voice recording exceeds 10MB limit. / وائس ریکارڈنگ 10MB سے بڑی ہے۔' }
    }
    if (!ALLOWED_VOICE_TYPES.includes(voiceFile.type)) {
      // Be lenient with voice types since browsers vary
      console.warn('Unknown voice type:', voiceFile.type)
    }
    try {
      voiceUrl = await uploadVoice(voiceFile, queryId)
    } catch (err: any) {
      console.error('Voice upload error:', err)
    }
  }

  // Update the query with attachment URLs
  if (attachmentUrls.length > 0 || voiceUrl) {
    const updateData: any = {}
    if (attachmentUrls.length > 0) updateData.attachment_urls = attachmentUrls
    if (voiceUrl) updateData.voice_url = voiceUrl

    await supabase
      .from('queries')
      .update(updateData)
      .eq('id', queryId)
  }

  revalidatePath('/')
  return { success: true, trackingId: queryId }
}

export async function trackQueryAction(trackingInput: string) {
  const supabase = await createAdminClient()
  
  const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trackingInput)
  
  let queryBuilder = supabase
    .from('queries')
    .select('id, created_at, query_category, charity_name, status, admin_reply, replied_at, attachment_urls, voice_url')
  
  if (isId) {
    queryBuilder = queryBuilder.eq('id', trackingInput)
  } else {
    queryBuilder = queryBuilder.eq('phone_number', trackingInput).order('created_at', { ascending: false }).limit(1)
  }

  const { data, error } = await queryBuilder.single()

  if (error || !data) {
    return { error: 'No complaint found matching this input. / اس ان پٹ کے ساتھ کوئی شکایت نہیں ملی۔' }
  }

  return { success: true, query: data }
}
