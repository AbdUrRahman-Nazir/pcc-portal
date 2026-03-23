'use client'

import { useState } from 'react'
import { trackQueryAction } from '@/app/actions/public'

export function TrackingForm() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    const res = await trackQueryAction(input)
    if (res.error) {
      setError(res.error)
    } else {
      setResult(res.query)
    }
    setIsLoading(false)
  }

  const categoryDisplayName = (cat: string) => cat === 'misc' ? 'General' : cat
  const statusUrdu = (status: string) => {
    if (status === 'pending') return 'زیر غور'
    if (status === 'replied') return 'جواب دیا گیا'
    if (status === 'resolved') return 'حل ہو گیا'
    return ''
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 md:px-0">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2 text-foreground">Track Complaint Status</h1>
        <h2 className="text-2xl font-bold font-urdu text-pcc-700">شکایت کی حیثیت جانیں</h2>
      </div>

      <form onSubmit={handleSearch} className="pcc-card p-6 bg-white mb-6 shadow-sm">
        <div className="space-y-4">
          <label htmlFor="trackingInput" className="text-sm font-semibold flex flex-col md:flex-row md:justify-between">
            <span>Enter Phone Number or Tracking ID</span>
            <span className="font-urdu text-xs text-muted-foreground mt-1 md:mt-0">فون نمبر یا ٹریکنگ آئی ڈی درج کریں</span>
          </label>
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              required 
              type="text" 
              id="trackingInput" 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="pcc-input flex-1 font-mono" 
              placeholder="03XXXXXXXXX or Tracking ID" 
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="pcc-btn-primary md:w-36"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Searching
                </span>
              ) : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-800 text-sm font-medium rounded-lg flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="pcc-card p-6 bg-white shadow-sm border-pcc-200">
          {/* Status & Date Header */}
          <div className="flex justify-between items-start mb-6 pb-5 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">Status</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
                result.status === 'resolved' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                result.status === 'replied' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-amber-200 text-amber-700 bg-amber-50'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  result.status === 'resolved' ? 'bg-emerald-500' :
                  result.status === 'replied' ? 'bg-blue-500' : 'bg-amber-500'
                }`}></span>
                {result.status.toUpperCase()}
                <span className="font-urdu text-[10px] font-normal ml-1">{statusUrdu(result.status)}</span>
              </span>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">Submitted On</p>
              <p className="text-sm font-medium">{new Date(result.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Category</p>
              <p className="font-medium capitalize">{categoryDisplayName(result.query_category)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Charity</p>
              <p className="font-medium">{result.charity_name}</p>
            </div>
          </div>

          {/* Attachments */}
          {result.attachment_urls && result.attachment_urls.length > 0 && (
            <div className="mb-6 pb-5 border-b border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Attachments ({result.attachment_urls.length})</p>
              <div className="grid grid-cols-3 gap-2">
                {result.attachment_urls.map((url: string, i: number) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-md overflow-hidden border border-border aspect-square">
                    <img src={url} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Voice */}
          {result.voice_url && (
            <div className="mb-6 pb-5 border-b border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Voice Message</p>
              <audio src={result.voice_url} controls className="w-full" />
            </div>
          )}

          {/* Reply Section */}
          {(result.status === 'replied' || result.status === 'resolved') ? (
            <div className="bg-pcc-50 p-4 border border-pcc-100 rounded-lg">
              <p className="text-xs text-pcc-700 uppercase tracking-wider font-semibold mb-2 flex justify-between">
                <span>Official Response</span>
                <span className="font-urdu">سرکاری جواب</span>
              </p>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{result.admin_reply}</p>
              <p className="text-xs text-muted-foreground mt-4 text-right">
                Responded on: {new Date(result.replied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          ) : (
            <div className="bg-amber-50/50 p-4 border border-amber-100 text-center rounded-lg">
              <p className="text-amber-800 text-sm">
                Your complaint is currently being reviewed. Please check back later.
              </p>
              <p className="text-amber-700 text-sm font-urdu mt-1">
                آپ کی شکایت زیر غور ہے۔ براہ کرم بعد میں چیک کریں۔
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
