'use client'

import { useState } from 'react'
import { CategoryTabs, type Category } from './CategoryTabs'
import { submitQueryAction } from '@/app/actions/public'

export function SubmissionForm() {
  const [category, setCategory] = useState<Category>('registration')
  const [error, setError] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.append('query_category', category)

    const result = await submitQueryAction(formData)

    if (result.error) {
      setError(result.error)
    } else if (result.success && result.trackingId) {
      setSuccessId(result.trackingId)
    }

    setIsSubmitting(false)
  }

  if (successId) {
    return (
      <div className="sleek-card p-8 text-center max-w-lg mx-auto border-green-600 bg-green-50 mt-10">
        <h3 className="text-xl font-bold text-green-900 mb-2">Query Submitted Successfully</h3>
        <h3 className="text-xl font-bold font-urdu text-green-900 mb-6">آپ کا سوال کامیابی سے جمع کر دیا گیا ہے</h3>
        <p className="text-sm text-green-800 mb-4">Please save your Tracking ID / براہ کرم اپنی ٹریکنگ آئی ڈی محفوظ کریں:</p>
        <div className="bg-white border-2 border-green-200 p-4 font-mono text-lg font-bold text-green-900 select-all tracking-wider mb-6">
          {successId}
        </div>
        <p className="text-sm text-green-700">You can also track your query using your phone number.</p>
        <a href="/track" className="inline-block mt-6 sleek-button-primary bg-green-700 hover:bg-green-800 focus:ring-green-700">
          Track Query Status
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 animate-in fade-in duration-500 px-4 md:px-0">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2">Submit a Query</h1>
        <h2 className="text-3xl font-bold font-urdu text-zinc-600">سوال درج کریں</h2>
        <p className="text-zinc-500 mt-4 max-w-md mx-auto">Please select a category and fill out the details below to submit your query to the Punjab Charity Commission.</p>
      </div>

      <CategoryTabs selected={category} onChange={setCategory} />

      <form onSubmit={handleSubmit} className="sleek-card p-6 md:p-8 space-y-6 bg-white shadow-sm hover:shadow-md transition-shadow">
        
        {error && (
          <div className="p-4 border border-red-200 bg-red-50 text-red-800 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="user_name" className="text-sm font-semibold flex justify-between">
              <span>Full Name</span>
              <span className="font-urdu text-xs text-zinc-500">پورا نام</span>
            </label>
            <input required type="text" id="user_name" name="user_name" className="sleek-input" placeholder="e.g. Ali Khan" />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone_number" className="text-sm font-semibold flex justify-between">
              <span>Phone Number</span>
              <span className="font-urdu text-xs text-zinc-500">فون نمبر</span>
            </label>
            <input required type="tel" id="phone_number" name="phone_number" className="sleek-input font-mono" placeholder="03XXXXXXXXX" pattern="^03\d{9}$" title="Format: 03XXXXXXXXX" />
            <p className="text-xs text-zinc-500">Format: 03001234567</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="charity_name" className="text-sm font-semibold flex justify-between">
              <span>Charity Name</span>
              <span className="font-urdu text-xs text-zinc-500">خیراتی ادارے کا نام</span>
            </label>
            <input required type="text" id="charity_name" name="charity_name" className="sleek-input" />
          </div>

          <div className="space-y-2">
            <label htmlFor="charity_reg_no" className="text-sm font-semibold flex justify-between">
              <span>Registration No. (Optional)</span>
              <span className="font-urdu text-xs text-zinc-500">رجسٹریشن نمبر</span>
            </label>
            <input type="text" id="charity_reg_no" name="charity_reg_no" className="sleek-input" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-semibold flex justify-between">
            <span>Query Details</span>
            <span className="font-urdu text-xs text-zinc-500">سوال کی تفصیل</span>
          </label>
          <textarea required id="message" name="message" rows={8} className="sleek-input h-auto py-3 resize-y" placeholder="Write your message here..."></textarea>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="sleek-button-primary w-full h-12 text-base font-bold flex justify-between items-center px-6 mt-4"
        >
          <span>{isSubmitting ? 'Submitting...' : 'Submit Query'}</span>
          <span className="font-urdu font-normal">{isSubmitting ? 'جمع ہو رہا ہے...' : 'جمع کریں'}</span>
        </button>
      </form>
    </div>
  )
}
