'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitQueryAction(formData: FormData) {
  const supabase = await createClient()
  
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
    return { error: 'You already have a pending query. Please wait for a response or check its status. / آپ کا ایک سوال پہلے ہی زیر التواء ہے۔ براہ کرم جواب کا انتظار کریں یا اس کی حیثیت چیک کریں۔' }
  }

  // Insert new query
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
    return { error: 'An error occurred while submitting your query. / سوال جمع کراتے وقت ایک خرابی پیش آ گئی۔' }
  }

  revalidatePath('/')
  return { success: true, trackingId: data.id }
}

import { createAdminClient } from '@/utils/supabase/admin'

export async function trackQueryAction(trackingInput: string) {
  const supabase = await createAdminClient()
  
  const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(trackingInput)
  
  let queryBuilder = supabase
    .from('queries')
    .select('id, created_at, query_category, charity_name, status, admin_reply, replied_at')
  
  if (isId) {
    queryBuilder = queryBuilder.eq('id', trackingInput)
  } else {
    // Treat as phone number
    queryBuilder = queryBuilder.eq('phone_number', trackingInput).order('created_at', { ascending: false }).limit(1)
  }

  // We are using the Server Client which inherently acts bypasses RLS for service_role or we can let it run as authenticated?
  // Actually, if we use standard SSR client 'auth', it runs as anonymous user unless logged in.
  // We need to bypass RLS for tracking because our RLS blocks anon users from select (we dropped it earlier for security).
  // Wait, `createClient` from 'utils/supabase/server.ts' uses the ANON key! It won't work if RLS is enabled and no anon SELECT policy exists!
  // Let me switch this specific server action to use the service_role key to bypass RLS securely.
  
  const { data, error } = await queryBuilder.single()

  if (error || !data) {
    return { error: 'No query found matching this input. / اس ان پٹ کے ساتھ کوئی سوال نہیں ملا۔' }
  }

  return { success: true, query: data }
}
