'use client'

import { useState } from 'react'
import { submitAdminReply } from '@/app/actions/admin'

interface QueryReplyFormProps {
  queryId: string
  currentStatus: string
  currentReply: string
}

export function QueryReplyForm({ queryId, currentStatus, currentReply }: QueryReplyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)
    
    const formData = new FormData(e.currentTarget)
    const res = await submitAdminReply(queryId, formData)
    
    if (res?.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleReply} className="pcc-card p-6 bg-white shadow-sm">
      <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pcc-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        Official Response
      </h3>
      
      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-sm font-medium mb-4 rounded-md flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-medium mb-4 rounded-md flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Response saved successfully.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="admin_reply" className="text-sm font-semibold block mb-2">Response Message</label>
          <textarea 
            required 
            id="admin_reply" 
            name="admin_reply" 
            rows={5} 
            defaultValue={currentReply}
            className="pcc-textarea" 
            placeholder="Type your official response here..."
          ></textarea>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label htmlFor="status" className="text-sm font-semibold block mb-2">Update Status</label>
            <select 
              id="status" 
              name="status" 
              defaultValue={currentStatus === 'pending' ? 'replied' : currentStatus}
              className="pcc-input bg-white"
            >
              <option value="pending">Pending</option>
              <option value="replied">Replied (Requires Action)</option>
              <option value="resolved">Resolved (Closed)</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="pcc-btn-primary md:w-48 h-10"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Saving...
              </span>
            ) : 'Send Response'}
          </button>
        </div>
      </div>
    </form>
  )
}
