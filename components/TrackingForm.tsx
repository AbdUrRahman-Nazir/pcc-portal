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

  return (
    <div className="max-w-xl mx-auto mt-10 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2">Track Your Query</h1>
        <h2 className="text-3xl font-bold font-urdu text-zinc-600">اپنے سوال کی صورتحال جانیں</h2>
      </div>

      <form onSubmit={handleSearch} className="sleek-card p-6 bg-white mb-6">
        <div className="space-y-4">
          <label htmlFor="trackingInput" className="text-sm font-semibold flex flex-col md:flex-row md:justify-between">
            <span>Enter Phone Number or Tracking ID</span>
            <span className="font-urdu text-xs text-zinc-500 mt-1 md:mt-0">فون نمبر یا ٹریکنگ آئی ڈی درج کریں</span>
          </label>
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              required 
              type="text" 
              id="trackingInput" 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="sleek-input flex-1 font-mono" 
              placeholder="03XXXXXXXXX or ID" 
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="sleek-button-primary bg-zinc-900 border border-zinc-900 md:w-32"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-800 text-sm font-medium animate-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {result && (
        <div className="sleek-card p-6 bg-white border-blue-200 animate-in slide-in-from-bottom-4">
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-zinc-100">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  result.status === 'resolved' ? 'bg-green-500' :
                  result.status === 'replied' ? 'bg-blue-500' : 'bg-yellow-500'
                }`}></span>
                <span className="font-bold text-lg capitalize">{result.status}</span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold mb-1">Submitted On</p>
              <p className="text-sm font-medium">{new Date(result.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Category</p>
              <p className="font-medium capitalize">{result.query_category}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Charity</p>
              <p className="font-medium">{result.charity_name}</p>
            </div>
          </div>

          {(result.status === 'replied' || result.status === 'resolved') ? (
            <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-sm">
              <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-2 flex justify-between">
                <span>Admin Reply</span>
                <span className="font-urdu">جواب</span>
              </p>
              <p className="text-zinc-800 whitespace-pre-wrap">{result.admin_reply}</p>
              <p className="text-xs text-zinc-400 mt-4 text-right">Replied on: {new Date(result.replied_at).toLocaleDateString()}</p>
            </div>
          ) : (
            <div className="bg-zinc-50 p-4 border border-zinc-100 text-center text-zinc-500 text-sm italic">
              Your query is currently being reviewed. Please check back later. / آپ کا سوال زیر غور ہے۔ براہ کرم بعد میں چیک کریں۔
            </div>
          )}
        </div>
      )}
    </div>
  )
}
