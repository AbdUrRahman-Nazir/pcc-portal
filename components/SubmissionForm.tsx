'use client'

import { useState, useRef } from 'react'
import { CategoryTabs, type Category } from './CategoryTabs'
import { ImagePicker } from './ImagePicker'
import { VoiceRecorder } from './VoiceRecorder'
import { submitQueryAction } from '@/app/actions/public'

export function SubmissionForm() {
  const [category, setCategory] = useState<Category>('registration')
  const [error, setError] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [voiceFile, setVoiceFile] = useState<File | null>(null)
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('query_category', category)

    // Add image attachments
    for (const img of imageFiles) {
      formData.append('attachments', img)
    }

    // Add voice recording
    if (voiceFile) {
      formData.append('voice_recording', voiceFile)
    }

    const result = await submitQueryAction(formData)

    if (result.error) {
      setError(result.error)
    } else if (result.success && result.trackingId) {
      setSuccessId(result.trackingId)
    }

    setIsSubmitting(false)
  }

  function copyTrackingId() {
    if (successId) {
      navigator.clipboard.writeText(successId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function resetForm() {
    setSuccessId(null)
    setError(null)
    setImageFiles([])
    setVoiceFile(null)
    setCopied(false)
  }

  if (successId) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <div className="pcc-card p-8 text-center border-emerald-200 bg-emerald-50/50">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3 className="text-xl font-bold text-emerald-900 mb-2">Complaint Submitted Successfully</h3>
          <h3 className="text-lg font-bold font-urdu text-emerald-800 mb-5">آپ کی شکایت کامیابی سے درج کر دی گئی ہے</h3>
          <p className="text-sm text-emerald-700 mb-1">Please save your Tracking ID:</p>
          <p className="text-sm text-emerald-600 font-urdu mb-3">براہ کرم اپنی ٹریکنگ آئی ڈی محفوظ کریں:</p>
          <div className="relative bg-white border-2 border-emerald-200 p-4 rounded-lg font-mono text-lg font-bold text-emerald-900 select-all tracking-wider mb-2">
            {successId}
          </div>
          <button
            type="button"
            onClick={copyTrackingId}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-md hover:bg-emerald-200 transition-colors duration-150 mb-5"
          >
            {copied ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Copied!
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Copy ID
              </>
            )}
          </button>
          <p className="text-sm text-emerald-600 mb-6">You can also track your complaint using your phone number.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/track" className="pcc-btn-primary px-6 py-2.5 h-auto">
              Track Complaint Status
            </a>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2.5 text-sm font-semibold text-pcc-700 bg-white border border-pcc-200 rounded-md hover:bg-pcc-50 transition-colors duration-150"
            >
              Submit Another Complaint
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-0 px-0 md:px-0 relative z-10">
      <CategoryTabs selected={category} onChange={setCategory} />

      <form ref={formRef} onSubmit={handleSubmit} className="pcc-card p-6 md:p-8 space-y-6 bg-white shadow-sm">
        
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 text-red-800 text-sm font-medium rounded-md flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="user_name" className="text-sm font-semibold flex justify-between gap-2">
              <span>Full Name</span>
              <span className="font-urdu text-xs text-muted-foreground">پورا نام</span>
            </label>
            <input required type="text" id="user_name" name="user_name" className="pcc-input" placeholder="e.g. Ali Khan" />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone_number" className="text-sm font-semibold flex justify-between gap-2">
              <span>Phone Number</span>
              <span className="font-urdu text-xs text-muted-foreground">فون نمبر</span>
            </label>
            <input required type="tel" id="phone_number" name="phone_number" className="pcc-input font-mono" placeholder="03XXXXXXXXX" pattern="^03\d{9}$" title="Format: 03XXXXXXXXX" />
            <p className="text-xs text-muted-foreground">Format: 03001234567</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="charity_name" className="text-sm font-semibold flex justify-between gap-2">
              <span>Charity Name</span>
              <span className="font-urdu text-xs text-muted-foreground">خیراتی ادارے کا نام</span>
            </label>
            <input required type="text" id="charity_name" name="charity_name" className="pcc-input" />
          </div>

          <div className="space-y-2">
            <label htmlFor="charity_reg_no" className="text-sm font-semibold flex justify-between gap-2">
              <span>Registration No. (Optional)</span>
              <span className="font-urdu text-xs text-muted-foreground">رجسٹریشن نمبر</span>
            </label>
            <input type="text" id="charity_reg_no" name="charity_reg_no" className="pcc-input" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-semibold flex justify-between gap-2">
            <span>Complaint Description</span>
            <span className="font-urdu text-xs text-muted-foreground">شکایت کی تفصیل</span>
          </label>
          <textarea required id="message" name="message" rows={10} className="pcc-textarea" placeholder="Describe your issue in detail..."></textarea>
        </div>

        {/* Attachments Section */}
        <div className="border-t border-border pt-6 space-y-5">
          <h4 className="text-sm font-semibold flex justify-between gap-2">
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pcc-600"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              Attachments (Optional)
            </span>
            <span className="font-urdu text-xs text-muted-foreground font-normal">منسلکات (اختیاری)</span>
          </h4>

          {/* Image Picker */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Upload screenshots or images related to your complaint:
              <span className="font-urdu mr-1 ml-2">اپنی شکایت سے متعلق تصاویر اپ لوڈ کریں</span>
            </p>
            <ImagePicker onFilesChange={setImageFiles} maxFiles={3} maxSizeMB={5} />
          </div>

          {/* Voice Recorder */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Or record a voice message to describe your issue:
              <span className="font-urdu mr-1 ml-2">یا اپنا مسئلہ بیان کرنے کے لیے وائس پیغام ریکارڈ کریں</span>
            </p>
            <VoiceRecorder 
              onRecordingComplete={setVoiceFile}
              onClear={() => setVoiceFile(null)}
              hasRecording={voiceFile !== null}
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="pcc-btn-primary w-full h-12 text-base font-bold flex justify-between items-center px-6 gap-4"
        >
          {isSubmitting ? (
            <>
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Submitting...
              </span>
              <span className="font-urdu font-normal text-sm">جمع ہو رہا ہے...</span>
            </>
          ) : (
            <>
              <span>Submit Complaint</span>
              <span className="font-urdu font-normal text-sm">شکایت درج کریں</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
