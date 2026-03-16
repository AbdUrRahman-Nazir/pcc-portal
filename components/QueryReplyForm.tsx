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

  async function handleReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    const res = await submitAdminReply(queryId, formData)
    
    if (res?.error) {
      setError(res.error)
    }
    
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleReply} className="sleek-card p-6 bg-white border-blue-200 shadow-sm">
      <h3 className="font-bold text-lg text-zinc-900 mb-4">Admin Reply</h3>
      
      {error && (
        <div className="p-3 border border-red-200 bg-red-50 text-red-800 text-sm font-medium mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="admin_reply" className="text-sm font-semibold block mb-2">Message to User</label>
          <textarea 
            required 
            id="admin_reply" 
            name="admin_reply" 
            rows={5} 
            defaultValue={currentReply}
            className="sleek-input h-auto resize-y" 
            placeholder="Type your official response here..."
          ></textarea>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="status" className="text-sm font-semibold block mb-2">Update Status</label>
            <select 
              id="status" 
              name="status" 
              defaultValue={currentStatus === 'pending' ? 'replied' : currentStatus}
              className="sleek-input bg-white"
            >
              <option value="pending">Pending</option>
              <option value="replied">Replied (Requires Action)</option>
              <option value="resolved">Resolved (Closed)</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="sleek-button-primary md:w-48 h-10 border border-zinc-900"
          >
            {isSubmitting ? 'Saving...' : 'Save & Notify User'}
          </button>
        </div>
      </div>
    </form>
  )
}
